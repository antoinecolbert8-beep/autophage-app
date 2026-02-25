import { db as prisma } from "@/core/db";

export class PartnerService {
    /**
     * Get or create a referral code for a user
     */
    static async getOrCreateReferralCode(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { referralCode: true }
        });

        if (user?.referralCode) return user.referralCode;

        const code = `ELA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        await prisma.user.update({
            where: { id: userId },
            data: { referralCode: code }
        });

        return code;
    }

    /**
     * Get performance stats for a partner
     */
    static async getPartnerStats(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                referralsGiven: {
                    include: {
                        referee: {
                            select: {
                                id: true,
                                email: true,
                                currentPlan: true,
                                createdAt: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) return null;

        const activeReferrals = user.referralsGiven.filter(r => r.status === 'active').length;
        const pendingReferrals = user.referralsGiven.filter(r => r.status === 'pending').length;

        // Calculate estimated monthly commission (30% of referee plan prices)
        // This is a simplification, in production we'd look at transaction history
        let estimatedMonthlyIncome = 0;
        for (const ref of user.referralsGiven) {
            if (ref.status === 'active') {
                const plan = ref.referee.currentPlan;
                if (plan === 'starter') estimatedMonthlyIncome += 37 * 0.3;
                else if (plan === 'pro' || plan === 'growth') estimatedMonthlyIncome += 197 * 0.3;
                else if (plan === 'god_mode') estimatedMonthlyIncome += 497 * 0.3;
            }
        }

        return {
            referralCode: user.referralCode,
            activeCount: activeReferrals,
            pendingCount: pendingReferrals,
            totalCount: user.referralsGiven.length,
            monthlyIncome: estimatedMonthlyIncome,
            referrals: user.referralsGiven.map(r => ({
                email: r.referee.email.replace(/(.{3}).*@/, '$1... @'), // Obfuscate
                plan: r.referee.currentPlan,
                date: r.createdAt,
                status: r.status
            }))
        };
    }

    /**
     * Distribute a "Media Invitation" to a list of network handles
     */
    static async broadcastMediaInvitation(handles: string[], platform: 'LINKEDIN' | 'TWITTER') {
        const inviteMessage = `Bonjour, l'infrastructure ELA (Genesis) ouvre un canal "Souverain" pour les réseaux et médias d'influence. Nous proposons une licence d'exploitation exclusive avec 30% de récurrence. Intéressé par un audit ?`;

        // This would use the social-media-manager to send DMs (if implemented) 
        // or just log for manual action by high-level agents
        console.log(`[PARTNER-SCALING] Broadcasting to ${handles.length} handles on ${platform}...`);
        return { success: true, targets: handles.length };
    }
}
