"use client";

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconZap,
    LineIconCheck
} from "@/components/AppIcons";

export default function SyncMonitorPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Sync Monitor (Real-time)</h1>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    LIVE
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
                        <h3 className="font-bold mb-6">Flux de Données</h3>
                        <div className="space-y-6">
                            {[
                                { name: "CRON: Lead Enrichment", status: "Success", time: "Il y a 2s" },
                                { name: "API: Content Generation", status: "Processing", time: "En cours..." },
                                { name: "WEBHOOK: Stripe Payment", status: "Success", time: "Il y a 45s" },
                                { name: "AGENT: Social Poster", status: "Success", time: "Il y a 2m" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-bold text-sm font-mono">{log.name}</p>
                                        <p className="text-xs text-gray-500">{log.time}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${log.status === 'Processing' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-green-500/20 text-green-400'}`}>
                                        {log.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
                        <h3 className="font-bold mb-6">État des Services</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Database (Supabase)</span>
                                <span className="text-green-400 font-bold text-sm">Opérationnel</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">AI Engine (Vertex)</span>
                                <span className="text-green-400 font-bold text-sm">Opérationnel</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Worker Queue (Redis)</span>
                                <span className="text-green-400 font-bold text-sm">Opérationnel</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Storage S3</span>
                                <span className="text-green-400 font-bold text-sm">Opérationnel</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="h-32 bg-[#0a0a0f] rounded-lg flex items-end justify-between px-2 pb-0 pt-4 gap-1">
                                {/* Mock CPU Load Chart */}
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} style={{ height: `${Math.random() * 60 + 20}%` }} className="w-full bg-blue-500/20 rounded-t-sm" />
                                ))}
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-2">Charge CPU (5 min)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
