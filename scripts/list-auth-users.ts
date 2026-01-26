
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("🔍 Listing Auth Users (SAFE MODE)...");
        // Cast raw result to array of any
        const users: any[] = await prisma.$queryRawUnsafe('SELECT email FROM auth.users');

        console.log(`Found ${users.length} users.`);

        users.forEach((u, i) => {
            console.log(`[${i}] ${u.email}`);
        });

    } catch (e: any) {
        console.error("ERROR running query:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
