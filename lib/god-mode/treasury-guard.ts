/**
 * MODULE: TREASURY GUARD (Loi de la Pérennité)
 * Rôle: Résilience des Flux Financiers et Kill-Switch.
 * "Le succès ne doit pas tuer le système."
 */

import { db as prisma } from "@/core/db";

const DISPUTE_THRESHOLD = 0.0075; // 0.75%
const HOURLY_TRANSACTION_LIMIT = 50;

export class TreasuryGuard {
    private static instance: TreasuryGuard;

    private constructor() { }

    public static getInstance(): TreasuryGuard {
        if (!TreasuryGuard.instance) {
            TreasuryGuard.instance = new TreasuryGuard();
        }
        return TreasuryGuard.instance;
    }

    /**
     * KILL-SWITCH AUTOMATIQUE
     * Vérifie le taux de disputes en temps réel via Webhooks Stripe.
     * Si > 0.75%, déclenche le protocole de survie.
     */
    public async checkHealth(organizationId: string): Promise<boolean> {
        // 1. Calcul du Dispute Rate
        const totalTransactions = await prisma.creditPurchase.count({
            where: { organizationId }
        });

        const totalDisputes = await prisma.paymentDispute.count({
            where: {
                organizationId,
                status: { not: "won" } // On compte tout sauf ce qu'on a gagné
            }
        });

        if (totalTransactions === 0) return true;

        const rate = totalDisputes / totalTransactions;

        if (rate > DISPUTE_THRESHOLD) {
            await this.activateKillSwitch(organizationId, rate);
            return false;
        }

        return true;
    }

    /**
     * PROTOCOLE DE SURVIE
     * Bascule instantanément le trafic vers un processeur de secours ou met en pause.
     */
    private async activateKillSwitch(orgId: string, rate: number) {
        console.error(`[TREASURY] 🚨 KILL SWITCH ACTIVATED for ${orgId}. Dispute Rate: ${(rate * 100).toFixed(2)}%`);

        // 1. Geler l'acquisition (OpCo Status -> Frozen)
        await prisma.warChest.update({
            where: { organizationId: orgId },
            data: { opco_status: "frozen" }
        });

        // 2. Basculer le routing (Implémenté dans FinancialWarEngine)
        // await financialEngine.switchGateway(orgId);

        // 3. Alerte Admin (Email/SMS)
    }

    /**
     * THROTTLING INTELLIGENT
     * Lisse les captures de paiement pour simuler une croissance organique.
     */
    public async scheduleTransaction(amount: number, orgId: string): Promise<void> {
        // Vérifie la vélocité actuelle
        const lastHourSales = await prisma.creditPurchase.count({
            where: {
                organizationId: orgId,
                timestamp: { gte: new Date(Date.now() - 3600 * 1000) }
            }
        });

        if (lastHourSales > HOURLY_TRANSACTION_LIMIT) {
            // Mise en file d'attente (Queue)
            const delay = this.calculateSmoothingDelay(lastHourSales);
            console.log(`[TREASURY] ⏳ Throttling activé. Transaction reportée de ${delay}ms.`);

            // En prod: Pousser dans Redis/BullMQ avec delay
            // await queue.add("capture_payment", { amount, orgId }, { delay });
            return;
        }

        // Sinon exécution immédiate
        // await processPayment(...)
    }

    private calculateSmoothingDelay(currentVelocity: number): number {
        // Logique de dispersion temporelle
        // Plus on dépasse, plus on lisse sur les 6 prochaines heures
        const overloadFactor = currentVelocity / HOURLY_TRANSACTION_LIMIT;
        return Math.floor(Math.random() * 3600 * 1000 * overloadFactor);
    }

    /**
     * CONFORMITÉ MCC
     * Vérifie que les métadonnées de transaction matchent le code catégorie déclaré.
     */
    public validateMCC(metadata: any): boolean {
        // Vérification basique des keywords produits
        // "Consulting" vs "SaaS" vs "High Risk"
        return true; // Placeholder
    }
}
