import { CartProvider } from "@/components/cart/CartProvider";
import Header from "@/components/layout/Header";
import CartDrawer from "@/components/cart/CartDrawer";
import Footer from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { prisma } from "@/lib/prisma";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch announcement bar messages from homepage settings
  const settings = await prisma.homepageSetting.findFirst({
    orderBy: { updatedAt: 'desc' }
  });
  const config = (settings?.config as any) || {};
  const announcementMessages = config.announcementBar || [
    "Free delivery on orders over £100",
    "New collection out now"
  ];

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar messages={announcementMessages} />
        <Header />
        <CartDrawer />
        <main className="flex-1 bg-white">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
