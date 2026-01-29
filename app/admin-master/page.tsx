"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconShield,
  LineIconUsers,
  LineIconZap,
  LineIconBarChart
} from "@/components/AppIcons";
import { LogOut, Settings, Database, Globe, Activity } from "lucide-react";

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
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="p-6 border-b border-red-500/20 flex items-center justify-between bg-gradient-to-r from-red-950/50 to-transparent">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <LineIconShield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-red-500">ELA MASTER COMMAND</h1>
              <p className="text-xs text-gray-500 font-mono">Session active • Niveau 4</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded font-bold text-xs uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Système Opérationnel
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm font-bold transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="group p-[1px] rounded-2xl bg-gradient-to-br from-red-500/30 to-pink-500/10">
            <div className="bg-[#13131f] rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-red-400 font-bold text-sm">Utilisateurs Actifs</h3>
                <LineIconUsers size={20} className="text-red-400" />
              </div>
              <p className="text-4xl font-black">12,482</p>
              <p className="text-xs text-green-400 mt-2">+847 cette semaine</p>
            </div>
          </div>
          <div className="group p-[1px] rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/10">
            <div className="bg-[#13131f] rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-purple-400 font-bold text-sm">Revenus Mensuels</h3>
                <LineIconBarChart size={20} className="text-purple-400" />
              </div>
              <p className="text-4xl font-black">842k €</p>
              <p className="text-xs text-green-400 mt-2">+12% vs mois dernier</p>
            </div>
          </div>
          <div className="group p-[1px] rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/10">
            <div className="bg-[#13131f] rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-400 font-bold text-sm">Charge Serveur</h3>
                <Activity size={20} className="text-blue-400" />
              </div>
              <p className="text-4xl font-black">34%</p>
              <p className="text-xs text-gray-400 mt-2">Infrastructure stable</p>
            </div>
          </div>
          <div className="group p-[1px] rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/10">
            <div className="bg-[#13131f] rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-green-400 font-bold text-sm">Incidents</h3>
                <LineIconShield size={20} className="text-green-400" />
              </div>
              <p className="text-4xl font-black">0</p>
              <p className="text-xs text-green-400 mt-2">Aucun incident ouvert</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <button className="p-6 bg-[#13131f] border border-white/5 hover:border-red-500/30 rounded-2xl text-left transition-all group">
            <Database size={24} className="text-red-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Base de données</h3>
            <p className="text-sm text-gray-500">Gérer les données utilisateurs et analytics</p>
          </button>
          <button className="p-6 bg-[#13131f] border border-white/5 hover:border-purple-500/30 rounded-2xl text-left transition-all group">
            <Settings size={24} className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Configuration</h3>
            <p className="text-sm text-gray-500">Paramètres système et intégrations API</p>
          </button>
          <button className="p-6 bg-[#13131f] border border-white/5 hover:border-blue-500/30 rounded-2xl text-left transition-all group">
            <Globe size={24} className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Auto-Promotion</h3>
            <p className="text-sm text-gray-500">Déclencher manuellement la promotion</p>
          </button>
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
