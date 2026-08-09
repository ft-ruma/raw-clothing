'use client';

import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // API call would go here
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-raw-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 pb-20 border-b border-white/10">
          <div>
            <h3 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Join The Club
            </h3>
            <p className="text-white/70 max-w-md text-lg">
              Sign up for exclusive drops, early access to sales, and insider-only content.
            </p>
          </div>
          <div className="flex items-center">
            <form onSubmit={handleSubscribe} className="w-full relative max-w-xl">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                required
                className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-white/40 py-4 pr-12 focus:outline-none focus:border-white transition-colors font-heading uppercase tracking-widest text-sm"
              />
              <button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors"
                aria-label="Subscribe"
              >
                {subscribed ? <span className="text-raw-success font-bold text-xs uppercase">Done</span> : <ArrowRight size={24} />}
              </button>
            </form>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex flex-col leading-none mb-5 group">
              <span className="font-heading font-black text-2xl tracking-[0.12em] uppercase text-white group-hover:text-raw-orange transition-colors">
                RAVINDRA BATIKS
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-medium mt-0.5">
                Where Tradition Meets Elegance
              </span>
            </Link>
            <p className="text-white/50 text-sm mb-6 max-w-xs leading-relaxed">
              Specialist in Hand-Painted Batik Creations, Wall Hangings &amp; Ready-made Garments. Handcrafted with passion in Sri Lanka.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/ravindra_batik/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-raw-orange hover:text-white transition-all duration-300 font-bold text-xs">
                IG
              </a>
              <a href="https://www.facebook.com/ravindrabatik/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-raw-orange hover:text-white transition-all duration-300 font-bold text-xs">
                FB
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-sm mb-6 text-white/90">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop?new=true" className="text-white/60 hover:text-white transition-colors text-sm">New Arrivals</Link></li>
              <li><Link href="/shop?category=men" className="text-white/60 hover:text-white transition-colors text-sm">Menswear</Link></li>
              <li><Link href="/shop?category=women" className="text-white/60 hover:text-white transition-colors text-sm">Womenswear</Link></li>
              <li><Link href="/collections" className="text-white/60 hover:text-white transition-colors text-sm">Collections</Link></li>
              <li><Link href="/shop?category=sale" className="text-white/60 hover:text-raw-red transition-colors text-sm">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-sm mb-6 text-white/90">Help</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-white/60 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/shipping" className="text-white/60 hover:text-white transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link href="/track" className="text-white/60 hover:text-white transition-colors text-sm">Track Order</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-sm mb-6 text-white/90">About</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-white/60 hover:text-white transition-colors text-sm">Our Story</Link></li>
              <li><Link href="/sustainability" className="text-white/60 hover:text-white transition-colors text-sm">Sustainability</Link></li>
              <li><Link href="/careers" className="text-white/60 hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link href="/terms" className="text-white/60 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} Ravindra Batiks. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>GBP (£)</span>
            <span>United Kingdom</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
