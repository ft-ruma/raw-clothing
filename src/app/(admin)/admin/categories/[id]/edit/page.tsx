import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { updateCategory, deleteCategory } from "@/actions/category";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const boundUpdate = updateCategory.bind(null, id);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/categories" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Categories
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p className="mt-1 text-sm text-gray-500">{category.name}</p>
          </div>
          <DeleteCategoryButton categoryId={id} categoryName={category.name} />
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        <CategoryForm action={boundUpdate} initialCategory={category} />
      </div>
    </div>
  );
}
