
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const prisma = new PrismaClient();

async function main() {
    try {
        const url = process.env.DATABASE_URL || "UNDEFINED";
        const isSupabase = url.includes("supabase");
        const isLocal = url.includes("localhost") || url.includes("127.0.0.1");

        console.log("--- DIAGNOSTIC ---");
        console.log("DB URL Detected:", isSupabase ? "Supabase (Remote)" : isLocal ? "Localhost" : "Other");

        if (isLocal) {
            console.warn("⚠️ ATTENTION: Votre script pointe vers LOCALHOST.");
            console.warn("Si vous vous êtes inscrit sur le site EN LIGNE (Railway), ce script ne peut pas vous trouver.");
            console.warn("SOLUTION: Copiez l'URL de la base de données de Supabase dans votre .env.local (variable DATABASE_URL)");
        } else {
            // Try to count auth users
            try {
                const count: any = await prisma.$queryRawUnsafe('SELECT count(*) FROM auth.users');
                console.log(`Auth Users Count: ${count[0].count}`);

                if (Number(count[0].count) === 0) {
                    console.log("❌ LA BASE EST VIDE (0 utilisateurs).");
                } else {
                    console.log("✅ Il y a des utilisateurs.");
                    const users: any[] = await prisma.$queryRawUnsafe('SELECT email FROM auth.users');
                    console.log("Emails trouvés:", users.map(u => u.email).join(", "));
                }
            } catch (e: any) {
                console.error("Erreur accès auth.users:", e.message);
            }
        }

    } catch (e: any) {
        console.error("FATAL:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
