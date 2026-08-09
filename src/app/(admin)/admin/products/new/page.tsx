import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-sm text-gray-700">
          Fill in the information below to add a new product to your catalogue.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 p-8">
        {categories.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">You need to create at least one category before adding products.</p>
            {/* Note: In a full app, we would add a category creation flow here */}
            <p className="mt-4 text-xs text-red-500">Please seed the database with categories first.</p>
          </div>
        ) : (
          <ProductForm categories={categories} />
        )}
      </div>
    </div>
  );
}
