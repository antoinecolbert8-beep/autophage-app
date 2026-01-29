import dotenv from "dotenv";
import path from "path";
import { Client } from "@notionhq/client";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function diagnose() {
    const key = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_DATABASE_ID;

    console.log("--- Diagnostic Notion ---");
    console.log("Clé trouvée (tronquée):", key?.substring(0, 10) + "...");
    console.log("DB ID trouvé:", dbId);

    if (!key) {
        console.error("❌ Erreur: Aucune clé API trouvée dans .env.local");
        return;
    }

    const notion = new Client({ auth: key });

    try {
        console.log("⏳ Test de l'appel users.me()...");
        const user = await notion.users.me({});
        console.log("✅ Succès ! Connecté en tant que :", user.name);

        if (dbId) {
            console.log(`⏳ Test de lecture de la DB ${dbId}...`);
            await notion.databases.retrieve({ database_id: dbId });
            console.log("✅ Succès ! La base de données est accessible.");
        }
    } catch (error: any) {
        console.error("❌ Échec du diagnostic :");
        console.error("Code d'erreur:", error.code);
        console.error("Message:", error.message);

        if (key.startsWith("ntn_")) {
            console.log("\n💡 Note: Le préfixe 'ntn_' est inhabituel (habituellement 'secret_').");
        }
    }
}

diagnose();
