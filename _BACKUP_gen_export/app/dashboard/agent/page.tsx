"use client";

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconPlus,
} from "@/components/LineIcons";

const agents = [
    {
        name: "VOX",
        role: "Secrétaire Téléphonique",
        status: "Actif",
        tasks: 142,
        efficiency: "98%",
        color: "from-blue-400 to-cyan-300"
    },
    {
        name: "NEXUS",
        role: "Prospecteur LinkedIn",
        status: "Actif",
        tasks: 890,
        efficiency: "94%",
        color: "from-pink-400 to-rose-300"
    },
    {
        name: "SENTINEL",
        role: "Juriste IA",
        status: "Veille",
        tasks: 12,
        efficiency: "100%",
        color: "from-emerald-400 to-teal-300"
    },
    {
        name: "HIVE",
        role: "Manager WhatsApp",
        status: "Inactif",
        tasks: 0,
        efficiency: "-",
        color: "from-amber-400 to-orange-300"
    },
];

export default function AgentsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Mini Nav for Subpage */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Mes Agents</h1>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <LineIconPlus size={16} />
                    <span>Nouvel Agent</span>
                </button>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent, i) => (
                        <div key={i} className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
                            <div className={`h-1 w-full bg-gradient-to-r ${agent.color}`}></div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{agent.name}</h3>
                                        <p className="text-sm text-gray-400">{agent.role}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${agent.status === 'Actif' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {agent.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 my-6">
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Tâches / 24h</p>
                                        <p className="text-lg font-mono font-bold">{agent.tasks}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Efficacité</p>
                                        <p className="text-lg font-mono font-bold text-green-400">{agent.efficiency}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold transition-colors">
                                        Paramètres
                                    </button>
                                    <button className="flex-1 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                                        Ouvrir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
