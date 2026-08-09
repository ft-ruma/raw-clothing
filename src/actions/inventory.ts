"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || !["SUPER_ADMIN", "STORE_MANAGER", "STAFF"].includes(role)) {
    throw new Error("Unauthorized");
  }
}

export async function updateStock(sizeId: string, stock: number) {
  try {
    await requireAdmin();
    if (stock < 0) return { error: "Stock cannot be negative" };

    await prisma.productSize.update({
      where: { id: sizeId },
      data: { stock },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    console.error("updateStock error:", e);
    return { error: "Failed to update stock" };
  }
}
