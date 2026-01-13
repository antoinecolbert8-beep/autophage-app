
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { LineIconArrowRight, LineIconCheck } from "@/components/AppIcons";

export default function AgentsPage() {
    const agents = [
        { name: "VOX", role: "Telephony Expert", img: "/agents/vox_v2.png?v=2", desc: "Gère vos appels entrants et sortants avec une voix humaine indiscernable.", gradient: "from-blue-500 to-indigo-500", capabilities: ["Appels entrants/sortants", "Synthèse vocale émotionnelle", "Gestion de calendrier"] },
        { name: "NEXUS", role: "Sales & Outreach", img: "/agents/nexus_v2.png?v=2", desc: "Prospecte sur LinkedIn et Email, qualifie les leads et booke vos RDV.", gradient: "from-[#667eea] to-[#764ba2]", capabilities: ["Outreach Multi-canal", "Rédaction Copywriting", "Lead Scoring"] },
        { name: "SENTINEL", role: "Legal & Compliance", img: "/agents/sentinel_v2.png?v=2", desc: "Vérifie vos contrats, assure la conformité RGPD et protège votre business.", gradient: "from-emerald-500 to-teal-500", capabilities: ["Audit Contractuel", "Veille Juridique", "Conformité Automatique"] },
        { name: "HIVE", role: "Swarm Commander", img: "/agents/hive_v2.png?v=2", desc: "Pilote l'ensemble de votre flotte d'agents via WhatsApp.", gradient: "from-amber-500 to-orange-500", capabilities: ["Orchestration d'agents", "Interface WhatsApp", "Reporting Unifié"] },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-[#ec4899] selection:text-white overflow-x-hidden pt-32 px-6">
            <div className="max-w-7xl mx-auto mb-20">
                <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-block">← Retour</Link>
                <h1 className="text-5xl md:text-7xl font-black mb-8">Nos Agents Spécialisés.</h1>
                <p className="text-xl text-gray-400 max-w-3xl">Une flotte d'intelligence artificielle prête à être déployée dans votre infrastructure.</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
                {agents.map((agent, i) => (
                    <div key={i} className="rounded-[2.5rem] bg-[#13131f] border border-white/5 overflow-hidden flex flex-col md:flex-row group hover:border-white/20 transition-all">
                        <div className="w-full md:w-1/2 aspect-square relative">
                            <img src={agent.img} alt={agent.name} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#13131f] to-transparent opacity-50 md:hidden"></div>
                        </div>
                        <div className="p-8 flex flex-col justify-center w-full md:w-1/2">
                            <div className={`w-fit px-3 py-1 rounded-full bg-gradient-to-r ${agent.gradient} text-xs font-bold mb-4`}>{agent.role}</div>
                            <h2 className="text-3xl font-black mb-4">{agent.name}</h2>
                            <p className="text-gray-400 mb-6">{agent.desc}</p>
                            <ul className="space-y-2 mb-8">
                                {agent.capabilities.map((cap, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                                        <LineIconCheck size={14} className="text-[#667eea]" /> {cap}
                                    </li>
                                ))}
                            </ul>
                            <Link href={`/signup?agent=${agent.name}`} className="w-full py-3 bg-white text-black rounded-xl font-bold text-center hover:bg-gray-200 transition-colors">
                                Déployer {agent.name}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
