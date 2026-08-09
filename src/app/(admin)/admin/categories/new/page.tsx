import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory } from "@/actions/category";

export default function NewCategoryPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/categories" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">New Category</h1>
        <p className="mt-1 text-sm text-gray-500">Create a new product category.</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        <CategoryForm action={createCategory} />
      </div>
    </div>
  );
}
