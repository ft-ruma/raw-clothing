'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AnnouncementBarProps {
  messages: string[];
}

export function AnnouncementBar({ messages }: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (messages.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [messages.length, isHovered]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  if (!messages || messages.length === 0) return null;

  return (
    <div
      className="bg-raw-black text-white py-2 px-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider relative z-50 h-10 border-b border-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Prev button */}
      <div className="w-10 flex justify-start flex-shrink-0">
        {messages.length > 1 && (
          <button onClick={handlePrev} className="hover:text-raw-red transition-colors p-1" aria-label="Previous announcement">
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Message */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -10 : 10 }}
            transition={{ duration: 0.3 }}
            className="absolute text-center w-full flex items-center justify-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-raw-red flex-shrink-0" />
            <span className="tracking-[0.15em] text-white/90">{messages[currentIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + Next button */}
      <div className="w-10 flex flex-col items-end gap-1 justify-center flex-shrink-0">
        {messages.length > 1 && (
          <>
            <button onClick={handleNext} className="hover:text-raw-red transition-colors p-1" aria-label="Next announcement">
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

