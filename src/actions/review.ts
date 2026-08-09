"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || !["SUPER_ADMIN", "STORE_MANAGER"].includes(role)) {
    throw new Error("Unauthorized");
  }
}

export async function approveReview(id: string) {
  try {
    await requireAdmin();
    await prisma.review.update({ where: { id }, data: { isApproved: true } });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to approve review" };
  }
}

export async function rejectReview(id: string) {
  try {
    await requireAdmin();
    await prisma.review.update({ where: { id }, data: { isApproved: false } });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to reject review" };
  }
}

export async function deleteReview(id: string) {
  try {
    await requireAdmin();
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to delete review" };
  }
}
