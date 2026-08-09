"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireSuperAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function suspendCustomer(id: string) {
  try {
    await requireSuperAdmin();
    await prisma.user.update({ where: { id }, data: { status: "SUSPENDED" } });
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to suspend customer" };
  }
}

export async function reactivateCustomer(id: string) {
  try {
    await requireSuperAdmin();
    await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to reactivate customer" };
  }
}
