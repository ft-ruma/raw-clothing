import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    productCount?: number;
    image?: string;
  };
  className?: string;
  isLarge?: boolean;
}

export function CategoryCard({ category, className = "", isLarge = false }: CategoryCardProps) {
  const imageUrl = category.image || 'https://images.unsplash.com/photo-1523398002811-999aa8d9511e?q=80&w=800&auto=format&fit=crop';
  
  return (
    <Link 
      href={`/shop?category=${category.slug}`}
      className={`group relative block overflow-hidden bg-raw-black rounded-lg ${className}`}
    >
      <div className={`relative w-full ${isLarge ? 'h-[500px] md:h-[600px]' : 'h-[300px] md:h-[400px]'}`}>
        <Image
          src={imageUrl}
          alt={category.name}
          fill
          className="object-cover object-center transition-transform duration-1000 ease-[var(--ease-premium)] group-hover:scale-105"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        
        {/* Animated Border */}
        <div className="absolute inset-4 border border-white/0 group-hover:border-white/20 transition-colors duration-700 ease-[var(--ease-premium)] pointer-events-none rounded-sm" />
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="overflow-hidden">
            <motion.h3 
              className="text-white font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500 ease-[var(--ease-premium)]"
            >
              {category.name}
            </motion.h3>
          </div>
          
          <div className="flex items-center justify-between mt-2 overflow-hidden">
            <p className="text-white/70 text-sm transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500 ease-[var(--ease-premium)] delay-75">
              {category.productCount !== undefined ? `${category.productCount} Products` : 'Explore Category'}
            </p>
            
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-[var(--ease-premium)]">
              <ArrowRight size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
