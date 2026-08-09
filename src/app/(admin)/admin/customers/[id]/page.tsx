import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import CustomerStatusButton from "@/components/admin/CustomerStatusButton";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!customer || customer.role !== "CUSTOMER") notFound();

  const totalSpent = customer.orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((acc, o) => acc + Number(o.totalAmount), 0);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/customers" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Customers
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name || "Unnamed Customer"}</h1>
            <p className="mt-1 text-sm text-gray-500">{customer.email}</p>
          </div>
          <CustomerStatusButton customerId={customer.id} currentStatus={customer.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{customer.orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">Rs. {totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Account Status</p>
          <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${
            customer.status === "ACTIVE" ? "bg-green-100 text-green-800" :
            customer.status === "SUSPENDED" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
          }`}>
            {customer.status}
          </span>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-gray-900">Order History</h2>
        </div>
        {customer.orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No orders yet.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 pl-6 pr-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customer.orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 pl-6 pr-3 text-sm font-medium text-indigo-600">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-3 py-3 text-sm text-gray-500">{order.items.length}</td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">Rs. {Number(order.totalAmount).toFixed(2)}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-indigo-600 hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
