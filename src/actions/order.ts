"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import { resend } from "@/lib/resend";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  items: z.array(z.object({
    productId: z.string(),
    size: z.string(),
    quantity: z.number().min(1)
  })).min(1, "Cart cannot be empty")
});

export async function createOrder(data: z.infer<typeof checkoutSchema>) {
  try {
    const validatedData = checkoutSchema.parse(data);
    
    // In a real application, we would check if the user is authenticated and link the order
    // For now, we will handle guest checkout
    
    // Calculate total and verify stock
    let totalAmount = 0;
    const validatedItems: { productId: string; size: string; quantity: number; price: number }[] = [];
    const emailItemDetails: { name: string; size: string; quantity: number; price: number }[] = [];

    // We MUST run this sequentially or inside a transaction, but we need to fetch products first
    // to calculate the authoritative price
    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          sizes: {
            where: { name: item.size }
          }
        }
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const productSize = product.sizes[0];
      
      if (!productSize || productSize.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.name} (Size: ${item.size})`);
      }

      const price = Number(product.price);
      totalAmount += price * item.quantity;

      validatedItems.push({
        productId: product.id,
        size: item.size,
        quantity: item.quantity,
        price: price
      });

      emailItemDetails.push({
        name: product.name,
        size: item.size,
        quantity: item.quantity,
        price: price
      });
    }

    // Combine address into a single string for simplicity
    const shippingAddress = `${validatedData.fullName}\n${validatedData.address}\n${validatedData.city}, ${validatedData.postalCode}\n${validatedData.country}`;

    // Execute transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const newOrder = await tx.order.create({
        data: {
          guestEmail: validatedData.email,
          status: "PENDING",
          totalAmount: totalAmount,
          shippingAddress: shippingAddress,
          items: {
            create: validatedItems.map(item => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 2. Decrement stock
      for (const item of validatedItems) {
        await tx.productSize.update({
          where: {
            productId_name: {
              productId: item.productId,
              name: item.size
            }
          },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    // Send email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@rawclothing.com";
      const itemsHtml = emailItemDetails.map(item => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.size}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #111; border-bottom: 2px solid #333; padding-bottom: 10px;">New Order Placed</h2>
          <p>A new order has been successfully placed on the store.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold; width: 120px;">Order ID:</td>
              <td style="padding: 8px;">${order.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Customer Email:</td>
              <td style="padding: 8px;">${validatedData.email}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Total Amount:</td>
              <td style="padding: 8px; font-weight: bold; color: #111;">$${totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">Shipping Info:</td>
              <td style="padding: 8px; white-space: pre-wrap;">${shippingAddress}</td>
            </tr>
          </table>

          <h3 style="margin-top: 30px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2; font-weight: bold;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; width: 60px;">Size</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; width: 60px;">Qty</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; width: 80px;">Price</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; width: 80px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <p style="margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
            This email was sent automatically from your Next.js Store.
          </p>
        </div>
      `;

      await resend.emails.send({
        from: "NextJS Store <onboarding@resend.dev>",
        to: adminEmail,
        subject: `New Order Alert: #${order.id}`,
        html: emailHtml,
      });
      console.log(`Admin notification email sent successfully to ${adminEmail}`);
    } catch (emailError) {
      console.error("Failed to send admin order notification email:", emailError);
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Checkout error:", error);
    return { error: error.message || "Failed to process checkout" };
  }
}

export async function updateOrderStatus(orderId: string, status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED") {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Update order status error:", error);
    return { error: "Failed to update order status" };
  }
}
