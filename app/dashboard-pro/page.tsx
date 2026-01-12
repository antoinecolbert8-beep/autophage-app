"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconUsers,
  LineIconZap,
  LineIconBarChart
} from "@/components/AppIcons";

export default function DashboardProPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Dashboard <span className="text-[#667eea]">PRO</span></h1>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-gray-400 mb-8">Vue consolidée pour les comptes Enterprise.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
            <h3 className="font-bold mb-4">Performance Globale</h3>
            <div className="h-64 bg-black/50 rounded-xl flex items-center justify-center border border-white/5">
              <p className="text-gray-500">[Graphique consolidé]</p>
            </div>
          </div>

          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
            <h3 className="font-bold mb-4">Alertes Système</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-sm font-bold text-green-400">Système stable</p>
                <p className="text-xs text-gray-400">Aucune anomalie détectée sur les 24 dernières heures.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
