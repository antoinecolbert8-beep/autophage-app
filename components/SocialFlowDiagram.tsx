"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Zap,
    Share2,
    Cpu
} from "lucide-react";

const PLATFORMS = [
    { id: "linkedin", icon: <Linkedin size={16} />, color: "#0077b5", angle: -60 },
    { id: "twitter", icon: <Twitter size={16} />, color: "#1da1f2", angle: -20 },
    { id: "facebook", icon: <Facebook size={16} />, color: "#1877f2", angle: 20 },
    { id: "instagram", icon: <Instagram size={16} />, color: "#e4405f", angle: 60 },
    { id: "youtube", icon: <Youtube size={16} />, color: "#ff0000", angle: 100 },
    { id: "other", icon: <Share2 size={16} />, color: "#8b5cf6", angle: 140 },
];

export const SocialFlowDiagram = () => {
    return (
        <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-[#050507]/50 rounded-2xl border border-white/5 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

            {/* Central ELA Core */}
            <div className="relative z-20">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: 360 }}
                    transition={{ scale: { repeat: Infinity, duration: 4 }, rotate: { repeat: Infinity, duration: 40, ease: "linear" } }}
                    className="absolute inset-0 bg-cyan-500/10 blur-[40px] rounded-full"
                />
                <div className="w-24 h-24 bg-black border border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                    <Cpu className="text-cyan-500 mb-1" size={32} />
                    <span className="text-[10px] font-black tracking-widest text-white uppercase">ELA_CORE</span>
                </div>
            </div>

            {/* Orbital Paths and Platforms */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400">
                <defs>
                    <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {PLATFORMS.map((platform, i) => {
                    const radius = 160;
                    const centerX = 400;
                    const centerY = 200;
                    const radian = (platform.angle * Math.PI) / 180;
                    const x = centerX + radius * Math.cos(radian);
                    const y = centerY + radius * Math.sin(radian);

                    return (
                        <g key={platform.id}>
                            {/* Connection Line */}
                            <motion.path
                                d={`M 400 200 Q ${(centerX + x) / 2} ${(centerY + y) / 2 - 20} ${x} ${y}`}
                                stroke="url(#flow-grad)"
                                strokeWidth="1.5"
                                fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.3 }}
                                transition={{ duration: 1.5, delay: i * 0.2 }}
                            />

                            {/* Data Packets (Simulated animated dots) */}
                            <motion.circle
                                r="3"
                                fill="#66fcf1"
                                filter="url(#glow)"
                                animate={{
                                    cx: [400, x],
                                    cy: [200, y],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Platform Node Container */}
                            <foreignObject x={x - 20} y={y - 20} width="40" height="40">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.2 }}
                                    className="w-10 h-10 bg-[#0a0a0f] border border-white/10 rounded-xl flex items-center justify-center text-white shadow-xl cursor-help"
                                    style={{ borderColor: `${platform.color}40` }}
                                >
                                    <div style={{ color: platform.color }}>{platform.icon}</div>
                                </motion.div>
                            </foreignObject>
                        </g>
                    );
                })}
            </svg>

            {/* Decorative HUD Elements */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Global_Sync_Active</span>
                </div>
                <div className="text-[8px] font-mono text-gray-700 uppercase">Latency: 14ms // Throughput: 1.2GB/s</div>
            </div>

            <div className="absolute top-6 right-6">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                    <Zap size={10} className="text-amber-500" />
                    <span className="text-[9px] font-black uppercase text-gray-400">Zero CMD Matrix</span>
                </div>
            </div>
        </div>
    );
};
