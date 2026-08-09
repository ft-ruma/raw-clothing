'use client';

import { CategoryCard } from '../ui/CategoryCard';
import { motion } from 'framer-motion';

interface FeaturedCategoriesProps {
  categories: any[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter text-raw-black">
            Shop By Category
          </h2>
          <a href="/shop" className="text-sm font-bold uppercase tracking-wider hover:text-raw-orange transition-colors">
            Explore All
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 4).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
            >
              <CategoryCard 
                category={category} 
                isLarge={index === 0}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
