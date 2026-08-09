import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage all customer orders from this page.
        </p>
      </div>

      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Order</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="relative py-3.5 pl-3 pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-indigo-600">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {order.guestEmail ?? "Registered user"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="h-5 w-5" />
                      <span className="sr-only">View order</span>
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
