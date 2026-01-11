"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0f]">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Main Loader Animation */}
                <div className="relative w-24 h-24">
                    <motion.div
                        className="absolute inset-0 rounded-full border-t-4 border-l-4 border-transparent border-t-blue-500 border-l-blue-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-2 rounded-full border-b-4 border-r-4 border-transparent border-b-pink-500 border-r-pink-500"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_20px_white]"></div>
                    </div>
                </div>

                {/* Text */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 animate-pulse">
                        GENESIS
                    </h2>
                    <p className="text-xs text-blue-500/50 font-mono tracking-widest uppercase">
                        Initialisation...
                    </p>
                </div>
            </div>
        </div>
    );
}
