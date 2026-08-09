"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, Users, Tag,
  ClipboardList, Star, Image as ImageIcon, Megaphone, Mail,
  Shield, Settings
} from "lucide-react";

const iconMap = {
  dashboard: LayoutDashboard,
  products: ShoppingBag,
  orders: ClipboardList,
  inventory: Package,
  categories: Tag,
  reviews: Star,
  gallery: ImageIcon,
  campaigns: Megaphone,
  customers: Users,
  newsletter: Mail,
  staff: Shield,
  settings: Settings,
};

export type IconType = keyof typeof iconMap;

interface AdminNavLinkProps {
  href: string;
  label: string;
  icon: IconType;
  exact?: boolean;
}

export default function AdminNavLink({ href, label, icon, exact = false }: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  const IconComponent = iconMap[icon] || Settings;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
        isActive
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <IconComponent className="h-4 w-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

