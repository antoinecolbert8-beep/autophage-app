"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LineIconZap,
  LineIconShield,
  LineIconBarChart,
  LineIconBell,
  LineIconSearch,
  LineIconChevronDown,
  LineIconUsers
} from "@/components/AppIcons";
import { OmniscienceTerminal } from "@/components/omniscience-terminal";
import { RealTimeActivityFeed } from "@/components/RealTimeActivityFeed";
import dynamic from 'next/dynamic';
import BlurFade from "@/components/ui/blur-fade";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SovereigntyGauge } from "@/components/SovereigntyGauge";
import { ImperialPulse } from "@/components/ImperialPulse";
import { getSovereigntyStats } from "@/actions/sovereignty-actions";
import { MeshGradient, Particles3D, MagneticCursor } from "@/components/AdvancedVisuals";

// Dynamic import to avoid SSR issues with Three.js Canvas
const NeuroSchema = dynamic(() => import("@/components/NeuroSchema"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#0a0a0f] opacity-50" />
});

// --- FINANCIAL SOVEREIGNTY LOGIC ---
const calculateSovereigntyScore = (cRate: number, impact: number, retention: number, friction: number) => {
  // S_score = (C_rate * Impact) + (Retention * (1 / Friction))
  // Friction is load time in seconds. Avoid div by zero.
  const safeFriction = Math.max(friction, 0.1);
  const score = (cRate * impact) + (retention * (1 / safeFriction));
  return Math.min(Math.round(score * 10) / 10, 100); // Normalize to 0-100ish
};

