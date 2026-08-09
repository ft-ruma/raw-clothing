import Image from 'next/image';
import Link from 'next/link';

interface StyleCardProps {
  title: string;
  phrase: string;
  image: string;
  link: string;
}

export function StyleCard({ title, phrase, image, link }: StyleCardProps) {
  return (
    <Link 
      href={link}
      className="group flex flex-col items-center gap-4 min-w-[200px] md:min-w-[240px] snap-start"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-full bg-raw-off-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[var(--ease-premium)]"
        />
        <div className="absolute inset-0 border border-black/5 rounded-full pointer-events-none group-hover:border-black/20 transition-colors duration-300" />
      </div>
      <div className="text-center">
        <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-raw-black group-hover:text-raw-orange transition-colors">{title}</h3>
        <p className="text-sm text-raw-text-secondary mt-1 font-medium">{phrase}</p>
      </div>
    </Link>
  );
}
