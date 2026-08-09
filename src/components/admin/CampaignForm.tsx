"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

interface CampaignFormProps {
  initialCampaign?: {
    id: string;
    name: string;
    description: string | null;
    endDate: Date;
    imageUrl: string | null;
  };
  action: (prevState: any, formData: FormData) => Promise<any>;
}

export default function CampaignForm({ initialCampaign, action }: CampaignFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialCampaign?.imageUrl ? [initialCampaign.imageUrl] : []
  );

  // Format date for input
  const defaultEndDate = initialCampaign
    ? new Date(initialCampaign.endDate).toISOString().split("T")[0]
    : "";

  async function handleSubmit(formData: FormData) {
    setError(null);
    if (imageUrls[0]) formData.set("imageUrl", imageUrls[0]);
    startTransition(async () => {
      const result = await action(null, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/campaigns");
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cam-name" className="block text-sm font-medium text-gray-700">Campaign Name *</label>
        <input
          type="text" id="cam-name" name="name" required
          defaultValue={initialCampaign?.name}
          className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-sm"
          placeholder="e.g. Summer Sale 2024"
        />
      </div>

      <div>
        <label htmlFor="cam-desc" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="cam-desc" name="description" rows={3}
          defaultValue={initialCampaign?.description ?? ""}
          className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-sm"
          placeholder="Describe this campaign..."
        />
      </div>

      <div>
        <label htmlFor="cam-end" className="block text-sm font-medium text-gray-700">End Date *</label>
        <input
          type="date" id="cam-end" name="endDate" required
          defaultValue={defaultEndDate}
          className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
        <ImageUploader images={imageUrls} onChange={(urls) => setImageUrls(urls)} maxImages={1} />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">{error}</div>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={isPending}
          className="rounded-md bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
          {isPending ? "Saving..." : initialCampaign ? "Save Changes" : "Create Campaign"}
        </button>
      </div>
    </form>
  );
}
