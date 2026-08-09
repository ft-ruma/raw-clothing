const { PrismaClient } = require('./src/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

async function test() {
  try {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL
    });
    const prisma = new PrismaClient({ adapter });
    
    const users = await prisma.user.findMany();
    console.log("Users:", users.length);
    process.exit(0);
  } catch (err) {
    console.error("Prisma error:", err);
    process.exit(1);
  }
}

test();
