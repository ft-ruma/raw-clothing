import { prisma } from "@/lib/prisma";
import Image from "next/image";
import GalleryManager from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const images = await prisma.socialGalleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Social Gallery</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage the photo gallery shown on your homepage. Upload images and toggle their visibility.
        </p>
      </div>
      <GalleryManager initialImages={images} />
    </div>
  );
}
