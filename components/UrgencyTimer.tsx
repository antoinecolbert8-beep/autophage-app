"use client";

import { useState, useEffect } from "react";
import { Clock, Flame } from "lucide-react";

/**
 * 🔱 URGENCY TIMER
 * Countdown timer for psychological urgency
 */
export default function UrgencyTimer({
    initialMinutes = 27,
    label = "OFFRE EXPIRE DANS"
}: {
    initialMinutes?: number;
    label?: string;
}) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : initialMinutes * 60));
        }, 1000);

        return () => clearInterval(interval);
    }, [initialMinutes]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 backdrop-blur-sm">
            <Flame className="w-5 h-5 text-red-500 animate-pulse" />
            <div className="flex flex-col">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{label}</span>
                <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span className="text-2xl font-black font-mono text-white tabular-nums">
                        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                    </span>
                </div>
            </div>
        </div>
    );
}
