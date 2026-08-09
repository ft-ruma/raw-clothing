import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="mt-2 text-sm text-gray-700">
          {customers.length} registered customers.
        </p>
      </div>

      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Orders</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joined</th>
              <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-gray-500">No customers yet.</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{customer.name ?? "—"}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{customer.email}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{customer._count.orders}</td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customer.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                      customer.status === "SUSPENDED" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-4 text-right">
                    <Link href={`/admin/customers/${customer.id}`} className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="h-5 w-5 inline" />
                      <span className="sr-only">View {customer.name}</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
