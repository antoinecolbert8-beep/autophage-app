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
      <MagneticCursor />
      {/* 2. CORTEX VISUEL: NEUROSCHEMA BACKGROUND */}
      <NeuroSchema />

      {/* Top Header */}
      <BlurFade yOffset={-20} className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0b0c10]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-4 text-gray-400 w-1/3 group">
          <LineIconSearch size={18} className="group-hover:text-[#66fcf1] transition-colors" />
          <input
            type="text"
            placeholder="Interroger l'Omniscience..."
            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 font-light focus:ring-0 text-sm"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-500 hover:text-[#66fcf1] transition-colors btn-haptic">
            <LineIconBell size={20} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#66fcf1] rounded-full animate-pulse shadow-[0_0_8px_#66fcf1]"></span>
          </button>
          <div className="flex items-center gap-3 border-l border-white/5 pl-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1f2833] to-[#0b0c10] border border-white/10 flex items-center justify-center text-[10px] font-black shadow-inner">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white tracking-tight leading-tight">{userName}</p>
              <p className={`text-[8px] uppercase tracking-[0.2em] font-black ${userTier === 'grand_horloger' ? 'text-[#66fcf1]' : 'text-gray-600'}`}>
                {userTier === 'grand_horloger' ? 'Horloger Suprême' : 'Abonné'}
              </p>
            </div>
            <LineIconChevronDown size={14} className="text-gray-600" />
          </div>
        </div>
      </BlurFade>

      <div className="p-8 max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase italic">Hyper-Flux Command</h1>
          <p className="text-gray-500 text-sm">
            {userTier === 'grand_horloger'
              ? `Status: OMNISCIENCE ACTIVE. Réseau neuronal synchronisé à 100%.`
              : `Système sécurisé. Prêt pour le déploiement de masse.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sovereignty Gauge Card - Cadran Principal */}
          <BlurFade delay={0.1} className="lg:col-span-1 md:col-span-1">
            <div className="card-saphir flex flex-col items-center justify-center h-full group">
              <SovereigntyGauge
                score={sovereignty?.score || 0}
                title={sovereignty?.title || "Evaluating..."}
                nextMilestone={sovereignty?.nextMilestone || 100}
              />
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] text-gray-600 font-mono text-center">
                MOUVEMENT CALIBRE ELA-v10.4<br />PRECISION 0.01s /// AUTO-SYNCHRO
              </div>
            </div>
          </BlurFade>

          {stats && stats.map((stat, i) => (
            <BlurFade key={i} delay={0.1 + (i * 0.1)} duration={0.8} className="group">
              <div className="card-saphir h-full flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{stat?.title || 'Metric'}</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter stat-value">{stat?.value || '0'}</h3>
                  </div>
                  <div className={`p-2.5 rounded-lg border border-white/5 bg-white/5 ${stat.color} group-hover:border-[#66fcf1]/30 transition-all duration-500`}>
                    {stat.icon && <stat.icon size={18} />}
                  </div>
                </div>

                {/* Progressive Disclosure: Hidden info revealed on hover */}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#66fcf1] font-mono text-[10px] font-black bg-[#66fcf1]/5 px-2 py-0.5 rounded border border-[#66fcf1]/10">
                      ▲ {stat.change}
                    </span>
                    <span className="text-gray-700 text-[9px] uppercase font-bold tracking-widest">Temps Réel</span>
                  </div>

                  <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <p className="text-[9px] text-gray-500 font-light leading-relaxed">
                      Données traitées par le moteur souverain. Optimisation mécanique en cours...
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
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#66fcf1" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#66fcf1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#1f2833"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#45a29e' }}
                    />
                    <YAxis
                      stroke="#1f2833"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      tick={{ fill: '#45a29e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2833',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '10px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ stroke: '#66fcf1', strokeWidth: 1 }}
                    />
                    <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.3} label={{ position: 'right', value: 'CRITIQUE', fill: '#ef4444', fontSize: 8, fontWeight: 'bold', tracking: '0.2em' }} />
                    <Area type="monotone" dataKey="score" stroke="#66fcf1" strokeWidth={1} fillOpacity={1} fill="url(#colorScore)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="absolute bottom-4 right-6 text-[8px] text-gray-700 font-bold tracking-[0.4em] uppercase">
                Calibre ELA Precision Engine
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.6} className="space-y-6">
            <div className="card-saphir">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#66fcf1] mb-6">Commandes Rapides</h3>
              <div className="space-y-3">
                <button className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-[#66fcf1]/30 transition-all text-left flex items-center gap-4 group btn-haptic">
                  <div className="w-9 h-9 rounded-lg bg-[#66fcf1]/5 text-[#66fcf1] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LineIconZap size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Lancer une campagne</p>
                    <p className="text-[9px] text-gray-600 uppercase font-bold tracking-wider">Email & Réseaux Sociaux</p>
                  </div>
                </button>

                <button className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-[#66fcf1]/30 transition-all text-left flex items-center gap-4 group btn-haptic">
                  <div className="w-9 h-9 rounded-lg bg-[#45a29e]/10 text-[#45a29e] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LineIconUsers size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Ajouter un prospect</p>
                    <p className="text-[9px] text-gray-600 uppercase font-bold tracking-wider">Enrichissement auto</p>
                  </div>
                </button>

                <Link
                  href="/dashboard/integrations"
                  className="w-full p-3 rounded-xl bg-[#66fcf1]/5 border border-[#66fcf1]/10 hover:border-[#66fcf1]/50 transition-all text-left flex items-center gap-4 group btn-haptic"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#66fcf1]/20 text-[#66fcf1] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(102,252,241,0.2)]">
                    <LineIconZap size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#66fcf1]">Centre d'Intégrations</p>
                    <p className="text-[9px] text-gray-600 uppercase font-bold tracking-wider italic">Vérifié par Horloger</p>
                  </div>
                </Link>
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
