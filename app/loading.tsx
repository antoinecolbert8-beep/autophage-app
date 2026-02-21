"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
    "Initialisation du Protocole Souveraineté...",
    "Alignement des Agents d'Attraction (APEX, VISION)...",
    "Synchronisation du Core Éducation (NEXUS, CORE)...",
    "Optimisation du Tunnel de Conversion (FORGE, HIVE)...",
    "Calcul de la Puissance d'Expansion (PULSE, ECHO)...",
    "Verrouillage de la Fondation Sécurisée...",
    "Extraction de l'Intelligence Marketplace...",
    "Domination Digitale en cours de chargement...",
];

export default function Loading() {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508] overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Nebula Effects */}
                <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>
            </div>

            {/* Central Singularity Core */}
            <div className="relative z-10 flex flex-col items-center gap-16">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Outer Rings */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute inset-0 rounded-full border border-white/${(i + 1) * 10} bg-gradient-to-tr from-blue-500/5 to-purple-500/5`}
                            style={{ padding: i * 20 }}
                            animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
                            transition={{
                                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                        />
                    ))}

                    {/* Glowing Core */}
                    <div className="relative w-20 h-20 rounded-full bg-black border border-white/20 flex items-center justify-center overflow-hidden group shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-60"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.4, 0.7, 0.4]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="relative z-10 text-white font-black text-2xl tracking-tighter">ELA</div>

                        {/* Scanning beam effect */}
                        <motion.div
                            className="absolute inset-0 w-full h-1 bg-white/40 blur-sm"
                            animate={{ top: ['-10%', '110%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Orbiting Particles */}
                    <motion.div
                        className="absolute w-2 h-2 bg-blue-400 rounded-full blur-[2px] shadow-[0_0_10px_#60a5fa]"
                        animate={{ offsetPath: "circle(90px at center)", offsetRotate: "0deg", offsetDistance: ["0%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute w-2 h-2 bg-pink-400 rounded-full blur-[2px] shadow-[0_0_10px_#f472b6]"
                        animate={{ offsetPath: "circle(110px at center)", offsetRotate: "0deg", offsetDistance: ["100%", "0%"] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Status Messaging System */}
                <div className="flex flex-col items-center gap-4 w-80">
                    <div className="h-6 flex items-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={msgIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="text-sm font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center"
                            >
                                {MESSAGES[msgIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Progress Bar (Indeterminate) */}
                    <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                        <motion.div
                            className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/3"
                            animate={{ left: ['-40%', '110%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="flex justify-between w-full px-1 text-[8px] font-mono text-gray-700 tracking-widest uppercase">
                        <span>Genesis Engine v2.0</span>
                        <span>Sovereignty Protocol</span>
                    </div>
                </div>
            </div>

            {/* Matrix Dust (Subtle Overlay) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
            </div>
        </div>
    );
}
