'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    buttonPrimaryText: string;
    buttonPrimaryLink: string;
    buttonSecondaryText: string;
    buttonSecondaryLink: string;
    imageUrl: string;
  };
}

export function Hero({ data }: HeroProps) {
  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-raw-black">
      {/* Background Image with slow zoom */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: "easeOut" }}
      >
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      </motion.div>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px',
        }}
      />

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute top-8 right-8 z-20 hidden md:block"
      >
        <div className="w-20 h-20 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center text-center animate-float">
          <div>
            <p className="text-white text-[9px] font-bold uppercase tracking-[0.15em] leading-tight">New</p>
            <p className="text-white text-[9px] font-bold uppercase tracking-[0.15em] leading-tight">Season</p>
            <p className="text-raw-red text-[9px] font-bold tracking-widest">2026</p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block py-1.5 px-4 border border-white/30 rounded-full text-white/90 text-xs md:text-sm font-bold tracking-[0.2em] mb-6 backdrop-blur-sm bg-white/5">
            {data.subtitle}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-black text-5xl md:text-7xl lg:text-9xl text-white uppercase tracking-tighter leading-[0.85] mb-6"
        >
          {data.title.split('/').map((part, i) => (
            <span key={i} className={`block ${i === 1 ? 'text-gradient-red' : ''}`}>
              {part.trim()}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/70 text-base md:text-lg font-light max-w-lg mx-auto mb-10 leading-relaxed tracking-wide"
        >
          {data.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Link
            href={data.buttonPrimaryLink}
            className="bg-white text-raw-black px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-raw-red hover:text-white transition-all duration-300 rounded-sm shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(204,0,0,0.4)]"
          >
            {data.buttonPrimaryText}
          </Link>
          <Link
            href={data.buttonSecondaryLink}
            className="bg-transparent border border-white/40 text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all duration-300 rounded-sm backdrop-blur-sm"
          >
            {data.buttonSecondaryText}
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex gap-8 mt-14 border-t border-white/10 pt-8 w-full max-w-sm justify-center"
        >
          {[['500+', 'Products'], ['14-Day', 'Returns'], ['24h', 'Dispatch']].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-white font-heading font-black text-lg tracking-tight">{num}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-10 bg-white/15 relative overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-white/70 absolute top-0"
            animate={{ top: ['-50%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

