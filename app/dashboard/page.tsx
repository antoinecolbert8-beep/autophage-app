"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
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
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import BlurFade from "@/components/ui/blur-fade";

// Remplacement des imports stricts Recharts par un Wrapper Dynamique (Bypass SSR bug 'reading S')
const DashboardChart = dynamic(() => import('@/components/DashboardChart'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-xs text-cyan-500/50 animate-pulse">Initialisation Data...</div>
});

const SovereigntyGauge = dynamic(() => import('@/components/SovereigntyGauge').then(m => m.SovereigntyGauge), {
  ssr: false,
  loading: () => <div className="w-[180px] h-[180px] rounded-full border border-cyan-500/20 animate-spin" />
});

import { ImperialPulse } from "@/components/ImperialPulse";
import { getSovereigntyStats } from "@/actions/sovereignty-actions";
import {
  MeshGradient,
  Particles3D,
  MagneticCursor,
  GrainTexture,
  NeuralWeb,
  CyberGlitch,
  Vortex3D,
  OmniSphere,
  HolographicInterface,
  GlitchText
} from "@/components/AdvancedVisuals";
import { CognitiveThought } from "@/components/CognitiveThought";

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
  const { data: session } = useSession();
  const [userName, setUserName] = useState("Utilisateur");
  const [userTier, setUserTier] = useState("standard");
  const [loadingTime, setLoadingTime] = useState(0.8); // Friction (s)
  const [sovereignty, setSovereignty] = useState<{ score: number, title: string, nextMilestone: number } | null>(null);
  const [billingData, setBillingData] = useState<any>(null);

  // Computed Metrics
  const retentionRate = 92; // %

  const isHealthy = retentionRate >= 85;

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || "Abonné");
      setUserTier((session.user as any).role === 'admin' ? 'grand_horloger' : 'standard');
    }

    const fetchData = async () => {
      const [stats, billing] = await Promise.all([
        getSovereigntyStats(),
        fetch('/api/billing').then(res => res.json())
      ]);

      if (stats) setSovereignty(stats);
      if (billing && !billing.error) setBillingData(billing);
    };

    fetchData();

    // Self-Healing Simulation
    const interval = setInterval(() => {
      setLoadingTime(prev => Math.max(0.05, prev - 0.02)); // Visual feedback of optimization
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const stats = [
    { title: "Indice Friction", value: `${loadingTime?.toFixed(2) || '0.00'}s`, change: "-0.7s", icon: LineIconZap, color: "text-green-400" },
    { title: "Crédits Souverains", value: billingData?.credits?.balance?.toLocaleString() || "0", change: "LIVE", icon: LineIconUsers, color: "text-purple-400" },
    { title: "Sécurité Flux", value: "100%", change: "MAX", icon: LineIconShield, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] overflow-hidden relative font-sans">
      <MeshGradient />
      <Particles3D />
      <GrainTexture />
      <NeuralWeb />
      <Vortex3D />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <OmniSphere />
      </div>
      <MagneticCursor />
      <NeuroSchema />
      {/* Top Header - Restored */}
      <BlurFade yOffset={-20} className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#0b0c10]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-4 text-gray-400 w-1/2 md:w-1/3 group">
          <LineIconSearch size={18} className="group-hover:text-white transition-colors" />
          <input
            type="text"
            placeholder="Command /"
            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 font-medium focus:ring-0 text-sm hidden md:block"
          />
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="relative text-gray-500 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <LineIconBell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></span>
          </button>
          <div className="flex items-center gap-3 border-l border-white/5 pl-4 md:pl-6">
            <div className="w-9 h-9 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-[10px] font-black shadow-inner">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-white tracking-tight leading-tight">{userName}</p>
              <p className={`text-[9px] uppercase tracking-widest font-black ${userTier === 'grand_horloger' ? 'text-white' : 'text-gray-500'}`}>
                {userTier === 'grand_horloger' ? 'Architect' : 'User'}
              </p>
            </div>
            <LineIconChevronDown size={14} className="text-gray-600 hidden md:block" />
          </div>
        </div>
      </BlurFade>

      <div className="p-8 max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <CyberGlitch>
            <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">
              <GlitchText text="Système de Commande" />
            </h1>
          </CyberGlitch>
          <p className="text-[#66fcf1] text-[10px] font-mono tracking-[0.4em] uppercase opacity-70">
            {userTier === 'grand_horloger'
              ? `Status: SYSTÈM SYNC. Réseau neuronal opérationnel à 100%.`
              : `Environnement sécurisé. Prêt pour l'exécution.`}
          </p>
        </div>

        <div className="mb-8">
          <CognitiveThought />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Sovereignty Gauge Card - Cadran Principal */}
          <BlurFade delay={0.1} className="sm:col-span-2 lg:col-span-1">
            <div className="card-saphir flex flex-col items-center justify-center h-full group min-h-[220px]">
              <SovereigntyGauge
                score={sovereignty?.score || 0}
                title={sovereignty?.title || "Evaluating..."}
                nextMilestone={sovereignty?.nextMilestone || 100}
              />
              <div className="mt-4 opacity-50 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] text-gray-500 font-mono text-center">
                MOUVEMENT CALIBRE ELA-v10.4<br />PRECISION 0.01s /// AUTO-SYNCHRO
              </div>
            </div>
          </BlurFade>

          {stats && stats.map((stat, i) => (
            <BlurFade key={i} delay={0.1 + (i * 0.1)} duration={0.8} className="group">
              <div className="card-saphir h-full flex flex-col justify-between min-h-[160px]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-[10px] md:text-[9px] font-bold uppercase tracking-widest mb-2">{stat?.title || 'Metric'}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight stat-value">{stat?.value || '0'}</h3>
                  </div>
                  <div className={`p-2.5 rounded-xl border border-white/5 bg-white/5 ${stat.color} group-hover:bg-white/10 transition-all duration-500`}>
                    {stat.icon && <stat.icon size={18} />}
                  </div>
                </div>

                {/* Progressive Disclosure: Hidden info revealed on hover */}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-mono text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-md border border-white/5">
                      ▲ {stat.change}
                    </span>
                    <span className="text-gray-600 text-[9px] uppercase font-bold tracking-widest hidden md:inline">Live</span>
                  </div>

                  <div className="h-0 md:group-hover:h-8 overflow-hidden transition-all duration-500 opacity-0 md:group-hover:opacity-100 hidden md:block">
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                      Traitement mécanique souverain en cours...
                    </p>
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        {userTier === 'grand_horloger' && (
          <BlurFade delay={0.4} className="mb-0 group">
            <div className="card-saphir border-t-0 rounded-t-none bg-gradient-to-b from-[#1f2833]/20 to-transparent p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-900/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-900/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-900/50"></div>
                  </div>
                  <span className="ml-2 text-[10px] uppercase font-bold tracking-[0.3em] text-gray-600">Mouvement Calibre.Omni /// SYNC</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#66fcf1] animate-pulse"></span>
                  <span className="text-[10px] font-mono text-[#66fcf1]">LOCKED</span>
                </div>
              </div>
              <div className="p-4 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                <OmniscienceTerminal />
              </div>
            </div>
          </BlurFade>
        )}

        {/* 3. CALCUL D'IMPACT & RECHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <BlurFade delay={0.5} className="lg:col-span-2">
            <div className="card-saphir h-full relative overflow-hidden group">
              <div className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${!isHealthy ? 'bg-amber-500/[0.02]' : 'bg-transparent'}`}></div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-lg text-white tracking-tight">Indice de Souveraineté</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Corrélation Rétention / Friction /// MECANIQUE</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#66fcf1]" /> Score</span>
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-700" /> Rétention</span>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <DashboardChart data={mockChartData} />
              </div>

              <div className="absolute bottom-4 right-6 text-[8px] text-gray-700 font-bold tracking-[0.4em] uppercase">
                Calibre ELA Precision Engine
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.6} className="space-y-6">
            <div className="card-saphir border-[#66fcf1]/10 bg-gradient-to-br from-[#0a0f12] to-[#0d141b]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#66fcf1] flex items-center gap-2">
                  <LineIconShield size={14} /> Missions Actives
                </h3>
                <span className="text-[9px] font-mono text-[#66fcf1] border border-[#66fcf1]/30 bg-[#66fcf1]/10 px-2 py-0.5 rounded uppercase">Quotidiennes</span>
              </div>

              <div className="space-y-3">
                {/* Quest 1 */}
                <div className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#66fcf1]/30 hover:bg-[#66fcf1]/5 transition-all group relative overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(102,252,241,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#66fcf1]/10 text-[#66fcf1] flex flex-shrink-0 items-center justify-center shadow-[0_0_10px_rgba(102,252,241,0.2)]">
                      <LineIconZap size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-white group-hover:text-[#66fcf1] transition-colors leading-tight">Campagne d'Acquisition</p>
                      <p className="text-[10px] text-gray-500 font-medium tracking-wide mt-1">Générer 10 nouveaux signaux qualifiés sur LinkedIn.</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] font-mono text-fuchsia-400 font-bold bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20">+150 XP</span>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">+5 AQCI</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quest 2 */}
                <div className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group relative overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(168,85,247,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex flex-shrink-0 items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                      <LineIconUsers size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors leading-tight">Effort de Coalition</p>
                        <span className="text-[9px] font-mono text-purple-400 uppercase">Guilde</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium tracking-wide mt-1">Atteindre un revenu collectif de 5,000€ ce mois-ci.</p>
                      <div className="w-full bg-black/50 h-1.5 rounded-full mt-3 overflow-hidden border border-white/5">
                        <div className="bg-purple-500 h-full w-[65%]" />
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-mono text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">Trésor Légendaire</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-saphir bg-transparent border-white/5">
              <RealTimeActivityFeed />
            </div>
          </BlurFade>
        </div>
      </div>
      <ImperialPulse />
    </div>
  );
}
