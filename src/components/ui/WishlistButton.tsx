'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface WishlistButtonProps {
  productId: string;
  initialState?: boolean;
}

export function WishlistButton({ productId, initialState = false }: WishlistButtonProps) {
  const [isLiked, setIsLiked] = useState(initialState);
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // In a real app, you would make an API call here to save the state
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleWishlist}
      className={`p-2 rounded-full backdrop-blur-md bg-white/80 shadow-sm border border-black/5 transition-colors ${
        isLiked ? 'text-raw-error' : 'text-raw-text-primary hover:text-raw-black'
      }`}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        size={18} 
        className={isLiked ? 'fill-current' : ''} 
      />
    </motion.button>
  );
}
