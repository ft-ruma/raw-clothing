'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface BrandStoryProps {
  data: {
    title: string;
    text: string;
    stats: string[];
    imageUrl: string;
  };
}

export function BrandStory({ data }: BrandStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Framer motion parallax for the background image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Text reveal animation
      gsap.fromTo(
        '.story-text-line',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        }
      );

      // Stats reveal
      gsap.fromTo(
        '.story-stat',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.story-stats-container',
            start: 'top 85%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-raw-black text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Image Section */}
          <div ref={imageRef} className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden relative">
              <motion.div style={{ y, height: '120%', width: '100%', position: 'absolute', top: '-10%' }}>
                <Image
                  src={data.imageUrl}
                  alt="Brand Story"
                  fill
                  className="object-cover object-center filter grayscale contrast-125 opacity-80 mix-blend-screen"
                />
              </motion.div>
              <div className="absolute inset-0 border border-white/10 rounded-2xl" />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-raw-red/30 rounded-full animate-spin-slow hidden md:block" style={{ animationDuration: '20s' }} />
          </div>

          {/* Text Section */}
          <div ref={textRef} className="w-full lg:w-1/2">
            <div className="overflow-hidden mb-6">
              <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter story-text-line">
                {data.title}
              </h2>
            </div>

            <div className="space-y-6 text-lg md:text-xl text-white/70 leading-relaxed font-light mb-16">
              {data.text.split('\n\n').map((paragraph, i) => (
                <div key={i} className="overflow-hidden">
                  <p className="story-text-line">{paragraph}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 story-stats-container border-t border-white/10 pt-10">
              {data.stats.map((stat, i) => (
                <div key={i} className="story-stat flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-raw-red" />
                  <span className="font-heading font-bold uppercase tracking-wider text-sm md:text-base">{stat}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-16 overflow-hidden">
              <div className="story-text-line">
                <a href="/about" className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm hover:text-raw-red transition-colors group">
                  Read Our Full Story
                  <span className="w-8 h-[2px] bg-white group-hover:bg-raw-red transition-colors group-hover:w-12 duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
