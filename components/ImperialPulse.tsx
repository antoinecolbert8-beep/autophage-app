"use client";

import React, { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PulseEngine, PulseEvent } from "@/lib/realtime-pulse";

// Helper for high-dopamine sound effects
const playPulseSound = (type: string) => {
    if (typeof window === 'undefined') return;

    const sounds: Record<string, string> = {
        'SALE_COMPLETED': '/sounds/cash-register.mp3',
        'LEAD_CAPTURED': '/sounds/power-up.mp3',
        'AGENT_EXECUTED': '/sounds/digital-blip.mp3'
    };

    try {
        const audio = new Audio(sounds[type] || '/sounds/default-pulse.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => { }); // Ignore interaction blocked errors
    } catch (e) {
        console.warn('Audio playback failed:', e);
    }
};

export const ImperialPulse = () => {
    const [pulses, setPulses] = useState<PulseEvent[]>([]);

    useEffect(() => {
        // Listen to local engine (In prod, this would be WebSocket/Supabase)
        const handlePulse = (pulse: PulseEvent) => {
            setPulses(prev => [pulse, ...prev].slice(0, 5));
            playPulseSound(pulse.type);
        };

        PulseEngine.on('pulse', handlePulse);
        return () => {
            PulseEngine.off('pulse', handlePulse);
        };
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 w-80">
            <AnimatePresence>
                {pulses.map((pulse) => (
                    <motion.div
                        key={pulse.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                        className={`
              relative overflow-hidden p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl
              ${pulse.type === 'SALE_COMPLETED' ? 'bg-emerald-500/20 border-emerald-500/30' :
                                pulse.type === 'LEAD_CAPTURED' ? 'bg-cyan-500/20 border-cyan-500/30' :
                                    'bg-purple-500/20 border-purple-500/30'}
            `}
                    >
                        {/* Intensity Glow */}
                        <div className={`absolute -inset-1 blur-2xl opacity-20 animate-pulse ${pulse.type === 'SALE_COMPLETED' ? 'bg-emerald-500' : 'bg-cyan-500'
                            }`} />

                        <div className="relative flex items-center gap-4">
                            <div className={`
                p-2 rounded-lg 
                ${pulse.type === 'SALE_COMPLETED' ? 'bg-emerald-500' : 'bg-cyan-500'}
              `}>
                                {pulse.type === 'SALE_COMPLETED' ? '💰' : pulse.type === 'LEAD_CAPTURED' ? '👤' : '🤖'}
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                                    {pulse.type.replace('_', ' ')}
                                </span>
                                <span className="text-sm font-medium text-white/90 leading-tight">
                                    {pulse.message}
                                </span>
                            </div>
                        </div>

                        {/* Progress bar countdown */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-white/20"
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 5, ease: 'linear' }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
