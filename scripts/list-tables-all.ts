import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const tables = await prisma.$queryRaw`
      SELECT schemaname, tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    `;
        console.log('--- TABLES IN ALL SCHEMAS ---');
        console.table(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
