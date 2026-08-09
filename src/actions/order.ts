"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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
