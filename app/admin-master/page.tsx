"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconShield,
  LineIconUsers,
  LineIconZap,
  LineIconBarChart,
  LineIconSearch
} from "@/components/AppIcons";
import { LogOut, Settings, Database, Globe, Activity, Terminal, Power, Link as LinkIcon, CheckCircle2, BrainCircuit, Twitter, Linkedin } from "lucide-react";
import {
  GrainTexture,
  Scanline,
  NeuralWeb,
  CyberGlitch,
  GlassCard3D
} from "@/components/AdvancedVisuals";

export default function AdminMasterPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [botStatus, setBotStatus] = useState<'stopped' | 'running' | 'error' | 'loading'>('loading');
  const [socialTokens, setSocialTokens] = useState({ linkedinToken: '', linkedinUrn: '', twitterKey: '', twitterSecret: '', twitterToken: '', twitterSecretToken: '' });
  const [savingSocial, setSavingSocial] = useState(false);
  const [socialStatus, setSocialStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const checkBotStatus = async () => {
    try {
      const res = await fetch('/api/bot/linkedin');
      const data = await res.json();
      setBotStatus(data.status);
    } catch (e) {
      setBotStatus('error');
    }
  };

  const toggleBot = async () => {
    const action = botStatus === 'running' ? 'stop' : 'start';
    setBotStatus('loading');
    try {
      const res = await fetch('/api/bot/linkedin', {
        method: 'POST',
        body: JSON.stringify({ action }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setBotStatus(data.status || 'error');
    } catch (e) {
      setBotStatus('error');
    }
  };

  const saveSocialIntegration = async (platform: string, credentials: any) => {
    setSavingSocial(true);
    setSocialStatus('idle');
    try {
      // Pour l'admin, on utilise une orga fictive cible "admin_god_mode" ou l'ID de l'admin
      const orgId = "genesis_core_org";

      const res = await fetch('/api/auth/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          organizationId: orgId,
          ...credentials
        })
      });

      if (res.ok) {
        setSocialStatus('saved');
        setTimeout(() => setSocialStatus('idle'), 3000);
      } else {
        setSocialStatus('error');
      }
    } catch (e) {
      setSocialStatus('error');
    }
    setSavingSocial(false);
  };

  useEffect(() => {
    checkBotStatus();
    const interval = setInterval(checkBotStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check admin authentication
    const authStatus = typeof window !== 'undefined' ? localStorage.getItem('ela_admin_auth') : null;

    if (authStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthed(true);
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ela_admin_auth');
      localStorage.removeItem('ela_admin_session');
    }
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden relative font-sans">
      <NeuralWeb />
      <GrainTexture />
      <Scanline />

      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 group btn-haptic">
            <LineIconChevronLeft size={20} className="text-gray-400 group-hover:text-white" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.2)] border border-red-500/30">
              <LineIconShield size={24} className="text-white" />
            </div>
            <div>
              <CyberGlitch>
                <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-red-600 stat-value">ELA MASTER COMMAND</h1>
              </CyberGlitch>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[10px] font-mono text-red-500/50 tracking-[0.4em] uppercase">SYSTEM_ACCESS_L4 // ROOT_CORTEX</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]" />
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">INFRASTRUCTURE: OPTIMALE</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-600/20 btn-haptic"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto relative z-10 pt-12">
        {/* Gamified Core Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Active Users */}
          <GlassCard3D className="p-1 relative group bg-gradient-to-b from-[#1a1c29] to-[#0a0a0f] overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-500 rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="p-3 bg-red-600/10 rounded-2xl text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all">
                  <LineIconUsers size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.3em]">CITOYENS</span>
                  <span className="w-12 h-0.5 bg-red-500/20 mt-1" />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-sm font-bold text-gray-500 tracking-wider">POPULATION ACTIVE</span>
              </div>
              <p className="text-6xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">12.4<span className="text-3xl text-red-500">K</span></p>
              <div className="flex items-center gap-2 mt-4">
                <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                  <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">+6.2%</span>
                </div>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">DELTA T-24H</span>
              </div>
            </div>
          </GlassCard3D>

          {/* Epic MRR / Treasury (The "Cash In" Panel) */}
          <GlassCard3D className="p-1 relative group bg-gradient-to-b from-[#1a0b1c] to-[#050005] overflow-hidden border border-purple-500/20 hover:border-purple-500/80 transition-all duration-500 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:shadow-[0_0_80px_rgba(168,85,247,0.3)] md:col-span-2">
            <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700" />

            <div className="p-8 relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-2xl text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <LineIconBarChart size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-[0.2em] text-white">TRÉSORERIE ELA</h3>
                    <p className="text-[10px] text-purple-400/70 uppercase tracking-[0.3em] font-bold">FLUX_FINANCIER // SÉCURISÉ</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full flex items-center gap-2 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">RÉCEPTION ACTIVE</span>
                </div>
              </div>

              <div className="flex items-end justify-between mt-6">
                <div>
                  <div className="flex text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] stat-value">
                    <span className="text-4xl text-purple-400 mt-2 mr-1">€</span>
                    842
                    <span className="text-5xl text-purple-500 mb-2 ml-1">K</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-green-400 text-sm font-black uppercase tracking-widest bg-green-400/10 px-3 py-1 rounded-md border border-green-400/20">+12.4% ARR</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Objectif: 1M€ / Mois</span>
                  </div>
                </div>

                <button className="relative group/btn overflow-hidden rounded-2xl p-px bg-gradient-to-b from-purple-400 to-purple-900 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all active:scale-95">
                  <div className="relative px-8 py-5 bg-black/80 rounded-2xl flex items-center gap-3 transition-colors group-hover/btn:bg-black/40 backdrop-blur-xl">
                    <Globe className="text-purple-400" size={24} />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-black text-white uppercase tracking-widest">ENCAISSER</span>
                      <span className="text-[9px] text-purple-400 font-bold tracking-[0.2em]">DIVIDENDES</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </GlassCard3D>

          {/* System Load */}
          <GlassCard3D className="p-1 relative group bg-gradient-to-b from-[#0a1e3f] to-[#050a14] overflow-hidden border border-blue-500/10 hover:border-blue-500/40 transition-all duration-500 rounded-3xl shadow-2xl">
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <Activity size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.3em]">MOTEUR IA</span>
                  <span className="w-12 h-0.5 bg-blue-500/20 mt-1" />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-sm font-bold text-gray-500 tracking-wider">CHARGE INFRA</span>
              </div>
              <p className="text-6xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">34<span className="text-3xl text-blue-500">%</span></p>

              <div className="w-full bg-black/50 rounded-full h-1.5 mt-4 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full w-[34%] shadow-[0_0_10px_#3b82f6]" />
              </div>
              <div className="text-blue-400 text-[9px] font-black uppercase tracking-widest mt-3 text-right">
                NOMINAL_SPEED
              </div>
            </div>
          </GlassCard3D>
        </div>

        {/* Tactical Command Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Link href="/admin-master/brain" className="block h-full">
            <GlassCard3D className="p-1 relative group bg-[#0a0f12] overflow-hidden border border-white/5 hover:border-[#66fcf1]/50 transition-all duration-500 rounded-3xl h-full shadow-xl hover:shadow-[0_0_30px_rgba(102,252,241,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#66fcf1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-[#66fcf1]/10 rounded-2xl flex items-center justify-center text-[#66fcf1] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(102,252,241,0.2)]">
                    <BrainCircuit size={28} />
                  </div>
                  <h3 className="font-black text-xl mb-2 tracking-[0.1em] uppercase text-white group-hover:text-[#66fcf1] transition-colors">Cerveau ELA</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-wider">Contrôle Total : Modèles IA, God Mode, Crons Actifs.</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[#66fcf1] opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest">
                  Accéder <LineIconChevronLeft className="rotate-180" size={14} />
                </div>
              </div>
            </GlassCard3D>
          </Link>

          <GlassCard3D className="p-1 relative group bg-[#0a0a0f] overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-500 rounded-3xl h-full shadow-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                  <Database size={28} />
                </div>
                <h3 className="font-black text-xl mb-2 tracking-[0.1em] uppercase text-white group-hover:text-red-500 transition-colors">Souverain DB</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-wider">Altération directe des registres, gestion quotas & calibres.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest">
                Initialiser <LineIconChevronLeft className="rotate-180" size={14} />
              </div>
            </div>
          </GlassCard3D>

          <GlassCard3D className="p-1 relative group bg-[#0a0a0f] overflow-hidden border border-white/5 hover:border-purple-600/50 transition-all duration-500 rounded-3xl h-full shadow-xl hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                  <Settings size={28} />
                </div>
                <h3 className="font-black text-xl mb-2 tracking-[0.1em] uppercase text-white group-hover:text-purple-400 transition-colors">Matrice Config</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-wider">Ajustement des hyperparamètres & seuils de sécurité API.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest">
                Configurer <LineIconChevronLeft className="rotate-180" size={14} />
              </div>
            </div>
          </GlassCard3D>

          <GlassCard3D className="p-1 relative group bg-[#0a0a0f] overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all duration-500 rounded-3xl h-full shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  <Globe size={28} />
                </div>
                <h3 className="font-black text-xl mb-2 tracking-[0.1em] uppercase text-white group-hover:text-orange-500 transition-colors">Omni-Déploiement</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-wider">Forcer la saturation marketing globale sur tous les réseaux.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest">
                Exécuter <LineIconChevronLeft className="rotate-180" size={14} />
              </div>
            </div>
          </GlassCard3D>
        </div>

        {/* Bot Automation Control */}
        <div className="mb-12">
          <h2 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
            <Terminal className="text-green-500" />
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">MACHINE D'ACQUISITION LINKEDIN</span>
          </h2>
          <GlassCard3D className="p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br from-black to-[#0a0f12]">
            {/* Status indicator glow */}
            <div className={`absolute top-0 left-0 w-full h-1 ${botStatus === 'running' ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' :
              botStatus === 'loading' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black uppercase text-white tracking-widest mb-2">
                  Bot Engagement (Python)
                </h3>
                <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
                  Contrôle direct sur l'exécutable Python <code className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded">SaaS_Bot_LinkedIn</code>.
                  Le bot gérera automatiquement vos sessions, naviguera sur LinkedIn et commentera via l'IA.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs uppercase font-bold text-gray-500">Statut:</span>
                  {botStatus === 'loading' ? (
                    <div className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold uppercase rounded-md flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> INITIALISATION...
                    </div>
                  ) : botStatus === 'running' ? (
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold uppercase rounded-md flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" /> EN LIGNE
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase rounded-md flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" /> HORS LIGNE
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={toggleBot}
                  disabled={botStatus === 'loading'}
                  className={`
                    flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all
                    ${botStatus === 'running'
                      ? 'bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                      : 'bg-green-500/10 text-green-500 border border-green-500 hover:bg-green-500 hover:text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <Power size={20} className={botStatus === 'running' ? '' : 'animate-pulse'} />
                  {botStatus === 'running' ? 'ARMEMENT COUPÉ' : 'DÉMARRER MACHINE'}
                </button>
              </div>
            </div>
          </GlassCard3D>
        </div>

        {/* Social Connections */}
        <div className="mb-12">
          <h2 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
            <LinkIcon className="text-blue-500" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">LIAISONS NEURALES (ACQUISITION)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LinkedIn Connection */}
            <GlassCard3D className="p-1 relative group bg-[#0a0f12] overflow-hidden border border-[#0a66c2]/20 hover:border-[#0a66c2]/60 transition-all duration-500 shadow-[0_0_20px_rgba(10,102,194,0.05)] hover:shadow-[0_0_40px_rgba(10,102,194,0.15)] rounded-3xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(10,102,194,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#0a66c2]/10 rounded-2xl text-[#0a66c2] shadow-[0_0_15px_rgba(10,102,194,0.2)]">
                      <Linkedin size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white tracking-[0.1em] uppercase">LINKEDIN UPLINK</h3>
                      <p className="text-[10px] text-[#0a66c2] uppercase tracking-[0.3em] font-bold">Protocole Natif</p>
                    </div>
                  </div>
                  {socialStatus === 'saved' && (
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full flex items-center gap-2 animate-pulse">
                      <CheckCircle2 size={14} className="text-green-400" />
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">CONNECTÉ</span>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="relative group/input">
                    <label className="block text-[10px] uppercase text-[#0a66c2]/70 font-black mb-2 tracking-widest">Jeton Cryptographique (Token)</label>
                    <input
                      type="password"
                      value={socialTokens.linkedinToken}
                      onChange={(e) => setSocialTokens({ ...socialTokens, linkedinToken: e.target.value })}
                      placeholder="AQV..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#0a66c2]/50 focus:bg-[#0a66c2]/5 outline-none text-white font-mono transition-all focus:ring-1 focus:ring-[#0a66c2]/30"
                    />
                  </div>
                  <div className="relative group/input">
                    <label className="block text-[10px] uppercase text-[#0a66c2]/70 font-black mb-2 tracking-widest">Identifiant Cible (URN)</label>
                    <input
                      type="text"
                      value={socialTokens.linkedinUrn}
                      onChange={(e) => setSocialTokens({ ...socialTokens, linkedinUrn: e.target.value })}
                      placeholder="urn:li:person:12345678"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#0a66c2]/50 focus:bg-[#0a66c2]/5 outline-none text-gray-300 font-mono transition-all focus:ring-1 focus:ring-[#0a66c2]/30"
                    />
                  </div>
                  <button
                    onClick={() => saveSocialIntegration('LINKEDIN', { accessToken: socialTokens.linkedinToken, externalId: socialTokens.linkedinUrn })}
                    disabled={savingSocial || !socialTokens.linkedinToken || !socialTokens.linkedinUrn}
                    className="w-full mt-4 py-4 bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 text-[#0a66c2] border border-[#0a66c2]/30 hover:border-[#0a66c2]/60 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(10,102,194,0.3)] disabled:hover:shadow-none"
                  >
                    INITIALISER LIAISON
                  </button>
                </div>
              </div>
            </GlassCard3D>

            {/* Twitter Connection */}
            <GlassCard3D className="p-1 relative group bg-[#0a0a0f] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] rounded-3xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.05),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-8 relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10">
                      <Twitter size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white tracking-[0.1em] uppercase">X.COM SECURE NODE</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">OAuth 1.0a Bridge</p>
                    </div>
                  </div>
                  {socialStatus === 'saved' && (
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full flex items-center gap-2 animate-pulse">
                      <CheckCircle2 size={14} className="text-green-400" />
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">CONNECTÉ</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-[9px] uppercase text-gray-500 font-black mb-1.5 tracking-widest">Clé API (Key)</label>
                    <input
                      type="password"
                      value={socialTokens.twitterKey}
                      onChange={(e) => setSocialTokens({ ...socialTokens, twitterKey: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2.5 text-xs focus:border-white/30 focus:bg-white/5 outline-none text-white font-mono transition-all"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[9px] uppercase text-gray-500 font-black mb-1.5 tracking-widest">Secret API</label>
                    <input
                      type="password"
                      value={socialTokens.twitterSecret}
                      onChange={(e) => setSocialTokens({ ...socialTokens, twitterSecret: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2.5 text-xs focus:border-white/30 focus:bg-white/5 outline-none text-white font-mono transition-all"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[9px] uppercase text-gray-500 font-black mb-1.5 tracking-widest">Token Cible</label>
                    <input
                      type="password"
                      value={socialTokens.twitterToken}
                      onChange={(e) => setSocialTokens({ ...socialTokens, twitterToken: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2.5 text-xs focus:border-white/30 focus:bg-white/5 outline-none text-white font-mono transition-all"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[9px] uppercase text-gray-500 font-black mb-1.5 tracking-widest">Token Secret</label>
                    <input
                      type="password"
                      value={socialTokens.twitterSecretToken}
                      onChange={(e) => setSocialTokens({ ...socialTokens, twitterSecretToken: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2.5 text-xs focus:border-white/30 focus:bg-white/5 outline-none text-white font-mono transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={() => saveSocialIntegration('TWITTER', {
                    apiKey: socialTokens.twitterKey,
                    apiSecret: socialTokens.twitterSecret,
                    accessToken: socialTokens.twitterToken,
                    accessSecret: socialTokens.twitterSecretToken
                  })}
                  disabled={savingSocial || !socialTokens.twitterKey}
                  className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:hover:shadow-none"
                >
                  INITIALISER LIAISON
                </button>
              </div>
            </GlassCard3D>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Gestion des Utilisateurs</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase font-bold text-gray-500 bg-white/5">
                <tr>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Crédits</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: 1001, email: "ceo@techcorp.fr", plan: "God Mode", credits: "∞", status: "active" },
                  { id: 1002, email: "marie@startup.io", plan: "Growth", credits: "8,542", status: "active" },
                  { id: 1003, email: "jean@agency.com", plan: "Starter", credits: "1,200", status: "active" },
                  { id: 1004, email: "paul@enterprise.fr", plan: "Growth", credits: "6,890", status: "pending" },
                  { id: 1005, email: "lucie@pme.com", plan: "Starter", credits: "450", status: "active" },
                ].map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="p-4 font-mono text-white">USR-{user.id}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.plan === 'God Mode' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30' :
                        user.plan === 'Growth' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{user.credits}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-2 ${user.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        {user.status === 'active' ? 'Actif' : 'En attente'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">Modifier</button>
                        <button className="text-red-400 hover:text-red-300 text-xs font-medium">Suspendre</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
