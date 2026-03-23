import { BaseAgent } from "./base-agent";
import { ViralEngine } from "../viral-engine";
import { MarketingStats } from "../services/marketing-stats";
import { triggerAutomation } from "../automations";
import { db as prisma } from "@/core/db";

export class MarketingAgent extends BaseAgent {
    constructor() {
        super("Marketing", "Stratège de croissance et évangéliste de la plateforme ELA");
    }

    async execute() {
        console.log("📣 [Marketing] Analyse de la croissance platform-wide...");

        // 1. Collecter les preuves sociales (Social Proof)
        const stats = await MarketingStats.getGlobalStats();
        const story = await MarketingStats.getLatestSuccessStory();

        // 2. Générer du contenu viral pour ELA
        const platformPost = await ViralEngine.generateViralPost({
            topic: `Comment nous avons généré ${stats.leadsGenerated} leads pour nos clients via l'IA autonome`,
            platform: "LINKEDIN",
            style: "educational",
            includeElaBranding: true
        });

        // 3. Publier la "Preuve de Souveraineté"
        await this.publishSelfPromotion(platformPost);

        // 4. Analyser les opportunités de partenariat (Agences)
        await this.sendMessage("Sales", "Marketing a identifié une traction sur les agences B2B. Lancement d'une séquence de prospection partenaire?");

        await this.logAction("MARKETING_CAMPAIGN_LAUNCHED", {
            stats,
            postPreview: platformPost.substring(0, 100) + "..."
        });

        return { status: "SUCCESS", stats };
    }

    private async publishSelfPromotion(content: string) {
        console.log("🚀 [Marketing] Publication du contenu de promotion ELA...");
        
        // Find ELA's own admin organization to attribute the post
        const adminOrg = await prisma.organization.findFirst({
            where: { name: { contains: "ELA" } }
        }) || await prisma.organization.findFirst();

        if (adminOrg) {
            await triggerAutomation('POST_PUBLISH', {
                content,
                platforms: ['LINKEDIN', 'X_PLATFORM'],
                organizationId: adminOrg.id
            });
        }
    }
}
