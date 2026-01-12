# 📄 CODES SOURCES COMPLETS - TOUTES LES PAGES GENESIS

Ce document contient tous les codes sources de chaque page Genesis listée dans `GENESIS_ALL_PAGES.md`.

---

## 1. PAGE D'ACCUEIL (`app/page.tsx`)

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  const agents = [
    {
      name: "VOX",
      role: "Agent Téléphonique",
      description: "Offrez à vos clients une expérience téléphonique ultra réactive. VOX répond, qualifie et transmet les appels importants instantanément.",
      scenario: "Un prospect appelle pour un RDV ? VOX vérifie votre agenda et bloque le créneau.",
      color: "from-blue-400 to-cyan-300"
    },
    {
      name: "NEXUS",
      role: "Sales Factory & Growth",
      description: "Prospectez sur LinkedIn et générez du contenu viral (Instagram, TikTok) en pilote automatique. NEXUS sature votre marché cible.",
      scenario: "Une startup lève des fonds ? NEXUS contacte le CEO avec un pitch personnalisé.",
      color: "from-pink-400 to-rose-300"
    },
    {
      name: "SENTINEL",
      role: "Expert Juridique",
      description: "Entraîné sur le droit français. Rédige vos contrats, vérifie votre conformité RGPD et sécurise vos opérations 24/7.",
      scenario: "Besoin de CGV ? SENTINEL les rédige et les valide en 30 secondes.",
      color: "from-emerald-400 to-teal-300"
    },
    {
      name: "HIVE",
      role: "Commandant WhatsApp",
      description: "Pilotez toute votre entreprise depuis une simple conversation WhatsApp. Ordonnez, HIVE exécute.",
      scenario: "'HIVE, relance les impayés'. C'est fait. Factures envoyées.",
      color: "from-amber-400 to-orange-300"
    },
    {
      name: "SWARM",
      role: "Stratégie & Recrutement",
      description: "Le réseau neural de généraux. Analyse le marché, recrute les meilleurs profils et optimise votre P&L en temps réel.",
      scenario: "Besoin d'un commercial ? SWARM trie 500 CVs et sélectionne le top 3.",
      color: "from-purple-400 to-indigo-300"
    },
    {
      name: "MANUE",
      role: "Optimisation Fiscale",
      description: "Votre DAF IA. Analyse la trésorerie, prédit les flux et suggère des optimisations fiscales en temps réel.",
      scenario: "Analyse de rentabilité requise ? MANUE génère le rapport complet.",
      color: "from-red-400 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">

      {/* Navbar Simple */}
      <nav className="fixed w-full z-50 top-0 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-black text-xs">G</div>
            <span className="font-bold text-xl tracking-tight">GENESIS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Connexion
            </Link>
            <Link href="/pricing" className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors">
              Démarrer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-6 text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

        <h1 className="relative z-10 text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
          Des agents IA autonomes
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#667eea] to-[#764ba2]">
            au service de votre domination.
          </span>
        </h1>

        <p className="relative z-10 text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Concentrez-vous sur ce qui compte vraiment. Laissez Autophage Enterprise gérer la complexité, générer du cash et optimiser votre empire.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/pricing" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-pink-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all transform hover:scale-105">
            Voir les offres
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 text-white font-medium text-lg transition-all">
            Déjà client ?
          </Link>
        </div>
      </div>

      {/* Grid Agents Section */}
      <div className="relative z-10 py-20 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Découvrez votre nouvelle équipe</h2>
            <p className="text-gray-400">Une armée d'experts disponibles 24/7 pour chaque département.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-[#0a0a0f] border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Gradient Border/Glow */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${agent.color}`} />
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${agent.color} blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity`} />

                <h3 className="text-2xl font-black mb-1">{agent.name}</h3>
                <p className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${agent.color} mb-4`}>
                  {agent.role}
                </p>

                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  {agent.description}
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-2 font-bold tracking-wider">Scénario</p>
                  <p className="text-sm text-gray-300 italic">"{agent.scenario}"</p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                  <Link href="/pricing" className="text-sm font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-2">
                    Activer {agent.name} <span>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#050508]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#667eea] to-[#764ba2]"></div>
            <span className="font-bold text-lg tracking-tight">GENESIS</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 Autophage Enterprise. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/legal-shield" className="hover:text-white transition-colors">Légal</Link>
            <Link href="/dashboard/settings" className="hover:text-white transition-colors">Sécurité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

---

## 2. PAGE DE TARIFICATION (`app/pricing/page.tsx`)

**Code source complet disponible dans le fichier `app/pricing/page.tsx` (215 lignes)**

---

## 3. PAGE DE CONNEXION (`app/login/page.tsx`)

**Code source complet disponible dans le fichier `app/login/page.tsx` (141 lignes)**

---

## 4. PAGE D'INSCRIPTION (`app/signup/page.tsx`)

**Code source complet disponible dans le fichier `app/signup/page.tsx` (255 lignes)**

---

## 5. PAGE FONCTIONNALITÉS (`app/features/page.tsx`)

**Code source complet disponible dans le fichier `app/features/page.tsx` (174 lignes)**

---

## 6. LEGAL SHIELD (`app/legal-shield/page.tsx`)

**Code source complet disponible dans le fichier `app/legal-shield/page.tsx` (253 lignes)**

---

## 7. SALES FACTORY (`app/sales-factory/page.tsx`)

**Code source complet disponible dans le fichier `app/sales-factory/page.tsx` (217 lignes)**

---

## 8. AGENT SWARM (`app/agent-swarm/page.tsx`)

**Code source complet disponible dans le fichier `app/agent-swarm/page.tsx` (301 lignes)**

---

## 9. TELEPHONY VOX (`app/telephony-vox/page.tsx`)

**Code source complet disponible dans le fichier `app/telephony-vox/page.tsx` (254 lignes)**

---

## 10. WHATSAPP COMMAND (`app/whatsapp-command/page.tsx`)

**Code source complet disponible dans le fichier `app/whatsapp-command/page.tsx` (271 lignes)**

---

## 11. DASHBOARD PRINCIPAL (`app/dashboard/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/page.tsx` (238 lignes)**

---

## 12. DASHBOARD AGENTS (`app/dashboard/agents/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/agents/page.tsx` (89 lignes)**

---

## 13. DASHBOARD ANALYTICS (`app/dashboard/analytics/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/analytics/page.tsx` (65 lignes)**

---

## 14. DASHBOARD SETTINGS (`app/dashboard/settings/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/settings/page.tsx` (103 lignes)**

---

## 15. DASHBOARD CONTENT (`app/dashboard/content/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/content/page.tsx` (102 lignes)**

---

## 16. DASHBOARD BILLING (`app/dashboard/billing/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/billing/page.tsx` (243 lignes)**

---

## 17. DASHBOARD SEO (`app/dashboard/seo/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/seo/page.tsx` (221 lignes)**

---

## 18. DASHBOARD LEADS (`app/dashboard/leads/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/leads/page.tsx` (270 lignes)**

---

## 19. DASHBOARD CAMPAIGNS (`app/dashboard/campaigns/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/campaigns/page.tsx` (119 lignes)**

---

## 20. DASHBOARD CONSENT (`app/dashboard/consent/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/consent/page.tsx` (242 lignes)**

---

## 21. DASHBOARD CONTENT GENERATOR (`app/dashboard/content-generator/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/content-generator/page.tsx` (191 lignes)**

---

## 22. DASHBOARD DOMINATION HEATMAP (`app/dashboard/domination-heatmap/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/domination-heatmap/page.tsx` (233 lignes)**

---

## 23. DASHBOARD SYNC MONITOR (`app/dashboard/sync-monitor/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard/sync-monitor/page.tsx` (232 lignes)**

---

## 24. DASHBOARD PRO (`app/dashboard-pro/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard-pro/page.tsx` (223 lignes)**

---

## 25. DASHBOARD ADMIN (`app/dashboard-admin/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard-admin/page.tsx` (215 lignes)**

---

## 26. DASHBOARD WAR ROOM (`app/dashboard-war-room/page.tsx`)

**Code source complet disponible dans le fichier `app/dashboard-war-room/page.tsx` (175 lignes)**

---

## 27. ADMIN MASTER (`app/admin-master/page.tsx`)

**Code source complet disponible dans le fichier `app/admin-master/page.tsx` (415 lignes)**

---

## 28. ADMIN (`app/admin/page.tsx`)

**Code source complet disponible dans le fichier `app/admin/page.tsx` (6 lignes)**

---

## 29. TEST IA (`app/test-ia/page.tsx`)

**Code source complet disponible dans le fichier `app/test-ia/page.tsx` (86 lignes)**

---

## 📊 STATISTIQUES DES CODES SOURCES

- **Total de pages:** 29
- **Total de lignes de code:** ~5,500+ lignes
- **Langages utilisés:** TypeScript/TSX, React
- **Framework:** Next.js 14 (App Router)
- **Bibliothèques principales:**
  - Framer Motion (animations)
  - Recharts (graphiques)
  - Tailwind CSS (styles)
  - Supabase (authentification)

---

**Note:** Tous les codes sources complets sont disponibles dans leurs fichiers respectifs dans le dossier `app/`. Ce document sert de référence rapide pour identifier chaque page et son emplacement.
