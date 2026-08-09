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

export async function addGalleryImage(url: string, caption?: string, link?: string) {
  try {
    await requireAdmin();
    await prisma.socialGalleryImage.create({
      data: { url, caption: caption || null, link: link || null },
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to add image" };
  }
}

export async function updateGalleryImage(id: string, data: { caption?: string; link?: string; isVisible?: boolean }) {
  try {
    await requireAdmin();
    await prisma.socialGalleryImage.update({ where: { id }, data });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to update image" };
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await requireAdmin();
    await prisma.socialGalleryImage.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to delete image" };
  }
}
