import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StaffTable from "@/components/admin/StaffTable";
import AddStaffForm from "@/components/admin/AddStaffForm";

export default async function AdminStaffPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "SUPER_ADMIN") redirect("/admin");

  const staff = await prisma.user.findMany({
    where: { role: { in: ["SUPER_ADMIN", "STORE_MANAGER", "STAFF"] } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
        <p className="mt-2 text-sm text-gray-700">Manage admin users and their roles. Only Super Admins can access this page.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Staff list */}
        <div className="lg:col-span-2">
          <StaffTable staff={staff} currentUserId={(session?.user as any)?.id} />
        </div>

        {/* Add new staff */}
        <div>
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Add Staff Member</h2>
            <AddStaffForm />
          </div>
        </div>
      </div>
    </div>
  );
}
