"use client";

import { useState, useTransition } from "react";
import { updateStock } from "@/actions/inventory";
import { Check, Loader2 } from "lucide-react";

export default function StockEditor({ sizeId, initialStock }: { sizeId: string; initialStock: number }) {
  const [stock, setStock] = useState(initialStock);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isDirty = stock !== initialStock;

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateStock(sizeId, stock);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number" min="0" value={stock}
        onChange={(e) => { setStock(parseInt(e.target.value) || 0); setSaved(false); }}
        className="w-20 rounded-md border-gray-300 border p-1.5 text-sm text-center focus:border-black focus:ring-black"
      />
      {isDirty && (
        <button
          onClick={handleSave} disabled={isPending}
          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
        </button>
      )}
      {saved && <Check className="h-4 w-4 text-green-500" />}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
