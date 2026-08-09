import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      sizes: true,
      images: {
        take: 1, // Get the first image
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the products in your store including their name, price, stock, and category.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Stock</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="whitespace-nowrap py-10 text-center text-sm text-gray-500">
                        No products found. Click "Add Product" to create one.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const totalStock = product.sizes.reduce((acc, size) => acc + size.stock, 0);
                      
                      return (
                        <tr key={product.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 border">
                                {product.images[0]?.url ? (
                                  <Image
                                    src={product.images[0].url}
                                    alt=""
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-gray-400">
                                    <ShoppingBag className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-gray-500 text-xs truncate max-w-[200px]">{product.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {product.category.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${Number(product.price).toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {totalStock}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {product.isArchived ? (
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Archived</span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Active</span>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                                <Edit className="h-5 w-5" />
                                <span className="sr-only">Edit {product.name}</span>
                              </Link>
                              {/* We will implement delete later if needed, stubbing it out for now */}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
