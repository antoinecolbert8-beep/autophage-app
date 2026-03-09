"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AgentIcon,
    AutomationIcon,
    BrainAIIcon,
    SecurityShieldIcon,
    AnalyticsChartIcon,
    GlobeNetworkIcon,
    RocketLaunchIcon,
    LightningBoltIcon,
    InfinityLoopIcon
} from "./CustomIcons";

const AGENTS_LIST = [
    { id: "nexus", name: "Nexus", icon: <AgentIcon className="w-8 h-8" />, desc: "Intelligence Centrale" },
    { id: "pulse", name: "Pulse", icon: <AutomationIcon className="w-8 h-8" />, desc: "Flux d'Automatisation" },
    { id: "oracle", name: "Oracle", icon: <BrainAIIcon className="w-8 h-8" />, desc: "Cognition Prédictive" },
    { id: "apex", name: "Apex", icon: <SecurityShieldIcon className="w-8 h-8" />, desc: "Protocole Défense" },
    { id: "quantum", name: "Quantum", icon: <GlobeNetworkIcon className="w-8 h-8" />, desc: "Sillage Réseau" },
    { id: "vault", name: "Vault", icon: <AnalyticsChartIcon className="w-8 h-8" />, desc: "Ledger de Données" },
    { id: "echo", name: "Echo", icon: <RocketLaunchIcon className="w-8 h-8" />, desc: "Amplificateur Social" },
    { id: "atlas", name: "Atlas", icon: <LightningBoltIcon className="w-8 h-8" />, desc: "Exécution Rapide" },
    { id: "lex", name: "Lex", icon: <InfinityLoopIcon className="w-8 h-8" />, desc: "Cohérence Juridique" }
];

export const AgentAssignment = () => {
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

    const toggleAgent = (id: string) => {
        setSelectedAgents(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    return (
        <div className="card-saphir p-8 bg-[#13131f] border-white/5 rounded-2xl flex flex-col h-full border-l-4 border-l-purple-500/50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-black text-white text-lg uppercase tracking-tight">Assignation des Agents</h3>
                    <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Select_Active_Nodes.sh</p>
                </div>
                <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[9px] font-black text-purple-400 uppercase">
                    {selectedAgents.length} Agents Actifs
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {AGENTS_LIST.map((agent) => {
                    const isSelected = selectedAgents.includes(agent.id);
                    return (
                        <motion.button
                            key={agent.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleAgent(agent.id)}
                            className={`p-4 rounded-xl border transition-all text-left relative group ${isSelected
                                    ? "bg-purple-500/20 border-purple-500/50"
                                    : "bg-black/20 border-white/5 hover:border-white/20"
                                }`}
                        >
                            <div className={`mb-3 ${isSelected ? "text-purple-400" : "text-gray-600 opacity-50"} transition-all group-hover:scale-110`}>
                                {agent.icon}
                            </div>
                            <h4 className={`text-xs font-black uppercase tracking-wider mb-1 ${isSelected ? "text-white" : "text-gray-500"}`}>
                                {agent.name}
                            </h4>
                            <p className="text-[8px] font-mono text-gray-600 leading-none truncate">
                                {agent.desc}
                            </p>

                            {isSelected && (
                                <motion.div
                                    layoutId={`agent-glow-${agent.id}`}
                                    className="absolute inset-0 ring-1 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <button
                    className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.3em] transition-all ${selectedAgents.length > 0
                            ? "bg-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:bg-purple-500"
                            : "bg-white/5 text-gray-600 cursor-not-allowed"
                        }`}
                    disabled={selectedAgents.length === 0}
                >
                    INITIALISER LA COHÉRENCE
                </button>
            </div>
        </div>
    );
};
