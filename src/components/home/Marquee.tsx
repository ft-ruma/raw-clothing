'use client';

interface MarqueeProps {
  messages: string[];
  speed?: number;
}

export function Marquee({ messages, speed = 40 }: MarqueeProps) {
  if (!messages || messages.length === 0) return null;

  // Join all messages into one long string, then double it for seamless CSS loop
  const combinedText = messages.join('  •  ');
  // Duplicate for seamless looping: CSS translateX(-50%) moves exactly one copy
  const track = `${combinedText}  •  ${combinedText}  •  ${combinedText}  •  ${combinedText}`;

  return (
    <div
      className="bg-raw-red text-white py-5 md:py-7 overflow-hidden relative flex items-center border-y-2 border-black/20 select-none"
      aria-hidden="true"
    >
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-raw-red to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-raw-red to-transparent z-10 pointer-events-none" />

      {/* The scrolling track — CSS animation, no JS pixel maths */}
      <div
        className="whitespace-nowrap animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter inline-block px-4 opacity-95">
          {track}
        </span>
      </div>
    </div>
  );
}

