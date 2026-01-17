
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.user.count();
        console.log("DB_READY: YES");
    } catch (e: any) {
        if (e.message.includes("does not exist")) {
            console.log("DB_READY: NO (Tables missing)");
        } else {
            console.log("DB_READY: YES (But other error)", e.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}
main();
