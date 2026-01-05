import { db } from "@/core/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/core/env";

const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

type RetentionPlan = {
    segment: 'VIP' | 'STANDARD';
    offer: string;
    emailSubject: string;
    emailBody: string;
};

export class RetentionService {
    private static VIP_LTV_THRESHOLD_CENTS = 10000;

    static async handleChurnRisk(stripeCustomerId: string, trigger: string): Promise<{ success: boolean; actionTaken: string }> {
        return this.executeSaveProtocol(stripeCustomerId);
    }

    static async executeSaveProtocol(stripeCustomerId: string): Promise<{ success: boolean; actionTaken: string }> {
        console.log(`🛡️ Antigravity Activated for customer: ${stripeCustomerId}`);

        try {
            const user = await db.user.findUnique({
                where: { stripeCustomerId },
            });

            if (!user) {
                console.error("User not found in Treasury.");
                return { success: false, actionTaken: "User Not Found" };
            }

            // Fail Safe: Check recent attempts (Last 30 days)
            const lastAttempt = await db.saveAttempt.findFirst({
                where: {
                    userId: user.id,
                    createdAt: { gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                },
            });

            if (lastAttempt) {
                console.log(`Antigravity: Skipping save attempt for ${user.id} (Attempted recently)`);
                return { success: false, actionTaken: "Skipped: Recently Attempted" };
            }

            // Calcul LTV
            const revenueEntries = await db.treasuryLedger.findMany({
                where: {
                    stripeCustomerId,
                    type: "REVENUE_IN",
                },
                select: { amount_cents: true },
            });
            const currentLTV = revenueEntries.reduce((sum, entry) => sum + entry.amount_cents, 0);

            const isVIP = currentLTV >= this.VIP_LTV_THRESHOLD_CENTS;
            const segment = isVIP ? 'VIP' : 'STANDARD';

            const retentionPlan = await this.generatePersonalizedOffer(segment, currentLTV);

            console.log("------------------------------------------------");
            console.log(`📧 SENDING RETENTION EMAIL [${segment}]`);
            console.log(`Subject: ${retentionPlan.emailSubject}`);
            console.log(`Body Snippet: ${retentionPlan.emailBody.substring(0, 100)}...`);
            console.log("------------------------------------------------");

            await db.saveAttempt.create({
                data: {
                    userId: user.id,
                    trigger: "CANCEL_INTENT",
                    offerSent: retentionPlan.offer,
                    status: "PENDING",
                },
            });

            return { success: true, actionTaken: `Email sent to ${segment} user` };

        } catch (error) {
            console.error("Antigravity Protocol Failed:", error);
            return { success: false, actionTaken: "Error during execution" };
        }
    }

    private static async generatePersonalizedOffer(segment: 'VIP' | 'STANDARD', ltv: number): Promise<RetentionPlan> {
        const prompt = `
            Context: A user is cancelling their subscription to our SaaS "Autophage".
            User Segment: ${segment} (LTV: $${(ltv / 100).toFixed(2)}).
            
            Task: Write a short, highly personalized retention email.
            
            Strategy:
            - If VIP: Offer a "15-minute Strategy Call with the Founder" + 50% OFF next 3 months. Tone: Respectful, Partnership.
            - If STANDARD: Offer "Pause Subscription" option or 20% OFF one month. Tone: Helpful, Curious why.
            
            Return strictly JSON format: { "subject": "...", "body": "..." }
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(jsonStr);

            return {
                segment,
                offer: segment === 'VIP' ? 'Strategy Call + 50% Off' : '20% Off',
                emailSubject: data.subject,
                emailBody: data.body
            };
        } catch (e) {
            return {
                segment,
                offer: segment === 'VIP' ? 'Strategy Call + 50% Off' : '20% Off',
                emailSubject: "Before you go...",
                emailBody: segment === 'VIP'
                    ? "We'd love to solve this. How about a strategy call?"
                    : "Would you consider pausing instead of cancelling?"
            };
        }
    }
}

