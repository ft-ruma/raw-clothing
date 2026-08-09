import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
}

export function FeatureCard({ icon: Icon, title, description, link }: FeatureCardProps) {
  const content = (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 h-full group">
      <div className="w-12 h-12 rounded-full bg-raw-off-white flex items-center justify-center mb-4 group-hover:bg-raw-black group-hover:text-white transition-colors duration-300">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="font-heading font-bold text-raw-black uppercase tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-raw-text-secondary leading-relaxed">{description}</p>
    </div>
  );

  if (link) {
    return <a href={link} className="block h-full">{content}</a>;
  }

  return content;
}
