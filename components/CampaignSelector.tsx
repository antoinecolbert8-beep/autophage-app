"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface CampaignSelectorProps {
    onTypeChange: (type: "free" | "paid") => void;
}

export const CampaignSelector = ({ onTypeChange }: CampaignSelectorProps) => {
    const [activeType, setActiveType] = useState<"free" | "paid">("free");

    const handleToggle = (type: "free" | "paid") => {
        setActiveType(type);
        onTypeChange(type);
    };

    return (
        <div className="card-saphir p-6 border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="text-[10px] font-mono tracking-widest uppercase">Selecteur_Protocole.sys</span>
            </div>

            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Type de Campagne
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleToggle("free")}
                    className={`relative p-5 rounded-xl border transition-all duration-300 group/btn ${activeType === "free"
                            ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                >
                    <div className={`text-left ${activeType === "free" ? "text-cyan-400" : "text-gray-500"}`}>
                        <span className="block text-[8px] font-black uppercase tracking-[0.2em] mb-1">ACCÈS_OUVERT</span>
                        <span className="text-sm font-black uppercase tracking-tight">Version Free</span>
                    </div>
                    {activeType === "free" && (
                        <motion.div layoutId="selector-glow" className="absolute inset-0 bg-cyan-500/5 blur-xl -z-10" />
                    )}
                </button>

                <button
                    onClick={() => handleToggle("paid")}
                    className={`relative p-5 rounded-xl border transition-all duration-300 group/btn ${activeType === "paid"
                            ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                >
                    <div className={`text-left ${activeType === "paid" ? "text-amber-400" : "text-gray-500"}`}>
                        <span className="block text-[8px] font-black uppercase tracking-[0.2em] mb-1">DOMINATION_TOTALE</span>
                        <span className="text-sm font-black uppercase tracking-tight">Version Paid</span>
                    </div>
                    {activeType === "paid" && (
                        <motion.div layoutId="selector-glow" className="absolute inset-0 bg-amber-500/5 blur-xl -z-10" />
                    )}
                </button>
            </div>

            <div className="mt-8 flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-gray-400">Status Opérationnel</p>
                    <p className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest leading-none">
                        {activeType === "free" ? "Ressources Limitées" : "Full Access Granted"}
                    </p>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`w-1 h-3 rounded-full ${i <= (activeType === "free" ? 1 : 4) ? (activeType === "free" ? 'bg-cyan-500' : 'bg-amber-500') : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};
