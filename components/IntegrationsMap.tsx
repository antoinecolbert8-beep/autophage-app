"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Linkedin, Twitter, Facebook, Instagram, Youtube, ShoppingBag,
    MessageCircle, Video, Mail, Target, Ghost, Share2,
    ShieldCheck, Loader2
} from "lucide-react";

const PLATFORM_ICONS: Record<string, any> = {
    LINKEDIN: Linkedin,
    X_PLATFORM: Twitter,
    FACEBOOK: Facebook,
    INSTAGRAM: Instagram,
    YOUTUBE_SEO: Youtube,
    SHOPIFY: ShoppingBag,
    WHATSAPP: MessageCircle,
    TIKTOK: Video,
    EMAIL_NEWSLETTER: Mail,
    ADS_SCALE: Target,
    SNAPCHAT: Ghost,
    AFFILIATE_LEVERAGE: Share2
};

interface IntegrationsMapProps {
    platforms: any[];
    integrations: any[];
    onConnect: (key: string) => void;
}

export const IntegrationsMap = ({ platforms, integrations, onConnect }: IntegrationsMapProps) => {
    const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

    return (
        <div className="card-saphir p-8 bg-black/40 backdrop-blur-3xl border-white/5 relative overflow-hidden h-[600px] flex items-center justify-center">
            {/* Background Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[300px] h-[300px] border border-white/5 rounded-full" />
                <div className="w-[450px] h-[450px] border border-white/5 rounded-full" />
                <div className="w-[600px] h-[600px] border border-white/5 rounded-full" />
            </div>

            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {/* Central Hub */}
                <div className="w-32 h-32 bg-cyan-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.4)] border-2 border-white/20">
                    <ShieldCheck size={40} className="text-white mb-1" />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest leading-none">Cortex</span>
                </div>

                {/* Orbiting Platforms */}
                {platforms.map((platform, i) => {
                    const isConnected = integrations.some(it => it.provider === platform.key && it.hasCredentials);
                    const angle = (i * 360) / platforms.length;
                    const radius = i % 2 === 0 ? 150 : 220; // Staggered orbits

                    const Icon = PLATFORM_ICONS[platform.key] || Share2;

                    return (
                        <motion.div
                            key={platform.key}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="absolute group/node"
                            style={{
                                transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
                            }}
                            onMouseEnter={() => setHoveredPlatform(platform.key)}
                            onMouseLeave={() => setHoveredPlatform(null)}
                        >
                            <button
                                onClick={() => onConnect(platform.key)}
                                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${isConnected
                                        ? "bg-[#66fcf1] text-black shadow-[0_0_20px_rgba(102,252,241,0.4)]"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <Icon size={24} />

                                {/* Status Indicator */}
                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${isConnected ? "bg-emerald-500" : "bg-gray-600"
                                    }`} />

                                {/* Connection Line Simulation (Hover) */}
                                <AnimatePresence>
                                    {hoveredPlatform === platform.key && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute top-1/2 left-1/2 -ml-[100px] w-[100px] h-px bg-cyan-500/50 -z-10 origin-right"
                                            style={{ transform: `rotate(180deg)` }}
                                        />
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* Label */}
                            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 transition-opacity duration-300 ${hoveredPlatform === platform.key ? "opacity-100" : "opacity-0"
                                }`}>
                                <div className="bg-black/90 border border-white/10 px-3 py-1 rounded-lg backdrop-blur-md">
                                    <p className="text-[10px] font-black uppercase text-white whitespace-nowrap">{platform.label}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Info Overlay */}
            <div className="absolute top-8 left-8">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400 mb-1">Matrice d'Intégration</h3>
                <p className="text-[10px] font-mono text-gray-500 uppercase">Mappage orbital de votre infrastructure</p>
            </div>
        </div>
    );
};
