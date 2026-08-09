import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderStatusUpdater from "./OrderStatusUpdater";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, images: { take: 1 } }
          }
        }
      }
    }
  });

  if (!order) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/orders" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="py-4 flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <p>Total</p>
                  <p>${Number(order.totalAmount).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h2>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">{order.shippingAddress}</pre>
            </div>
          </div>
        </div>

        {/* Status panel */}
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Customer</h2>
              <p className="text-sm text-gray-600">{order.guestEmail ?? "Registered user"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
