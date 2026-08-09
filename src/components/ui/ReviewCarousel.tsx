'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, BadgeCheck, Quote } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  product?: { name: string; slug: string } | null;
  isVerified: boolean;
  avatarUrl?: string;
}

interface ReviewCarouselProps {
  title: string;
  reviews: Review[];
}

export function ReviewCarousel({ title, reviews }: ReviewCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reviews]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!reviews || reviews.length === 0) return null;

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-20 md:py-32 bg-raw-off-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-raw-orange mb-3">Customer Reviews</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter text-raw-black">{title}</h2>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-raw-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-raw-black text-sm">{avgRating}</span>
              <span className="text-raw-text-secondary text-sm">/ 5 from {reviews.length} reviews</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-raw-black hover:text-white transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-raw-black hover:text-white transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4 md:-mx-8 md:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="min-w-[85vw] sm:min-w-[360px] md:min-w-[400px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] snap-start flex flex-col border-l-4 border-raw-orange"
            >
              <div className="p-8 flex flex-col h-full">
                {/* Quote icon */}
                <Quote size={28} className="text-raw-orange/20 mb-4 flex-shrink-0" />

                {/* Stars */}
                <div className="flex text-raw-gold mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < review.rating ? 'currentColor' : 'none'}
                      className={i >= review.rating ? 'text-gray-200' : ''}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-raw-black text-base md:text-lg font-medium leading-relaxed mb-8 flex-1">
                  "{review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-raw-black flex items-center justify-center overflow-hidden flex-shrink-0">
                    {review.avatarUrl ? (
                      <Image src={review.avatarUrl} alt={review.customerName} width={40} height={40} className="object-cover" />
                    ) : (
                      <span className="font-heading font-bold text-sm text-white">{review.customerName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-raw-black text-sm flex items-center gap-1.5">
                      {review.customerName}
                      {review.isVerified && <BadgeCheck size={14} className="text-raw-info flex-shrink-0" />}
                    </h4>
                    {review.product && (
                      <a href={`/product/${review.product.slug}`} className="text-xs text-raw-text-secondary hover:text-raw-orange transition-colors truncate block max-w-[180px]">
                        Purchased: {review.product.name}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

