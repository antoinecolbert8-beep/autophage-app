const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:ElaSovereign2024%21@db.yoqgvuwtseoctwwjlapy.supabase.co:5432/postgres?sslmode=require"
        }
    }
});

async function test() {
    try {
        console.log("Connecting with direct DB URL (ElaSovereign2024!) ...");
        const res = await prisma.organization.findFirst();
        console.log("Success:", res);
    } catch (e) {
        console.error("Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
