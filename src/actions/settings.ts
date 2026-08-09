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

export async function updateHomepageSettings(prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const heroTitle = formData.get("heroTitle") as string;
    const heroSubtitle = formData.get("heroSubtitle") as string;
    const heroBannerUrl = formData.get("heroBannerUrl") as string;
    const promoText = formData.get("promoText") as string;
    const promoActive = formData.get("promoActive") === "on";

    const config = { heroTitle, heroSubtitle, heroBannerUrl, promoText, promoActive };

    // Upsert — only one HomepageSetting row
    const existing = await prisma.homepageSetting.findFirst();
    if (existing) {
      await prisma.homepageSetting.update({ where: { id: existing.id }, data: { config } });
    } else {
      await prisma.homepageSetting.create({ data: { config } });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    if (e.message === "Unauthorized") return { error: "Unauthorized" };
    console.error("updateHomepageSettings error:", e);
    return { error: "Failed to save settings" };
  }
}
