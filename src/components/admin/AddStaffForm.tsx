"use client";

import { useState, useTransition } from "react";
import { createStaffUser } from "@/actions/staff";

export default function AddStaffForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await createStaffUser(null, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        (document.getElementById("add-staff-form") as HTMLFormElement)?.reset();
      }
    });
  }

  return (
    <form id="add-staff-form" action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" name="name" className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="John Doe" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email *</label>
        <input type="email" name="email" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="john@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password *</label>
        <input type="password" name="password" required minLength={8} className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="Min 8 characters" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role *</label>
        <select name="role" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm">
          <option value="STAFF">Staff</option>
          <option value="STORE_MANAGER">Store Manager</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 p-2 rounded">Staff member created successfully!</p>}

      <button type="submit" disabled={isPending}
        className="w-full bg-black text-white py-2 px-4 text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50">
        {isPending ? "Creating..." : "Create Staff Member"}
      </button>
    </form>
  );
}
