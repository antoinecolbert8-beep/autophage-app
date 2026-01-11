/**
 * Script de setup de la base de données Supabase/PostgreSQL
 * Usage: npx tsx scripts/setup-database.ts
 * 
 * Prérequis: DATABASE_URL configuré dans .env
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗄️ Configuration de la base de données...\n");

  try {
    // Test de connexion
    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie");

    // Vérifie le nombre d'utilisateurs
    const userCount = await prisma.user.count();
    console.log(`📊 Utilisateurs dans la base: ${userCount}`);

    // Vérifie ActionHistory
    const actionCount = await prisma.actionHistory.count();
    console.log(`📊 Actions enregistrées: ${actionCount}`);

    // Vérifie BrandProfile
    const brandCount = await prisma.brandProfile.count();
    console.log(`📊 Profils de marque: ${brandCount}`);

    // Vérifie ContentStat
    const statCount = await prisma.contentStat.count();
    console.log(`📊 Statistiques de contenu: ${statCount}`);

    console.log("\n✅ Base de données opérationnelle");
  } catch (error) {
    console.error("\n❌ Erreur:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("\n✅ Setup database terminé");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Erreur fatale:", err);
    process.exit(1);
  });





