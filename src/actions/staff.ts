"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

async function requireSuperAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createStaffUser(prevState: any, formData: FormData) {
  try {
    await requireSuperAdmin();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;

    if (!email || !role || !password) return { error: "All fields are required." };
    if (!["SUPER_ADMIN", "STORE_MANAGER", "STAFF"].includes(role)) {
      return { error: "Invalid role." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "A user with this email already exists." };

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, role: role as any, passwordHash },
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    console.error("createStaffUser error:", e);
    return { error: "Failed to create staff user" };
  }
}

export async function updateStaffRole(id: string, role: string) {
  try {
    await requireSuperAdmin();
    if (!["SUPER_ADMIN", "STORE_MANAGER", "STAFF"].includes(role)) {
      return { error: "Invalid role." };
    }
    await prisma.user.update({ where: { id }, data: { role: role as any } });
    revalidatePath("/admin/staff");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to update role" };
  }
}

export async function deactivateStaffUser(id: string) {
  try {
    await requireSuperAdmin();
    await prisma.user.update({ where: { id }, data: { status: "INACTIVE" } });
    revalidatePath("/admin/staff");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to deactivate user" };
  }
}
