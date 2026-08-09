import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        sizes: { orderBy: { name: "asc" } },
        colors: { orderBy: { name: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const initialProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    categoryId: product.categoryId,
    images: product.images.map((img) => ({ url: img.url })),
    sizes: product.sizes.map((s) => ({ name: s.name, stock: s.stock })),
    colors: product.colors.map((c) => ({ name: c.name, hex: c.hex })),
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="mt-1 text-sm text-gray-500">{product.name}</p>
          </div>
          <DeleteProductButton productId={product.id} productName={product.name} />
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        <ProductForm categories={categories} initialProduct={initialProduct} />
      </div>
    </div>
  );
}
