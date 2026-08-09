"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || !["SUPER_ADMIN", "STORE_MANAGER"].includes(role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
});

export async function createCategory(prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || undefined,
    };

    const validated = categorySchema.safeParse(data);
    if (!validated.success) {
      return { error: "Validation failed", details: validated.error.flatten().fieldErrors };
    }

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name: validated.data.name }, { slug: validated.data.slug }] }
    });
    if (existing) {
      return { error: "A category with this name or slug already exists." };
    }

    await prisma.category.create({ data: validated.data });
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    console.error("createCategory error:", e);
    return { error: "Something went wrong." };
  }
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || undefined,
    };

    const validated = categorySchema.safeParse(data);
    if (!validated.success) {
      return { error: "Validation failed", details: validated.error.flatten().fieldErrors };
    }

    const conflicting = await prisma.category.findFirst({
      where: {
        OR: [{ name: validated.data.name }, { slug: validated.data.slug }],
        NOT: { id }
      }
    });
    if (conflicting) {
      return { error: "Another category already uses this name or slug." };
    }

    await prisma.category.update({ where: { id }, data: validated.data });
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    console.error("updateCategory error:", e);
    return { error: "Something went wrong." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAdmin();

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return { error: `Cannot delete: ${productCount} product(s) are in this category. Re-assign them first.` };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    console.error("deleteCategory error:", e);
    return { error: "Something went wrong." };
  }
}
