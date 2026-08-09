"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/product";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteProduct(productId);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      setConfirming(false);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Delete &quot;{productName}&quot;?</span>
        <button
          onClick={handleDelete} disabled={loading}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "#cc0000", color: "#ffffff" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#aa0000")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#cc0000")}
        >
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
      Delete Product
    </button>
  );
}
