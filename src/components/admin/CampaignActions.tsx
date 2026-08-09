"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { setActiveCampaign, deactivateCampaign, deleteCampaign } from "@/actions/campaign";
import { Zap, ZapOff, Edit, Trash2, Loader2 } from "lucide-react";

interface Props {
  campaignId: string;
  isActive: boolean;
  isExpired: boolean;
}

export default function CampaignActions({ campaignId, isActive, isExpired }: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function act(fn: () => Promise<any>) {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mt-3 space-y-2">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-2">
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        {!isActive && !isExpired && (
          <button
            onClick={() => act(() => setActiveCampaign(campaignId))}
            disabled={isPending}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Zap className="h-3 w-3" /> Activate
          </button>
        )}
        {isActive && (
          <button
            onClick={() => act(() => deactivateCampaign(campaignId))}
            disabled={isPending}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <ZapOff className="h-3 w-3" /> Deactivate
          </button>
        )}
        <Link
          href={`/admin/campaigns/${campaignId}/edit`}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Edit className="h-3 w-3" /> Edit
        </Link>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        ) : (
          <>
            <button onClick={() => act(() => deleteCampaign(campaignId))} disabled={isPending}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md text-white disabled:opacity-50 transition-colors"
              style={{ backgroundColor: "#cc0000", color: "#ffffff" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#aa0000")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#cc0000")}
            >
              Yes, Delete
            </button>
            <button onClick={() => setConfirming(false)} className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
