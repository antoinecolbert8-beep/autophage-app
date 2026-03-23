import { SalesAgent } from "../lib/agents/sales-agent";

async function massConvert() {
    console.log("⚡ [MassConvert] Initialisation du Commando de Closing Live...");
    
    const agent = new SalesAgent();
    
    // On commence par un batch de 50 pour la sécurité
    const count = await agent.forceConversion(50);
    
    console.log(`✅ Conversion terminée. Emails envoyés: ${count}`);
    console.log("📈 Les prospects sont passés de 'WARM' à 'CLOSING' avec le lien live.");
}

massConvert().catch(console.error);
