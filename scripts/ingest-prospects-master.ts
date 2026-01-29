import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import { addToNotionDatabase } from "../lib/notion";

const databaseId = process.env.NOTION_DATABASE_ID;

const leads = [
    // LOGISTIQUE
    { nom: "Fives Cinetic", secteur: "Logistique automatisée", signal: "200-499 salariés ; usinage/assemblage manuel legacy europages", gain: "50% saisie production/docs", decideur: "NS" },
    { nom: "Datalogic", secteur: "Logistique tech", signal: "Scale-up France ; flux manuels entreposage europages", gain: "40% inventaire/étiquettes", decideur: "NS" },
    { nom: "Europe Services Transport", secteur: "Transport logistique", signal: "5-9→scale ; stock/expéditions admin europages", gain: "60% gestion stocks", decideur: "NS" },
    { nom: "HBS Transport Urgent", secteur: "Logistique intégrée", signal: "Entreposage/distribution volumes europages", gain: "50% fret/communication", decideur: "NS" },
    { nom: "Savoye Logistics", secteur: "Supply chain", signal: "WMS legacy, recrutement Rhône-Alpes lehub.bpifrance", gain: "40-60% flux commandes", decideur: "NS" },
    { nom: "Prodway", secteur: "Logistique startups", signal: "Mapping supply chain, data entry ops lehub.bpifrance", gain: "50% optimisation stocks", decideur: "NS" },

    // E-COMMERCE
    { nom: "Club Employes", secteur: "E-commerce Lyon", signal: "Data analyst e-com KPI manuels, Python sheets welcometothejungle", gain: "50% dashboards/orders", decideur: "NS" },
    { nom: "Groupe Mondial Tissus", secteur: "E-commerce textile", signal: "Chef projet e-com, saisie flux ventes linkedin", gain: "40% KPI/ventes", decideur: "NS" },
    { nom: "Convertix", secteur: "Ads e-commerce", signal: "Consultant ads, tracking manuels linkedin", gain: "60% data campaigns", decideur: "NS" },
    { nom: "Polar Analytics", secteur: "Analytics e-com", signal: "Finance manager data volumes linkedin", gain: "50% reporting", decideur: "NS" },
    { nom: "CobbleWeb", secteur: "Marketplace e-com", signal: "Backend PHP pour ops manuelles linkedin", gain: "40% inventory sync", decideur: "NS" },
    { nom: "SBM Life Science", secteur: "E-com agro", signal: "Contrôle gestion stage, saisie admin linkedin", gain: "50% processing", decideur: "NS" },

    // RH / RECUTEMENT
    { nom: "Licorne Society", secteur: "Recrutement scale-up", signal: "COO search ops/customer, process manuels licornesociety", gain: "60% gestion candidats/dossiers", decideur: "André Farah" },
    { nom: "365Talents", secteur: "RH influenceurs", signal: "Recrutement cadres data entry linkedin", gain: "50% matching/process", decideur: "NS" },
    { nom: "Lucca", secteur: "RH suite", signal: "Flux RH legacy volumes ensun", gain: "40-60% paie/dossiers", decideur: "NS" },
    { nom: "Silae", secteur: "Paie RH", signal: "Admin saisie payroll scale-up ensun", gain: "50% reporting employés", decideur: "NS" },
];

async function runIngestion() {
    if (!databaseId) {
        console.error("❌ NOTION_DATABASE_ID manquant dans le .env");
        return;
    }

    console.log(`🚀 Lancement de l'ingestion de ${leads.length} leads vers Notion...`);

    let successCount = 0;

    for (const lead of leads) {
        try {
            await addToNotionDatabase(databaseId, {
                "Nom": {
                    title: [{ text: { content: lead.nom } }]
                },
                "Secteur": {
                    rich_text: [{ text: { content: lead.secteur } }]
                },
                "Signal": {
                    rich_text: [{ text: { content: lead.signal } }]
                },
                "Gain Estimé": {
                    rich_text: [{ text: { content: lead.gain } }]
                },
                "Décideur": {
                    rich_text: [{ text: { content: lead.decideur } }]
                }
            });
            console.log(`✅ Ingéré : ${lead.nom}`);
            successCount++;
        } catch (error: any) {
            console.error(`❌ Échec pour ${lead.nom} :`, error.message);
        }
    }

    console.log(`\n🏆 Ingestion terminée : ${successCount}/${leads.length} succès.`);
}

runIngestion();
