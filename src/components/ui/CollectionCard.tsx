import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CollectionCardProps {
  collection: {
    title: string;
    slug: string;
    description?: string;
    image?: string;
    productCount?: number;
  };
  className?: string;
}

export function CollectionCard({ collection, className = "" }: CollectionCardProps) {
  const imageUrl = collection.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
  
  return (
    <Link 
      href={`/collections/${collection.slug}`}
      className={`group flex flex-col min-w-[280px] md:min-w-[350px] w-full snap-start ${className}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-raw-off-white mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-500">
        <Image
          src={imageUrl}
          alt={collection.title}
          fill
          className="object-cover object-center transition-transform duration-1000 ease-[var(--ease-premium)] group-hover:scale-105"
        />
        
        {/* Explore button overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-white text-raw-black px-6 py-3 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[var(--ease-premium)]">
            Explore Collection <ArrowRight size={16} />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col px-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading text-xl font-bold text-raw-black uppercase tracking-tight">{collection.title}</h3>
          {collection.productCount !== undefined && (
            <span className="text-xs font-medium text-raw-text-secondary bg-raw-grey px-2 py-1 rounded-sm">
              {collection.productCount}
            </span>
          )}
        </div>
        {collection.description && (
          <p className="text-raw-text-secondary text-sm line-clamp-2">{collection.description}</p>
        )}
      </div>
    </Link>
  );
}
