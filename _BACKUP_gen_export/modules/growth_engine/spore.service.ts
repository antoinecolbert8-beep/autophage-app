import { db } from "@/core/db";
import { LedgerService } from "@/modules/treasury/ledger.service";

export type SporeResult = {
    success: boolean;
    message: string;
    referrerId?: string;
    rewardCents?: number;
};

export class SporeService {
    // Prime de parrainage : 10.00$ (1000 cents)
    private static REFERRAL_REWARD_CENTS = 1000;

    /**
     * Traite l'application d'un code de parrainage par un nouvel utilisateur.
     */
    static async processReferral(newUserId: string, referralCode: string): Promise<SporeResult> {
        console.log(`🍄 Spore Protocol: Processing referral for ${newUserId} with code ${referralCode}`);

        try {
            // 1. Validation du Code
            const referrer = await db.user.findUnique({
                where: { referralCode: referralCode },
            });

            if (!referrer) {
                return { success: false, message: "Invalid Referral Code" };
            }

            if (referrer.id === newUserId) {
                return { success: false, message: "Self-referral attempt blocked" };
            }

            // 2. Vérifier si le nouvel utilisateur a déjà été parrainé
            const newUser = await db.user.findUnique({ where: { id: newUserId } });
            if (newUser?.referredBy) {
                return { success: false, message: "User already referred" };
            }

            // 3. Exécution Atomique (Transaction)
            await db.$transaction(async (tx) => {
                // A. Marquer le nouvel utilisateur
                await tx.user.update({
                    where: { id: newUserId },
                    data: { referredBy: referralCode }
                });

                // B. Récompenser le parrain
                await LedgerService.handleIncome(this.REFERRAL_REWARD_CENTS);
            });

            console.log(`✅ Spore Success: ${this.REFERRAL_REWARD_CENTS} cents added to WarChest via ${referrer.id}`);

            return {
                success: true,
                message: "Referral applied successfully",
                referrerId: referrer.id,
                rewardCents: this.REFERRAL_REWARD_CENTS
            };

        } catch (error) {
            console.error("Spore Protocol Failed:", error);
            return { success: false, message: "System Error during referral processing" };
        }
    }

    /**
     * Génère un code unique pour un nouvel utilisateur
     */
    static generateSporeCode(username: string): string {
        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const safeUsername = username || "USER";
        const prefix = safeUsername.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'USER');
        return `${prefix}-${suffix}`;
    }
}

