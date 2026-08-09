import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Marquee } from "@/components/home/Marquee";
import { BrandStory } from "@/components/home/BrandStory";
import { ReviewCarousel } from "@/components/ui/ReviewCarousel";

// Fallback data
const FALLBACK_HERO = {
  title: "RAVINDRA / BATIKS",
  subtitle: "Where Tradition Meets Elegance",
  description: "Hand-painted batik creations crafted with passion in Sri Lanka. Each piece tells a story of colour, culture, and artistry.",
  buttonPrimaryText: "SHOP COLLECTION",
  buttonPrimaryLink: "/shop?new=true",
  buttonSecondaryText: "EXPLORE GALLERY",
  buttonSecondaryLink: "/shop",
  imageUrl: "https://images.unsplash.com/photo-1523398002811-999aa8d9511e?q=80&w=1200&auto=format&fit=crop"
};

const FALLBACK_PROMO = {
  left: { title: "BATIK WALL ART", text: "Handcrafted wall hangings. Timeless beauty.", btn: "SHOP WALL ART", link: "/shop" },
  right: { title: "READY-MADE GARMENTS", text: "Hand-painted dresses made for every occasion.", btn: "DISCOVER GARMENTS", link: "/shop" }
};

const FALLBACK_REVIEWS = [
  {
    id: "r1",
    customerName: "Alex M.",
    rating: 5,
    text: "Absolutely love the quality. The fabric feels premium and the fit is exactly as described. Already ordered two more pieces.",
    isVerified: true,
  },
  {
    id: "r2",
    customerName: "Jordan K.",
    rating: 5,
    text: "RAW Clothing is on another level. The oversized hoodie is my go-to. Fast shipping, great packaging — 10/10.",
    isVerified: true,
  },
  {
    id: "r3",
    customerName: "Sam T.",
    rating: 5,
    text: "Finally a streetwear brand that doesn't compromise on fit. The sizing guide is spot on and the pieces look even better in person.",
    isVerified: true,
  },
  {
    id: "r4",
    customerName: "Riley P.",
    rating: 4,
    text: "Great quality and delivery was super quick. The tee I ordered has a really nice weight to it. Will definitely be coming back.",
    isVerified: true,
  },
  {
    id: "r5",
    customerName: "Morgan C.",
    rating: 5,
    text: "Wore the new season drop to an event and got so many compliments. This brand is the real deal.",
    isVerified: false,
  },
];

export default async function StorefrontHomePage() {
  const settings = await prisma.homepageSetting.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  const config: any = settings?.config || {};

  // New Arrivals — tagged OR just latest, always show something
  const newArrivalsTagged = await prisma.product.findMany({
    where: { isArchived: false, isNewArrival: true },
    include: { category: true, images: { take: 2 }, sizes: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  // Fall back to latest published products if none are tagged as new arrivals
  const newArrivalsData =
    newArrivalsTagged.length > 0
      ? newArrivalsTagged
      : await prisma.product.findMany({
          where: { isArchived: false },
          include: { category: true, images: { take: 2 }, sizes: true },
          take: 8,
          orderBy: { createdAt: "desc" },
        });

  const newArrivals = newArrivalsData.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));

  // Best sellers — fall back to latest if no products have sales
  const bestSellersTagged = await prisma.product.findMany({
    where: { isArchived: false, salesCount: { gt: 0 } },
    include: { category: true, images: { take: 2 }, sizes: true },
    take: 8,
    orderBy: { salesCount: "desc" },
  });

  const bestSellersData =
    bestSellersTagged.length > 0
      ? bestSellersTagged
      : await prisma.product.findMany({
          where: { isArchived: false },
          include: { category: true, images: { take: 2 }, sizes: true },
          take: 8,
          orderBy: { createdAt: "desc" },
          skip: 4, // offset from new arrivals to avoid duplicates
        });

  const bestSellers = bestSellersData.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));

  // Categories
  const categories = await prisma.category.findMany({
    take: 4,
    include: { _count: { select: { products: true } } },
  });

  const categoryImages = [
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop",
  ];

  const formattedCategories = categories.map((cat, i) => ({
    ...cat,
    productCount: cat._count.products,
    image: categoryImages[i % categoryImages.length],
  }));

  // Reviews — approved from DB, fall back to curated static
  const dbReviews = await prisma.review.findMany({
    where: { isApproved: true },
    include: { product: { select: { name: true, slug: true } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const reviews =
    dbReviews.length > 0
      ? dbReviews.map((r) => ({
          id: r.id,
          customerName: r.customerName,
          rating: r.rating,
          text: r.text,
          isVerified: r.isVerified,
          product: r.product,
        }))
      : FALLBACK_REVIEWS;

  return (
    <div className="flex flex-col min-h-screen">
      <Hero data={config.hero || FALLBACK_HERO} />

      <ProductCarousel
        title="Latest Drops"
        subtitle="Fresh in. These won't stick around for long."
        products={newArrivals}
        viewAllLink="/shop?new=true"
      />

      <PromoBanner data={config.promoBanner || FALLBACK_PROMO} />

      <FeaturedCategories categories={formattedCategories} />

      <Marquee
        messages={
          config.marquee || [
            "RAVINDRA BATIKS — WHERE TRADITION MEETS ELEGANCE — HAND-PAINTED BATIK CREATIONS — CRAFTED WITH PASSION —",
            "WALL HANGINGS — READY-MADE GARMENTS — HANDCRAFTED DRESSES — MADE IN SRI LANKA —",
          ]
        }
      />

      <ProductGrid
        title="Most Wanted"
        subtitle="The pieces everyone is talking about."
        products={bestSellers}
        actionText="Shop All Best Sellers"
        actionLink="/shop"
      />

      <ReviewCarousel title="What They're Saying" reviews={reviews} />

      <BrandStory
        data={
          config.brandStory || {
            title: "THIS IS RAVINDRA BATIKS",
            text: "We create authentic hand-painted batik art for people who appreciate tradition, craftsmanship, and beauty.\n\nEvery piece is unique.\nEvery colour tells a story.\nMade with passion in Sri Lanka.",
            stats: [
              "Handcrafted Creations",
              "Authentic Batik Art",
              "Worldwide Shipping",
              "Premium Quality",
            ],
            imageUrl:
              "https://images.unsplash.com/photo-1617331720183-167817b38d38?q=80&w=1000&auto=format&fit=crop",
          }
        }
      />
    </div>
  );
}

