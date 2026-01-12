"use client";

import { useEffect, useState } from "react";
import {
  LineIconZap,
  LineIconShield,
  LineIconBarChart,
  LineIconBell,
  LineIconSearch,
  LineIconChevronDown,
  LineIconUsers
} from "@/components/LineIcons";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Utilisateur");

  useEffect(() => {
    setUserName("Alexandre");
  }, []);

  const stats = [
    { title: "Leads Générés", value: "1,284", change: "+12%", icon: LineIconUsers, color: "text-blue-400" },
    { title: "Contenus Créés", value: "342", change: "+8%", icon: LineIconZap, color: "text-purple-400" },
    { title: "Taux de Conversion", value: "3.4%", change: "+2.1%", icon: LineIconBarChart, color: "text-green-400" },
    { title: "Sécurité", value: "100%", change: "Optimale", icon: LineIconShield, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4 text-gray-400 w-1/3">
          <LineIconSearch size={18} />
          <input
            type="text"
            placeholder="Rechercher une action..."
            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 font-light focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <LineIconBell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="text-sm">
              <p className="font-semibold text-white">{userName}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <LineIconChevronDown size={14} className="text-gray-500" />
          </div>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-gray-400">Bienvenue sur votre centre de commandement, {userName}.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#13131f] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded">{stat.change}</span>
                <span className="text-gray-600">vs mois dernier</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Area Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-[#13131f] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Activité des Agents</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400 outline-none">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {[40, 70, 45, 90, 65, 85, 45, 60, 75, 50, 95, 80].map((h, i) => (
                <div key={i} className="w-full bg-white/5 rounded-t-sm hover:bg-[#667eea] transition-colors relative group">
                  <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-gradient-to-t from-[#667eea] to-[#764ba2] rounded-t-sm opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6">Actions Rapides</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
}
