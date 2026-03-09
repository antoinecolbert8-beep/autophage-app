"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, Zap, X } from "lucide-react";

export const CinematicOAuth = ({
    platform,
    onComplete,
    onClose
}: {
    platform: any;
    onComplete: () => void;
    onClose: () => void;
}) => {
    const [step, setStep] = useState(0);

    const steps = [
        { label: "INITIALISATION_PROTOCOL", msg: "Accès à la passerelle OAuth 2.0..." },
        { label: "HANDSHAKE_SSL", msg: `Négociation du tunnel sécurisé avec ${platform.label}...` },
        { label: "IDENTITY_CLAIM", msg: "Vérification des permissions de publication..." },
        { label: "SYNC_ATHE", msg: "Finalisation du ledger d'accès..." }
    ];

    useEffect(() => {
        if (step < steps.length) {
            const timer = setTimeout(() => setStep(step + 1), 1200);
            return () => clearTimeout(timer);
        } else {
            setTimeout(onComplete, 1000);
        }
    }, [step]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-8">
            <div className="w-full max-w-md bg-[#0a0a0f] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.2)]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                            <Zap size={16} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-white">OAuth_Handshake</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Animation Area */}
                <div className="p-10 flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute inset-0 border-t-2 border-cyan-500 rounded-full"
                        />
                        <div className="absolute inset-3 bg-cyan-500/10 rounded-full flex items-center justify-center">
                            <ShieldCheck size={32} className="text-cyan-500 animate-pulse" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Authentification {platform.label}</h2>

                    <div className="w-full space-y-4 mt-6">
                        {steps.map((s, i) => (
                            <div key={i} className={`flex items-center justify-between transition-all duration-500 ${i > step ? "opacity-20 blur-sm" : "opacity-100"}`}>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest">{s.label}</span>
                                    <span className="text-[11px] text-gray-400">{s.msg}</span>
                                </div>
                                {i < step ? (
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                ) : i === step ? (
                                    <Loader2 size={14} className="text-cyan-500 animate-spin" />
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-cyan-500/5 border-t border-cyan-500/10 flex justify-center">
                    <p className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-[0.2em]">Zero_Cmd_Interface // ELA_Sovereign_OS</p>
                </div>
            </div>
        </div>
    );
};
