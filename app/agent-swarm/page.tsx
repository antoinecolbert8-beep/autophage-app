"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconUsers,
  LineIconGlobe
} from "@/components/AppIcons";

import { CampaignSelector } from "@/components/CampaignSelector";
import { AgentAssignment } from "@/components/AgentAssignment";

export default function AgentSwarmPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl relative z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <LineIconChevronLeft size={20} className="text-gray-400 group-hover:text-white" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold uppercase tracking-widest">Agent Swarm Intelligence</h1>
            <span className="text-[10px] font-mono text-purple-500 tracking-[0.3em]">CORTEX_OS_V2.4</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-hidden items-stretch">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* Moteur de Campagne Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CampaignSelector onTypeChange={(t) => console.log("Campaign Type Changed:", t)} />
            <div className="card-saphir p-8 flex flex-col justify-center border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-all">
                  <LineIconUsers size={24} className="text-purple-400" />
                </div>
                <div className="stat-value text-3xl font-black">1.24K</div>
              </div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-[0.2em]">Cibles Qualifiées en Attente</p>
              <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: ["10%", "85%", "40%", "95%"] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
                />
              </div>
            </div>
          </div>

          {/* Neural Network Map */}
          <div className="flex-1 bg-[#13131f] border border-white/5 rounded-2xl relative overflow-hidden p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <LineIconGlobe size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Swarm Status: ONLINE</h2>
                    <p className="text-purple-400 font-mono text-sm leading-none pt-1">Active Agents: 14</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <div className="relative transition-transform duration-1000 scale-110 lg:scale-125">
                  {/* Central Hub */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: 360 }}
                    transition={{ scale: { repeat: Infinity, duration: 4 }, rotate: { repeat: Infinity, duration: 40, ease: "linear" } }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-purple-500/20 rounded-full"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(147,51,234,0.6)] z-20 border-2 border-white/10">
                    <span className="font-black text-xs uppercase tracking-tighter">CORTEX</span>
                  </div>

                  {/* Orbiting Agents */}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 10 + i * 2, ease: "linear" }}
                      className="absolute top-1/2 left-1/2 w-[320px] pointer-events-none"
                    >
                      <div
                        className="w-10 h-10 bg-[#0a0a0f] border border-purple-500/40 rounded-full flex items-center justify-center pointer-events-auto hover:scale-125 hover:border-white transition-all cursor-crosshair shadow-[0_0_15px_rgba(147,51,234,0.2)]"
                        style={{ marginLeft: '100%' }}
                      >
                        <span className="text-[8px] font-black text-purple-400">AG-{i + 1}</span>
                      </div>
                    </motion.div>
                  ))}

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] border border-purple-500/5 rounded-full pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Assignment */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8 h-full min-h-[600px]">
          <AgentAssignment />
          <div className="card-saphir p-6 flex flex-col bg-[#0a0a0f] h-[240px]">
            <h3 className="font-bold mb-4 text-purple-400 text-xs uppercase tracking-widest">Flux de Conscience</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar font-mono text-[9px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-1">
                  <div className="flex justify-between items-center opacity-40">
                    <span>14:02:{10 + i}</span>
                    <span>AGENT_REACTION</span>
                  </div>
                  <p className="text-gray-300"><span className="text-purple-400 font-bold">[AG-{i}]</span> Analyse transmise.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
