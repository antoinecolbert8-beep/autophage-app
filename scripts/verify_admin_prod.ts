import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

const prisma = new PrismaClient();

function verifyPassword(password: string, hash: string): boolean {
    try {
        const [salt, key] = hash.split(':');
        const keyBuffer = Buffer.from(key, 'hex');
        const derivedKey = scryptSync(password, salt, 64);
        return timingSafeEqual(keyBuffer, derivedKey);
    } catch (e) {
        console.error("verifyPassword error", e);
        return false;
    }
}

async function run() {
    const user = await prisma.user.findUnique({ where: { email: 'admin@genesis.ai' } });
    if (!user) {
        console.log("❌ USER NOT FOUND");
        return;
    }

    console.log("✅ USER FOUND:", user.id, user.email, user.role);
    console.log("Hash:", user.password);

    const isMatch = verifyPassword('Genesis2025!', user.password!);
    console.log("Match 'Genesis2025!'?", isMatch ? "YES ✅" : "NO ❌");

    // Let's also test what happens if password is missing
    if (!user.password) {
        console.log("No password set!");
    }
}

run().catch(console.error).finally(() => prisma.$disconnect());
