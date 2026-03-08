"use client";

import { useState } from "react";
import Link from "next/link";
import { LineIconChevronLeft, LineIconUsers, LineIconZap, LineIconShield } from "@/components/AppIcons";
import { toast } from "sonner";

export default function SporeProtocolPage() {
    const [copied, setCopied] = useState(false);
    const referralLink = "ref.ela-revolution.com/a4f89d";

    const tiers = [
        { level: 1, name: "Initié", req: 1, reward: "+50% AQCI Bonus (1 sem)", unlocked: true },
        { level: 2, name: "Émissaire", req: 3, reward: "Accès Beta Outils IA", unlocked: false },
        { level: 3, name: "Seigneur de Guerre", req: 5, reward: "God Mode Temporaire (1 mois)", unlocked: false },
        { level: 4, name: "Architecte", req: 10, reward: "Revenus Passifs +10%", unlocked: false },
        { level: 5, name: "Grand Horloger", req: 25, reward: "Statut Souverain Perpétuel", unlocked: false },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Lien d'acquisition copié ! 🧬");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-xl z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">Protocol Spore <LineIconZap className="text-[#66fcf1]" size={18} /></h1>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                            Générateur d'Expansion Virale
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">

                {/* Main Banner */}
                <div className="rounded-3xl bg-gradient-to-br from-[#0a0f12] to-[#0d141b] border border-[#66fcf1]/30 p-8 md:p-12 relative overflow-hidden shadow-[0_0_40px_rgba(102,252,241,0.1)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(102,252,241,0.1),transparent_50%)]" />
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-[#66fcf1] mb-4">
                            Déployez Votre Réseau
                        </h2>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8">
                            Le Protocole Spore est votre arme d'expansion. Invitez d'autres souverains à rejoindre ELA.
                            Chaque noeud actif renforce votre Coalition, augmente votre puissance AQCI, et débloque des avantages uniques.
                        </p>

                        <div className="inline-flex items-center justify-between bg-black/50 border border-[#66fcf1]/20 p-2 rounded-2xl w-full max-w-md backdrop-blur-md">
                            <code className="px-4 text-[#66fcf1] font-bold text-sm select-all">{referralLink}</code>
                            <button
                                onClick={handleCopy}
                                className="px-6 py-3 bg-[#66fcf1] text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all"
                            >
                                {copied ? "SÉCURISE" : "COPIER LIEN"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Skill Tree (Spore Tiers) */}
                <div className="mt-12">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 text-center flex items-center justify-center gap-2">
                        <LineIconShield size={14} /> Arbre de Conquête (Milestones)
                    </h3>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-[#66fcf1] via-[#66fcf1]/30 to-white/5 md:-translate-x-1/2" />

                        <div className="space-y-6">
                            {tiers.map((tier, index) => (
                                <div key={index} className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>

                                    {/* Node Center */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-[#0a0a0f] flex items-center justify-center z-10 bg-[#0a0a0f]">
                                        <div className={`w-3 h-3 rounded-full ${tier.unlocked ? "bg-[#66fcf1] shadow-[0_0_15px_rgba(102,252,241,0.8)]" : "bg-gray-800"}`} />
                                    </div>

                                    {/* Content Card */}
                                    <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${index % 2 === 0 ? "md:pr-16 text-left md:text-right" : "md:pl-16 text-left"}`}>
                                        <div className={`p-6 rounded-2xl border transition-all duration-500 ${tier.unlocked ? "bg-[#101820] border-[#66fcf1]/40 shadow-[0_0_30px_rgba(102,252,241,0.1)] hover:border-[#66fcf1]" : "bg-white/[0.02] border-white/5 opacity-60 grayscale"}`}>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-3 inline-block ${tier.unlocked ? "bg-[#66fcf1]/20 text-[#66fcf1]" : "bg-white/10 text-gray-500"}`}>
                                                Niveau {tier.level}
                                            </span>
                                            <h4 className="text-xl font-bold text-white mb-1">{tier.name}</h4>
                                            <p className="text-xs text-gray-500 mb-4">{tier.req} Affilié{tier.req > 1 ? 's' : ''} Actif{tier.req > 1 ? 's' : ''}</p>

                                            <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                                                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                                                    <LineIconShield size={16} />
                                                </div>
                                                <p className="text-xs font-bold text-yellow-500">{tier.reward}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
