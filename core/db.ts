import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Reuses the connection if it already exists to prevent exhaustion
export const db = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Alias for compatibility with files that import 'prisma'
export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

