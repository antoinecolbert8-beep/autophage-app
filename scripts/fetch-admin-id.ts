
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { role: 'admin' }
    });

    if (user) {
        console.log(`ADMIN_ID=${user.id}`);
    } else {
        // Fallback to any user
        const anyUser = await prisma.user.findFirst();
        if (anyUser) {
            console.log(`ADMIN_ID=${anyUser.id}`);
        } else {
            console.error("NO_USERS_FOUND");
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
