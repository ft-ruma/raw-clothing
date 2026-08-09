'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const navLinks = [
    { label: 'New Arrivals', href: '/shop?new=true', highlight: true },
    { label: 'Men', href: '/shop?category=men' },
    { label: 'Women', href: '/shop?category=women' },
    { label: 'Unisex', href: '/shop?category=unisex' },
    { label: 'Collections', href: '/collections' },
    { label: 'Best Sellers', href: '/shop?bestsellers=true' },
    { label: 'Sale', href: '/shop?category=sale', isSale: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white z-[101] shadow-2xl flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex flex-col leading-none">
                <span className="font-heading font-black text-base tracking-[0.12em] uppercase">RAVINDRA BATIKS</span>
                <span className="text-[8px] tracking-[0.2em] uppercase text-gray-400 font-medium">Where Tradition Meets Elegance</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              <nav className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-gray-50 group transition-colors"
                    >
                      <span className={`font-heading text-lg font-bold uppercase tracking-tight ${
                        link.highlight ? 'text-raw-red' : link.isSale ? 'text-raw-red' : 'text-raw-black'
                      }`}>
                        {link.label}
                      </span>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-raw-black transition-colors transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-6 py-8 mt-4 bg-gray-50 m-6 rounded-xl">
                <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Customer Care</h4>
                <div className="flex flex-col gap-3 text-gray-600">
                  <Link href="/account" onClick={onClose}>My Account</Link>
                  <Link href="/orders" onClick={onClose}>Track Order</Link>
                  <Link href="/faq" onClick={onClose}>FAQ & Support</Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
