"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/actions/category";
import { Trash2 } from "lucide-react";

export default function DeleteCategoryButton({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteCategory(categoryId);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      setConfirming(false);
    } else {
      router.push("/admin/categories");
      router.refresh();
    }
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 max-w-xs text-right">{error}
        <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Delete &quot;{categoryName}&quot;?</span>
        <button onClick={handleDelete} disabled={loading}
          className="px-3 py-1.5 text-sm font-medium rounded-md text-white disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "#cc0000", color: "#ffffff" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#aa0000")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#cc0000")}
        >
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button onClick={() => setConfirming(false)}
          className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-red-300 text-red-600 hover:bg-red-50">
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  );
}
