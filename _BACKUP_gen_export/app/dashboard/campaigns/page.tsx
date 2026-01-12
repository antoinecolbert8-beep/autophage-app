"use client";

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconPlus,
} from "@/components/LineIcons";

export default function CampaignsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Campagnes Marketing</h1>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <LineIconPlus size={16} />
                    <span>Nouvelle Campagne</span>
                </button>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden hover:border-[#667eea]/50 transition-all group cursor-pointer">
                            <div className="h-40 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                                <span className="text-4xl">📧</span>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">Campagne Q1 Release {item}</h3>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-bold">En cours</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">Emailing • Automation</p>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Ouvertures</span>
                                            <span>42%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="w-[42%] h-full bg-[#667eea]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Clics</span>
                                            <span>15%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="w-[15%] h-full bg-[#764ba2]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
