"use client";

import { useState } from "react";
import { Zap, Bot, BarChart3, Users, Globe, Play, Activity, Lock, Cpu, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function AgentsPage() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  // List of Sovereign Agents
  const agents = [
    { id: "atlas", icon: Globe, name: "Atlas", role: "Market Intelligence", status: "ONLINE", color: "blue" },
    { id: "nexus", icon: BrainCircuit, name: "Nexus", role: "Strategist Engine", status: "ONLINE", color: "purple" },
    { id: "pulse", icon: Activity, name: "Pulse", role: "Trend Forecaster", status: "ONLINE", color: "green" },
    { id: "vox", icon: Bot, name: "Vox", role: "Communication Core", status: "ONLINE", color: "pink" },
    { id: "hive", icon: Users, name: "Hive", role: "Social Swarm", status: "STANDBY", color: "amber" },
    { id: "apex", icon: Zap, name: "Apex", role: "Performance Max", status: "ONLINE", color: "red" },
  ];

  const testAgent = async (agentName: string) => {
    setActiveAgent(agentName);
    setTesting(true);
    setTestResult(null);

    try {
      // We use the chat API we created earlier to test the connection (OpenAI Key validation)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `ACCESS_REQUEST: Agent ${agentName}, confirm status.
              To start usage session, please generate a unique 'Identity Hash' (a random hex string) and a short, single-sentence poem about your function as a ${agentName}.
              Format: [STATUS: ONLINE] [HASH: XXXXX] "Poem"`
          }]
        })
      });

      const data = await res.json();

      if (res.ok) {
        setTestResult(data.content || "Connexion établie. Clés API valides.");
      } else {
        setTestResult("Erreur: Impossible de joindre le noyau IA (Vérifiez votre clé OpenAI).");
      }
    } catch (err) {
      setTestResult("Erreur critique de réseau.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Cpu size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Escouade Autonome</h1>
            </div>
            <p className="text-gray-400">Gérez votre flotte d'Agents "God Mode". Testez leur réactivité.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-bold animate-pulse">
              <Activity size={16} /> SYSTÈME OPÉRATIONNEL
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="group relative bg-[#13131f] border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-blue-900/10 overflow-hidden">
              <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity text-${agent.color}-500`}>
                <agent.icon size={80} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${agent.color}-600/20 to-black border border-${agent.color}-500/30 flex items-center justify-center mb-4`}>
                  <agent.icon size={24} className={`text-${agent.color}-400`} />
                </div>

                <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
                <p className="text-sm text-gray-400 mb-6">{agent.role}</p>

                <div className="flex items-center justify-between mt-auto">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded bg-${agent.color}-500/10 text-${agent.color}-400 border border-${agent.color}-500/20`}>
                    {agent.status}
                  </span>

                  <button
                    onClick={() => testAgent(agent.name)}
                    className="flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors border border-white/5 hover:border-white/20"
                  >
                    <Play size={12} fill="currentColor" /> TESTER
                  </button>
                </div>
              </div>

              {/* Console Output for Testing */}
              {activeAgent === agent.name && (
                <div className="absolute inset-0 bg-black/95 flex flex-col p-6 z-20 animate-in fade-in slide-in-from-bottom-4 duration-200">
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-blue-400">TEST_SEQUENCE_INIT /// {agent.name.toUpperCase()}</span>
                    <button onClick={() => setActiveAgent(null)} className="text-gray-500 hover:text-white"><Bot size={16} /></button>
                  </div>
                  <div className="font-mono text-xs text-green-400 overflow-y-auto flex-1 space-y-2">
                    <p>{`> Initializing handshake with Core...`}</p>
                    <p>{`> Verifying API Keys...`}</p>
                    {testing && <p className="animate-pulse">{`> Waiting for ${agent.name} response...`}</p>}
                    {!testing && testResult && (
                      <>
                        <p>{`> Response received:`}</p>
                        <p className="text-white pl-4 border-l border-green-500/50 mt-2">{testResult}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Global Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#13131f] rounded-2xl p-6 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Globe size={24} /></div>
            <div>
              <p className="text-gray-400 text-sm">Requêtes API (24h)</p>
              <p className="text-2xl font-bold">14,203</p>
            </div>
          </div>
          <div className="bg-[#13131f] rounded-2xl p-6 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Zap size={24} /></div>
            <div>
              <p className="text-gray-400 text-sm">Temps de Réponse</p>
              <p className="text-2xl font-bold">45ms</p>
            </div>
          </div>
          <div className="bg-[#13131f] rounded-2xl p-6 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><Lock size={24} /></div>
            <div>
              <p className="text-gray-400 text-sm">Sécurité</p>
              <p className="text-2xl font-bold">100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
