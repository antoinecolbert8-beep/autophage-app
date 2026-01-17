
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Lancement de la procédure d'urgence ADMIN...");

    // Email hardcodé basé sur votre demande
    const TARGET_EMAIL = "ela.revolution.ia@gmail.com";

    try {
        console.log(`\n1. Recherche du compte Auth Supabase pour: ${TARGET_EMAIL}`);

        // On exécute le bloc SQL pur via Prisma
        // C'est la méthode la plus fiable car elle contourne les restrictions de l'API Prisma
        await prisma.$executeRawUnsafe(`
            DO $$
            DECLARE
                target_email TEXT := '${TARGET_EMAIL}'; 
                v_user_id UUID;
                v_org_id TEXT;
            BEGIN
                -- 1. Récupérer l'ID de l'utilisateur (créé lors du signup)
                SELECT id INTO v_user_id FROM auth.users WHERE email = target_email;
                
                IF v_user_id IS NULL THEN
                   RAISE EXCEPTION '❌ Utilisateur introuvable ! Créez d''abord un compte sur /signup (ignorez le paiement)';
                END IF;

                -- 2. Créer une Organisation (si elle n'existe pas)
                INSERT INTO "Organization" (id, name, domain, tier, status, "updatedAt")
                VALUES ('org_' || substr(md5(random()::text), 1, 8), 'Admin Corp', 'admin-corp', 'enterprise', 'active', now())
                ON CONFLICT (domain) DO UPDATE SET "updatedAt" = now()
                RETURNING id INTO v_org_id;
                
                -- Fallback lookup
                IF v_org_id IS NULL THEN
                    SELECT id INTO v_org_id FROM "Organization" WHERE domain = 'admin-corp' LIMIT 1;
                END IF;

                -- 3. Créer ou Mettre à jour l'utilisateur Public
                INSERT INTO "User" (id, email, name, role, "currentPlan", "organizationId", "updatedAt")
                VALUES (
                    v_user_id::text, 
                    target_email, 
                    'Super Admin', 
                    'admin', 
                    'enterprise', 
                    v_org_id, 
                    now()
                )
                ON CONFLICT (email) DO UPDATE 
                SET role = 'admin', "currentPlan" = 'enterprise';
            END $$;
        `);

        console.log(`\n✅ SUCCÈS TOTAL !`);
        console.log(`👤 Compte: ${TARGET_EMAIL}`);
        console.log(`👑 Rôle: ADMIN (God Mode)`);
        console.log(`🏢 Org: Admin Corp`);
        console.log(`\n👉 Vous pouvez maintenant aller sur /login et vous connecter.`);

    } catch (error) {
        console.error("\n❌ ERREUR:", error);
        console.log("\n💡 ASTUCE: Assurez-vous d'avoir créé le compte sur /signup (même sans payer) avant de lancer ce script !");
    } finally {
        await prisma.$disconnect();
    }
}

main();
