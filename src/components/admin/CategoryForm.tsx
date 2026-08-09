"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  initialCategory?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  action: (prevState: any, formData: FormData) => Promise<any>;
}

export default function CategoryForm({ initialCategory, action }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(null, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/categories");
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name *</label>
        <input
          type="text" id="name" name="name" required
          defaultValue={initialCategory?.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
          placeholder="e.g. Batik Tops"
          onChange={(e) => {
            const slugInput = document.getElementById("cat-slug") as HTMLInputElement;
            if (slugInput && !slugInput.value) {
              slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            }
          }}
        />
      </div>

      <div>
        <label htmlFor="cat-slug" className="block text-sm font-medium text-gray-700">Slug *</label>
        <input
          type="text" id="cat-slug" name="slug" required
          defaultValue={initialCategory?.slug}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
          placeholder="batik-tops"
        />
        <p className="mt-1 text-xs text-gray-500">Used in URLs. Lowercase letters, numbers, and hyphens only.</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description" name="description" rows={3}
          defaultValue={initialCategory?.description ?? ""}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
          placeholder="Optional description..."
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button" onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit" disabled={isPending}
          className="inline-flex justify-center rounded-md bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isPending ? "Saving..." : initialCategory ? "Save Changes" : "Create Category"}
        </button>
      </div>
    </form>
  );
}
