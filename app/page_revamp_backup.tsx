"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineIconChevronRight,
  LineIconCheck,
  LineIconZap,
  LineIconShield,
  LineIconUsers,
  LineIconGlobe,
  LineIconStar,
  LineIconArrowRight
} from "@/components/AppIcons";

// --- ANIMATION VARIANTS --- //
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// --- COMPONENTS --- //

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-[0_0_20px_rgba(118,75,162,0.5)]">
            <span className="font-black text-white text-lg">G</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">GENESIS</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Fonctionnalités</Link>
          <Link href="/agents" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Agents</Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Tarifs</Link>
          <Link href="/login" className="text-sm font-medium text-white hover:text-[#667eea] transition-colors">Connexion</Link>
          <Link href="/signup" className="group relative px-6 py-2.5 rounded-lg bg-white text-black font-bold text-sm overflow-hidden">
            <span className="relative z-10 group-hover:text-white transition-colors">Essayer gratuitement</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] to-[#764ba2] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-[#ec4899] selection:text-white overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Divine Ambient Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[#667eea] opacity-[0.06] blur-[150px] rounded-full pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#ec4899] opacity-[0.04] blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm hover:border-[#ec4899]/50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#ec4899] animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-[#ec4899] absolute ml-0"></span>
            <span className="text-xs font-bold tracking-wide uppercase text-gray-300 ml-2">Genesis V2 Engine Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]"
          >
            Des Agents IA Autonomes <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#ec4899] animate-gradient-x">
              au service de votre Empire.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Automatisez 100% de vos tâches répétitives. Sales, Marketing, Support, Juridique : déployez une armée digitale qui ne dort jamais.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-24"
          >
            <Link href="/signup" className="w-full md:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold text-lg shadow-[0_0_40px_rgba(118,75,162,0.4)] hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-1 relative overflow-hidden group">
              <span className="relative z-10">Commencer Maintenant</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <Link href="#demo" className="w-full md:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
              <span>Voir la démo</span>
              <LineIconArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Social Proof Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="border-t border-white/5 pt-12"
          >
            <p className="text-sm font-mono text-gray-500 mb-8 uppercase tracking-widest">Ils dominent leur marché avec Genesis</p>
            <div className="flex overflow-hidden relative w-full group">
              <div className="flex animate-marquee whitespace-nowrap gap-16 items-center w-max hover:paused">
                {[...Array(2)].map((_, setIndex) => (
                  <div key={setIndex} className="flex gap-16 shrink-0 items-center animate-marquee">
                    {['Acme Corp', 'Stark Ind.', 'Cyberdyne', 'Massive Dynamic', 'Tyrell Corp', 'Wayne Ent.', 'Umbrella'].map((company, i) => (
                      <span key={`${setIndex}-${i}`} className="text-2xl font-black font-display text-white/20 uppercase tracking-widest hover:text-white/80 transition-colors duration-300 cursor-default">{company}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- VALUE PROP (Keep Focus) --- */}
      <section className="py-32 px-6 bg-[#0f0f16]" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Restez concentré sur l'essentiel.</h2>
            <p className="text-lg text-gray-400">
              Laissez l'IA gérer le chaos. Nos agents spécialisés s'occupent de la prospection, du contenu et du service client, 24/7, sans erreur humaine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Productivité x5", desc: "Un seul agent accomplit le travail de 5 employés qualifiés.", color: "from-blue-500 to-cyan-500", icon: LineIconZap, visual: "⚡" },
              { title: "Coûts /10", desc: "Réduisez vos charges opérationnelles de 90% immédiatement.", color: "from-purple-500 to-pink-500", icon: LineIconStar, visual: "💎" },
              { title: "Onboarding 2min", desc: "Connectez vos outils et lancez vos agents en quelques clics.", color: "from-emerald-500 to-lime-500", icon: LineIconCheck, visual: "🚀" }
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
              <h2 className="text-4xl md:text-6xl font-black mb-6">Rencontrez l'Équipe.</h2>
              <p className="text-gray-400 max-w-xl text-lg">
                Chaque agent est un expert dans son domaine, entraîné sur des milliards de points de données pour exceller instantanément.
              </p>
            </div>
            <Link href="/agents" className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all font-bold flex items-center gap-3 group">
              Voir tous les agents <LineIconChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "VOX", role: "Telephony Expert", img: "/agents/vox_v2.png", desc: "Gère vos appels entrants et sortants avec une voix humaine indiscernable.", gradient: "from-blue-500 to-indigo-500" },
              { name: "NEXUS", role: "Sales & Outreach", img: "/agents/nexus_v2.png", desc: "Prospecte sur LinkedIn et Email, qualifie les leads et booke vos RDV.", gradient: "from-[#667eea] to-[#764ba2]" },
              { name: "SENTINEL", role: "Legal & Compliance", img: "/agents/sentinel_v2.png", desc: "Vérifie vos contrats, assure la conformité RGPD et protège votre business.", gradient: "from-emerald-500 to-teal-500" },
              { name: "HIVE", role: "Swarm Commander", img: "/agents/hive_v2.png", desc: "Pilote l'ensemble de votre flotte d'agents via WhatsApp.", gradient: "from-amber-500 to-orange-500" },
            ].map((agent, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="group relative rounded-[2.5rem] overflow-hidden aspect-[3/4] border border-white/10 bg-[#13131f] shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all"
              >
                <Image
                  src={agent.img}
                  alt={agent.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                  <button className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                    Déployer <LineIconArrowRight size={16} />
                  </button>
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
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">Gérez votre business<br />depuis WhatsApp.</h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Plus besoin de dashboards complexes. Envoyez simplement un message vocal à HIVE pour lancer une campagne, vérifier vos stats ou générer un contrat. C'est aussi simple que de parler à un ami.
            </p>
            <ul className="space-y-6 mb-12">
              {[
                "Commandes vocales & textuelles en langage naturel : parlez comme à un humain.",
                "Rapports PDF & Excel générés instantanément : finis les exports manuels.",
                "Notifications de leads en temps réel : ne manquez plus jamais une opportunité."
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-[#25D366]/20 text-[#25D366]"><LineIconCheck size={18} /></div>
                  <span className="font-medium text-lg">{feat}</span>
                </li>
              ))}
            </ul>
            <button className="px-10 py-5 bg-[#25D366] text-black font-bold text-lg rounded-2xl hover:shadow-[0_0_50px_rgba(37,211,102,0.5)] transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3 group">
              <Link href="/pricing" className="flex items-center gap-3 w-full justify-center h-full">
                Connecter WhatsApp Maintenant
                <LineIconArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </button>
            <p className="mt-4 text-sm text-[#25D366]/80 font-mono animate-pulse">⚡ Place limitée : accès Beta disponible.</p>
          </div>
          <div className="flex-1 relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 bg-[#25D366] rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
            <div className="relative z-10 bg-[#0a0a0f] border border-white/10 rounded-[3rem] p-4 shadow-2xl">
              <div className="bg-[#13131f] rounded-[2.5rem] h-[650px] overflow-hidden border border-white/5 relative flex flex-col">
                {/* Fake Chat Header */}
                <div className="bg-[#202c33] p-6 flex items-center gap-4 border-b border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 p-[2px]">
                    <Image src="/agents/hive_v2.png" alt="Hive" width={48} height={48} className="rounded-full" />
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
                    <span className="block text-[10px] text-white/50 text-right mt-1">10:42</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-[#202c33] p-4 rounded-2xl rounded-tl-none mr-auto w-fit max-w-[85%] text-sm shadow-lg border border-white/5"
                  >
                    <p className="mb-2">Bien reçu chef. 🫡</p>
                    <p className="mb-2">✅ <strong>Cible :</strong> CEO Tech (Paris)</p>
                    <p>🚀 <strong>Agent NEXUS :</strong> Déployé.</p>
                    <p className="mt-2 text-[#25D366]">Estimation : 50 leads qualifiés/jour.</p>
                    <span className="block text-[10px] text-white/50 text-right mt-1">10:42</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3 STEPS --- */}
      <section className="py-32 px-6 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Commencez en 3 étapes.</h2>
            <p className="text-xl text-gray-400">Pas de code. Pas de configuration complexe. Juste du résultat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-[#667eea]/0 via-[#667eea]/50 to-[#667eea]/0"></div>

            {[
              { num: "01", title: "Connectez", desc: "Liez vos outils (Gmail, LinkedIn, Stripe) en un clic sécurisé.", icon: "🔌" },
              { num: "02", title: "Configurez", desc: "Définissez vos objectifs en langage naturel à HIVE.", icon: "⚙️" },
              { num: "03", title: "Profitez", desc: "Regardez les résultats tomber et votre CA augmenter.", icon: "📈" }
            ].map((step, i) => (
              <div key={i} className="relative text-center group p-6 rounded-3xl hover:bg-white/5 transition-colors duration-500">
                <div className="w-24 h-24 rounded-3xl bg-[#13131f] border border-white/10 flex items-center justify-center mx-auto mb-8 relative z-10 group-hover:bg-[#667eea] transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110">
                  <span className="text-3xl font-black text-gray-500 group-hover:text-white transition-colors relative z-20">{step.num}</span>
                  <div className="absolute inset-0 bg-[#667eea] opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500 rounded-3xl"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">{step.title} <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">{step.icon}</span></h3>
                <p className="text-gray-400 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="py-32 px-6 border-t border-white/5 relative" id="pricing">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#667eea]/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8">Investissez dans votre Domination.</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Choisissez la puissance de feu adaptée à vos ambitions. Changez de plan à tout moment.
            </p>

            <div className="inline-flex bg-[#13131f] p-1.5 rounded-2xl border border-white/10">
              <button onClick={() => setActiveTab('monthly')} className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'monthly' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Mensuel</button>
              <button onClick={() => setActiveTab('yearly')} className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'yearly' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Annuel (-20%)</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* STARTUP */}
            <div className="p-10 bg-[#13131f]/50 backdrop-blur-md border border-white/5 rounded-[2.5rem] flex flex-col hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Starter</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-black font-sans">{activeTab === 'monthly' ? '99€' : '79€'}</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 min-h-[40px]">L'essentiel pour automatiser vos premières tâches.</p>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-white/10 rounded-full"><LineIconCheck size={14} /></div> 1 Agent (au choix)</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-white/10 rounded-full"><LineIconCheck size={14} /></div> 1,000 Crédits/mois</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-white/10 rounded-full"><LineIconCheck size={14} /></div> Support Email</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-white/10 rounded-full"><LineIconCheck size={14} /></div> Accès Dashboard</li>
              </ul>
              <Link href="/signup?plan=starter" className="w-full py-4 border border-white/20 rounded-xl font-bold text-center hover:bg-white hover:text-black transition-colors">Commencer</Link>
            </div>

            {/* GROWTH */}
            <div className="p-10 bg-[#13131f] border-2 border-[#667eea] rounded-[2.5rem] flex flex-col relative scale-105 shadow-[0_0_60px_rgba(102,126,234,0.15)] z-20">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg uppercase tracking-wider">Recommandé</div>
              <h3 className="text-2xl font-bold text-[#667eea] mb-2">Pro</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-6xl font-black font-sans tracking-tight">{activeTab === 'monthly' ? '299€' : '239€'}</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 min-h-[40px]">La suite complète pour scaler votre entreprise rapidement.</p>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-bold text-white"><div className="p-1 bg-[#667eea] text-white rounded-full"><LineIconCheck size={14} /></div> 3 Agents IA</li>
                <li className="flex items-center gap-3 text-sm font-bold text-white"><div className="p-1 bg-[#667eea] text-white rounded-full"><LineIconCheck size={14} /></div> 2,500 Crédits/mois</li>
                <li className="flex items-center gap-3 text-sm font-bold text-white"><div className="p-1 bg-[#667eea] text-white rounded-full"><LineIconCheck size={14} /></div> WhatsApp Command (HIVE)</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-[#667eea]/20 text-[#667eea] rounded-full"><LineIconCheck size={14} /></div> Accès API (Limité)</li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-[#667eea]/20 text-[#667eea] rounded-full"><LineIconCheck size={14} /></div> Support Prioritaire</li>
              </ul>
              <Link href="/signup?plan=growth" className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl font-bold text-white text-center hover:shadow-lg hover:shadow-[#667eea]/25 transition-all transform hover:-translate-y-1">S'abonner maintenant</Link>
            </div>

            {/* GOD MODE */}
            <div className="p-10 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0f] border border-pink-500/20 rounded-[2.5rem] flex flex-col bg-[url('/grid.svg')] hover:border-pink-500/50 transition-colors duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2 relative z-10">God Mode (Enterprise)</h3>
              <div className="mb-6 flex items-baseline gap-1 relative z-10">
                <span className="text-5xl font-black font-sans">{activeTab === 'monthly' ? '999€' : '799€'}</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 min-h-[40px]">Puissance illimitée pour écraser la concurrence.</p>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-pink-500/20 text-pink-500 rounded-full"><LineIconZap size={14} /></div> <strong>Agents Illimités</strong></li>
                <li className="flex items-center gap-3 text-sm"><div className="p-1 bg-pink-500/20 text-pink-500 rounded-full"><LineIconZap size={14} /></div> 15,000 Crédits/mois</li>
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
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 px-6 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Questions Fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: "Comment fonctionnent les crédits ?", a: "Chaque action d'un agent (appel, message, recherche) consomme des crédits. Le plan Growth vous donne 10,000 crédits, suffisant pour environ 2,000 interactions." },
              { q: "Puis-je annuler à tout moment ?", a: "Oui, sans aucun engagement. Vous gardez l'accès jusqu'à la fin de la période facturée." },
              { q: "Est-ce sécurisé ?", a: "Absolument. Nous utilisons un chiffrement de niveau bancaire et ne stockons jamais vos données sensibles en clair. Conforme RGPD." },
              { q: "Le God Mode inclut vraiment tout ?", a: "Oui. Vous avez accès à toute notre puissance de calcul sans limite, et un ingénieur dédié pour configurer vos workflows." }
            ].map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-[#13131f]/50">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between font-bold hover:bg-white/5 transition-colors"
                >
                  {faq.q}
                  <LineIconChevronRight className={`transform transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-6 text-gray-400 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#050508]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-black text-xs text-white">G</div>
            <span className="font-bold text-xl tracking-tight text-white">GENESIS</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 Genesis Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">Legal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
