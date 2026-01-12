"use client";

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconGlobe
} from "@/components/AppIcons";

export default function HeatmapPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Domination Market Heatmap</h1>
                </div>
            </div>

            <div className="p-8 max-w-full mx-auto">
                <div className="bg-[#13131f] border border-white/5 rounded-2xl p-1 relative overflow-hidden h-[70vh]">
                    <div className="absolute inset-0 bg-[url('/world-map.png')] bg-cover bg-center opacity-20">
                        {/* Fallback pattern if image missing */}
                        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a0a0f] to-[#0a0a0f]"></div>
                    </div>

                    {/* Simulated Hotspots */}
                    <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>

                    <div className="relative z-10 p-8">
                        <div className="inline-block bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-xl p-6">
                            <p className="text-gray-400 text-sm mb-2">Index de Domination</p>
                            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#667eea] to-[#764ba2]">
                                14.2%
                            </h2>
                            <p className="text-green-400 text-sm font-bold mt-2">▲ +0.8% cette semaine</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold mb-2">Territoires Actifs</h3>
                        <p className="text-2xl font-bold">4 Pays</p>
                    </div>
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold mb-2">Segments Saturés</h3>
                        <p className="text-2xl font-bold text-green-400">12</p>
                    </div>
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold mb-2">Opportunités</h3>
                        <p className="text-2xl font-bold text-[#667eea]">87</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
