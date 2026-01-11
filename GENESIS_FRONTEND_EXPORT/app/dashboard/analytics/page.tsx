"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconBarChart,
  LineIconTrendingUp,
  LineIconUsers,
  LineIconGlobe
} from "@/components/LineIcons";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Analytique</h1>
        </div>
        <select className="bg-[#13131f] border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none">
          <option>30 derniers jours</option>
          <option>7 derniers jours</option>
          <option>Hier</option>
        </select>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Visiteurs Uniques", value: "24.5k", change: "+14%", icon: LineIconUsers, color: "text-blue-400" },
            { title: "Temps Moyen", value: "4m 12s", change: "+2%", icon: LineIconTrendingUp, color: "text-green-400" },
            { title: "Taux de Rebond", value: "42%", change: "-5%", icon: LineIconBarChart, color: "text-purple-400" },
            { title: "Pays", value: "12", change: "+2", icon: LineIconGlobe, color: "text-orange-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <stat.icon size={20} className={stat.color} />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-sm text-green-400 font-medium">{stat.change} <span className="text-gray-500 font-normal">vs période précédente</span></p>
            </div>
          ))}
        </div>

        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <LineIconBarChart size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Graphiques en cours de chargement...</h3>
            <p className="text-gray-500">Connexion à l'API de données en cours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
