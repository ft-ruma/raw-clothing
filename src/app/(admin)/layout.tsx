import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import AdminNavLink from "@/components/admin/AdminNavLink";

interface NavItem {
  href: string;
  label: string;
  icon: "dashboard" | "products" | "orders" | "inventory" | "categories" | "reviews" | "gallery" | "campaigns" | "customers" | "newsletter" | "staff" | "settings";
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Store",
    items: [
      { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
      { href: "/admin/products", label: "Products", icon: "products" },
      { href: "/admin/orders", label: "Orders", icon: "orders" },
      { href: "/admin/inventory", label: "Inventory", icon: "inventory" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/categories", label: "Categories", icon: "categories" },
      { href: "/admin/reviews", label: "Reviews", icon: "reviews" },
      { href: "/admin/gallery", label: "Gallery", icon: "gallery" },
      { href: "/admin/campaigns", label: "Campaigns", icon: "campaigns" },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/customers", label: "Customers", icon: "customers" },
      { href: "/admin/newsletter", label: "Newsletter", icon: "newsletter" },
      { href: "/admin/staff", label: "Staff", icon: "staff" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
];



export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userInitial = session.user.email?.[0]?.toUpperCase() ?? "A";
  const userRole = (session.user as any).role ?? "STAFF";

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-600",
    STORE_MANAGER: "bg-indigo-600",
    STAFF: "bg-gray-600",
  };
  const roleBadgeColor = roleColors[userRole] ?? "bg-gray-600";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800">
          <Link href="/admin" className="font-bold text-lg tracking-widest text-white">
            RAW
          </Link>
          <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-medium tracking-wide">
            ADMIN
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <AdminNavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    exact={item.exact}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${roleBadgeColor} flex-shrink-0`}>
              <span className="text-sm font-semibold text-white">{userInitial}</span>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user.name || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View Site
            </Link>

            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md text-red-400 hover:text-white hover:bg-red-900/40 transition-colors"
              >
                <LogOut className="h-3 w-3" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
