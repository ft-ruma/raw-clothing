'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import Link from 'next/link';

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: any[];
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  actionText?: string;
  actionLink?: string;
}

export function ProductGrid({ 
  title, 
  subtitle, 
  products, 
  tabs = [], 
  activeTab, 
  onTabChange,
  actionText,
  actionLink
}: ProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter text-raw-black mb-4">{title}</h2>
          {subtitle && <p className="text-raw-text-secondary text-lg max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {tabs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange?.(tab)}
                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-raw-black text-white' 
                    : 'bg-raw-grey text-raw-text-secondary hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10"
        >
          {products.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              key={product.id}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {actionText && actionLink && (
          <div className="mt-16 text-center">
            <a 
              href={actionLink} 
              className="inline-block border-2 border-raw-black text-raw-black hover:bg-raw-black hover:text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors duration-300"
            >
              {actionText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