const mockChartData = [
  { name: 'Lun', score: 65, retention: 82 },
  { name: 'Mar', score: 68, retention: 84 },
  { name: 'Mer', score: 75, retention: 88 },
  { name: 'Jeu', score: 72, retention: 86 },
  { name: 'Ven', score: 85, retention: 92 },
  { name: 'Sam', score: 82, retention: 90 },
  { name: 'Dim', score: 89, retention: 94 },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState("Utilisateur");
  const [userTier, setUserTier] = useState("standard");
  const [loadingTime, setLoadingTime] = useState(0.8); // Friction (s)
  const [sovereignty, setSovereignty] = useState<{ score: number, title: string, nextMilestone: number } | null>(null);

  // Computed Metrics
  const conversionRate = 3.4; // %
  const impactScore = 8.5; // Arbitrary impact factor
  const retentionRate = 92; // %

  const isHealthy = retentionRate >= 85;

  useEffect(() => {
    const checkUser = async () => {
      const storedTier = typeof window !== 'undefined' ? localStorage.getItem('ela_tier') : null;
      const storedName = typeof window !== 'undefined' ? localStorage.getItem('ela_user_name') : "Alexandre";
      setUserName(storedName || "Alexandre");
      setUserTier(storedTier || "standard");

      const stats = await getSovereigntyStats();
      if (stats) setSovereignty(stats);
    };
    checkUser();

    // Self-Healing Simulation (Friction fluctuation)
    const interval = setInterval(() => {
      setLoadingTime(prev => Math.max(0.2, prev + (Math.random() - 0.5) * 0.1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: "Indice Friction", value: `${loadingTime.toFixed(2)}s`, change: "-0.3s", icon: LineIconZap, color: "text-green-400" },
    { title: "Rétention Client", value: `${retentionRate}%`, change: "+2.1%", icon: LineIconUsers, color: "text-purple-400" },
    { title: "Sécurité", value: "100%", change: "Optimale", icon: LineIconShield, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative font-sans">
      <MeshGradient />
      <Particles3D />
      <MagneticCursor />
      {/* 2. CORTEX VISUEL: NEUROSCHEMA BACKGROUND */}
      <NeuroSchema />

      {/* Top Header */}
      <BlurFade yOffset={-20} className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4 text-gray-400 w-1/3">
          <LineIconSearch size={18} />
          <input
            type="text"
            placeholder="Interroger le système..." // Updated copy
            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 font-light focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <LineIconBell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 ring-2 ring-white/10"></div>
            <div className="text-sm">
              <p className="font-semibold text-white">{userName}</p>
              <p className={`text-xs ${userTier === 'grand_horloger' ? 'text-pink-500 font-bold animate-pulse' : 'text-gray-500'}`}>
                {userTier === 'grand_horloger' ? 'GOD MODE /// ARCHITECT' : 'Admin'}
              </p>
            </div>
            <LineIconChevronDown size={14} className="text-gray-500" />
          </div>
        </div>
      </BlurFade>

      <div className="p-8 max-w-7xl mx-auto relative z-10">
        <BlurFade delay={0.1} className="mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Tableau de bord</h1>
          <p className="text-gray-400">
            {userTier === 'grand_horloger'
              ? `Bienvenue, Architecte ${userName}. Le réseau neuronal est synchronisé.`
              : `Bienvenue sur votre centre de commandement, ${userName}.`}
          </p>
        </BlurFade>

        {/* 1. PIXEL PERFECT: ALIGNMENT & FADE-IN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sovereignty Gauge Card */}
          <BlurFade delay={0.1} className="lg:col-span-1 md:col-span-1">
            <div className="bg-[#13131f]/90 backdrop-blur-xl rounded-2xl p-6 h-full border border-white/5 flex flex-col items-center justify-center">
              <SovereigntyGauge
                score={sovereignty?.score || 0}
                title={sovereignty?.title || "Evaluating..."}
                nextMilestone={sovereignty?.nextMilestone || 100}
              />
            </div>
          </BlurFade>

          {stats.map((stat, i) => (
            <BlurFade key={i} delay={0.1 + (i * 0.1)} duration={0.8} className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-500">
              <div className="bg-[#13131f]/90 backdrop-blur-xl rounded-2xl p-6 h-full border border-white/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider text-[10px]">{stat.title}</p>
                    <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/10' : stat.color === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/10' : stat.color === 'text-green-400' ? 'from-green-500/20 to-green-600/10' : 'from-emerald-500/20 to-emerald-600/10'} ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon size={22} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400 font-bold bg-green-400/10 px-2.5 py-1 rounded-sm flex items-center gap-1 text-xs">
                    <span className="text-[10px]">▲</span>{stat.change}
                  </span>
                  <span className="text-gray-600 text-xs">vs cycle préc.</span>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        {userTier === 'grand_horloger' && (
          <BlurFade delay={0.4} className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-pink-500/50 via-purple-600/50 to-pink-500/50 animate-gradient-xy">
            <div className="bg-black rounded-[14px] overflow-hidden font-mono text-xs border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="ml-2 text-gray-400">NEURO_LINK.EXE /// ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-green-500">SYNCED</span>
                </div>
              </div>
              <OmniscienceTerminal />
            </div>
          </BlurFade>
        )}

        {/* 3. CALCUL D'IMPACT & RECHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <BlurFade delay={0.5} className="lg:col-span-2 bg-[#13131f]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative">
            <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-colors duration-1000 ${!isHealthy ? 'bg-amber-500/5' : 'bg-transparent'}`}></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="font-bold text-lg">Indice de Souveraineté</h3>
                <p className="text-xs text-gray-500">Corrélation Rétention / Friction</p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Seuil Critique', fill: '#ef4444', fontSize: 10 }} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </BlurFade>

          <BlurFade delay={0.6} className="bg-[#13131f]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6">Commandes Rapides</h3>
            <div className="space-y-4">
              <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LineIconZap size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Lancer une campagne</p>
                  <p className="text-xs text-gray-500">Email & Réseaux Sociaux</p>
                </div>
              </button>

              <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LineIconUsers size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Ajouter un prospect</p>
                  <p className="text-xs text-gray-500">Enrichissement auto</p>
                </div>
              </button>

              <button className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LineIconBarChart size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Générer un rapport</p>
                  <p className="text-xs text-gray-500">PDF & Excel</p>
                </div>
              </button>
            </div>

            <div className="mt-8 border-t border-white/5 pt-8">
              <RealTimeActivityFeed />
            </div>
          </BlurFade>
        </div>
      </div>
      <ImperialPulse />
    </div>
  );
}
