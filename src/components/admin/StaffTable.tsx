"use client";

import { useState, useTransition } from "react";
import { updateStaffRole, deactivateStaffUser } from "@/actions/staff";
import { Loader2 } from "lucide-react";

const ROLES = ["SUPER_ADMIN", "STORE_MANAGER", "STAFF"] as const;
const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  STORE_MANAGER: "Store Manager",
  STAFF: "Staff",
};
const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800",
  STORE_MANAGER: "bg-indigo-100 text-indigo-800",
  STAFF: "bg-gray-100 text-gray-800",
};

interface StaffUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

export default function StaffTable({ staff, currentUserId }: { staff: StaffUser[]; currentUserId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function changeRole(id: string, role: string) {
    setError(null);
    startTransition(async () => {
      const result = await updateStaffRole(id, role);
      if (result?.error) setError(result.error);
    });
  }

  function deactivate(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await deactivateStaffUser(id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
      {error && <div className="p-3 bg-red-50 text-red-700 text-sm border-b border-red-200">{error}</div>}
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {staff.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                {user.name || "—"}
                {user.id === currentUserId && <span className="ml-2 text-xs text-gray-400">(you)</span>}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="px-3 py-4">
                {user.id === currentUserId ? (
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                ) : (
                  <select
                    defaultValue={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    disabled={isPending}
                    className="text-xs rounded-md border border-gray-300 p-1 focus:ring-black focus:border-black"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
                  </select>
                )}
              </td>
              <td className="px-3 py-4 text-sm">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-3 py-4 text-right">
                {user.id !== currentUserId && user.status === "ACTIVE" && (
                  <button
                    onClick={() => deactivate(user.id)} disabled={isPending}
                    className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="h-3 w-3 animate-spin inline" /> : "Deactivate"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
