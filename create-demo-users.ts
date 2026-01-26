// Script to create demo users
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = 'Ko1blackno.';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@mail.com' },
        update: {},
        create: {
            email: 'admin@mail.com',
            name: 'Admin Kullanıcı',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin oluşturuldu:', admin.email);

    // Create Teacher
    const teacher = await prisma.user.upsert({
        where: { email: 'fatma@mail.com' },
        update: {},
        create: {
            email: 'fatma@mail.com',
            name: 'Fatma Öğretmen',
            password: hashedPassword,
            role: 'TEACHER',
        },
    });
    console.log('✅ Öğretmen oluşturuldu:', teacher.email);

    // Create Student
    const student = await prisma.user.upsert({
        where: { email: 'naci@mail.com' },
        update: {},
        create: {
            email: 'naci@mail.com',
            name: 'Naci Öğrenci',
            password: hashedPassword,
            role: 'STUDENT',
        },
    });
    console.log('✅ Öğrenci oluşturuldu:', student.email);

    console.log('\n🎉 Tüm demo kullanıcıları başarıyla oluşturuldu!');
    console.log('\nDemo Hesapları:');
    console.log('👨‍🏫 Admin: admin@mail.com / Ko1blackno.');
    console.log('👩‍🏫 Öğretmen: fatma@mail.com / Ko1blackno.');
    console.log('👨‍🎓 Öğrenci: naci@mail.com / Ko1blackno.');
}

main()
    .catch((e) => {
        console.error('❌ Hata:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
