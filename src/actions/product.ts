"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string().min(1, "Image URL/path is required")).min(1, "At least one image is required"),
  sizes: z.array(z.object({
    name: z.string().min(1, "Size name is required"),
    stock: z.coerce.number().min(0, "Stock must be 0 or greater"),
  })).min(1, "At least one size is required"),
  colors: z.array(z.object({
    name: z.string().min(1, "Color name is required"),
    hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  })), // Can be empty array if product has no colors
});

export async function createProduct(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "STORE_MANAGER") {
      return { error: "Unauthorized" };
    }

    // Parse the JSON stringified arrays from formData
    const rawImages = formData.get("images") as string;
    const rawSizes = formData.get("sizes") as string;
    const rawColors = formData.get("colors") as string;
    
    const images = rawImages ? JSON.parse(rawImages) : [];
    const sizes = rawSizes ? JSON.parse(rawSizes) : [];
    const colors = rawColors ? JSON.parse(rawColors) : [];

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      price: formData.get("price"),
      categoryId: formData.get("categoryId") as string,
      images,
      sizes,
      colors,
    };

    const validatedData = productSchema.safeParse(data);

    if (!validatedData.success) {
      return { 
        error: "Validation failed", 
        details: validatedData.error.flatten().fieldErrors 
      };
    }

    const { name, slug, description, price, categoryId, images: validImages, sizes: validSizes, colors: validColors } = validatedData.data;

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return { error: "A product with this slug already exists. Please choose a unique slug." };
    }

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        categoryId,
        images: {
          create: validImages.map(url => ({ url }))
        },
        sizes: {
          create: validSizes.map(size => ({
            name: size.name,
            stock: size.stock,
          }))
        },
        colors: {
          create: validColors.map(color => ({
            name: color.name,
            hex: color.hex,
          }))
        }
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    
    return { success: true };

  } catch (error) {
    console.error("Create Product Error:", error);
    return { error: "Something went wrong while creating the product." };
  }
}

export async function updateProduct(productId: string, prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "STORE_MANAGER") {
      return { error: "Unauthorized" };
    }

    const rawImages = formData.get("images") as string;
    const rawSizes = formData.get("sizes") as string;
    const rawColors = formData.get("colors") as string;

    const images = rawImages ? JSON.parse(rawImages) : [];
    const sizes = rawSizes ? JSON.parse(rawSizes) : [];
    const colors = rawColors ? JSON.parse(rawColors) : [];

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      price: formData.get("price"),
      categoryId: formData.get("categoryId") as string,
      images,
      sizes,
      colors,
    };

    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
      return { error: "Validation failed", details: validatedData.error.flatten().fieldErrors };
    }

    const { name, slug, description, price, categoryId, images: validImages, sizes: validSizes, colors: validColors } = validatedData.data;

    // Check slug uniqueness (excluding this product)
    const slugConflict = await prisma.product.findFirst({ where: { slug, NOT: { id: productId } } });
    if (slugConflict) return { error: "A product with this slug already exists." };

    // Update product — replace images, sizes, colors in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: { name, slug, description, price, categoryId },
      });

      // Replace images
      await tx.productImage.deleteMany({ where: { productId } });
      await tx.productImage.createMany({
        data: validImages.map((url: string) => ({ url, productId })),
      });

      // Replace sizes
      await tx.productSize.deleteMany({ where: { productId } });
      await tx.productSize.createMany({
        data: validSizes.map((s: { name: string; stock: number }) => ({
          name: s.name,
          stock: s.stock,
          productId,
        })),
      });

      // Replace colors
      await tx.productColor.deleteMany({ where: { productId } });
      await tx.productColor.createMany({
        data: validColors.map((c: { name: string; hex: string }) => ({
          name: c.name,
          hex: c.hex,
          productId,
        })),
      });
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { error: "Something went wrong while updating the product." };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "STORE_MANAGER") {
      return { error: "Unauthorized" };
    }

    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete Product Error:", error);
    return { error: "Failed to delete the product." };
  }
}
