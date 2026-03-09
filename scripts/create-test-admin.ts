import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth-utils';

const prisma = new PrismaClient();

async function main() {
    const email = 'test-admin@genesis.ai';
    const password = 'Password123!';
    const hashedPassword = hashPassword(password);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'admin',
        },
        create: {
            email,
            password: hashedPassword,
            name: 'System Tester',
            role: 'admin',
        },
    });

    console.log('✅ Created/Updated test admin:', email);
    console.log('Password is:', password);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
