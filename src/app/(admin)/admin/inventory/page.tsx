import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import StockEditor from "@/components/admin/StockEditor";

export default async function AdminInventoryPage() {
  const sizes = await prisma.productSize.findMany({
    include: {
      product: { include: { images: { take: 1 } } },
    },
    orderBy: { stock: "asc" },
  });

  const outOfStock = sizes.filter((s) => s.stock === 0);
  const lowStock = sizes.filter((s) => s.stock > 0 && s.stock <= 5);
  const inStock = sizes.filter((s) => s.stock > 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <p className="mt-2 text-sm text-gray-700">Monitor and edit stock levels across all product sizes.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-bold text-red-600">{outOfStock.length}</p>
            <p className="text-sm text-red-700">Out of Stock</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-bold text-yellow-600">{lowStock.length}</p>
            <p className="text-sm text-yellow-700">Low Stock (≤5)</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4">
          <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-2xl font-bold text-green-600">{inStock.length}</p>
            <p className="text-sm text-green-700">In Stock</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Product</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Size</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sizes.map((size) => {
              const statusLabel = size.stock === 0 ? "Out of Stock" : size.stock <= 5 ? "Low Stock" : "In Stock";
              const statusClass =
                size.stock === 0
                  ? "bg-red-100 text-red-800"
                  : size.stock <= 5
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800";

              return (
                <tr key={size.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{size.product.name}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{size.name}</td>
                  <td className="px-3 py-4 text-sm">
                    <StockEditor sizeId={size.id} initialStock={size.stock} />
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right text-sm">
                    <Link href={`/admin/products/${size.productId}/edit`} className="text-indigo-600 hover:text-indigo-900 text-xs font-medium">
                      Edit Product
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
