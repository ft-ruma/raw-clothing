import { prisma } from "@/lib/prisma";
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // Fetch all KPIs in parallel
  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
    lowStockSizes,
    recentOrders,
    revenueResult,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.productSize.count({ where: { stock: { lte: 5, gt: 0 } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        guestEmail: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      }
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } }
    }),
  ]);

  const totalRevenue = Number(revenueResult._sum.totalAmount ?? 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const kpis = [
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "bg-green-500" },
    { label: "Total Orders", value: totalOrders, icon: Package, color: "bg-blue-500" },
    { label: "Pending Orders", value: pendingOrders, icon: Clock, color: "bg-yellow-500" },
    { label: "Delivered Orders", value: deliveredOrders, icon: CheckCircle, color: "bg-emerald-500" },
    { label: "Cancelled Orders", value: cancelledOrders, icon: XCircle, color: "bg-red-500" },
    { label: "Customers", value: totalCustomers, icon: Users, color: "bg-purple-500" },
    { label: "Active Products", value: totalProducts, icon: ShoppingBag, color: "bg-indigo-500" },
    { label: "Low Stock Variants", value: lowStockSizes, icon: AlertTriangle, color: "bg-orange-500" },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Welcome back. Here's your store at a glance.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${kpi.color} rounded-md p-3`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{kpi.label}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{kpi.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Average Order Value */}
      <div className="mb-8 bg-white shadow rounded-lg p-5 flex items-center gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Average Order Value</p>
          <p className="text-2xl font-semibold text-gray-900">${avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">No orders yet.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      <Link href={`/admin/orders/${order.id}`}>
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.guestEmail ?? "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${Number(order.totalAmount).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
