/**
 * Prisma Seed Script
 * Seeds the database with default products on initialization
 * Run with: npm run prisma:seed
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Check if products already exist
  const existingCount = await prisma.product.count();

  if (existingCount > 0) {
    console.log('✓ Database already seeded, skipping...');
    return;
  }

  // Default products to seed
  const defaultProducts = [
    {
      title: 'Wireless Bluetooth Headphones',
      description:
        'Premium noise-canceling Bluetooth headphones with 30-hour battery life. Crystal clear audio and comfortable design for all-day listening. Features active noise cancellation and touch controls for seamless music experience.',
      sku: 'WBHP-001',
      stock: 50,
      price: 89.99,
      keywords: 'wireless headphones',
      images: ['https://via.placeholder.com/300?text=Headphones'],
      featuredImage: 'https://via.placeholder.com/300?text=Headphones',
    },
    {
      title: 'Portable USB-C Power Bank',
      description:
        'High-capacity 20000mAh power bank with fast USB-C charging. Lightweight and portable design perfect for travel. Supports simultaneous charging of multiple devices with smart charging technology.',
      sku: 'PBC-002',
      stock: 75,
      price: 39.99,
      keywords: 'USB-C power bank',
      images: ['https://via.placeholder.com/300?text=PowerBank'],
      featuredImage: 'https://via.placeholder.com/300?text=PowerBank',
    },
    {
      title: '4K USB-C Hub',
      description:
        'All-in-one USB-C hub with 4K video output, multiple USB ports, and SD card reader. Compact aluminum design for professionals. Supports Thunderbolt 3 for maximum compatibility and speed.',
      sku: 'USB4K-003',
      stock: 30,
      price: 59.99,
      keywords: 'USB-C 4K hub',
      images: ['https://via.placeholder.com/300?text=USBHub'],
      featuredImage: 'https://via.placeholder.com/300?text=USBHub',
    },
    {
      title: 'Mechanical Gaming Keyboard RGB',
      description:
        'Premium mechanical keyboard with customizable RGB lighting and ultra-responsive switches. Durable aluminum frame with programmable keys for gaming and productivity. Type with confidence and style.',
      sku: 'MGK-RGB-004',
      stock: 45,
      price: 129.99,
      keywords: 'mechanical keyboard gaming',
      images: ['https://via.placeholder.com/300?text=Keyboard'],
      featuredImage: 'https://via.placeholder.com/300?text=Keyboard',
    },
    {
      title: 'Portable SSD 1TB USB 3.1',
      description:
        'Ultra-fast portable SSD with 1TB capacity and USB 3.1 interface for lightning-quick transfers. Rugged design survives drops and extreme conditions. Perfect for creators and professionals on the move.',
      sku: 'PSSD-1TB-005',
      stock: 60,
      price: 149.99,
      keywords: 'portable SSD storage',
      images: ['https://via.placeholder.com/300?text=SSD'],
      featuredImage: 'https://via.placeholder.com/300?text=SSD',
    },
  ];

  // Create products
  console.log('🌱 Seeding database with default products...');
  for (const product of defaultProducts) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✓ Database seeded successfully with 5 products');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
