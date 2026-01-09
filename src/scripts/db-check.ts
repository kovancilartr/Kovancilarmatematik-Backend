
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Category Check ---');
    const count = await prisma.category.count();
    console.log(`Total Categories: ${count}`);

    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            isPublished: true,
            isPublic: true,
            allowedUsers: {
                select: { id: true, email: true }
            }
        }
    });

    console.log(JSON.stringify(categories, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
