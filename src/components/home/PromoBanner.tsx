'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PromoBannerProps {
  data: {
    left: {
      title: string;
      text: string;
      btn: string;
      link: string;
    };
    right: {
      title: string;
      text: string;
      btn: string;
      link: string;
    };
  };
}

export function PromoBanner({ data }: PromoBannerProps) {
  return (
    <section className="py-2 md:py-4">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Left Banner */}
          <Link href={data.left.link} className="group relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[600px] overflow-hidden rounded-xl bg-raw-black block">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
              alt={data.left.title}
              fill
              className="object-cover object-center transition-transform duration-1000 ease-[var(--ease-premium)] group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">{data.left.title}</h3>
                <p className="text-white/80 text-lg mb-8 max-w-sm">{data.left.text}</p>
                <span className="inline-flex items-center justify-center bg-white text-raw-black px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-raw-red hover:text-white transition-colors duration-300">
                  {data.left.btn}
                </span>
              </motion.div>
            </div>
          </Link>

          {/* Right Banner */}
          <Link href={data.right.link} className="group relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[600px] overflow-hidden rounded-xl bg-raw-grey block">
            <Image
              src="https://images.unsplash.com/photo-1550614000-4b95d4662d51?q=80&w=1000&auto=format&fit=crop"
              alt={data.right.title}
              fill
              className="object-cover object-center transition-transform duration-1000 ease-[var(--ease-premium)] group-hover:scale-105 mix-blend-multiply opacity-90"
            />
            
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-raw-black">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">{data.right.title}</h3>
                <p className="text-raw-text-secondary text-lg mb-8 max-w-sm">{data.right.text}</p>
                <span className="inline-flex items-center justify-center bg-raw-black text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-raw-red transition-colors duration-300">
                  {data.right.btn}
                </span>
              </motion.div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
