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

export async function createCampaign(prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const endDate = formData.get("endDate") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!name || !endDate) return { error: "Name and end date are required." };

    await prisma.campaign.create({
      data: {
        name,
        description: description || null,
        endDate: new Date(endDate),
        imageUrl: imageUrl || null,
        isActive: false,
      },
    });

    revalidatePath("/admin/campaigns");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    console.error("createCampaign error:", e);
    return { error: "Failed to create campaign" };
  }
}

export async function updateCampaign(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const endDate = formData.get("endDate") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!name || !endDate) return { error: "Name and end date are required." };

    await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description: description || null,
        endDate: new Date(endDate),
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/admin/campaigns");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to update campaign" };
  }
}

export async function setActiveCampaign(id: string) {
  try {
    await requireAdmin();
    // Deactivate all, then activate the selected one
    await prisma.campaign.updateMany({ data: { isActive: false } });
    await prisma.campaign.update({ where: { id }, data: { isActive: true } });
    revalidatePath("/admin/campaigns");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to activate campaign" };
  }
}

export async function deactivateCampaign(id: string) {
  try {
    await requireAdmin();
    await prisma.campaign.update({ where: { id }, data: { isActive: false } });
    revalidatePath("/admin/campaigns");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to deactivate campaign" };
  }
}

export async function deleteCampaign(id: string) {
  try {
    await requireAdmin();
    await prisma.campaign.delete({ where: { id } });
    revalidatePath("/admin/campaigns");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Failed to delete campaign" };
  }
}
