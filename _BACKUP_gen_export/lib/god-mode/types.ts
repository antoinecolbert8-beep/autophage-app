/**
 * GOD MODE SYSTEM TYPES
 * Définitions des structures de données pour l'ingénierie de combat Autophage.
 */

// --- 1. OPTIMISATION DU SIGNAL ($S_p$) ---
export interface SignalMetrics {
    emotionScore: number;     // E
    uncertaintyMetric: number; // I
    socialVelocity: number;   // V
    ghostMultiplier: number;  // N
    timeDecay: number;        // T
}

// --- 2. GUERRE FINANCIÈRE (WarState) ---
export interface WarState {
    dailyRevenue: number;
    currentROAS: number; // Return on Ad Spend
    opCoBalance: number;
    holdCoBalance: number;
}

export interface BankTransferRequest {
    from: "OPCO_MAIN" | "OPCO_SECONDARY";
    to: "HOLDING_VAULT";
    amount: number;
    label: string;
    executedAt: Date;
}

// --- 3. HYDRA & GRAVITÉ ---
export interface HydraMetrics {
    timeAlive: number;      // Heures depuis publication
    currentRank: number;    // Position
    domainHealth: number;   // 0.0 - 1.0
    trustVariance: number;  // Entropie
}

// --- 4. INBOX PENETRATION ---
export interface Domain {
    id: string;
    url: string;
    reputation: number; // D_rep (0-1)
    dailyVolume: number;
    maxVolume: number;
    aiPersonalizationScore: number; // P_perso
}

// --- 5. GHOST PROTOCOL ---
export type GhostActionType = "LIKE" | "COMMENT" | "SHARE" | "VOTE_UP" | "SAVE" | "REPORT";

export interface GhostInjectionParams {
    targetId: string;
    intensity: "LOW" | "MEDIUM" | "HIGH" | "NUCLEAR";
    type: "CONTROVERSY" | "VALIDATION" | "DEBATE";
    platform: "LINKEDIN" | "REDDIT" | "TWITTER" | "INSTAGRAM";
}
