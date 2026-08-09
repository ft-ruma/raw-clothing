"use client";

import { useState, useTransition } from "react";
import { approveReview, rejectReview, deleteReview } from "@/actions/review";
import { CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react";

export default function ReviewActions({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function act(fn: () => Promise<any>) {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
      {error && <span className="text-xs text-red-600">{error}</span>}
      {!isApproved ? (
        <button
          onClick={() => act(() => approveReview(reviewId))}
          disabled={isPending}
          title="Approve"
          className="text-green-600 hover:text-green-800 disabled:opacity-40"
        >
          <CheckCircle className="h-5 w-5" />
        </button>
      ) : (
        <button
          onClick={() => act(() => rejectReview(reviewId))}
          disabled={isPending}
          title="Reject"
          className="text-yellow-600 hover:text-yellow-800 disabled:opacity-40"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
      <button
        onClick={() => act(() => deleteReview(reviewId))}
        disabled={isPending}
        title="Delete"
        className="text-red-500 hover:text-red-700 disabled:opacity-40"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
