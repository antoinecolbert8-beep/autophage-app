"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SovereigntyGaugeProps {
    score: number;
    title: string;
    nextMilestone: number;
}

export const SovereigntyGauge = ({ score, title, nextMilestone }: SovereigntyGaugeProps) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDisplayScore(score);
        }, 500);
        return () => clearTimeout(timeout);
    }, [score]);

    const percentage = (displayScore / 1000) * 100;
    const strokeDasharray = 2 * Math.PI * 45; // Radius 45
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
        <div className="relative flex flex-col items-center justify-center w-64 h-64 group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            {/* Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-white/5 fill-none"
                    strokeWidth="4"
                />
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="stroke-cyan-400 fill-none"
                    strokeWidth="6"
                    strokeDasharray={strokeDasharray}
                    initial={{ strokeDashoffset: strokeDasharray }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{
                        filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))",
                    }}
                />
            </svg>

            {/* Middle Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-5xl font-black text-white tracking-tighter"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    {displayScore}
                </motion.span>
                <motion.span
                    className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400/80 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Sovereignty
                </motion.span>
            </div>

            {/* Rank Title Floating */}
            <div className="absolute -bottom-8 w-full text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="px-4 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full inline-block"
                    >
                        <span className="text-sm font-bold text-white/90">
                            Rank: <span className="text-cyan-400">{title}</span>
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Particle Accents */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        animate={{
                            x: [Math.cos(i * 60 * Math.PI / 180) * 80, Math.cos(i * 60 * Math.PI / 180) * 100],
                            y: [Math.sin(i * 60 * Math.PI / 180) * 80, Math.sin(i * 60 * Math.PI / 180) * 100],
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
