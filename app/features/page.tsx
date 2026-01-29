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
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">
      {/* HEADER - Consistent with other pages */}
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

          <div className="w-20"></div>
        </div>
      </header>

      <div className="pt-32 pb-24 px-6 relative">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1 mb-6 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 text-sm font-bold text-blue-400 backdrop-blur-md">
                🚀 FONCTIONNALITÉS
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
                <span className="text-white">Puissance</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Illimitée.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                ELA regroupe tous les outils pour automatiser et dominer votre marché.
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                icon: LineIconZap,
                title: "Automatisation Totale",
                description: "9 agents IA spécialisés travaillent 24/7 sans pause, sans erreur, sans limite.",
                features: ["Workflows intelligents", "Déclencheurs auto", "Intégrations natives", "Zéro maintenance"],
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: LineIconBarChart,
                title: "Analytics Temps Réel",
                description: "Dashboards interactifs et rapports automatiques pour piloter votre croissance.",
                features: ["Tableaux de bord live", "Prédictions IA", "Export illimité", "Alertes intelligentes"],
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: LineIconGlobe,
                title: "Multi-Plateformes",
                description: "Connectez tous vos outils : YouTube, TikTok, Instagram, LinkedIn, Stripe, Shopify.",
                features: ["10+ intégrations", "API complète", "Webhooks", "Sync bidirectionnelle"],
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: LineIconShield,
                title: "Sécurité Bancaire",
                description: "Chiffrement 256-bit, conformité RGPD, hébergement certifié en France.",
                features: ["SSL 256-bit", "RGPD compliant", "ISO 27001", "Backups quotidiens"],
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: LineIconClock,
                title: "Support Premium",
                description: "Équipe d'experts disponible 24/7 pour vous accompagner vers le succès.",
                features: ["Chat en direct", "Support prioritaire", "Onboarding dédié", "Tutoriels vidéo"],
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: LineIconRocket,
                title: "Scalabilité Infinie",
                description: "De 10 à 10 000 utilisateurs sans limite de performance. 99.9% uptime.",
                features: ["Cloud infrastructure", "Auto-scaling", "CDN global", "Zero downtime"],
                gradient: "from-orange-500 to-amber-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-[1px] rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-white/5 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-500"
              >
                <div className="bg-[#13131f]/95 backdrop-blur-xl rounded-[2rem] p-8 h-full">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] shrink-0`}>
                      <div className="w-full h-full bg-[#13131f] rounded-2xl flex items-center justify-center">
                        <feature.icon size={28} className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-400 transition-all">{feature.title}</h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                      <ul className="grid grid-cols-2 gap-3">
                        {feature.features.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                            <LineIconCheck size={16} className="text-green-500 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <div className="inline-block p-[1px] rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              <div className="bg-[#0a0a0f] rounded-3xl px-16 py-12">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Prêt à <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">Dominer</span> ?
                </h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Paiement sécurisé. Annulation facile. Support 24/7.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg rounded-xl hover:shadow-[0_0_40px_rgba(217,119,6,0.5)] transition-all transform hover:-translate-y-1"
                >
                  <Zap size={20} fill="currentColor" />
                  COMMENCER MAINTENANT
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
