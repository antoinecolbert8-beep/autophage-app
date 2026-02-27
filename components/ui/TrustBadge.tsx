import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface TrustBadgeProps {
    score: number; // 0 to 100
    className?: string;
}

/**
 * Trust Badge UI Component (Sovereign Reputation Ledger)
 * Cyber-Minimaliste, affiche le niveau de fiabilité d'un utilisateur.
 */
export const TrustBadge: React.FC<TrustBadgeProps> = ({ score, className = '' }) => {

    // Logique visuelle et labels basée sur le Sovereign Score
    const getBadgeSpecs = () => {
        if (score >= 95) {
            return {
                label: 'SOVEREIGN',
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10',
                border: 'border-emerald-400/20',
                icon: <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
            };
        } else if (score >= 80) {
            return {
                label: 'TRUSTED',
                color: 'text-indigo-400',
                bg: 'bg-indigo-400/10',
                border: 'border-indigo-400/20',
                icon: <Shield className="w-4 h-4 mr-1 text-indigo-400" />
            };
        } else if (score >= 50) {
            return {
                label: 'VERIFIED',
                color: 'text-slate-300',
                bg: 'bg-slate-300/10',
                border: 'border-slate-500/30',
                icon: <Shield className="w-4 h-4 mr-1 text-slate-400" />
            };
        } else if (score >= 20) {
            return {
                label: 'AT RISK',
                color: 'text-amber-400',
                bg: 'bg-amber-400/10',
                border: 'border-amber-400/30',
                icon: <ShieldAlert className="w-4 h-4 mr-1 text-amber-400" />
            };
        } else {
            // Score trop bas : God Mode et sous-traitance désactivés
            return {
                label: 'RESTRICTED',
                color: 'text-rose-500',
                bg: 'bg-rose-500/10',
                border: 'border-rose-500/30',
                icon: <AlertTriangle className="w-4 h-4 mr-1 text-rose-500" />
            };
        }
    };

    const specs = getBadgeSpecs();

    return (
        <div
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider border ${specs.bg} ${specs.color} ${specs.border} ${className}`}
            title={`Sovereign Score: ${score}/100`}
        >
            {specs.icon}
            {specs.label}
            <span className="ml-1.5 opacity-60">[{score}]</span>
        </div>
    );
};
