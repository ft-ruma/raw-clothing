'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // Check initial scroll position on mount
  useEffect(() => {
    if (window.scrollY > 40) {
      setIsScrolled(true);
    }
  }, []);

  const isDark = !isScrolled && !activeMegaMenu;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'fixed top-0 bg-white/90 backdrop-blur-md shadow-sm py-4' 
            : `absolute top-10 py-6 ${
                activeMegaMenu 
                  ? 'bg-white/90 backdrop-blur-md shadow-sm' 
                  : 'bg-transparent'
              }`
        }`}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-raw-black hover:bg-black/5'}`}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-flex flex-col items-center lg:items-start leading-none group">
              <span className={`font-heading font-black text-xl tracking-[0.15em] uppercase transition-colors ${
                isDark ? 'text-white group-hover:text-white/80' : 'text-raw-black group-hover:text-raw-orange'
              }`}>
                RAVINDRA BATIKS
              </span>
              <span className={`text-[9px] tracking-[0.25em] uppercase font-medium transition-colors ${
                isDark ? 'text-white/60' : 'text-raw-text-secondary'
              }`}>
                Where Tradition Meets Elegance
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center gap-8">
            {['New Arrivals', 'Men', 'Women', 'Unisex', 'Collections'].map((item) => (
              <div 
                key={item}
                className="relative group h-full"
                onMouseEnter={() => setActiveMegaMenu(item)}
              >
                <Link 
                  href={`/shop`} 
                  className={`font-bold text-sm tracking-widest uppercase transition-colors py-2 ${
                    isDark ? 'text-white/90 hover:text-white' : 'text-raw-text-secondary hover:text-raw-black'
                  }`}
                >
                  {item}
                </Link>
                {/* Active indicator line */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-raw-red transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
            <button className={`p-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-raw-black hover:bg-black/5'}`}>
              <Search size={20} />
            </button>
            <Link href="/account" className={`p-2 rounded-full hidden sm:block transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-raw-black hover:bg-black/5'}`}>
              <User size={20} />
            </Link>
            <Link href="/wishlist" className={`p-2 rounded-full hidden sm:block transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-raw-black hover:bg-black/5'}`}>
              <Heart size={20} />
            </Link>
            <button className={`p-2 rounded-full relative transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-raw-black hover:bg-black/5'}`}>
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-raw-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <MegaMenu 
          isOpen={!!activeMegaMenu} 
          onMouseEnter={() => {}} 
          onMouseLeave={() => setActiveMegaMenu(null)}
        />
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
