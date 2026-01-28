import { Client } from "@notionhq/client";

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

/**
 * Récupère les données d'une base de données Notion.
 * @param databaseId L'ID de la base de données Notion.
 * @returns Une liste d'objets formatés.
 */
export async function getNotionDatabase(databaseId: string) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });
        return response.results;
    } catch (error) {
        console.error("Erreur lors de la récupération de la DB Notion:", error);
        return [];
    }
}

/**
 * Ajoute une page (ligne) à une base de données Notion.
 * Idéal pour capturer des leads ou des feedbacks.
 * @param databaseId L'ID de la base de données.
 * @param properties Les propriétés de la page à créer.
 */
export async function addToNotionDatabase(databaseId: string, properties: any) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: properties,
        });
        return response;
    } catch (error) {
        console.error("Erreur lors de l'ajout à Notion:", error);
        throw error;
    }
}

export default notion;
