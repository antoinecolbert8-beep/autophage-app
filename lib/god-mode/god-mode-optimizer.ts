/**
 * MODULE: GOD MODE OPTIMIZER
 * Rôle: Cerveau Mathématique et Algorithmes de Domination.
 */

import { Domain, HydraMetrics, SignalMetrics } from "./types";

export class GodModeOptimizer {

    /**
     * 1. L'EQUATION DU SIGNAL PARFAIT (S_p)
     * Calcul de la viralité forcée.
     * ScoreP > Threshold = Scale MAX.
     */
    public calculateSignalPerfect(metrics: SignalMetrics): number {
        const { emotionScore, uncertaintyMetric, socialVelocity, ghostMultiplier, timeDecay } = metrics;

        // Formule: ((E * I) + (V * N)) / T
        // On évite la division par zéro avec timeDecay + epsilon
        const decay = Math.max(1, timeDecay);

        const scoreP = ((emotionScore * uncertaintyMetric) + (socialVelocity * ghostMultiplier)) / decay;
        return scoreP;
    }

    /**
     * 2. ALGORITHME DE GRAVITÉ INVERSÉE (Reddit/SEO)
     * Calcule la force nécessaire pour contrer la chute temporelle.
     */
    public calculateInjectionForce(metrics: HydraMetrics): number {
        const gravity = 1.8;
        // La gravité augmente avec le temps au carré (approximativement)
        const decayForce = Math.pow(metrics.timeAlive + 1, gravity);

        // Si la gravité écrase le post, on envoie une dose massive de Ghosts
        const neededVelocity = decayForce * 1.5; // Marge de sécurité 50%

        return Math.ceil(neededVelocity);
    }

    /**
     * 3. FONCTION DE PÉNÉTRATION INBOX (Emailing)
     * Sélectionne le domaine avec la meilleure probabilité de passer les filtres spam.
     */
    public selectBestDomain(domains: Domain[]): Domain {
        // Trie par probabilité mathématique d'atterrir en Inbox
        // P_inbox = D_rep * (1 - Vol/Vmax) * P_perso
        return domains.sort((a, b) => {
            const loadA = a.dailyVolume / a.maxVolume; // Charge (0-1)
            const scoreA = (a.reputation * (1 - loadA)) * a.aiPersonalizationScore;

            const loadB = b.dailyVolume / b.maxVolume;
            const scoreB = (b.reputation * (1 - loadB)) * b.aiPersonalizationScore;

            return scoreB - scoreA; // Descending
        })[0];
    }

    /**
     * 4. COEFFICIENT DE RÉALITÉ SYNTHÉTIQUE (Avis/Trust)
     * Génère une note imparfaite pour crédibiliser le profil (Courbe de Gauss).
     */
    public generateReviewRating(): number {
        // On ne veut pas que des 5. On veut une courbe naturelle (Target 4.7)
        const rand = Math.random();

        if (rand > 0.9) return 4;   // 10% de 4 étoiles (Imperfection nécessaire)
        if (rand > 0.98) return 3;  // 2% de 3 étoiles (Crédibilité max)

        return 5; // 88% de 5 étoiles
    }
}
