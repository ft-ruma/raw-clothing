import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const { category, sort, q } = await searchParams;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const orderBy: any =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      images: { take: 1 },
      sizes: true,
    },
    orderBy,
  });

  const sortOptions = [
    { label: "Newest", value: "" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">Shop</h1>
        <p className="text-sm text-gray-500">{products.length} products</p>
      </div>

      <div className="pt-6 lg:grid lg:grid-cols-4 lg:gap-x-8">
        {/* Filters */}
        <aside>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Search</h3>
            <form method="GET">
              {category && <input type="hidden" name="category" value={category} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </form>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Category</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className={`text-sm ${!category ? "font-bold text-black" : "text-gray-600 hover:text-black"}`}
                >
                  All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
                    className={`text-sm ${category === cat.slug ? "font-bold text-black" : "text-gray-600 hover:text-black"}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Sort By</h3>
            <ul className="space-y-2">
              {sortOptions.map((option) => (
                <li key={option.value}>
                  <Link
                    href={`/shop?${category ? `category=${category}&` : ""}sort=${option.value}`}
                    className={`text-sm ${sort === option.value || (!sort && option.value === "") ? "font-bold text-black" : "text-gray-600 hover:text-black"}`}
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No products found.</p>
              <Link href="/shop" className="mt-4 text-sm text-indigo-600 hover:text-indigo-500">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
              {products.map((product) => {
                const inStock = product.sizes.some((s) => s.stock > 0);
                return (
                  <Link key={product.id} href={`/product/${product.slug}`} className="group relative">
                    <div className="relative w-full h-72 overflow-hidden rounded-md bg-gray-200 border">
                      {product.images[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-center group-hover:opacity-75 transition-opacity"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <ShoppingBag className="h-12 w-12" />
                        </div>
                      )}
                      {!inStock && (
                        <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1">
                          Sold Out
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase">{product.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">Rs. {Number(product.price).toFixed(2)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
