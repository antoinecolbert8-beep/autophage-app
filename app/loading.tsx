"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AGENTS = [
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

const MESSAGES = [
    "Initialisation du Protocole Souveraineté...",
    "Déploiement de la Matrice Empire...",
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
        // Incrementaly "activate" agents
        const agentInterval = setInterval(() => {
            setActiveAgents(prev => {
                if (prev.length >= AGENTS.length) {
                    clearInterval(agentInterval);
                    return prev;
                }
                return [...prev, AGENTS[prev.length].id];
            });
        }, 300);

        // Cycle messages
        const msgInterval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 1500);

        return () => {
            clearInterval(agentInterval);
            clearInterval(msgInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508] overflow-hidden select-none">
            {/* Cinematic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)]"></div>
            </div>

            {/* Matrix / Digital Dust Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay">
                <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-lg px-6">

                {/* ELA CORE SINGULARITY */}
                <div className="relative mb-4">
                    <motion.div
                        className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 opacity-40 animate-pulse"
                        />
                        <span className="relative z-10 font-black text-3xl tracking-tighter text-white">ELA</span>
                    </motion.div>

                    {/* Pulsing rings */}
                    {[...Array(2)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0 rounded-2xl border border-white/5"
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 1 }}
                        />
                    ))}
                </div>

                {/* AGENT GRID STATUS */}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3 w-full">
                    {AGENTS.map((agent) => {
                        const isActive = activeAgents.includes(agent.id);
                        return (
                            <div key={agent.id} className="flex flex-col items-center gap-1.5">
                                <motion.div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${isActive
                                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                            : 'bg-white/5 border-white/5 text-white/20'
                                        }`}
                                    animate={isActive ? { scale: [0.8, 1.1, 1] } : {}}
                                >
                                    {agent.id[0]}
                                </motion.div>
                                <span className={`text-[8px] font-mono tracking-tighter uppercase transition-colors duration-500 ${isActive ? 'text-gray-400' : 'text-white/10'}`}>
                                    {agent.id}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* STATUS BAR */}
                <div className="w-full space-y-4">
                    <div className="h-4 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={msgIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-400/80 text-center"
                            >
                                {MESSAGES[msgIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <div className="relative w-full h-[1px] bg-white/5">
                        <motion.div
                            className="absolute inset-0 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="flex justify-between items-center text-[8px] font-mono text-gray-700 tracking-widest uppercase px-1">
                        <span>Agents: {activeAgents.length}/{AGENTS.length}</span>
                        <span>Protocol: Empire Alpha</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
