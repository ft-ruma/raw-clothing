"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product";
import ImageUploader from "@/components/admin/ImageUploader";
import { Plus, Trash2 } from "lucide-react";

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialProduct?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    categoryId: string;
    images: { url: string }[];
    sizes: { name: string; stock: number }[];
    colors: { name: string; hex: string }[];
  };
}

export default function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!initialProduct;

  const [sizes, setSizes] = useState(
    initialProduct?.sizes ?? [{ name: "S", stock: 10 }, { name: "M", stock: 10 }]
  );
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    initialProduct?.colors ?? []
  );
  const [images, setImages] = useState<string[]>(
    initialProduct?.images.map((img) => img.url) ?? []
  );

  // New color temporary inputs
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const handleAddSize = () => setSizes([...sizes, { name: "", stock: 0 }]);
  const handleRemoveSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    // Check if color name already exists
    if (colors.some((c) => c.name.toLowerCase() === newColorName.trim().toLowerCase())) {
      return;
    }
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName("");
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  async function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("sizes", JSON.stringify(sizes));
    formData.set("colors", JSON.stringify(colors));
    formData.set("images", JSON.stringify(images.filter((img) => img.trim() !== "")));

    startTransition(async () => {
      const result = isEditing
        ? await updateProduct(initialProduct!.id, null, formData)
        : await createProduct(null, formData);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        {/* Basic Information */}
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            <p className="mt-1 text-sm text-gray-500">Provide the essential details about the product.</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
              <div className="mt-1">
                <input
                  type="text" name="name" id="name" required
                  defaultValue={initialProduct?.name}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                  placeholder="e.g. Vintage Denim Jacket"
                  onChange={(e) => {
                    const slugInput = document.getElementById("slug") as HTMLInputElement;
                    if (slugInput && !slugInput.value) {
                      slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                    }
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL Slug</label>
              <div className="mt-1">
                <input
                  type="text" name="slug" id="slug" required
                  defaultValue={initialProduct?.slug}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                  placeholder="vintage-denim-jacket"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <div className="mt-1">
                <textarea
                  id="description" name="description" rows={4} required
                  defaultValue={initialProduct?.description}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (LKR)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">Rs.</span>
                </div>
                <input
                  type="number" name="price" id="price" step="0.01" min="0" required
                  defaultValue={initialProduct?.price}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-black focus:ring-black sm:text-sm p-2 border"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
              <div className="mt-1">
                <select
                  id="categoryId" name="categoryId" required
                  defaultValue={initialProduct?.categoryId}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Images</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload product images directly. The first image will be used as the primary thumbnail.
            </p>
          </div>
          <div className="mt-6">
            <ImageUploader images={images} onChange={(urls) => setImages(urls)} maxImages={8} />
          </div>
        </div>

        {/* Sizes & Inventory */}
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Sizes & Inventory</h3>
            <p className="mt-1 text-sm text-gray-500">Define the available sizes and stock quantities.</p>
          </div>
          <div className="mt-6 space-y-4">
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Size Name</label>
                  <input
                    type="text" value={size.name}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[index].name = e.target.value;
                      setSizes(newSizes);
                    }}
                    className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                    placeholder="e.g. M"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Stock Qty</label>
                  <input
                    type="number" min="0" value={size.stock}
                    onChange={(e) => {
                      const newSizes = [...sizes];
                      newSizes[index].stock = parseInt(e.target.value) || 0;
                      setSizes(newSizes);
                    }}
                    className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                  />
                </div>
                <div className="pt-5">
                  <button type="button" onClick={() => handleRemoveSize(index)} className="text-red-600 hover:text-red-900 text-sm font-medium">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button" onClick={handleAddSize}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800"
            >
              Add Size
            </button>
          </div>
        </div>

        {/* Colors Section */}
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Color Options</h3>
            <p className="mt-1 text-sm text-gray-500">Configure custom colors for this product. If left empty, no color selector will show for this product.</p>
          </div>
          
          <div className="mt-6 space-y-4">
            {/* List current colors */}
            {colors.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }} />
                    <span className="text-sm font-medium text-gray-800">{color.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="text-gray-400 hover:text-red-600 transition-colors ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No color options added yet.</p>
            )}

            {/* Add new color picker */}
            <div className="flex items-end gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">Color Name</label>
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="mt-1 block w-44 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                  placeholder="e.g. Olive Green"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Picker</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-black sm:text-sm p-2 border"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddColor}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Color
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="pt-5">
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="pt-5">
        <div className="flex justify-end gap-3">
          <button
            type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit" disabled={isPending}
            className="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isPending ? "Saving..." : isEditing ? "Save Changes" : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
