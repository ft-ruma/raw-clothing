'use client';

import Link from "next/link";
import { useState } from "react";
import { Send, ArrowRight, Package, RefreshCw, ShieldCheck } from "lucide-react";

/* ── Inline social SVGs (not available in this lucide-react version) ── */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-raw-black text-white mt-auto">
      
      {/* Trust Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-raw-orange" />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider">Free Shipping</p>
                <p className="text-white/50 text-xs mt-0.5">On orders over Rs. 5,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={18} className="text-raw-orange" />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider">Easy Returns</p>
                <p className="text-white/50 text-xs mt-0.5">14-day hassle-free returns</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={18} className="text-raw-orange" />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider">Secure Checkout</p>
                <p className="text-white/50 text-xs mt-0.5">SSL encrypted payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="font-heading font-black text-4xl tracking-tighter uppercase text-white hover:text-raw-orange transition-colors duration-300 inline-block mb-1">
              RAVINDRA BATIKS
            </Link>
            <p className="text-raw-orange text-xs font-semibold tracking-widest uppercase mb-4">Where Tradition Meets Elegance</p>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Specialist for Wall Hanging &amp; Ready-made Garments of High Quality. Hand Painted Dresses &amp; Handcrafted Creations.
            </p>

            {/* Location */}
            <a
              href="https://maps.google.com/?q=No+555B,+Kandy+Road,+Horagolla,+Nittambuwa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-white/50 hover:text-white transition-colors duration-200 mb-8 group"
            >
              <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-raw-orange" />
              <span className="text-sm leading-relaxed">
                No: 555/B, Kandy Road,<br />
                Horagolla, Nittambuwa
              </span>
            </a>
            
            {/* Social Links */}
            <div className="flex gap-3 mb-10">
              <a href="https://www.instagram.com/ravindra_batik/" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-raw-orange hover:border-raw-orange transition-all duration-300 group">
                <InstagramIcon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </a>
              <a href="https://www.facebook.com/ravindrabatik/" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-raw-orange hover:border-raw-orange transition-all duration-300 group">
                <FacebookIcon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Stay in the Loop</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-raw-success text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-raw-success/20 flex items-center justify-center text-xs">✓</span>
                  You're on the list. Welcome.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 bg-white/5 border border-white/15 text-white placeholder-white/25 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-raw-orange transition-colors min-w-0"
                  />
                  <button type="submit"
                    className="bg-raw-orange text-white px-4 py-2.5 rounded-lg hover:bg-raw-orange/80 transition-colors flex-shrink-0 flex items-center gap-1 text-sm font-bold">
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            
            {/* Shop */}
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Shop</h4>
              <ul className="space-y-3">
                {[
                  { label: "New Arrivals", href: "/shop?new=true" },
                  { label: "Best Sellers", href: "/shop?bestsellers=true" },
                  { label: "T-Shirts", href: "/shop?category=t-shirts" },
                  { label: "Hoodies", href: "/shop?category=hoodies" },
                  { label: "Accessories", href: "/shop?category=accessories" },
                  { label: "All Products", href: "/shop" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors duration-200 group flex items-center gap-1.5">
                      <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-raw-orange flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Help</h4>
              <ul className="space-y-3">
                {[
                  { label: "FAQ", href: "/faq" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Shipping Info", href: "/shipping-policy" },
                  { label: "Returns", href: "/return-policy" },
                  { label: "Track Order", href: "/account" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors duration-200 group flex items-center gap-1.5">
                      <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-raw-orange flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-5">Company</h4>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms & Conditions", href: "/terms" },
                  { label: "Sustainability", href: "/about" },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors duration-200 group flex items-center gap-1.5">
                      <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-raw-orange flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Ravindra Batiks. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Payment icons */}
            {["VISA", "MC", "AMEX", "STRIPE"].map((pay) => (
              <span key={pay} className="text-[10px] font-bold text-white/20 border border-white/10 px-2 py-1 rounded tracking-wider">
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

