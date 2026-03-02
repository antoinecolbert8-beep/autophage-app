import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
        console.log('--- TABLES IN PUBLIC SCHEMA ---');
        console.table(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
