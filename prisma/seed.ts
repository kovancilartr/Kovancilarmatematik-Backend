import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Admin User (if it doesn't exist)
  const adminEmail = 'admin@kovancilarmatematik.com';
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('Ko1blackno.', 12);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Default admin user created:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: Ko1blackno.`);
  } else {
    console.log('✅ Admin user already exists.');
  }

  // 2. Create Sample Course Structure (if it doesn't exist)
  const categoryName = 'TYT Matematik';
  const existingCategory = await prisma.category.findUnique({
    where: { name: categoryName },
  });

  if (!existingCategory) {
    console.log(`🌱 Creating sample category: ${categoryName}`);
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        order: 1,
        subjects: {
          create: [
            {
              name: 'Temel Kavramlar',
              order: 1,
              lessons: {
                create: [
                  {
                    name: 'Sayı Kümeleri ve İşlem Yeteneği',
                    videoUrl: 'https://www.youtube.com/watch?v=example1',
                    materials: {
                      create: [
                        {
                          name: 'Temel Kavramlar Çalışma Kağıdı.pdf',
                          url: '/uploads/materials/example1.pdf',
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              name: 'EBOB-EKOK',
              order: 2,
              lessons: {
                create: [
                  {
                    name: 'EBOB-EKOK Konu Anlatımı',
                    videoUrl: 'https://www.youtube.com/watch?v=example2',
                  }
                ]
              }
            }
          ],
        },
      },
      include: {
        subjects: {
          include: {
            lessons: {
              include: {
                materials: true,
              },
            },
          },
        },
      },
    });
    console.log('✅ Sample course structure created!');
  } else {
    console.log('✅ Sample course structure already exists.');
  }

  console.log('🌱 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });