"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import { useCart } from "../cart/CartProvider";
import { MegaMenu } from "../home/MegaMenu";
import { MobileMenu } from "../home/MobileMenu";

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm py-4 border-b border-gray-100"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-full transition-colors text-raw-black hover:bg-black/5"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-flex flex-col items-center lg:items-start leading-none transition-colors group">
              <span className="font-heading font-black text-xl tracking-[0.15em] uppercase text-raw-black group-hover:text-raw-orange transition-colors">
                RAVINDRA BATIKS
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-raw-text-secondary font-medium">
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
                  className="font-bold text-sm tracking-widest uppercase transition-colors py-2 text-raw-text-secondary hover:text-raw-black"
                >
                  {item}
                </Link>
                {/* Active indicator line */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-raw-orange transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
            <button className="p-2 rounded-full transition-colors text-raw-black hover:bg-black/5">
              <Search size={20} />
            </button>
            <Link href="/account" className="p-2 rounded-full hidden sm:block transition-colors text-raw-black hover:bg-black/5">
              <User size={20} />
            </Link>
            <Link href="/wishlist" className="p-2 rounded-full hidden sm:block transition-colors text-raw-black hover:bg-black/5">
              <Heart size={20} />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full relative transition-colors text-raw-black hover:bg-black/5"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-raw-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
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
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
