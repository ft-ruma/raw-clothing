"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/order";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = () => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status as any);
      if (result.success) {
        setMessage("Status updated successfully.");
        router.refresh();
      } else {
        setMessage(result.error ?? "Failed to update.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[currentStatus] ?? "bg-gray-100 text-gray-800"}`}>
        Current: {currentStatus}
      </span>

      <div>
        <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">Update to</label>
        <select
          id="status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm p-2 border"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={isPending || status === currentStatus}
        className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300"
      >
        {isPending ? "Updating..." : "Update Status"}
      </button>

      {message && <p className="text-xs text-green-600">{message}</p>}
    </div>
  );
}
