import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Réutilise la connexion si elle existe déjà
export const db = globalForPrisma.prisma || new PrismaClient();

// Alias for compatibility with files that import 'prisma'
export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

