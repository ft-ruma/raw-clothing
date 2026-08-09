import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } }
    },
    orderBy: { name: "asc" }
  });

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product categories.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Category
          </Link>
        </div>
      </div>

      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Slug</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Products</th>
              <th className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{category.slug}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{category._count.products}</td>
                <td className="py-4 pl-3 pr-6 text-right text-sm font-medium">
                  <Link href={`/admin/categories/${category.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                    <Edit className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
