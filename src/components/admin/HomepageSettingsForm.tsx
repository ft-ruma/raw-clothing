"use client";

import { useState, useTransition } from "react";
import { updateHomepageSettings } from "@/actions/settings";
import ImageUploader from "@/components/admin/ImageUploader";
import { CheckCircle2 } from "lucide-react";

interface Props {
  initialConfig: Record<string, any>;
}

export default function HomepageSettingsForm({ initialConfig }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [heroBannerUrls, setHeroBannerUrls] = useState<string[]>(
    initialConfig.heroBannerUrl ? [initialConfig.heroBannerUrl] : []
  );

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    if (heroBannerUrls[0]) formData.set("heroBannerUrl", heroBannerUrls[0]);
    startTransition(async () => {
      const result = await updateHomepageSettings(null, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Hero Section */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hero Title</label>
            <input
              type="text" name="heroTitle"
              defaultValue={initialConfig.heroTitle ?? ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="e.g. Discover Authentic Batik"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
            <textarea
              name="heroSubtitle" rows={2}
              defaultValue={initialConfig.heroSubtitle ?? ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="e.g. Handcrafted batik fashion from Sri Lanka"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Banner Image</label>
            <ImageUploader images={heroBannerUrls} onChange={setHeroBannerUrls} maxImages={1} />
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">Promotional Banner</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Promo Text</label>
            <input
              type="text" name="promoText"
              defaultValue={initialConfig.promoText ?? ""}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="e.g. Free shipping on orders over Rs. 5,000"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox" id="promoActive" name="promoActive"
              defaultChecked={initialConfig.promoActive === true}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="promoActive" className="text-sm font-medium text-gray-700">
              Show promo banner on homepage
            </label>
          </div>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">{error}</div>}

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        {saved && (
          <div className="flex items-center gap-1.5 text-green-600 text-sm">
            <CheckCircle2 className="h-4 w-4" /> Settings saved!
          </div>
        )}
        <button
          type="submit" disabled={isPending}
          className="px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
