"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconUsers,
  LineIconGlobe
} from "@/components/AppIcons";

export default function AgentSwarmPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Agent Swarm Intelligence</h1>
        </div>
      </div>

      <div className="p-8 max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main View: Neural Network Map */}
          <div className="lg:col-span-3 bg-[#13131f] border border-white/5 rounded-2xl relative overflow-hidden min-h-[600px] p-8">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <LineIconGlobe size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Swarm Status: ONLINE</h2>
                    <p className="text-purple-400 font-mono text-sm">Active Agents: 14</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-96 h-96">
                  {/* Central Hub */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.5)] z-20">
                    <span className="font-bold text-xs">CORTEX</span>
                  </div>

                  {/* Orbiting Agents */}
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`absolute top-1/2 left-1/2 w-12 h-12 bg-[#2a2a35] border border-purple-500/50 rounded-full flex items-center justify-center z-10 animate-pulse`}
                      style={{
                        transform: `translate(-50%, -50%) rotate(${i * 90}deg) translate(140px) rotate(-${i * 90}deg)`
                      }}>
                      <span className="text-xs">AG-{i + 1}</span>
                    </div>
                  ))}

                  {/* Connection Lines (Simulated with absolute divs for simplicity) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-purple-500/20 rounded-full pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Consciousness Flow */}
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6 flex flex-col">
            <h3 className="font-bold mb-4 text-purple-400">Flux de Conscience</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-3 bg-[#0a0a0f] border border-white/5 rounded-lg text-xs">
                  <p className="text-gray-500 mb-1 font-mono">14:02:{10 + i}</p>
                  <p className="text-gray-300"><span className="text-purple-400 font-bold">[AG-{i}]</span> Analyse de marché terminée pour le secteur retail.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
