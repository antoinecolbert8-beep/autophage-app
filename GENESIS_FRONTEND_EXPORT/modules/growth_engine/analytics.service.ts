import { db } from "@/core/db";
import { env } from "@/core/env";
import { AdManager } from "@/modules/growth_engine/ad_manager";
import { NotifierService } from "@/modules/platform/notifier.service";

// Interface pour la réponse Meta (simplifiée)
type MetaInsight = {
    ad_id: string;
    ad_name: string;
    spend: string;
    impressions: string;
    clicks: string;
    cpc: string;
    ctr: string;
    actions?: Array<{ action_type: string; value: string }>;
};

export class AnalyticsService {
    // Seuils de décision (Le "Juge")
    private static MIN_ROAS_WINNER = 2.0;
    private static MAX_SPEND_LOSER_CENTS = 1500;
    private static MIN_ROAS_TOLERANCE = 0.8;

    static async syncDailyMetrics() {
        console.log("👁️ Oculus: Fetching Meta Ads Performance...");

        try {
            const fields = "ad_id,ad_name,spend,impressions,clicks,cpc,ctr,actions,action_values";
            const url = `https://graph.facebook.com/v19.0/${env.META_AD_ACCOUNT_ID}/insights?level=ad&fields=${fields}&date_preset=yesterday&access_token=${env.META_ACCESS_TOKEN}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.data) {
                console.warn("Oculus: No data returned from Meta.");
                return;
            }

            const insights: MetaInsight[] = data.data;

            for (const item of insights) {
                await this.processAdMetric(item);
            }

        } catch (error) {
            console.error("Oculus System Failure:", error);
        }
    }

    private static async processAdMetric(insight: MetaInsight) {
        const postIdMatch = insight.ad_name.match(/Post_(\w+)/);
        if (!postIdMatch) return;

        const postId = postIdMatch[1];
        const spendCents = Math.round(parseFloat(insight.spend) * 100);
        const clicks = parseInt(insight.clicks || "0");
        const impressions = parseInt(insight.impressions || "0");
        const ctr = parseFloat(insight.ctr || "0");

        const purchaseAction = insight.actions?.find(a => a.action_type === 'offsite_conversion.fb_pixel_purchase');
        const revenue = parseFloat(purchaseAction?.value || "0");
        const roas = spendCents > 0 ? (revenue * 100) / spendCents : 0;

        await db.performanceMetric.create({
            data: {
                postId,
                spend: spendCents,
                impressions,
                clicks,
                ctr,
                roas
            }
        });

        const post = await db.post.findUnique({ where: { id: postId } });
        if (!post) return;

        // SCÉNARIO 1 : WINNER
        if (roas >= this.MIN_ROAS_WINNER) {
            if (post.status !== 'WINNER') {
                console.log(`🏆 NEW CHAMPION DETECTED: ${postId} (ROAS: ${roas})`);
                await db.post.update({
                    where: { id: postId },
                    data: { status: 'WINNER' }
                });
                await NotifierService.sendAlert(
                    "NEW CHAMPION",
                    `Ad ${postId} is a WINNER (ROAS: ${roas.toFixed(2)})`,
                    'SUCCESS'
                );
            }
        }

        // SCÉNARIO 2 : BURNER
        else if (spendCents > this.MAX_SPEND_LOSER_CENTS && roas < this.MIN_ROAS_TOLERANCE) {
            console.log(`💀 KILLING AD: ${postId} (Money Burner)`);

            await AdManager.pauseAd(insight.ad_id);

            await db.post.update({
                where: { id: postId },
                data: { status: 'BURNER' }
            });
            await NotifierService.sendAlert(
                "AD KILLED",
                `Ad ${postId} was burning money (ROAS ${roas.toFixed(2)}). Paused.`,
                'WARNING'
            );
        }
    }
}

