"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Zap } from "lucide-react";

/**
 * 🔱 LIVE SOCIAL PROOF
 * Real-time notifications for neuro-psychological conversion
 */

const notifications = [
    { name: "Marc D.", action: "vient de s'inscrire", plan: "God Mode", location: "Paris", icon: Zap },
    { name: "Sophie L.", action: "a déployé 4 agents", plan: "Growth", location: "Lyon", icon: Users },
    { name: "Thomas B.", action: "a généré 847 leads", plan: "God Mode", location: "Marseille", icon: TrendingUp },
    { name: "Julie M.", action: "vient de s'inscrire", plan: "Starter", location: "Toulouse", icon: Zap },
    { name: "Alexandre P.", action: "a automatisé son pipeline", plan: "Growth", location: "Nice", icon: Users },
    { name: "Marie C.", action: "a converti 34 clients", plan: "God Mode", location: "Nantes", icon: TrendingUp },
];

export default function LiveSocialProof() {
    const [currentNotif, setCurrentNotif] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showInterval = setInterval(() => {
            setIsVisible(true);
            setCurrentNotif((prev) => (prev + 1) % notifications.length);

            setTimeout(() => setIsVisible(false), 4000);
        }, 8000);

        return () => clearInterval(showInterval);
    }, []);

    const notif = notifications[currentNotif];
    const Icon = notif.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: -400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -400, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-8 left-8 z-50 pointer-events-none hidden md:block"
                >
                    <div className="bg-[#000000] border border-yellow-500/30 rounded-2xl p-4 shadow-2xl shadow-yellow-500/20 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shrink-0">
                                <Icon size={20} className="text-black" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-white text-sm">{notif.name}</span>
                                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">
                                        {notif.plan}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-xs">{notif.action}</p>
                                <p className="text-gray-600 text-[10px] mt-1">📍 {notif.location} • Il y a 2 min</p>
                            </div>

                            {/* Pulse indicator */}
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
