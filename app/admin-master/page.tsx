"use client";

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
import { LogOut, Settings, Database, Globe, Activity } from "lucide-react";
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <GlassCard3D className="p-8 group bg-gradient-to-br from-red-600/5 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-red-600/10 rounded-xl text-red-600">
                <LineIconUsers size={20} />
              </div>
              <span className="text-[10px] font-black text-red-600/50 uppercase tracking-widest">ACTIVE_USERS</span>
            </div>
            <p className="text-5xl font-black tracking-tighter mb-2 stat-value">12.4k</p>
            <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-wider">
              <span className="animate-bounce">↑</span> +6.2% <span className="text-gray-600 font-normal">DELTA_H_24</span>
            </div>
          </GlassCard3D>

          <GlassCard3D className="p-8 group bg-gradient-to-br from-purple-600/5 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-purple-600/10 rounded-xl text-purple-600">
                <LineIconBarChart size={20} />
              </div>
              <span className="text-[10px] font-black text-purple-600/50 uppercase tracking-widest">MRR_FLOW</span>
            </div>
            <p className="text-5xl font-black tracking-tighter mb-2 stat-value">€842k</p>
            <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-wider">
              <span className="animate-bounce">↑</span> +12.4% <span className="text-gray-600 font-normal">DELTA_M_1</span>
            </div>
          </GlassCard3D>

          <GlassCard3D className="p-8 group bg-gradient-to-br from-blue-600/5 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-black text-blue-600/50 uppercase tracking-widest">CORE_LOAD</span>
            </div>
            <p className="text-5xl font-black tracking-tighter mb-2 stat-value">34%</p>
            <div className="text-gray-500 text-[10px] font-black uppercase tracking-wider">
              STATUS: <span className="text-blue-400">NOMINAL_SPEED</span>
            </div>
          </GlassCard3D>

          <GlassCard3D className="p-8 group bg-gradient-to-br from-green-600/5 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-green-600/10 rounded-xl text-green-600">
                <LineIconZap size={20} />
              </div>
              <span className="text-[10px] font-black text-green-600/50 uppercase tracking-widest">SYSTEM_BREACH</span>
            </div>
            <p className="text-5xl font-black tracking-tighter mb-2 stat-value">00</p>
            <div className="text-gray-500 text-[10px] font-black uppercase tracking-wider">
              PROTECTION: <span className="text-green-400">MAXIMUM</span>
            </div>
          </GlassCard3D>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard3D className="p-8 group hover:bg-white/[0.02] cursor-pointer transition-all border-white/5 hover:border-red-600/30">
            <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform">
              <Database size={28} />
            </div>
            <h3 className="font-black text-lg mb-2 tracking-tight uppercase">Souverain DB</h3>
            <p className="text-[11px] text-gray-500 font-light italic leading-relaxed uppercase tracking-wider">Gérer les calibres utilisateurs et synchroniser les accès organisationnels.</p>
          </GlassCard3D>

          <GlassCard3D className="p-8 group hover:bg-white/[0.02] cursor-pointer transition-all border-white/5 hover:border-purple-600/30">
            <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <Settings size={28} />
            </div>
            <h3 className="font-black text-lg mb-2 tracking-tight uppercase">Config. Matrice</h3>
            <p className="text-[11px] text-gray-500 font-light italic leading-relaxed uppercase tracking-wider">Ajuster les réglages système, seuils API et orchestrations autonomes.</p>
          </GlassCard3D>

          <GlassCard3D className="p-8 group hover:bg-white/[0.02] cursor-pointer transition-all border-white/5 hover:border-blue-600/30">
            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <Globe size={28} />
            </div>
            <h3 className="font-black text-lg mb-2 tracking-tight uppercase">Auto-Expansion</h3>
            <p className="text-[11px] text-gray-500 font-light italic leading-relaxed uppercase tracking-wider">Déclencher manuellement le protocole de diffusion omni-canale globale.</p>
          </GlassCard3D>
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
