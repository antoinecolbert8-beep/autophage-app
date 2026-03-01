"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineIconChevronLeft,
  LineIconGlobe,
  LineIconZap,
  LineIconShield,
  LineIconTrendingUp
} from "@/components/AppIcons";
import {
  MeshGradient,
  Particles3D,
  GrainTexture,
  SpotlightEffect,
  GlassCard3D,
  TacticalMap,
  CyberGlitch,
  Scanline,
  GlobalInterference,
  RealityDistortion,
  DataTsunami
} from "@/components/AdvancedVisuals";
import { CognitiveThought } from "@/components/CognitiveThought";

export default function WarRoomPage() {
  const [revenue, setRevenue] = useState(12450);
  const [isDominating, setIsDominating] = useState(false);
  const [pulseEvents, setPulseEvents] = useState<any[]>([]);
  const [logs, setLogs] = useState([
    { id: 1, type: "SYSTEM", msg: "Attaque marketing lancée sur le secteur Retail...", time: "NOMINAL" },
    { id: 2, type: "BOT-142", msg: "500 emails envoyés (Taux ouverture: 82%)", time: "ACTIVE" },
    { id: 3, type: "VOX", msg: "Appel terminé avec CEO (Durée: 4m12s) -> RDV Pris", time: "SUCCESS" },
  ]);

  // Fetch Pulse Data
  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const res = await fetch('/api/v1/pulse');
        const data = await res.json();
        if (data.success && data.pulse) {
          setPulseEvents(data.pulse);

          // Add latest pulse to logs if it's new
          if (data.pulse.length > 0) {
            const latest = data.pulse[0];
            setLogs(prev => {
              if (prev.some(l => l.msg.includes(latest.orgName || latest.title))) return prev;
              return [{
                id: Date.now(),
                type: "PULSE",
                msg: `${latest.title}: ${latest.value} sécurisés par ${latest.orgName || 'un client'}`,
                time: "JUST NOW"
              }, ...prev].slice(0, 10);
            });
          }
        }
      } catch (err) {
        console.error("Pulse fetch failed:", err);
      }
    };

    fetchPulse();
    const interval = setInterval(fetchPulse, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Revenue Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + (isDominating ? Math.floor(Math.random() * 500) : Math.floor(Math.random() * 50)));
    }, isDominating ? 500 : 2000);
    return () => clearInterval(interval);
  }, [isDominating]);

  return (
    <div className="min-h-screen bg-[#050507] text-[#c5c6c7] overflow-hidden relative font-sans">
      <MeshGradient />
      <Particles3D />
      <GrainTexture />
      <SpotlightEffect />
      <Scanline />
      <GlobalInterference active={isDominating} />
      <RealityDistortion active={isDominating} />
      <DataTsunami active={isDominating} />

      {/* --- DOMINANCE OVERLAY --- */}
      <AnimatePresence>
        {isDominating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] pointer-events-none border-[10px] border-red-600 animate-pulse bg-red-600/5 backdrop-invert-[0.05]"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-red-600/10 rotate-[-15deg] select-none tracking-tighter">
              DOMINANCE
            </div>
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-red-600 font-black text-4xl mb-4 tracking-[0.5em] uppercase animate-bounce">singularité active</div>
              <div className="text-white/40 font-mono text-xs uppercase tracking-widest leading-loose text-center">
                Capture de marché en cours...<br />
                Neutralisation de la concurrence...<br />
                Saturation sémantique globale : 94%<br />
                ROI Estimé : +1,240%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HUD OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
        <div className="absolute top-1/2 left-0 w-px h-[200px] -translate-y-1/2 bg-red-600/20" />
        <div className="absolute top-1/2 right-0 w-px h-[200px] -translate-y-1/2 bg-red-600/20" />
      </div>

      <div className="relative z-20 h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 group btn-haptic">
              <LineIconChevronLeft size={20} className="text-gray-400 group-hover:text-white" />
            </Link>
            <div className="flex flex-col">
              <CyberGlitch>
                <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-red-600 stat-value">WAR ROOM</h1>
              </CyberGlitch>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]" />
                <span className="text-[9px] font-mono text-red-500/50 tracking-[0.4em] uppercase">DEFCON 1 • SOUVERAINETÉ ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-right hidden md:block">
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1">LOCAL_COORD</p>
              <p className="text-[10px] font-mono text-white tracking-widest">48.8566 / 2.3522</p>
            </div>
            <div className="px-6 py-2 bg-red-950/20 border border-red-600/30 rounded-lg">
              <div className="font-mono text-red-500 text-xl font-bold">
                00 : 42 : 15 : <span className="text-red-400 opacity-50 italic">09</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Interface */}
        <main className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-hidden">

          {/* Global Scan Panel */}
          <div className="col-span-8 flex flex-col gap-8">
            <GlassCard3D className="flex-1 p-0 overflow-hidden group">
              <TacticalMap events={pulseEvents} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Tactical Radar */}
                <div className="w-[800px] h-[800px] border border-red-600/5 rounded-full animate-[spin_60s_linear_infinite]" />
                <div className="w-[600px] h-[600px] border border-red-600/5 rounded-full absolute animate-[spin_40s_linear_infinite_reverse]" />
                <div className="w-[400px] h-[400px] border border-red-600/10 rounded-full absolute animate-[spin_20s_linear_infinite]" />

                {/* Crosshair Animation */}
                <svg className="absolute w-[100%] h-[100%] opacity-20" viewBox="0 0 400 400">
                  <motion.path
                    d="M 200 150 L 200 250 M 150 200 L 250 200"
                    stroke="red"
                    strokeWidth="0.5"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <circle cx="200" cy="200" r="100" stroke="red" strokeWidth="0.2" fill="none" />
                </svg>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                  <div className="w-24 h-24 border border-red-600/30 rounded-full flex items-center justify-center mb-6 bg-red-600/5 backdrop-blur-xl group-hover:border-red-600/60 transition-all duration-700">
                    <LineIconGlobe size={48} className="text-red-600 animate-pulse" />
                  </div>
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase stat-value leading-none">
                    GLOBAL<br />
                    <span className="text-red-600">SATURATION.</span>
                  </h2>
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <span className="px-3 py-1 bg-red-600/10 border border-red-600/20 text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">TARGET AQ: 100%</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">OPERATIONAL_SYNC</span>
                  </div>
                </div>
              </div>

              {/* HUD Coordinates in corner */}
              <div className="absolute bottom-6 left-6 font-mono text-[8px] text-red-500/30 space-y-1">
                <p>LAT: 48.856614</p>
                <p>LNG: 2.352222</p>
                <p>ALT: 45.2M</p>
              </div>
            </GlassCard3D>
          </div>

          {/* Controls & Metrics */}
          <div className="col-span-4 flex flex-col gap-8">
            <CognitiveThought />
            {/* Action Trigger */}
            <div className="card-saphir bg-gradient-to-br from-red-600/5 to-transparent border-red-600/20 p-8 shadow-[0_0_60px_rgba(220,38,38,0.1)] group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <LineIconZap size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-sm">Contrôle Alpha</h4>
                  <p className="text-[10px] text-red-500/50 font-mono tracking-tighter">SINGULARITY_V10_READY</p>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (confirm("INITIER LA SINGULARITÉ ? Cette action lancera une saturation globale omni-canal et une prospection ultra-agressive sur l'ensemble de vos cibles qualifiées.")) {
                    setIsDominating(true);
                    const res = await fetch('/api/omniscience/trigger', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ organizationId: 'org_global' })
                    });
                    const data = await res.json();
                    if (data.success) {
                      // Simuler l'effet de domination pendant quelques secondes
                      setTimeout(() => setIsDominating(false), 8000);
                    } else {
                      setIsDominating(false);
                      alert("ERREUR : " + (data.error || "Protocole interrompu."));
                    }
                  }
                }}
                className={`w-full py-6 font-black rounded-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.4)] uppercase tracking-[0.3em] text-xs btn-haptic flex items-center justify-center gap-4 group ${isDominating ? 'bg-white text-red-600 animate-pulse' : 'bg-red-600 text-white hover:bg-red-700'}`}
                disabled={isDominating}
              >
                {isDominating ? 'Domination en cours...' : 'Lancer la Singularité'}
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <LineIconZap size={16} fill={isDominating ? "#dc2626" : "white"} />
                </motion.div>
              </button>
            </div>

            {/* Revenue Ticker */}
            <div className="card-saphir p-8 flex flex-col justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <LineIconTrendingUp size={16} className="text-red-500/30" />
              </div>
              <p className="font-mono text-red-500/40 text-[9px] mb-2 uppercase tracking-[0.4em]">REVENU GÉNÉRÉ (SESSION_ALPHA)</p>
              <CyberGlitch>
                <div className="text-6xl font-black text-white stat-value tracking-tighter">
                  {revenue.toLocaleString()} <span className="text-red-600">€</span>
                </div>
              </CyberGlitch>
              <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]"
                  animate={{ width: ["0%", "85%", "40%", "95%"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Live Operations Feed */}
            <div className="flex-1 card-saphir p-8 overflow-hidden flex flex-col">
              <h3 className="font-black text-white text-[10px] mb-6 uppercase tracking-[0.4em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> OPÉRATIONS LIVE
              </h3>
              <div className="space-y-4 font-mono text-[10px] overflow-y-auto pr-2 scrollbar-thin">
                <AnimatePresence>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-red-600/[0.03] border border-red-600/10 rounded-lg flex flex-col gap-1 border-l-2 border-l-red-600"
                    >
                      <div className="flex justify-between items-center opacity-40">
                        <span className="text-[8px] font-black">{log.type}</span>
                        <span className="text-[8px]">{log.time}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">&gt; {log.msg}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
