import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function m() {
    try {
        const org = await p.organization.findFirst();
        console.log('ORG_DATA:', JSON.stringify(org));
    } catch(e: any) {
        console.error('DB_ERROR:', e.message);
    } finally {
        await p.$disconnect();
    }
}
m();
