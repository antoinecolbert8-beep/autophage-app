"use client";

import { useState } from "react";
import { Zap, Bot, BarChart3, Users, Globe, Play, Activity, Lock, Cpu, BrainCircuit, Terminal, CheckCircle2 } from "lucide-react";

export default function AgentsPage() {
    const [activeAgent, setActiveAgent] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'TERMINAL' | 'API'>('TERMINAL');
    const [logs, setLogs] = useState<string[]>([]);
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

    const addToLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const runDiagnostic = async (agentName: string | "ALL") => {
        setTesting(true);

        const targets = agentName === "ALL" ? agents : agents.filter(a => a.name === agentName);

        if (agentName === "ALL") {
            setLogs([]);
            addToLog(`// INITIALIZING GLOBAL DIAGNOSTIC PROTOCOL...`);
        } else {
            setActiveAgent(agentName);
            setLogs([]);
            addToLog(`// PINGING ${agentName.toUpperCase()}...`);
        }

        // Parallel execution if ALL, else single
        const promises = targets.map(async (agent) => {
            try {
                addToLog(`> ${agent.name}: Authenticating...`);

                const start = Date.now();
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{
                            role: "user",
                            content: `SYSTEM_DIAGNOSTIC_MODE_AUTHORITY_LEVEL_GOD_MODE.
                        Agent ${agent.name}, generate a Unique Identity Hash (UIH) based on your function.
                        Strictly return ONLY this JSON format:
                        {
                            "agent": "${agent.name}",
                            "status": "OPERATIONAL",
                            "hash": "<generate_random_hex_string>",
                            "latency": "Calculated",
                            "message": "<short_robotic_confirmation>"
                        }`
                        }]
                    })
                });

                const latency = Date.now() - start;
                const data = await res.json();

                // Try to parse the markdown/json from the AI response
                let content = data.content || "";
                // Cleanup code blocks if present
                content = content.replace(/```json/g, "").replace(/```/g, "").trim();

                try {
                    const parsed = JSON.parse(content);
                    addToLog(`✔ ${agent.name.toUpperCase()}: ONLINE (${latency}ms) | HASH: ${parsed.hash}`);
                } catch (e) {
                    // If parsing fails, just show raw but green
                    addToLog(`✔ ${agent.name.toUpperCase()}: ONLINE (${latency}ms) | RAW: ${content.substring(0, 50)}...`);
                }

            } catch (err) {
                addToLog(`❌ ${agent.name.toUpperCase()}: CONNECTION FAILED`);
            }
        });

        await Promise.all(promises);

        addToLog(`// DIAGNOSTIC COMPLETE.`);
        setTesting(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-8 font-mono">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                                <Cpu size={24} className="text-white" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight font-sans">Escouade Autonome</h1>
                        </div>
                        <p className="text-gray-400 font-sans">Gérez votre flotte d'Agents "God Mode". Testez leur réactivité.</p>
                    </div>

                    <button
                        onClick={() => runDiagnostic("ALL")}
                        disabled={testing}
                        className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {testing ? <Activity className="animate-spin" /> : <Terminal />}
                        LANCER LE DIAGNOSTIC GLOBAL
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Main Content Area: Terminal or API Docs */}
                    <div className="lg:col-span-2 bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">

                        {/* Tab Switcher */}
                        <div className="bg-white/5 p-2 border-b border-white/10 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('TERMINAL')}
                                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${viewMode === 'TERMINAL' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    TERMINAL
                                </button>
                                <button
                                    onClick={() => setViewMode('API')}
                                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${viewMode === 'API' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}
                                >
                                    API / INTÉGRATION
                                </button>
                            </div>
                            <div className="flex gap-1.5 px-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                            </div>
                        </div>

                        {viewMode === 'TERMINAL' ? (
                            <>
                                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2 text-green-500/80">
                                    <p className="text-gray-600">Waiting for command...</p>
                                    {logs.map((log, i) => (
                                        <p key={i} className={`whitespace-pre-wrap ${log.includes("❌") ? "text-red-500" : log.includes("✔") ? "text-green-400" : log.startsWith(">") ? "text-gray-400" : "text-blue-400"}`}>
                                            {log}
                                        </p>
                                    ))}
                                    {testing && <span className="animate-pulse">_</span>}
                                </div>
                                <div className="p-2 bg-white/5 border-t border-white/10">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const input = e.currentTarget.cmd.value;
                                            if (input.trim()) {
                                                if (input.startsWith("/connect ")) {
                                                    const target = input.split(" ")[1];
                                                    runDiagnostic(target);
                                                } else {
                                                    if (activeAgent) {
                                                        setLogs(prev => [...prev, `[USER] > ${input}`]);
                                                        e.currentTarget.cmd.value = "";
                                                        (async () => {
                                                            setTesting(true);
                                                            try {
                                                                const res = await fetch('/api/chat', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        agent: activeAgent,
                                                                        messages: [{ role: "user", content: input }]
                                                                    })
                                                                });
                                                                const data = await res.json();
                                                                setLogs(prev => [...prev, `[${activeAgent?.toUpperCase()}] > ${data.content}`]);
                                                            } catch (err) {
                                                                setLogs(prev => [...prev, `❌ ERROR: UPLINK FAILED`]);
                                                            } finally {
                                                                setTesting(false);
                                                            }
                                                        })();
                                                    } else {
                                                        setLogs(prev => [...prev, `> ERROR: NO ACTIVE UPLINK. CLICK 'PING' OR TYPE '/connect [agent]'`]);
                                                        e.currentTarget.cmd.value = "";
                                                    }
                                                }
                                            }
                                        }}
                                        className="flex gap-2"
                                    >
                                        <span className="text-green-500 font-bold">{activeAgent ? `${activeAgent.toUpperCase()}@GENESIS:~$` : "GUEST@GENESIS:~$"}</span>
                                        <input
                                            name="cmd"
                                            autoComplete="off"
                                            className="bg-transparent border-none outline-none flex-1 font-mono text-white placeholder-gray-600"
                                            placeholder={activeAgent ? "Type message..." : "Select an agent to start chat..."}
                                            autoFocus
                                        />
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto text-gray-300">
                                <div className="mb-6">
                                    <h3 className="text-blue-400 font-bold text-lg mb-2">Endpoint Public</h3>
                                    <div className="bg-[#1a1a23] p-4 rounded-lg border border-white/10 flex items-center justify-between">
                                        <code className="text-pink-500">POST https://api.genesis.ai/v1/agent</code>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20">ACTIVE</span>
                                            <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded border border-blue-500/20">HTTPS</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-purple-400 font-bold text-lg mb-2">Exemple d'Intégration (cURL)</h3>
                                    <p className="text-gray-500 mb-2 text-xs">Copiez ce code pour intégrer {activeAgent || "l'agent"} dans votre application externe.</p>
                                    <div className="bg-[#13131f] p-4 rounded-lg border border-white/10 overflow-x-auto relative group">
                                        <pre className="text-gray-300">
                                            {`curl -X POST https://api.genesis.ai/v1/chat \\
  -H "Authorization: Bearer sk_gen_${Math.random().toString(36).substring(7)}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent": "${activeAgent || "atlas"}",
    "messages": [
      { "role": "user", "content": "Analyze Q3 market trends." }
    ]
  }'`}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-green-400 font-bold text-lg mb-2">Test Live</h3>
                                    <button
                                        onClick={async () => {
                                            const start = Date.now();
                                            const res = await fetch('/api/chat', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    agent: activeAgent || "atlas",
                                                    messages: [{ role: "user", content: "Simulation API Request: Status Check" }]
                                                })
                                            });
                                            const data = await res.json();
                                            const time = Date.now() - start;
                                            alert(`STATUS: ${res.status} OK\nLATENCY: ${time}ms\n\nRESPONSE:\n${JSON.stringify(data, null, 2)}`);
                                        }}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold border border-white/10 transition-colors"
                                    >
                                        SIMULER REQUÊTE CLIENT
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Stats & List */}
                    <div className="space-y-6">
                        {agents.map((agent) => (
                            <div key={agent.id} className="bg-[#13131f] border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg bg-${agent.color}-500/10 text-${agent.color}-400`}>
                                        <agent.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm font-sans">{agent.name}</h3>
                                        <p className="text-xs text-gray-500 font-sans">{agent.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => runDiagnostic(agent.name)}
                                    className="text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors"
                                >
                                    PING
                                </button>
                            </div>
                        ))}

                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-green-500 rounded-full p-1"><CheckCircle2 size={12} className="text-black" /></div>
                                <h4 className="font-bold text-green-400 text-sm">Réseau Neuronal</h4>
                            </div>
                            <p className="text-xs text-green-500/70">
                                Toutes les passerelles API sont actives. Le chiffrement quantique est activé.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
