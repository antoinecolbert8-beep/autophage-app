"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ELALogo } from "@/components/GenesisLogo";
import {
    AgentIcon,
    AutomationIcon,
    BrainAIIcon,
    SecurityShieldIcon,
    AnalyticsChartIcon,
    GlobeNetworkIcon,
    RocketLaunchIcon,
    LightningBoltIcon,
    InfinityLoopIcon
} from "@/components/CustomIcons";

/**
 * 🎬 ELA LIVE IDENTITY TRAILER
 * A high-impact cinematic presentation of the ELA visual identity.
 */
export default function VideoIdentityPage() {
    const [stage, setStage] = useState(0); // 0: Intro, 1: Features, 2: Global, 3: CTA

    useEffect(() => {
        const timer = setInterval(() => {
            setStage((prev) => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-amber-500/30">
            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

                {/* Animated Grid */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)',
                        transformOrigin: 'top'
                    }}
                />
            </div>

            <AnimatePresence mode="wait">
                {stage === 0 && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="relative z-10 flex flex-col items-center justify-center min-h-screen"
                    >
                        <motion.div
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <ELALogo className="w-64 h-64 drop-shadow-[0_0_50px_rgba(251,191,36,0.5)]" />
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="mt-8 text-6xl font-black tracking-tighter bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
                        >
                            ELA
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 2 }}
                            className="mt-4 uppercase tracking-[0.5em] text-sm font-mono"
                        >
                            Sovereign Intelligence
                        </motion.p>
                    </motion.div>
                )}

                {stage === 1 && (
                    <motion.div
                        key="features"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="relative z-10 grid grid-cols-3 gap-8 p-20 min-h-screen items-center"
                    >
                        <div className="col-span-1 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-1 px-3 border border-cyan-500/30 bg-cyan-500/10 rounded-full w-fit text-xs font-mono text-cyan-400"
                            >
                                ● CORE_PROTOCOL.SYS
                            </motion.div>
                            <h2 className="text-5xl font-black leading-tight uppercase">
                                Domination <br /> <span className="text-cyan-400">Asymétrique</span>
                            </h2>
                            <p className="text-gray-400 text-lg max-w-sm">
                                L'acquisition de puissance ne demande pas plus d'efforts, juste un meilleur système.
                            </p>
                        </div>

                        <div className="col-span-2 grid grid-cols-2 gap-6">
                            {[
                                { icon: <AgentIcon className="w-12 h-12" />, title: "Agent Swarm", desc: "Intelligence collective coordonnée" },
                                { icon: <AutomationIcon className="w-12 h-12" />, title: "Auto-Scale", desc: "Expansion infinie sans friction" },
                                { icon: <SecurityShieldIcon className="w-12 h-12" />, title: "Quantum Security", desc: "Protection active impénétrable" },
                                { icon: <LightningBoltIcon className="w-12 h-12" />, title: "Instant Alpha", desc: "Exécution à la vitesse de la lumière" }
                            ].map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-white/20 transition-colors group"
                                >
                                    <div className="bg-black/50 p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                                    <p className="text-sm text-gray-500">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {stage === 2 && (
                    <motion.div
                        key="global"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <GlobeNetworkIcon className="w-[800px] h-[800px] animate-reverse-spin" />
                        </div>
                        <motion.div className="relative z-20 space-y-4">
                            <BrainAIIcon className="w-32 h-32 mx-auto mb-8 animate-pulse" />
                            <h2 className="text-7xl font-black tracking-tighter uppercase italic">
                                RÉSEAU <span className="text-violet-500">GLOBAL</span>
                            </h2>
                            <p className="text-2xl text-gray-400 font-light max-w-2xl">
                                Une infrastructure mondiale alimentée par l'intelligence souveraine.
                            </p>
                        </motion.div>
                    </motion.div>
                )}

                {stage === 3 && (
                    <motion.div
                        key="cta"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 flex flex-col items-center justify-center min-h-screen"
                    >
                        <motion.div
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            className="text-center space-y-12"
                        >
                            <h2 className="text-8xl font-black tracking-tighter leading-none uppercase">
                                INFILTRER <br /> LE SYSTÈME
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(6, 182, 212, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 py-5 bg-white text-black text-xl font-black uppercase rounded-full transition-all"
                            >
                                Activer ELA Maintenant
                            </motion.button>
                            <div className="flex justify-center space-x-8 opacity-40">
                                <RocketLaunchIcon className="w-8 h-8" />
                                <InfinityLoopIcon className="w-8 h-8" />
                                <AnalyticsChartIcon className="w-8 h-8" />
                            </div>
                        </motion.div>

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">System Active • Master Identity Verified</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bars */}
            <div className="fixed top-10 left-10 right-10 z-50 flex space-x-2">
                {[0, 1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        {stage === s && (
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                className="h-full bg-white"
                            />
                        )}
                        {stage > s && <div className="h-full w-full bg-white/40" />}
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 60s linear infinite;
        }
      `}</style>
        </div>
    );
}
