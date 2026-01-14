"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Star, ArrowRight, Zap, Check, CheckCircle2, Menu, X, Crown, Target, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineIconChevronRight,
  LineIconZap,
  LineIconStar,
  LineIconCheck,
  LineIconArrowRight,
  LineIconGlobe,
  LineIconTrendingUp,
} from "@/components/AppIcons";

import BlurFade from "@/components/ui/blur-fade";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">
      {/* --- HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-pink-500 flex items-center justify-center overflow-hidden border border-white/20 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30"></div>
              <img src="/chip.svg" alt="chip" className="w-6 h-6 text-white relative z-10" />
              {/* Fallback Icon if chip.svg invalid */}
              <Zap className="w-6 h-6 text-white relative z-10" />
            </div>
            <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">
              GENESIS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/agents" className="text-sm font-bold text-gray-400 hover:text-white transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">AGENTS</Link>
            <Link href="/features" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">FONCTIONNALITÉS</Link>
            <Link href="/pricing" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">TARIFS</Link>
            <Link href="/contact" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">CONTACT</Link>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold hover:text-blue-400 transition-colors">SE CONNECTER</Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 rounded-lg font-bold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all transform hover:-translate-y-1 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2"><Zap size={16} fill="currentColor" /> ESSAI GRATUIT</span>
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 mb-8 backdrop-blur-md">
              <Zap className="w-5 h-5 text-blue-500" fill="currentColor" />
              <span className="text-sm font-bold text-white">SYSTÈME AUTONOME</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">ÉCRASEZ LA</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">CONCURRENCE.</span>
            </h1>

            <p className="text-xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-6 leading-relaxed font-bold">
              9 ARMES ULTIMES. ZÉRO PITIÉ.
            </p>
            <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-12">
              Pendant qu'ils dorment, vous <span className="text-blue-500 font-bold">DOMINEZ</span> le marché. 24/7. Sans limite.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Primary CTA - Most prominent */}
              <Link href="/signup" className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-pink-600 rounded-xl font-black text-xl flex items-center gap-4 hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-2 hover:scale-110 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <Target className="w-6 h-6 relative z-10" />
                <span className="relative z-10 uppercase tracking-wider">PRENEZ LE POUVOIR</span>
                <Rocket className="w-6 h-6 relative z-10 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
              </Link>

              {/* Secondary CTA */}
              <Link href="/agents" className="group px-8 py-4 bg-transparent border-2 border-purple-500/30 rounded-xl font-bold flex items-center gap-3 hover:bg-purple-500/10 transition-all hover:scale-105 hover:border-purple-500 text-purple-400">
                <Star className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                VOIR L'ARSENAL
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Sans carte bancaire</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Annulation en 1 clic</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Support 24/7</span>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* --- SOCIAL PROOF (Marquee) --- */}
      <section className="py-10 border-y border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-transparent to-[#0a0a0f] z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex items-center gap-12 justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex animate-marquee whitespace-nowrap gap-28 items-center w-max hover:paused">
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-28 shrink-0 items-center animate-marquee">
                  <span className="text-2xl font-black tracking-widest text-white">ACME</span>
                  <span className="text-2xl font-black tracking-widest text-white">STARK</span>
                  <span className="text-2xl font-black tracking-widest text-white">WAYNE</span>
                  <span className="text-2xl font-black tracking-widest text-white">CYBERDYNE</span>
                  <span className="text-2xl font-black tracking-widest text-white">TYRELL</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUE PROP (Keep Focus) --- */}
      <section className="py-32 px-6 bg-[#0f0f16]" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <span className="text-blue-400 font-bold text-sm">💡 POURQUOI GENESIS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Votre Concurrent Dort.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Vous Dominez.</span></h2>
            <p className="text-lg text-gray-400">
              Pendant que d'autres perdent du temps sur des tâches répétitives, vos agents IA génèrent des leads, du contenu et des revenus — <span className="text-white font-semibold">24 heures sur 24</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Productivité x5", desc: "Un seul agent accomplit le travail de 5 employés qualifiés.", color: "from-blue-500 to-cyan-500", icon: LineIconZap, visual: "⚡", illustration: "/assets/productivity.png?v=4" },
              { title: "Coûts /10", desc: "Réduisez vos charges opérationnelles de 90% immédiatement.", color: "from-purple-500 to-pink-500", icon: LineIconStar, visual: "💎", illustration: "/assets/feat_costs.png?v=4" },
              { title: "Onboarding 2min", desc: "Connectez vos outils et lancez vos agents en quelques clics.", color: "from-emerald-500 to-lime-500", icon: LineIconCheck, visual: "🚀", illustration: "/assets/feat_onboarding.png?v=4" }
            ].map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="p-10 rounded-[2rem] bg-[#13131f] border border-white/5 hover:border-[#667eea]/30 transition-all relative overflow-hidden group hover:-translate-y-2"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
                <div className="absolute top-4 right-4 text-4xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-500">{item.visual}</div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform duration-300 relative z-10 border border-white/10 group-hover:border-white/30">
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{item.desc}</p>
                <div className="relative h-32 w-full rounded-xl overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity duration-500 border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                  <img src={item.illustration} alt={item.title} className="w-full h-full object-cover" loading="eager" />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AGENTS GRID --- */}
      <section className="py-32 px-6 relative" id="agents">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
                <span className="text-purple-400 font-bold text-sm">🤖 L'ÉQUIPE</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">9 Experts.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Zéro Salaire.</span></h2>
              <p className="text-gray-400 max-w-xl text-lg">
                Chaque agent maîtrise son domaine. Ils travaillent ensemble, sans pause café, sans RTT, sans erreur.
              </p>
            </div>
            <Link href="/agents" className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all font-bold flex items-center gap-3 group">
              Voir tous les agents <LineIconChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "VOX", role: "Telephony Expert", img: "/agents/vox_v2.png?v=4", desc: "Gère vos appels entrants et sortants avec une voix humaine indiscernable.", gradient: "from-blue-500 to-indigo-500" },
              { name: "NEXUS", role: "Sales & Outreach", img: "/agents/nexus_v2.png?v=4", desc: "Prospecte sur LinkedIn et Email, qualifie les leads et booke vos RDV.", gradient: "from-[#667eea] to-[#764ba2]" },
              { name: "SENTINEL", role: "Legal & Compliance", img: "/agents/sentinel_v2.png?v=4", desc: "Vérifie vos contrats, assure la conformité RGPD et protège votre business.", gradient: "from-emerald-500 to-teal-500" },
              { name: "HIVE", role: "Swarm Commander", img: "/agents/hive_v2.png?v=4", desc: "Pilote l'ensemble de votre flotte d'agents via WhatsApp.", gradient: "from-amber-500 to-orange-500" },
            ].map((agent, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="group relative rounded-[2.5rem] overflow-hidden aspect-[3/4] border border-white/10 bg-[#13131f] shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all"
              >
                <img
                  src={agent.img}
                  alt={agent.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent opacity-90"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className={`w-fit px-4 py-1.5 rounded-full bg-gradient-to-r ${agent.gradient} text-xs font-black mb-4 uppercase tracking-wider`}>
                    {agent.role}
                  </div>
                  <h3 className="text-4xl font-black mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {agent.desc}
                  </p>
                  <Link href="/agents" className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                    Déployer <LineIconArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHATSAPP SECTION --- */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0f0f16] to-[#0a0a0f] border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <div className="w-20 h-20 rounded-3xl bg-[#25D366]/20 flex items-center justify-center mb-10 text-[#25D366]">
              <span className="text-5xl">💬</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 mb-6">
              <span className="text-[#25D366] font-bold text-sm">📱 CONTRÔLE TOTAL</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">Pilotez l'Empire<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-emerald-400">Depuis WhatsApp.</span></h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Plus besoin de dashboards complexes. Envoyez simplement un message vocal à HIVE pour lancer une campagne, vérifier vos stats ou générer un contrat. C'est aussi simple que de parler à un ami.
            </p>
            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-4 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="font-medium text-lg">Commandes vocales & textuelles en langage naturel : parlez comme à un humain.</span>
              </div>
              <div className="flex items-center gap-4 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="font-medium text-lg">Rapports PDF & Excel générés instantanément : finis les exports manuels.</span>
              </div>
              <div className="flex items-center gap-4 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="font-medium text-lg">Notifications de leads en temps réel : ne manquez plus jamais une opportunité.</span>
              </div>
              <div className="flex items-center gap-4 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="font-medium text-lg">Multi-Utilisateurs : donnez accès à toute votre équipe commercial.</span>
              </div>
              <div className="flex items-center gap-4 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="font-medium text-lg">Sécurité Chiffrée : vos données sensibles restent protégées.</span>
              </div>
              <div className="flex items-center gap-4 text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="font-medium text-lg">Disponibilité 24/7 : votre business ne dort jamais, HIVE non plus.</span>
              </div>
            </div>
            <a href="#pricing" className="px-10 py-5 bg-[#25D366] text-black font-bold text-lg rounded-2xl hover:shadow-[0_0_50px_rgba(37,211,102,0.5)] transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3 group cursor-pointer text-center justify-center">
              Connecter WhatsApp Maintenant
              <LineIconArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="mt-4 text-sm text-[#25D366]/80 font-mono animate-pulse">⚡ Place limitée : accès Beta disponible.</p>
          </div>
          <div className="flex-1 relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 bg-[#25D366] rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
            <div className="relative z-10 bg-[#0a0a0f] border border-white/10 rounded-[3rem] p-4 shadow-2xl">
              <div className="bg-[#13131f] rounded-[2.5rem] h-[650px] overflow-hidden border border-white/5 relative flex flex-col">
                {/* Fake Chat Header */}
                <div className="bg-[#202c33] p-6 flex items-center gap-4 border-b border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 p-[2px] overflow-hidden">
                    <img src="/agents/hive_v2.png?v=3" alt="Hive" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">HIVE (Genesis)</p>
                    <p className="text-xs text-[#25D366] font-mono">En ligne</p>
                  </div>
                </div>
                {/* Fake Chat Body */}
                <div className="p-6 space-y-6 mt-auto bg-[url('/assets/whatsapp-bg.png')] bg-opacity-10">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#005c4b] p-4 rounded-2xl rounded-tr-none ml-auto w-fit max-w-[85%] text-sm shadow-lg border border-white/5"
                  >
                    Lance une campagne de prospection sur les CEO tech à Paris.
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#202c33] p-4 rounded-2xl rounded-tl-none w-fit max-w-[85%] text-sm shadow-lg border border-white/5"
                  >
                    Bien reçu. J'active NEXUS sur LinkedIn. Cible : CEO Tech @ Paris.
                    <br /><br />
                    Je commence l'extraction des profils. Je t'envoie un rapport dans 5 minutes. 🚀
                  </motion.div>
                </div>
                {/* Fake Input */}
                <div className="p-4 bg-[#202c33] border-t border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400">+</div>
                  <div className="flex-1 h-10 bg-[#2a3942] rounded-full px-4 flex items-center text-gray-400 text-sm">Message...</div>
                  <div className="w-10 h-10 rounded-full bg-[#005c4b] flex items-center justify-center text-white"><Zap size={18} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3 STEPS --- */}
      <section className="py-32 px-6 bg-[#0f0f16] relative overflow-hidden">
        {/* Ambient Background Elements */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 cursor-default">
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">Pourquoi vous allez perdre si vous n'automatisez pas.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Vos concurrents saturent déjà l'espace numérique. HIVE vous donne l'avantage injuste de l'omniprésence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Omniprésence Sociale",
                desc: "Ne laissez plus aucune plateforme vide. HIVE inonde LinkedIn, X, Instagram et TikTok de contenu pertinent simultanément. Soyez partout, tout le temps.",
                color: "blue",
                bgIcons: (
                  <>
                    <LineIconGlobe className="absolute top-4 right-4 w-12 h-12 text-blue-500/10 rotate-12" />
                    <div className="absolute bottom-4 left-4 font-black text-6xl text-blue-500/5 -rotate-12 z-0">IN</div>
                    <div className="absolute bottom-12 right-12 font-black text-6xl text-blue-500/5 rotate-6 z-0">X</div>
                  </>
                ),
                accent: "LinkedIn & X"
              },
              {
                title: "Neuromarketing IA",
                desc: "L'IA analyse les biais cognitifs de votre audience pour rédiger des hooks impossibles à ignorer. Capturez l'attention reptilienne de vos prospects en 0.3 seconde.",
                color: "purple",
                bgIcons: (
                  <>
                    <LineIconZap className="absolute top-4 right-4 w-12 h-12 text-purple-500/10 -rotate-6" />
                    <div className="absolute bottom-8 right-8 font-black text-6xl text-purple-500/5 rotate-12 z-0">🧠</div>
                  </>
                ),
                accent: "Conversion Max"
              },
              {
                title: "Monétisation Passive",
                desc: "Chaque interaction est une opportunité de vente. HIVE transforme votre audience en revenus récurrents pendant que vous dormez. L'automatisation est votre meilleur commercial.",
                color: "pink",
                bgIcons: (
                  <>
                    <LineIconTrendingUp className="absolute top-4 right-4 w-12 h-12 text-pink-500/10 rotate-45" />
                    <div className="absolute bottom-4 left-4 font-black text-6xl text-pink-500/5 -rotate-6 z-0">€</div>
                  </>
                ),
                accent: "Revenus 24/7"
              }
            ].map((item, i) => (
              <div key={i} className={`relative overflow-hidden flex flex-col items-center text-center p-10 rounded-[2.5rem] border transition-all duration-500 group hover:-translate-y-3 cursor-default
                ${item.color === 'blue' ? 'bg-[#13131f] border-blue-500/20 hover:border-blue-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]' : ''}
                ${item.color === 'purple' ? 'bg-[#13131f] border-purple-500/20 hover:border-purple-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)]' : ''}
                ${item.color === 'pink' ? 'bg-[#13131f] border-pink-500/20 hover:border-pink-500 hover:shadow-[0_0_50px_rgba(236,72,153,0.2)]' : ''}
              `}>
                {/* Visual Background Elements */}
                {item.bgIcons}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none
                    ${item.color === 'blue' ? 'from-blue-500/10 to-cyan-500/5' : ''}
                    ${item.color === 'purple' ? 'from-purple-500/10 to-indigo-500/5' : ''}
                    ${item.color === 'pink' ? 'from-pink-500/10 to-rose-500/5' : ''}
                `}></div>

                {/* Accent Tag */}
                <div className={`mb-8 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors relative z-10
                    ${item.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white' : ''}
                    ${item.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white' : ''}
                    ${item.color === 'pink' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20 group-hover:bg-pink-500 group-hover:text-white' : ''}
                `}>
                  {item.accent}
                </div>

                <h3 className="text-3xl font-black mb-6 relative z-10">{item.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section className="py-32 px-6 bg-[#0a0a0f]" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Investissez dans votre domination.</h2>
            <p className="text-gray-400">Des tarifs transparents. Rentabilité dès le premier mois.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* STARTER */}
            <div className="p-8 rounded-[2rem] bg-[#13131f] border border-white/5 flex flex-col hover:border-[#667eea]/30 transition-all">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black">99€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 min-h-[40px]">L'essentiel pour automatiser vos premières tâches.</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> 1 Agent (au choix)</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> 1.000 Crédits/mois</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Support Email</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Accès Dashboard</div>

                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Mises à jour Hebdomadaires</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Sécurité SSL</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /> Accès Mobile</div>
              </div>
              <Link href="/signup?plan=starter" className="w-full py-4 border border-white/20 rounded-xl font-bold text-center hover:bg-white hover:text-black transition-colors">Commencer</Link>
            </div>

            {/* PRO (Highlighted) */}
            <div className="p-8 rounded-[2rem] bg-[#1a1a2e] border border-[#667eea] flex flex-col relative transform md:-translate-y-8 shadow-[0_0_50px_rgba(102,126,234,0.1)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-[#667eea] rounded-full text-xs font-bold uppercase tracking-widest shrink-0 whitespace-nowrap">
                Recommandé
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#667eea]">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black">299€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 min-h-[40px]">La suite complète pour scaler votre entreprise rapidement.</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> 3 Agents IA</div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> 2,500 Crédits/mois</div>
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

            {/* GOD MODE (Divine/Gold Edition) */}
            <div className="relative p-1 bg-[#1a1005] rounded-[2.5rem] group transform hover:scale-105 transition-all duration-500 shadow-[0_0_100px_rgba(217,119,6,0.3)]">
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
                    <span className="text-6xl font-black text-white tracking-tighter">999€</span>
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
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          &copy; 2026 GENESIS Corp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
