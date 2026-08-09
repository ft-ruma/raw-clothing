import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcrypt'

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@rawclothing.com' },
    update: {},
    create: {
      email: 'admin@rawclothing.com',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('Admin seeded.')

  const categories = [
    { name: 'T-Shirts', slug: 't-shirts' },
    { name: 'Hoodies', slug: 'hoodies' },
    { name: 'Jackets', slug: 'jackets' },
    { name: 'Trousers', slug: 'trousers' },
    { name: 'Shorts', slug: 'shorts' },
    { name: 'Shirts', slug: 'shirts' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Sale', slug: 'sale' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log('Categories seeded.')

  const collections = [
    { title: 'RAW Essentials', slug: 'raw-essentials', description: 'Everyday pieces. Elevated.' },
    { title: 'Oversized Collection', slug: 'oversized-collection', description: 'Relaxed shapes made for movement.' },
    { title: 'Monochrome Edit', slug: 'monochrome-edit', description: 'Black and white staples.' },
    { title: 'Street Utility', slug: 'street-utility', description: 'Functional streetwear.' },
    { title: 'Weekend Wear', slug: 'weekend-wear', description: 'Comfort meets style.' },
    { title: 'Limited Edition', slug: 'limited-edition', description: 'Exclusive drops. No reprints.' }
  ]

  for (const col of collections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: col,
    })
  }

  console.log('Collections seeded.')

  const catTshirts = await prisma.category.findUnique({ where: { slug: 't-shirts' } })
  const catHoodies = await prisma.category.findUnique({ where: { slug: 'hoodies' } })
  const colEssentials = await prisma.collection.findUnique({ where: { slug: 'raw-essentials' } })
  
  if (catTshirts && catHoodies && colEssentials) {
    const products = [
      {
        name: 'Essential Oversized T-Shirt',
        slug: 'essential-oversized-t-shirt',
        description: 'Premium heavyweight cotton oversized t-shirt.',
        price: 45.00,
        compareAtPrice: 55.00,
        isNewArrival: true,
        salesCount: 150,
        categoryId: catTshirts.id,
      },
      {
        name: 'RAW Logo Hoodie',
        slug: 'raw-logo-hoodie',
        description: 'Classic fit hoodie with embroidered logo.',
        price: 85.00,
        isNewArrival: true,
        salesCount: 300,
        categoryId: catHoodies.id,
      },
      {
        name: 'Heavyweight Zip Hoodie',
        slug: 'heavyweight-zip-hoodie',
        description: 'Boxy fit heavy zip hoodie for layering.',
        price: 95.00,
        isNewArrival: false,
        salesCount: 220,
        categoryId: catHoodies.id,
      }
    ]

    for (const prod of products) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: {
          ...prod,
          collections: {
            connect: [{ id: colEssentials.id }]
          },
          sizes: {
            create: [
              { name: 'S', stock: 10 },
              { name: 'M', stock: 15 },
              { name: 'L', stock: 20 },
              { name: 'XL', stock: 5 },
            ]
          },
          images: {
            create: [
              { url: '/uploads/essential-oversized-t-shirt.jpg' }
            ]
          }
        },
      })
    }
    console.log('Products seeded.')
  }

  // Create default homepage settings
  await prisma.homepageSetting.create({
    data: {
      config: {
        announcementBar: [
          "Free delivery on orders over $100",
          "New RAW collection now available",
          "Easy returns within 14 days"
        ],
        hero: {
          title: "RAW / NEW SEASON",
          subtitle: "Wear It Your Way",
          description: "Modern essentials designed for people who refuse to blend in.",
          buttonPrimaryText: "SHOP NEW ARRIVALS",
          buttonPrimaryLink: "/shop?new=true",
          buttonSecondaryText: "EXPLORE COLLECTION",
          buttonSecondaryLink: "/collections",
          imageUrl: "https://images.unsplash.com/photo-1523398002811-999aa8d9511e?q=80&w=1200&auto=format&fit=crop"
        },
        promoBanner: {
          left: { title: "RAW ESSENTIALS", text: "Everyday pieces. Elevated.", btn: "SHOP ESSENTIALS", link: "/collections/raw-essentials" },
          right: { title: "THE OVERSIZED EDIT", text: "Relaxed shapes made for movement.", btn: "DISCOVER THE EDIT", link: "/collections/oversized-collection" }
        },
        marquee: [
          "RAW CLOTHING — MADE TO MOVE — BUILT TO STAND OUT — WEAR IT YOUR WAY —",
          "NEW SEASON — NEW ENERGY — LIMITED DROPS — TIMELESS ESSENTIALS —"
        ],
        brandStory: {
          title: "THIS IS RAW",
          text: "We create modern clothing for people who build their own identity instead of following someone else's version of style.\n\nDesigned with confidence.\nMade for everyday movement.\nBuilt to remain relevant.",
          stats: ["Premium fabrics", "Limited collections", "Modern fits", "Customer-first service"],
          imageUrl: "https://images.unsplash.com/photo-1617331720183-167817b38d38?q=80&w=1000&auto=format&fit=crop"
        }
      }
    }
  })
  
  console.log('Homepage config seeded.')
}

main()
  .then(async () => {
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
