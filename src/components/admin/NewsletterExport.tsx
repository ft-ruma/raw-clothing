"use client";

import { Download } from "lucide-react";

interface Props {
  subscribers: { email: string; date: string }[];
}

export default function NewsletterExport({ subscribers }: Props) {
  function handleExport() {
    const csv = ["Email,Subscribed On", ...subscribers.map((s) => `${s.email},${new Date(s.date).toLocaleDateString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}
