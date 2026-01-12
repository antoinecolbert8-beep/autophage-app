"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LineIconCheck,
  LineIconZap,
  LineIconChevronLeft
} from "@/components/LineIcons";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("monthly");

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* HEADER */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <LineIconChevronLeft size={20} />
          <span className="font-bold">Retour</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-black text-xs text-white">G</div>
          <span className="font-bold text-xl tracking-tight text-white">GENESIS</span>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6">Investissez dans votre Domination.</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choisissez la puissance de feu adaptée à vos ambitions. Changez de plan à tout moment.
            </p>

            <div className="mt-8 inline-flex bg-[#13131f] p-1 rounded-xl border border-white/10">
              <button onClick={() => setActiveTab('monthly')} className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'monthly' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Mensuel</button>
              <button onClick={() => setActiveTab('yearly')} className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'yearly' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Annuel (-20%)</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* STARTUP */}
            <div className="p-8 bg-[#13131f] border border-white/5 rounded-3xl flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Startup</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-black">{activeTab === 'monthly' ? '49€' : '39€'}</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 h-10">L'essentiel pour automatiser vos premières tâches.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-white/10 rounded-full"><LineIconCheck size={14} /></div> 1 Agent (au choix)</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-white/10 rounded-full"><LineIconCheck size={14} /></div> 1,000 Crédits/mois</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-white/10 rounded-full"><LineIconCheck size={14} /></div> Support Email</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-white/10 rounded-full"><LineIconCheck size={14} /></div> Accès Dashboard</li>
              </ul>
              <button className="w-full py-4 border border-white/20 rounded-xl font-bold hover:bg-white hover:text-black transition-colors">Commencer</button>
            </div>

            {/* GROWTH */}
            <div className="p-8 bg-[#13131f] border border-[#667eea] rounded-3xl flex flex-col relative scale-105 shadow-[0_0_60px_rgba(102,126,234,0.15)] z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">RECOMMANDÉ</div>
              <h3 className="text-2xl font-bold text-[#667eea] mb-2">Growth</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-black">{activeTab === 'monthly' ? '199€' : '159€'}</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 h-10">Pour les entreprises en croissance rapide qui veulent scaler.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm font-bold"><div className="p-1 bg-[#667eea]/20 text-[#667eea] rounded-full"><LineIconCheck size={14} /></div> 3 Agents IA</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-[#667eea]/20 text-[#667eea] rounded-full"><LineIconCheck size={14} /></div> 10,000 Crédits/mois</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-[#667eea]/20 text-[#667eea] rounded-full"><LineIconCheck size={14} /></div> WhatsApp Command (HIVE)</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-[#667eea]/20 text-[#667eea] rounded-full"><LineIconCheck size={14} /></div> Accès API (Limité)</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-[#667eea]/20 text-[#667eea] rounded-full"><LineIconCheck size={14} /></div> Support Prioritaire</li>
              </ul>
              <button className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl font-bold text-white hover:shadow-lg hover:shadow-[#667eea]/25 transition-all">S'abonner maintenant</button>
            </div>

            {/* GOD MODE */}
            <div className="p-8 bg-[#0a0a0f] border border-white/10 rounded-3xl flex flex-col bg-[url('/grid.svg')] hover:border-pink-500/50 transition-colors">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">God Mode</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-black">{activeTab === 'monthly' ? '499€' : '399€'}</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 h-10">Puissance illimitée pour écraser la concurrence.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-pink-500/20 text-pink-500 rounded-full"><LineIconZap size={14} /></div> <strong>Agents Illimités</strong></li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-pink-500/20 text-pink-500 rounded-full"><LineIconZap size={14} /></div> Crédits Illimités</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-pink-500/20 text-pink-500 rounded-full"><LineIconZap size={14} /></div> <strong>LinkedIn Bot Pro</strong></li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-pink-500/20 text-pink-500 rounded-full"><LineIconZap size={14} /></div> Dedicated Account Manager</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-pink-500/20 text-pink-500 rounded-full"><LineIconZap size={14} /></div> Custom Branding</li>
              </ul>
              <button className="w-full py-4 border border-pink-500/50 text-pink-500 rounded-xl font-bold hover:bg-pink-500 hover:text-white transition-colors">Contacter Sales</button>
            </div>
          </div>

          <div className="mt-20 text-center">
            <p className="text-gray-500 text-sm">Tous les prix sont en EUR HT. TVA applicable selon votre région.<br />Satisfait ou remboursé sous 14 jours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
