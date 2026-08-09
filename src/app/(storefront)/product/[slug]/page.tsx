import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import ProductFormClient from "./ProductFormClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const raw = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
      sizes: true,
      colors: true
    }
  });

  if (!raw) notFound();

  // Serialize the Prisma result — Decimal cannot be passed to Client Components
  const product = {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    price: Number(raw.price),
    isArchived: raw.isArchived,
    category: { id: raw.category.id, name: raw.category.name },
    images: raw.images.map(img => ({ id: img.id, url: img.url })),
    sizes: raw.sizes.map(s => ({ id: s.id, name: s.name, stock: s.stock })),
    colors: raw.colors.map(c => ({ id: c.id, name: c.name, hex: c.hex })),
  };

  const inStock = product.sizes.some(size => size.stock > 0);
  const firstImage = product.images[0]?.url;

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-6 pb-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Catalogue
          </Link>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image */}
          <div className="w-full rounded-lg overflow-hidden relative border min-h-[500px] bg-gray-100">
            {firstImage ? (
              <Image
                src={firstImage}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400 min-h-[500px]">
                <ShoppingBag className="h-20 w-20" />
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category.name}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 uppercase">{product.name}</h1>
            
            <div className="mt-3">
              <p className="text-3xl text-gray-900">Rs. {product.price.toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <ProductFormClient product={product} />
            </div>

            {!inStock && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">This item is currently out of stock.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
