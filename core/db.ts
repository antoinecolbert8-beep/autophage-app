import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Reuses the connection if it already exists to prevent exhaustion
export const db = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Alias for compatibility with files that import 'prisma'
export const prisma = db;

// 🛡️ SECURITY AUDIT: Fail-fast if critical secrets are missing
if (process.env.NODE_ENV === 'production') {
    if (!process.env.FORTRESS_SECRET || process.env.FORTRESS_SECRET.length < 32) {
        console.error('❌ CRITICAL SECURITY ERROR: FORTRESS_SECRET is missing or too short (min 32 chars).');
        console.error('The application will now terminate to prevent unencrypted data exposure.');
        process.exit(1);
    }
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

