import { PackageX } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

interface EmptyProductStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
}

export function EmptyProductState({
  title = "No products found",
  message = "We couldn't find any products matching your current selection.",
  actionText = "Continue Shopping",
  actionLink = "/shop"
}: EmptyProductStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-200 rounded-2xl bg-raw-off-white min-h-[400px]">
      <div className="bg-white p-4 rounded-full shadow-sm mb-6 text-gray-400">
        <PackageX size={48} strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-2xl font-bold text-raw-black mb-2">{title}</h3>
      <p className="text-raw-text-secondary max-w-md mb-8">{message}</p>
      
      <Link href={actionLink}>
        <Button variant="outline">{actionText}</Button>
      </Link>
    </div>
  );
}
