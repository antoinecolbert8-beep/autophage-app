import { EventEmitter } from 'events';

export type PulseType = 'LEAD_CAPTURED' | 'SALE_COMPLETED' | 'AGENT_EXECUTED' | 'POST_VIRAL' | 'SYSTEM_UPGRADE' | 'PROSPECT_ENGAGED';

export interface PulseEvent {
    id: string;
    type: PulseType;
    platform?: string;
    value?: number;
    message: string;
    timestamp: Date;
}

/**
 * ⚡ REALTIME PULSE ENGINE
 * Emits high-dopamine events for the dashboard
 */
class RealtimePulse extends EventEmitter {
    private static instance: RealtimePulse;

    private constructor() {
        super();
    }

    static getInstance(): RealtimePulse {
        if (!RealtimePulse.instance) {
            RealtimePulse.instance = new RealtimePulse();
        }
        return RealtimePulse.instance;
    }

    /**
     * Emit a new pulse event
     */
    emitPulse(event: Omit<PulseEvent, 'id' | 'timestamp'>) {
        const fullEvent: PulseEvent = {
            ...event,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date()
        };
        this.emit('pulse', fullEvent);
        console.log(`[PULSE] ${fullEvent.type}: ${fullEvent.message}`);
    }

    /**
     * Helper to trigger lead event
     */
    notifyLead(platform: string, name?: string) {
        this.emitPulse({
            type: 'LEAD_CAPTURED',
            platform,
            message: `Nouveau prospect identifié sur ${platform} ${name ? `(${name})` : ''}`
        });
    }

    /**
     * Helper to trigger sale event
     */
    notifySale(amount: number) {
        this.emitPulse({
            type: 'SALE_COMPLETED',
            value: amount,
            message: `🔥 NOUVELLE VENTE : +${amount}€`
        });
    }

    /**
     * Helper to trigger agent activity
     */
    notifyAgent(agentName: string) {
        this.emitPulse({
            type: 'AGENT_EXECUTED',
            message: `L'agent ${agentName} vient d'optimiser votre infrastructure.`
        });
    }

    /**
     * Helper to trigger engagement event
     */
    notifyEngagement(type: 'OPEN' | 'CLICK', prospectName: string) {
        this.emitPulse({
            type: 'PROSPECT_ENGAGED',
            message: `🔥 Prospect ${prospectName} vient de ${type === 'OPEN' ? 'LIRE' : 'CLIQUER SUR'} votre mail !`
        });
    }
}

export const PulseEngine = RealtimePulse.getInstance();
