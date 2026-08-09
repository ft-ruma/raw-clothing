'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface MegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MegaMenu({ isOpen, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-raw-black overflow-hidden z-40"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="max-w-[1440px] mx-auto px-8 py-10 flex gap-12">
            
            {/* Categories */}
            <div className="w-1/4">
              <h3 className="font-heading font-bold text-lg mb-4">CATEGORIES</h3>
              <ul className="space-y-3">
                <li><Link href="/shop?category=t-shirts" className="text-gray-600 hover:text-raw-black transition-colors">T-Shirts</Link></li>
                <li><Link href="/shop?category=hoodies" className="text-gray-600 hover:text-raw-black transition-colors">Hoodies & Sweatshirts</Link></li>
                <li><Link href="/shop?category=jackets" className="text-gray-600 hover:text-raw-black transition-colors">Outerwear</Link></li>
                <li><Link href="/shop?category=trousers" className="text-gray-600 hover:text-raw-black transition-colors">Bottoms</Link></li>
                <li><Link href="/shop?category=accessories" className="text-gray-600 hover:text-raw-black transition-colors">Accessories</Link></li>
              </ul>
            </div>

            {/* Featured Collections */}
            <div className="w-1/4">
              <h3 className="font-heading font-bold text-lg mb-4">COLLECTIONS</h3>
              <ul className="space-y-3">
                <li><Link href="/collections/raw-essentials" className="text-gray-600 hover:text-raw-black transition-colors font-medium">RAW Essentials</Link></li>
                <li><Link href="/collections/oversized-collection" className="text-gray-600 hover:text-raw-black transition-colors">The Oversized Edit</Link></li>
                <li><Link href="/collections/monochrome-edit" className="text-gray-600 hover:text-raw-black transition-colors">Monochrome Series</Link></li>
                <li><Link href="/shop?new=true" className="text-raw-red hover:text-raw-black transition-colors font-bold mt-2 inline-block">New Arrivals</Link></li>
                <li><Link href="/shop?bestsellers=true" className="text-raw-black hover:text-raw-red transition-colors font-bold inline-block">Best Sellers</Link></li>
              </ul>
            </div>

            {/* Promotional Images */}
            <div className="w-2/4 flex gap-6">
              <Link href="/shop?new=true" className="relative group block w-1/2 aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <Image 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop"
                  alt="New Arrivals"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-bold tracking-widest text-sm drop-shadow-md">LATEST DROP</span>
                </div>
              </Link>
              
              <Link href="/collections/raw-essentials" className="relative group block w-1/2 aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <Image 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
                  alt="Essentials"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-bold tracking-widest text-sm drop-shadow-md">RAW ESSENTIALS</span>
                </div>
              </Link>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
