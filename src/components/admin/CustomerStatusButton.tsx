"use client";

import { useState, useTransition } from "react";
import { suspendCustomer, reactivateCustomer } from "@/actions/customer";
import { ShieldBan, ShieldCheck, Loader2 } from "lucide-react";

export default function CustomerStatusButton({ customerId, currentStatus }: { customerId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      const result = currentStatus === "SUSPENDED"
        ? await reactivateCustomer(customerId)
        : await suspendCustomer(customerId);
      if (result?.error) setError(result.error);
    });
  }

  const isSuspended = currentStatus === "SUSPENDED";

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle} disabled={isPending}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors disabled:opacity-50 ${
          isSuspended
            ? "border-green-300 text-green-700 hover:bg-green-50"
            : "border-red-300 text-red-600 hover:bg-red-50"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSuspended ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <ShieldBan className="h-4 w-4" />
        )}
        {isSuspended ? "Reactivate Account" : "Suspend Account"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
