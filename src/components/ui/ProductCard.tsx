import Link from 'next/link';
import Image from 'next/image';
import { WishlistButton } from './WishlistButton';
import { QuickAddButton } from './QuickAddButton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string | any;
    compareAtPrice?: number | string | any | null;
    isNewArrival?: boolean;
    salesCount?: number;
    category?: { name: string };
    images: { url: string }[];
    sizes: { name: string; stock: number }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const inStock = product.sizes?.some(size => size.stock > 0);
  const isSale = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  
  // Calculate discount percentage
  const discountPercent = isSale 
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : 0;

  const primaryImage = product.images[0]?.url || '/placeholder.png';
  const secondaryImage = product.images[1]?.url || primaryImage;

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg bg-white p-3">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-raw-off-white">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        {/* Secondary hover image */}
        <Image
          src={secondaryImage}
          alt={`${product.name} alternate view`}
          fill
          className="absolute inset-0 object-cover object-center opacity-0 transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-100"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-white/90 backdrop-blur-sm text-raw-black text-xs font-bold px-2 py-1 uppercase rounded-sm shadow-sm">
              New
            </span>
          )}
          {isSale && (
            <span className="bg-raw-error/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 uppercase rounded-sm shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {!inStock && (
            <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 uppercase rounded-sm shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Toggle */}
        <div className="absolute top-3 right-3 opacity-0 transform translate-x-4 transition-all duration-300 ease-[var(--ease-premium)] group-hover:opacity-100 group-hover:translate-x-0">
          <WishlistButton productId={product.id} />
        </div>

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 transition-all duration-400 ease-[var(--ease-premium)] group-hover:translate-y-0 group-hover:opacity-100">
          <QuickAddButton product={product} inStock={inStock} />
        </div>
      </Link>

      {/* Product Details */}
      <Link href={`/product/${product.slug}`} className="flex flex-col gap-1 px-1">
        <p className="text-xs text-raw-text-secondary uppercase tracking-wider font-medium">{product.category?.name || 'Category'}</p>
        <h3 className="text-sm font-bold text-raw-black truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-raw-black">
            Rs. {Number(product.price).toFixed(2)}
          </span>
          {isSale && (
            <span className="text-xs text-raw-text-light line-through">
              Rs. {Number(product.compareAtPrice).toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Simple Swatches placeholder */}
        <div className="flex gap-1.5 mt-2 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-300">
          <div className="w-3 h-3 rounded-full bg-black border border-black/10"></div>
          <div className="w-3 h-3 rounded-full bg-white border border-black/10"></div>
          <div className="w-3 h-3 rounded-full bg-stone-300 border border-black/10"></div>
        </div>
      </Link>
    </div>
  );
}
