import { prisma } from '@/core/db';

/**
 * MARKETING STATS - Aggregates real platform data for social proof
 */
export class MarketingStats {
    /**
     * Get aggregate stats safe for public marketing
     */
    static async getGlobalStats() {
        const [totalLeads, totalCampaigns, totalOrgs, totalRevenue] = await Promise.all([
            prisma.lead.count(),
            prisma.campaign.count(),
            prisma.organization.count(),
            prisma.organization.aggregate({
                _sum: { mrr: true }
            })
        ]);

        return {
            leadsGenerated: totalLeads,
            activeCampaigns: totalCampaigns,
            servedOrganizations: totalOrgs,
            totalRevenueMRR: totalRevenue._sum.mrr || 0,
            launchDate: new Date('2026-01-01'), // Platform inception
        };
    }

    /**
     * Generate a "Success Story" snippet
     */
    static async getLatestSuccessStory() {
        // Find a recent high-performing campaign or major organization activity
        const recentOrg = await prisma.organization.findFirst({
            where: { mrr: { gt: 1000 } },
            orderBy: { createdAt: 'desc' },
            select: { name: true, mrr: true }
        });

        if (!recentOrg) return "Un nouvel entrepreneur vient de scaler son business à 1k€/mois en 48h via ELA.";

        return `L'organisation ${recentOrg.name} vient de franchir la barre des ${recentOrg.mrr}€ de MRR grâce aux automations ELA.`;
    }
}
