"use client";

/**
 * 💎 PAGE FEATURES - VERSION ELA MASTER PREMIUM
 * Consistent styling with landing page
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import {
  LineIconRocket,
  LineIconZap,
  LineIconShield,
  LineIconBarChart,
  LineIconGlobe,
  LineIconClock,
  LineIconCheck
} from "@/components/AppIcons";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#66fcf1]/30 selection:text-white overflow-x-hidden">
      {/* HEADER - Consistent with other pages */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-gray-400 hover:text-[#66fcf1] transition-colors">
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

          <div className="w-20"></div>
        </div>
      </header>

      <div className="pt-32 pb-24 px-6 relative">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-32">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-xl">
              <span className="text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.3em]">MANUFACTURE ELA // INFRASTRUCTURE</span>
            </div>
            <h1 className="text-5xl md:text-9xl font-black mb-10 tracking-tighter uppercase stat-value text-white">PUISSANCE<br /><span className="text-[#66fcf1]">SOUVERAINE.</span></h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              " ELA synchronise votre infrastructure stratégique haute technologie pour une performance totale du marché. "
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                icon: LineIconZap,
                title: "Automatisation Totale",
                description: "9 agents IA spécialisés travaillent 24/7 sans pause, sans erreur, sans limite.",
                features: ["MÉCANIQUE AI", "DÉCLENCHEURS AUTO", " SYNC NATIVE", "ZÉRO FRICTION"],
                gradient: "from-[#66fcf1]/20 to-[#0b0c10]"
              },
              {
                icon: LineIconBarChart,
                title: "Analytics Temps Réel",
                description: "Dashboards interactifs et rapports automatiques pour piloter votre croissance.",
                features: ["CADRAN LIVE", "PRÉDICTIONS V10", "EXPORT ILLIMITÉ", "ALERTES PRÉCISION"],
                gradient: "from-[#1f2833] to-[#0b0c10]"
              },
              {
                icon: LineIconGlobe,
                title: "Multi-Plateformes",
                description: "Connectez tous vos outils : YouTube, TikTok, Instagram, LinkedIn, Stripe, Shopify.",
                features: ["11+ INTÉGRATIONS", "API SOUVERAINE", "WEBHOOK BRIDGE", "SYNC NOBLE"],
                gradient: "from-[#45a29e]/20 to-[#0b0c10]"
              },
              {
                icon: LineIconShield,
                title: "Sécurité Noble",
                description: "Chiffrement 256-bit, conformité RGPD, hébergement certifié en France.",
                features: ["CALIBRE SSL", "RGPD COMPLIANT", "AUDIT PERMANENT", "BACKUPS NOIR"],
                gradient: "from-white/10 to-[#0b0c10]"
              },
              {
                icon: LineIconClock,
                title: "Support Manufacture",
                description: "Équipe d'experts disponible 24/7 pour vous accompagner vers le succès.",
                features: ["CHAT MANUFACTURE", "SUPPORT SOUVERAIN", "ONBOARDING ÉLITE", "TUTOS MÉCANIQUES"],
                gradient: "from-[#c5c6c7]/5 to-[#0b0c10]"
              },
              {
                icon: LineIconRocket,
                title: "Scalabilité Souveraine",
                description: "De 10 à 10 000 utilisateurs sans limite de performance. 99.9% uptime.",
                features: ["INFRA NOIR", "AUTO-SCALING", "CDN MONDIAL", "ZERO FRICTION"],
                gradient: "from-[#66fcf1]/5 to-[#0b0c10]"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group card-saphir overflow-hidden hover:border-[#66fcf1]/20 transition-all duration-700 p-10 snap-start"
              >
                <div className="flex items-start gap-8">
                  <div className={`w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center group-hover:border-[#66fcf1]/30 transition-all duration-700`}>
                    <feature.icon size={32} className={`text-[#66fcf1] transition-transform duration-700 group-hover:scale-110`} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-4 stat-value tracking-tighter">{feature.title}</h3>
                    <p className="text-gray-500 mb-10 text-[11px] font-light leading-relaxed italic">"{feature.description}"</p>
                    <ul className="grid grid-cols-2 gap-4">
                      {feature.features.map((item, j) => (
                        <li key={j} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 group-hover:text-white transition-colors">
                          <LineIconCheck size={14} className="text-[#66fcf1] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center snap-start">
            <div className="card-saphir border-[#66fcf1]/20 p-20 max-w-4xl mx-auto shadow-[0_0_100px_rgba(102,252,241,0.05)]">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 stat-value tracking-tighter">
                PRÊT À <span className="text-[#66fcf1]">SCALER ?</span>
              </h2>
              <p className="text-xl text-gray-500 mb-12 font-light italic leading-relaxed">
                Initialisez votre infrastructure et lancez vos agents stratégiques dès aujourd'hui.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-6 px-16 py-8 bg-[#66fcf1] text-[#0b0c10] font-black text-xs uppercase tracking-[0.3em] rounded-xl hover:shadow-[0_0_60px_rgba(102,252,241,0.4)] transition-all btn-haptic"
              >
                INITIALISER LE PROTOCOLE
                <Zap size={18} fill="currentColor" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
