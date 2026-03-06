"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Zap, ArrowLeft, Menu, X } from "lucide-react";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("monthly");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#66fcf1]/30 overflow-x-hidden">
      {/* HEADER (Simplified for Subpage) */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-gray-500 hover:text-[#66fcf1] transition-colors">
            <ArrowLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">RETOUR AU CADRAN</span>
          </Link>

          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo-ela.png"
              alt="ELA"
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
          </Link>

          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      <div className="pt-32 pb-24 px-6 relative">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-xl">
              <span className="text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.3em]">TARIFS // ALLIAGE NOBLE</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase stat-value text-white">INVESTISSEZ DANS<br /><span className="text-[#66fcf1]">VOTRE HÉRITAGE.</span></h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              " Rentabilité industrielle. Performance garantie par l'Infrastructure SOUVERAINE v10.4. "
            </p>

            <div className="inline-flex bg-white/5 p-1 rounded-2xl border border-white/10 relative">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10 ${activeTab === 'monthly' ? 'text-[#0b0c10]' : 'text-gray-500 hover:text-white'}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setActiveTab('yearly')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10 ${activeTab === 'yearly' ? 'text-[#0b0c10]' : 'text-gray-500 hover:text-white'}`}
              >
                Annuel <span className="ml-1 opacity-60">-20%</span>
              </button>

              {/* Sliding Background */}
              <div className={`absolute top-1 bottom-1 w-[50%] bg-[#66fcf1] rounded-xl transition-all duration-500 ease-out ${activeTab === 'monthly' ? 'left-1' : 'left-[49%]'}`}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* STARTER */}
            <div className="card-saphir p-12 flex flex-col group hover:border-white/20 transition-all">
              <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-gray-500">Structure Starter</h3>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-6xl font-black text-white stat-value tracking-tighter">{activeTab === 'monthly' ? '37' : '30'}€</span>
                <span className="text-gray-700 text-[10px] font-mono uppercase tracking-widest">/mois</span>
              </div>
              <p className="text-[11px] text-gray-600 mb-10 min-h-[40px] font-light leading-relaxed">L'essentiel pour automatiser vos premières opérations.</p>
              <div className="space-y-6 mb-12 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> 1 AGENT IA</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> {activeTab === 'monthly' ? '1,000' : '1,200'} CRÉDITS</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> SUPPORT STANDARD</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> ACCÈS CADRAN LIVE</div>
              </div>
              <Link href="/signup?plan=starter" className="w-full py-5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-center hover:bg-white hover:text-black transition-all btn-haptic">INITIALISER</Link>
            </div>

            {/* PRO (Highlighted) */}
            <div className="card-saphir p-12 flex flex-col relative border-[#66fcf1]/20 shadow-[0_0_50px_rgba(102,252,241,0.05)] transform md:-translate-y-8 group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#66fcf1] rounded-full text-[8px] font-black uppercase tracking-[0.3em] text-[#0b0c10]">
                RECOMMANDE
              </div>
              <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-[#66fcf1]">Structure Pro</h3>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-6xl font-black text-white stat-value tracking-tighter">{activeTab === 'monthly' ? '197' : '157'}€</span>
                <span className="text-gray-700 text-[10px] font-mono uppercase tracking-widest">/mois</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-10 min-h-[40px] font-light leading-relaxed">La suite d'outils complète pour scaler votre Infrastructure.</p>
              <div className="space-y-6 mb-12 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> 3 AGENTS IA</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> {activeTab === 'monthly' ? '2,500' : '3,000'} CRÉDITS</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> COMMANDE VOCALE HIVE</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> SUPPORT PRIORITAIRE</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> INTÉGRATION CRM</div>
              </div>
              <Link href="/signup?plan=growth" className="w-full py-5 bg-[#66fcf1] text-[#0b0c10] rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-center hover:shadow-[0_0_40px_rgba(102,252,241,0.4)] transition-all btn-haptic">DÉPLOYER LE SCALE</Link>
            </div>

            {/* GOD MODE (Divine/Gold Edition) - SAME AS LANDING PAGE */}
            <div className="card-saphir p-12 bg-gradient-to-br from-[#1f2833]/40 to-black/40 border-white/10 group">
              <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-[#c5c6c7]">Structure Souveraine</h3>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-6xl font-black text-white stat-value tracking-tighter">{activeTab === 'monthly' ? '497' : '397'}€</span>
                <span className="text-gray-700 text-[10px] font-mono uppercase tracking-widest">/mois</span>
              </div>
              <p className="text-[11px] text-[#c5c6c7] mb-10 min-h-[40px] font-light leading-relaxed">Pour ceux qui ne concurrencent pas, mais qui dirigent par la Précision.</p>
              <div className="space-y-6 mb-12 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#c5c6c7] uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> PERFORMANCE TOTALE</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#c5c6c7] uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> CRÉDITS ILLIMITÉS</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#c5c6c7] uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> SERVEUR DÉDIÉ</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#c5c6c7] uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> ACCÈS DIRECT ARCHITECTES</div>
              </div>
              <Link href="/signup?plan=god_mode" className="w-full py-5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-center transition-all btn-haptic">ACTIVER LA SOUVERAINETÉ</Link>
            </div>

            {/* NETWORK EMPIRE (The Reseller/Media Tier) */}
            <div className="card-saphir p-12 bg-[#66fcf1]/5 border-[#66fcf1]/30 group hover:border-[#66fcf1] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#66fcf1]/10 blur-3xl -z-10" />
              <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-[#66fcf1]">Infrastructure Scale</h3>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-6xl font-black text-white stat-value tracking-tighter">{activeTab === 'monthly' ? '1497' : '1197'}€</span>
                <span className="text-gray-700 text-[10px] font-mono uppercase tracking-widest">/mois</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-10 min-h-[40px] font-light leading-relaxed">Infrastructure Whitelabel pour réseaux de médias et agences de scaling.</p>
              <div className="space-y-6 mb-12 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> LICENCE RESELLER</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> API DÉDIÉE ILLIMITÉE</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> DASHBOARD WHITELABEL</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><Zap className="w-4 h-4 text-[#66fcf1]" /> PARTAGE DE REVENUS 50%</div>
              </div>
              <Link href="/contact?subject=network_scale" className="w-full py-5 bg-[#66fcf1] text-[#0b0c10] rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-center hover:shadow-[0_0_50px_rgba(102,252,241,0.4)] transition-all btn-haptic">REJOINDRE LE PROGRAMME</Link>
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
