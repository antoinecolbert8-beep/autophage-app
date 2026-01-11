"use client";

/**
 * 💎 PAGE FEATURES - VERSION GENESIS (DARK)
 */

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineIconRocket,
  LineIconZap,
  LineIconShield,
  LineIconBarChart,
  LineIconGlobe,
  LineIconClock,
  LineIconCheck
} from "@/components/LineIcons";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center">
                <LineIconRocket size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Genesis</span>
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white font-medium transition-colors">
              ← Retour
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-40" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            Toutes les fonctionnalités <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#667eea] to-[#764ba2]">
              dont vous avez besoin.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Genesis regroupe tous les outils essentiels pour automatiser votre entreprise de A à Z.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {[
              {
                icon: LineIconZap,
                title: "Automatisation Complète",
                description: "Automatisez l'intégralité de vos processus métiers avec nos 9 agents IA spécialisés. De la comptabilité au marketing, tout est géré automatiquement.",
                features: [
                  "9 agents IA spécialisés",
                  "Workflows personnalisables",
                  "Déclencheurs intelligents",
                  "Intégrations natives"
                ],
                color: "text-yellow-400"
              },
              {
                icon: LineIconBarChart,
                title: "Analytics Temps Réel",
                description: "Suivez les performances de vos agents en temps réel avec des dashboards interactifs et des rapports automatiques.",
                features: [
                  "Tableaux de bord personnalisables",
                  "Rapports automatiques",
                  "Prédictions IA",
                  "Export de données"
                ],
                color: "text-blue-400"
              },
              {
                icon: LineIconGlobe,
                title: "Multi-Plateformes",
                description: "Connectez tous vos outils favoris : YouTube, TikTok, Instagram, LinkedIn, Stripe, Shopify, Slack, Notion et bien plus.",
                features: [
                  "10+ intégrations natives",
                  "API complète",
                  "Webhooks personnalisés",
                  "Synchronisation bidirectionnelle"
                ],
                color: "text-purple-400"
              },
              {
                icon: LineIconShield,
                title: "Sécurité Maximale",
                description: "Vos données sont protégées par un chiffrement de niveau bancaire et hébergées sur des serveurs certifiés en France.",
                features: [
                  "Chiffrement SSL 256-bit",
                  "Conformité RGPD",
                  "ISO 27001 certifié",
                  "Sauvegardes quotidiennes"
                ],
                color: "text-green-400"
              },
              {
                icon: LineIconClock,
                title: "Support 24/7",
                description: "Notre équipe d'experts est disponible 24h/24 et 7j/7 pour répondre à toutes vos questions et vous accompagner.",
                features: [
                  "Chat en direct",
                  "Support prioritaire",
                  "Base de connaissances",
                  "Vidéos tutoriels"
                ],
                color: "text-red-400"
              },
              {
                icon: LineIconRocket,
                title: "Scalabilité Illimitée",
                description: "Genesis grandit avec vous. Passez de 10 à 10 000 utilisateurs sans aucune limite de performance.",
                features: [
                  "Infrastructure cloud",
                  "Auto-scaling",
                  "99.9% uptime garanti",
                  "CDN global"
                ],
                color: "text-orange-400"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                    <feature.icon size={32} className={`${feature.color}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, j) => (
                      <li key={j} className="flex items-center space-x-2 text-gray-300">
                        <LineIconCheck size={18} className="text-[#667eea] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à découvrir Genesis ?
          </h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Commencez votre essai gratuit de 7 jours. Sans carte bancaire. Annulation en 1 clic.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center space-x-2 px-10 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(118,75,162,0.5)] transition-all transform hover:-translate-y-1"
          >
            <span>Essayer gratuitement</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
