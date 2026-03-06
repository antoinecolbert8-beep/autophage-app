"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeuralWeb } from "@/components/AdvancedVisuals";

const MAIN_AGENTS = [
    { id: "APEX", role: "Content" },
    { id: "VISION", role: "Video" },
    { id: "NEXUS", role: "Outreach" },
    { id: "CORE", role: "Email" },
    { id: "FORGE", role: "E-Com" },
    { id: "HIVE", role: "WhatsApp" },
    { id: "PULSE", role: "Ads" },
    { id: "ECHO", role: "Referral" },
    { id: "VOX", role: "Voice" },
    { id: "SENTINEL", role: "Legal" },
    { id: "ORACLE", role: "Intelligence" },
    { id: "GHOST", role: "Scraping" },
    { id: "SYNC", role: "Lifecycle" }
];

const TICKER_AGENTS = [
    "Métriques Temps Réel", "Upload Média Natif", "A/B Testing Auto", "Auto-Engagement Bot",
    "Trending Topics", "Frequency Optimizer", "Content Recycling", "Retargeting Pixels",
    "Influencer Detection", "Video Generator", "Revenue Autopilot", "Multi-Language",
    "Lead Scoring AI", "ROI Calculator", "Meeting Assistant AI", "Proposal Generator",
    "Competitive Intelligence", "SMS Automation", "White-Label Program", "Email Warmup",
    "Performance Globale", "Infrastructure Souveraine", "IA Transmission Layer", "Orchestration Autonome"
];

const MESSAGES = [
    "Initialisation du Protocole Souveraineté...",
    "Déploiement de l'Infrastructure...",
    "Synchronisation des Unités Autonomes...",
    "Verrouillage des Clés de Cryptage...",
    "Activation du Flywheel Stratégique...",
    "Extraction des Données de Marché...",
    "Finalisation du Nexus Central...",
];

export default function Loading() {
    const [activeAgents, setActiveAgents] = useState<string[]>([]);
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const agentInterval = setInterval(() => {
            setActiveAgents(prev => {
                if (prev.length >= MAIN_AGENTS.length) {
                    clearInterval(agentInterval);
                    return prev;
                }
                return [...prev, MAIN_AGENTS[prev.length].id];
            });
        }, 150);

        const msgInterval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 1500);

        return () => {
            clearInterval(agentInterval);
            clearInterval(msgInterval);
        };
    }, []);

    // Create a very long ticker to avoid gaps
    const tickerContent = [...TICKER_AGENTS, ...TICKER_AGENTS, ...TICKER_AGENTS, ...TICKER_AGENTS];

    return (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050508] overflow-hidden select-none">
            {/* Cinematic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <NeuralWeb />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>
            </div>

            {/* Matrix Dust */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
            </div>

            {/* TOP TICKER - LENT VERS LA GAUCHE */}
            <div className="absolute top-0 left-0 w-full py-6 border-b border-white/10 bg-black/60 backdrop-blur-md overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap gap-16 items-center"
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    {tickerContent.map((name, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
                            <span className="text-xs font-black text-white/60 tracking-[0.3em] uppercase">{name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-16 w-full max-w-2xl px-8">

                {/* ELA CORE SINGULARITY */}
                <div className="relative">
                    <motion.div
                        className="w-32 h-32 rounded-3xl bg-black border-2 border-white/10 flex items-center justify-center relative overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.25)]"
                        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 15 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-60"
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <span className="relative z-10 font-black text-4xl tracking-tighter text-white drop-shadow-2xl">ELA</span>

                        {/* Scanning Effect */}
                        <motion.div
                            className="absolute inset-0 w-full h-0.5 bg-white/50 blur-[2px]"
                            animate={{ top: ["0%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>

                    {/* Pulsing rings */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0 rounded-3xl border border-blue-500/20"
                            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                        />
                    ))}
                </div>

                {/* AGENT GRID STATUS */}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-5 w-full">
                    {MAIN_AGENTS.map((agent) => {
                        const isActive = activeAgents.includes(agent.id);
                        return (
                            <div key={agent.id} className="flex flex-col items-center gap-3">
                                <motion.div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all duration-700 ${isActive
                                        ? 'bg-blue-600/30 border-blue-500/60 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)]'
                                        : 'bg-white/5 border-white/5 text-white/10'
                                        }`}
                                    animate={isActive ? { scale: [0.9, 1.15, 1], rotate: [0, 5, 0] } : {}}
                                >
                                    {agent.id[0]}
                                </motion.div>
                                <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors duration-700 ${isActive ? 'text-blue-400' : 'text-white/10'}`}>
                                    {isActive ? agent.id : "OFFLINE"}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* STATUS BAR */}
                <div className="w-full space-y-6 pt-4">
                    <div className="h-6 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={msgIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                                className="text-xs font-black tracking-[0.4em] uppercase text-blue-500 text-center"
                            >
                                {MESSAGES[msgIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <div className="relative w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute inset-0 h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 shadow-[0_0_15px_#3b82f6]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                        />
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono text-gray-600 tracking-[0.2em] uppercase px-1">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                            Protocole Infrastructure Alpha-2
                        </span>
                        <span>Souveraineté : Verrouillée</span>
                    </div>
                </div>
            </div>

            {/* BOTTOM TICKER - LENT VERS LA GAUCHE (REVERSE LIST) */}
            <div className="absolute bottom-0 left-0 w-full py-6 border-t border-white/10 bg-black/60 backdrop-blur-md overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap gap-16 items-center"
                    initial={{ x: "-50%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    {tickerContent.reverse().map((name, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]"></div>
                            <span className="text-xs font-black text-white/60 tracking-[0.3em] uppercase">{name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
