'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: any[];
  viewAllLink?: string;
}

export function ProductCarousel({ title, subtitle, products, viewAllLink }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter text-raw-black">{title}</h2>
            {subtitle && <p className="text-raw-text-secondary mt-2 text-lg">{subtitle}</p>}
          </div>
          
          <div className="flex items-center gap-4">
            {viewAllLink && (
              <a href={viewAllLink} className="text-sm font-bold uppercase tracking-wider hover:text-raw-orange transition-colors">
                View All
              </a>
            )}
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-4 px-4 md:-mx-8 md:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[85vw] sm:min-w-[45vw] md:min-w-[30vw] lg:min-w-[22vw] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
