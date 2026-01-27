"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Zap, ArrowLeft, Menu, X } from "lucide-react";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("monthly");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">
      {/* HEADER (Simplified for Subpage) */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold">Retour</span>
          </Link>

          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo-ela.png"
              alt="ELA"
              className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(217,119,6,0.4)]"
            />
            <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 group-hover:to-amber-300 transition-all">
              ELA
            </span>
          </Link>

          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      <div className="pt-32 pb-24 px-6 relative">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 mb-6 backdrop-blur-md">
              <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">💰 TARIFS PREMIUM</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight uppercase">INVESTISSEZ DANS<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">VOTRE EMPIRE.</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-bold">
              Choisissez votre arsenal. Dominez dès le premier mois.
            </p>

            <div className="inline-flex bg-[#13131f] p-1 rounded-2xl border border-white/10 relative">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all relative z-10 ${activeTab === 'monthly' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setActiveTab('yearly')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all relative z-10 ${activeTab === 'yearly' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Annuel <span className="text-emerald-400 text-xs ml-1">-20%</span>
              </button>

              {/* Sliding Background */}
              <div className={`absolute top-1 bottom-1 w-[50%] bg-white/10 rounded-xl transition-all duration-300 ${activeTab === 'monthly' ? 'left-1' : 'left-[49%]'}`}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* STARTER */}
            <div className="p-8 rounded-[2rem] bg-[#13131f] border border-white/5 flex flex-col hover:border-[#667eea]/30 transition-all group">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black">{activeTab === 'monthly' ? '37' : '30'}€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 min-h-[40px]">L'essentiel pour automatiser vos premières tâches.</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> 1 Agent (au choix)</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> {activeTab === 'monthly' ? '1,000' : '1,200'} Crédits/mois</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Support Email</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Accès Dashboard</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Mises à jour Hebdomadaires</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Sécurité SSL</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Accès Mobile</div>
              </div>
              <Link href="/signup?plan=starter" className="w-full py-4 border border-white/20 rounded-xl font-bold text-center hover:bg-white hover:text-black transition-colors">Commencer</Link>
            </div>

            {/* PRO (Highlighted) */}
            <div className="p-8 rounded-[2rem] bg-[#1a1a2e] border border-[#667eea] flex flex-col relative transform md:-translate-y-4 shadow-[0_0_50px_rgba(102,126,234,0.1)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-[#667eea] rounded-full text-xs font-bold uppercase tracking-widest shrink-0 whitespace-nowrap shadow-lg shadow-[#667eea]/40">
                Recommandé
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#667eea]">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black">{activeTab === 'monthly' ? '197' : '157'}€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 min-h-[40px]">La suite complète pour scaler votre entreprise rapidement.</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> 3 Agents IA</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> {activeTab === 'monthly' ? '2,500' : '3,000'} Crédits/mois</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> WhatsApp Command (HIVE)</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Accès API (Limité)</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Support Prioritaire</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Intégration CRM (HubSpot)</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Exports Ilimités</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Accès Beta Fonctionnalités</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Formation Vidéo Offerte</div>
              </div>
              <Link href="/signup?plan=growth" className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl font-bold text-white text-center hover:shadow-lg hover:shadow-[#667eea]/25 transition-all transform hover:-translate-y-1">S'abonner maintenant</Link>
            </div>

            {/* GOD MODE (Divine/Gold Edition) - SAME AS LANDING PAGE */}
            <div className="relative p-1 bg-[#1a1005] rounded-[2.5rem] group transform hover:scale-105 transition-all duration-500 shadow-[0_0_100px_rgba(217,119,6,0.3)] z-10">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 rounded-[2.5rem] opacity-50 blur-lg group-hover:opacity-100 animate-gradient-xy transition-opacity"></div>

              <div className="relative h-full p-10 bg-[#0c0a09] rounded-[2.3rem] flex flex-col overflow-hidden">
                {/* Cosmic Background Effect */}
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-600/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="inline-block px-4 py-1 mb-4 rounded-full bg-amber-500/10 border border-amber-500/50 text-amber-500 text-xs font-black tracking-[0.2em] uppercase">
                    Souveraineté Totale
                  </div>
                  <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mb-2">
                    GOD MODE
                  </h3>
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-6xl font-black text-white tracking-tighter">{activeTab === 'monthly' ? '497' : '397'}€</span>
                    <span className="text-gray-400 font-mono">/mois</span>
                  </div>

                  <p className="text-base text-gray-300 mb-8 border-l-2 border-amber-500 pl-4 italic">
                    "Pour ceux qui ne concurrencent pas, mais qui règnent."
                  </p>

                  <div className="space-y-5 mb-10">
                    {[
                      "Agents Illimités & Autonomes",
                      "Crédits Infinis (Fair Usage)",
                      "Machine d'Auto-Promotion Incluse",
                      "Accès API 'Souverain' (Priority)",
                      "Dedicated Server (Tenant Unique)",
                      "Audit de Domination Mensuel",
                      "Accès Direct aux Fondateurs"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-4 group/item">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-black">
                          <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-gray-200 font-medium group-hover/item:text-amber-200 transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/signup?plan=god_mode" className="block w-full py-5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black text-lg font-black text-center shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] hover:scale-[1.02] transition-all relative overflow-hidden group/btn">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      INITIALISER LE PROTOCOLE <Zap className="w-5 h-5 fill-black" />
                    </span>
                    <div className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  </Link>
                </div>
              </div>
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
