'use client';

import { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/cart/CartProvider';

interface QuickAddButtonProps {
  product: {
    id: string;
    name: string;
    price: number | string | any;
    images: { url: string }[];
    sizes: { name: string; stock: number }[];
  };
  inStock: boolean;
  className?: string;
}

export function QuickAddButton({ product, inStock, className = '' }: QuickAddButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate minor network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const firstInStockSize = product.sizes?.find(size => size.stock > 0)?.name || 'S';
    
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      size: firstInStockSize,
      quantity: 1,
      image: product.images?.[0]?.url
    });

    setIsLoading(false);
    setIsSuccess(true);
    
    // Reset success state after 2 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  };

  return (
    <motion.button
      whileHover={inStock ? { scale: 1.05 } : {}}
      whileTap={inStock ? { scale: 0.95 } : {}}
      onClick={handleQuickAdd}
      disabled={!inStock || isLoading}
      className={`relative overflow-hidden flex items-center justify-center gap-2 px-4 py-2 w-full rounded-md font-medium text-sm transition-colors ${
        !inStock 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : isSuccess
            ? 'bg-raw-success text-white'
            : 'bg-black text-white hover:bg-gray-800'
      } ${className}`}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 size={16} className="animate-spin" />
          </motion.div>
        ) : isSuccess ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            Added
          </motion.span>
        ) : (
          <motion.div
            key="default"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ShoppingBag size={16} />
            <span>{!inStock ? 'Out of Stock' : 'Quick Add'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
