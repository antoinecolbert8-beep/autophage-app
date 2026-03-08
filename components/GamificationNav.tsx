"use client";

import { useState, useEffect } from "react";
import { Zap, Shield, TrendingUp } from "lucide-react";

export default function GamificationNav() {
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [aqci, setAqci] = useState(0);

    const xpNeeded = level * 1000;
    const progressPercent = Math.min(100, (xp / xpNeeded) * 100);

    // Simulation (will be replaced by real DB fetches in production)
    useEffect(() => {
        // Mock user profile loading
        setTimeout(() => {
            setLevel(12);
            setXp(8450);
            setAqci(124.5);
        }, 1000);
    }, []);

    return (
        <div className="sticky top-0 z-50 w-full bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Player Level & XP Bar */}
                    <div className="flex-1 flex items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-black border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                <span className="text-xl font-black text-white">{level}</span>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#050508] flex items-center justify-center">
                                    <Shield size={8} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 max-w-xs">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expérience</span>
                                <span className="text-[10px] text-blue-400 font-mono font-bold">{xp} / {level * 1000} XP</span>
                            </div>
                            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AQCI Score (Power Level) */}
                    <div className="flex-shrink-0 flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-purple-400/80 font-bold mb-0.5">Indice d'Acquisition (AQCI)</span>
                            <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                <TrendingUp size={14} className="text-purple-400" />
                                <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300 font-mono">
                                    {aqci.toFixed(1)}
                                </span>
                                <Zap size={10} className="text-fuchsia-400 animate-pulse ml-1" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
