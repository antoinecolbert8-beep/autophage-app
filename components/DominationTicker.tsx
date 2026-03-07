"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const METRICS = [
    "REVENU_DELTA: +412% / H",
    "SATURATION_INDEX: 98.4%",
    "ACTIVE_AGENTS: 14,281",
    "MARKET_SHARE_CAPTURE: 1.2M€ / DIA",
    "PREDICTION_ACCURACY: 99.1%",
    "LATENCY: 4.2ms",
    "EMPIRE_STATUS: NOMINAL",
    "RETENTION_PRESSURE: 100%",
];

export function DominationTicker() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Static SSR fallback — no animation, avoids hydration mismatch
        return (
            <div className="w-full bg-red-600 py-1 overflow-hidden select-none border-y border-red-500/50">
                <div className="flex whitespace-nowrap gap-20 items-center justify-start">
                    {METRICS.map((m, i) => (
                        <span key={i} className="text-[9px] font-black text-white/90 tracking-[0.2em] font-mono">
                            {m}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-red-600 py-1 overflow-hidden select-none border-y border-red-500/50">
            <motion.div
                className="flex whitespace-nowrap gap-20 items-center justify-start"
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {[...METRICS, ...METRICS, ...METRICS].map((m, i) => (
                    <span key={i} className="text-[9px] font-black text-white/90 tracking-[0.2em] font-mono">
                        {m}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
