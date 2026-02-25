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
import { GrainTexture, TextReveal, CyberGlitch } from "@/components/AdvancedVisuals";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#66fcf1]/30 overflow-x-hidden snap-y snap-mandatory scroll-smooth">
      <GrainTexture />
      {/* 🚨 GLOBAL ALERT BANNER */}
      <div className="w-full bg-[#66fcf1] py-2 px-8 flex items-center justify-center gap-6 overflow-hidden relative z-[60]">
        <div className="flex animate-marquee whitespace-nowrap gap-12 text-[10px] font-black text-[#0b0c10] uppercase tracking-[0.2em]">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-3">
              <Zap size={12} fill="currentColor" /> ALERTE GÉNÉRALE : L'INFRASTRUCTURE ELA EST DÉSORMAIS OUVERTE AUX MÉDIAS ET PARTENAIRES
            </span>
          ))}
        </div>
      </div>

      {/* --- HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group z-50">
            <div className="w-12 h-12 border border-[#66fcf1]/30 rounded-full flex items-center justify-center bg-white/5 relative group-hover:border-[#66fcf1]/60 transition-colors duration-700">
              <div className="w-8 h-8 border border-[#66fcf1] rounded-full border-t-transparent animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-0 bg-[#66fcf1]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <span className="text-2xl font-black tracking-[0.3em] uppercase text-white stat-value pt-1">
              ELA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {['Agents', 'Features', 'Pricing', 'Partners', 'Press'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace('press', 'press')}`}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-[#66fcf1] transition-all relative group"
              >
                {item === 'Press' ? 'Presse' : item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#66fcf1] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">LOGIN</Link>
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-[#66fcf1] text-[#0b0c10] rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:shadow-[0_0_30px_rgba(102,252,241,0.3)] btn-haptic"
            >
              INITIALISER
            </Link>
          </div>

          <button className="md:hidden text-[#66fcf1] z-50 relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="absolute top-0 left-0 w-full h-screen bg-[#0b0c10] flex flex-col pt-32 px-8 z-40 border-l border-white/5"
            >
              <nav className="flex flex-col gap-12 text-left">
                {['Agents', 'Features', 'Pricing', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-black text-white stat-value uppercase tracking-tighter hover:text-[#66fcf1] transition-colors"
                  >
                    {item}.
                  </Link>
                ))}
                <div className="h-px bg-white/5 w-24" />
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500">SE CONNECTER</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="py-6 bg-[#66fcf1] text-[#0b0c10] rounded-xl font-black text-[12px] uppercase tracking-[0.4em] text-center btn-haptic">
                  INITIALISER LE PROTOCOLE
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-32 px-8 overflow-hidden min-h-screen flex items-center justify-center snap-start">
        {/* Animated Background Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(102,252,241,0.03),transparent_70%)] opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#66fcf1]/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center z-10">
          {/* Breaking News / Press Banner */}
          <Link href="/press" className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/30 mb-8 backdrop-blur-xl group hover:bg-[#66fcf1]/20 transition-all duration-500 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#66fcf1] shadow-[0_0_10px_#66fcf1]"></span>
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#66fcf1]">COMMUNIQUÉ OFFICIEL : DÉPLOIEMENT DU CALIBRE V10.4 SOUVERAIN</span>
            <ArrowRight size={12} className="text-[#66fcf1] group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Trust Badge (Mechanical) */}
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 mb-16 backdrop-blur-xl group hover:border-[#66fcf1]/30 transition-all duration-700">
            <div className="w-2 h-2 rounded-full bg-[#66fcf1] animate-pulse shadow-[0_0_10px_#66fcf1]"></div>
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-600 group-hover:text-[#66fcf1] transition-colors italic">CALIBRE SOUVERAIN V10.4 // OPÉRATIONNEL</span>
          </div>

          <h1 className="text-5xl md:text-[10rem] font-black tracking-tighter mb-12 leading-[0.85] uppercase stat-value text-white">
            <TextReveal>MAÎTRISE ALGORITHMIQUE.</TextReveal>
          </h1>

          <p className="text-xl md:text-3xl text-gray-500 max-w-4xl mx-auto mb-16 leading-tight font-light tracking-[0.1em] px-2 italic uppercase">
            &bdquo; Le temps est l'alliage noble de votre succès.<br />Automatisez votre héritage avec une précision séculaire. &rdquo;
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
            <CyberGlitch>
              <Link href="/signup" className="w-full md:w-auto px-16 py-7 bg-[#66fcf1] text-[#0b0c10] rounded-xl font-black text-[12px] uppercase tracking-[0.4em] hover:shadow-[0_0_60px_rgba(102,252,241,0.5)] transition-all btn-haptic block text-center">
                INITIALISER LE PROTOCOLE
              </Link>
            </CyberGlitch>

            <Link href="/agents" className="w-full md:w-auto px-12 py-7 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all btn-haptic group">
              CATALOGUE DES CALIBRES <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF (Marquee) --- */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden relative snap-start">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-transparent to-[#0b0c10] z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex items-center gap-12 justify-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex animate-marquee whitespace-nowrap gap-28 items-center w-max hover:paused">
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-28 shrink-0 items-center animate-marquee">
                  <span className="text-xl font-black tracking-[0.4em] text-white">HOROLOGY</span>
                  <span className="text-xl font-black tracking-[0.4em] text-white">PRECISION</span>
                  <span className="text-xl font-black tracking-[0.4em] text-white">EXCELLENCE</span>
                  <span className="text-xl font-black tracking-[0.4em] text-white">DOMINATION</span>
                  <span className="text-xl font-black tracking-[0.4em] text-white">SOUVERAINE</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- VALUE PROP (Keep Focus) --- */}
      <section className="py-40 px-8 bg-[#0f0f16]/50 snap-start relative overflow-hidden" id="features">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#66fcf1]/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-40">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 mb-10 backdrop-blur-xl">
              <span className="text-gray-500 font-black text-[10px] uppercase tracking-[0.4em]">MANUFACTURE ELA // CALIBRATION V10.4</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black mb-8 stat-value text-white uppercase tracking-tighter">
              L'EXCELLENCE<br />
              <span className="text-[#66fcf1]">MÉCANIQUE.</span>
            </h2>
            <p className="text-xl text-gray-500 font-light tracking-wide italic leading-relaxed">
              &bdquo; Pendant qu'ils dorment, vos <span className="text-[#66fcf1] font-bold">Calibres IA</span> saturent le marché avec une précision de 0.01 micro-seconde. &rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "+148K€ / AN", desc: "VALEUR INCRÉMENTALE MOYENNE", color: "#66fcf1", icon: LineIconTrendingUp },
              { title: "+3.200H / AN", desc: "GAIN DE TEMPS OPÉRATIONNEL", color: "#66fcf1", icon: LineIconZap },
              { title: "R.O.I. X12", desc: "MULTIPLICATEUR DE SOUVERAINETÉ", color: "#66fcf1", icon: LineIconStar }
            ].map((item, i) => (
              <div
                key={i}
                className="card-saphir group p-12 flex flex-col items-center text-center hover:border-[#66fcf1]/30 transition-all duration-700"
              >
                <div className="mb-10 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#66fcf1]/40 transition-all duration-700 relative">
                  <item.icon size={32} className="text-[#66fcf1]" />
                  <div className="absolute inset-0 bg-[#66fcf1]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-5xl font-black mb-4 stat-value text-white tracking-tighter">{item.title}</h3>
                <p className="text-gray-600 uppercase text-[9px] font-black tracking-[0.4em] mb-10">{item.desc}</p>

                {/* Precision Mechanical Line */}
                <div className="w-full h-px bg-white/5 relative">
                  <div className="absolute top-0 left-0 h-full bg-[#66fcf1] w-0 group-hover:w-full transition-all duration-1000 ease-out shadow-[0_0_8px_#66fcf1]" />
                </div>
              </div>
            ))}
          </div>
        </div >
      </section >

      {/* --- INFRASTRUCTURE GRID --- */}
      <section className="py-40 px-8 bg-gradient-to-b from-[#0f0f16] to-[#0b0c10] snap-start relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-40">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 mb-10 backdrop-blur-xl">
              <span className="text-[#66fcf1] font-black text-[10px] uppercase tracking-[0.4em]">MANUFACTURE ELA // ARCHITECTURE</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black mb-10 stat-value text-white uppercase tracking-tighter">
              20 COMPLICATIONS<br />
              <span className="text-[#66fcf1]">SOUVERAINES.</span>
            </h2>
            <p className="text-xl text-gray-500 font-light tracking-wide italic leading-relaxed">
              &bdquo; Des pièces d'orfèvrerie algorithmique conçues pour dominer chaque aspect de votre <span className="text-white font-bold">Empire Digital</span>. &rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "📈", title: "MÉTRIQUES RÉELLES", desc: "LinkedIn, Twitter, Meta Analytics APIs synchronisées.", tag: "PHASE 1" },
              { icon: "⚡", title: "UPLOAD NATIF", desc: "Carrousels, vidéos et média haute fidélité automatiques.", tag: "PHASE 1" },
              { icon: "💎", title: "A/B TESTING AUTO", desc: "Split test neuromarketing avec sélection de vainqueur.", tag: "PHASE 1" },
              { icon: "🤖", title: "ENGAGEMENT BOT", desc: "Réponses IA aux commentaires et likes intelligents.", tag: "PHASE 2" },
              { icon: "📡", title: "TRENDING TOPICS", desc: "Scraping stratégique Reddit, Google Trends et Twitter.", tag: "PHASE 2" },
              { icon: "⏱️", title: "FREQUENCY OPTIMIZER", desc: "2-5 publications adaptatives par cycle solaire.", tag: "PHASE 2" },
              { icon: "♻️", title: "CONTENT RECYCLING", desc: "Repurpose automatique des calibres les plus performants.", tag: "PHASE 2" },
              { icon: "🎯", title: "RETARGETING PIXELS", desc: "Audiences custom basées sur l'engagement réel.", tag: "PHASE 3" },
              { icon: "👥", title: "INFLUENCER ENGINE", desc: "Identification et outreach automatique micro-influences.", tag: "PHASE 3" },
              { icon: "🎬", title: "VIDEO GENERATOR", desc: "Scripts Reels/TikTok auto avec voiceover ElevenLabs.", tag: "PHASE 3" },
              { icon: "💰", title: "REVENUE AUTOPILOT", desc: "Gestion des flux monétaires et analytics financiers.", tag: "PHASE 3" },
              { icon: "🌍", title: "MULTI-LANGUAGE", desc: "5 langues natives avec traduction virale intelligente.", tag: "PHASE 3" },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-10 rounded-2xl card-saphir border-white/5 hover:border-[#66fcf1]/30 transition-all duration-700 overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#66fcf1]/5 opacity-0 blur-[60px] group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex items-center justify-between mb-10">
                  <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">{feature.icon}</span>
                  <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] group-hover:text-[#66fcf1] transition-colors">{feature.tag}</span>
                </div>

                <h3 className="text-2xl font-black mb-4 text-white tracking-tighter stat-value uppercase">
                  {feature.title}
                </h3>

                <p className="text-[11px] text-gray-600 leading-relaxed font-light group-hover:text-gray-400 transition-colors uppercase tracking-wider">
                  {feature.desc}
                </p>

                <div className="absolute bottom-0 left-0 w-0 h-px bg-[#66fcf1] group-hover:w-full transition-all duration-700 shadow-[0_0_8px_#66fcf1]" />
              </div>
            ))}
          </div>

          <div className="text-center mt-40">
            <Link
              href="/features"
              className="inline-flex items-center gap-8 px-16 py-7 bg-white/5 border border-white/10 rounded-xl font-black text-[12px] uppercase tracking-[0.4em] text-white hover:bg-white hover:text-[#0b0c10] transition-all group btn-haptic"
            >
              EXPLORER LA MANUFACTURE
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>


      {/* --- AGENTS GRID --- */}
      <section className="py-40 px-8 relative snap-start bg-[#0b0c10]" id="agents" >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
            <div>
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 mb-10 backdrop-blur-xl">
                <span className="text-gray-600 font-black text-[10px] uppercase tracking-[0.4em]">MANUFACTURE ELA // LA COLLECTION</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black mb-10 stat-value text-white uppercase tracking-tighter">
                9 PIÈCES<br />
                <span className="text-[#66fcf1]">D'HORLOGERIE.</span>
              </h2>
              <p className="text-gray-500 max-w-2xl text-xl font-light italic leading-relaxed">
                &bdquo; Chaque calibre IA est une prouesse d'ingénierie. Une orchestration continue sans la moindre friction humaine. &rdquo;
              </p>
            </div>
            <Link href="/agents" className="px-10 py-5 rounded-xl border border-[#66fcf1]/20 bg-[#66fcf1]/5 hover:bg-[#66fcf1]/10 transition-all font-black text-[10px] uppercase tracking-[0.3em] text-[#66fcf1] flex items-center gap-4 group btn-haptic">
              CONSULTER L'ÉCOSYSTÈME <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "VOX", role: "Telephony Expert", img: "/agents/vox_v2.png?v=4", desc: "MOUVEMENT VOCAL AUTONOME" },
              { name: "NEXUS", role: "Sales & Outreach", img: "/agents/nexus_v2.png?v=4", desc: "OUTREACH HAUTE PRÉCISION" },
              { name: "SENTINEL", role: "Legal & Compliance", img: "/agents/sentinel_v2.png?v=4", desc: "GARDE-TEMPS JURIDIQUE" },
              { name: "HIVE", role: "Swarm Commander", img: "/agents/hive_v2.png?v=4", desc: "TOURBILLON DE COMMANDE" },
            ].map((agent, i) => (
              <div
                key={i}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4.5] border border-white/5 card-saphir p-0"
              >
                <img
                  src={agent.img}
                  alt={agent.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-10">
                  <div className="w-fit px-4 py-1.5 rounded-full bg-[#66fcf1]/10 border border-[#66fcf1]/20 text-[9px] font-black mb-6 uppercase tracking-[0.3em] text-[#66fcf1] backdrop-blur-md">
                    {agent.role}
                  </div>
                  <h3 className="text-4xl font-black mb-3 text-white tracking-tighter stat-value uppercase">{agent.name}</h3>
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] mb-8 leading-relaxed">
                    {agent.desc}
                  </p>
                  <Link href="/agents" className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-[#0b0c10] transition-all flex items-center justify-center gap-3 group btn-haptic">
                    DÉPLOYER <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* --- WHATSAPP SECTION (HIVE CADRAN) --- */}
      <section className="py-48 px-8 bg-gradient-to-b from-[#0b0c10] to-[#0f0f16] snap-start relative overflow-hidden" >
        {/* Atmosphere */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-[#66fcf1]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#66fcf1]/5 blur-[150px] rounded-full" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-40 relative z-10">
          <div className="flex-1 space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#66fcf1]/20 bg-[#66fcf1]/5 mb-4">
              <span className="text-[#66fcf1] font-black text-[10px] uppercase tracking-[0.4em]">CALIBRE HIVE // TRANSMISSION VOCALE</span>
            </div>
            <h2 className="text-5xl md:text-[7rem] font-black mb-8 leading-[0.85] stat-value text-white uppercase tracking-tighter">
              L'EMPIRE RÉPOND<br />
              <span className="text-[#66fcf1]">À VOTRE VOIX.</span>
            </h2>
            <p className="text-2xl text-gray-500 leading-relaxed font-light italic uppercase tracking-wider">
              &bdquo; Libérez-vous des interfaces conventionnelles. Le <span className="text-white font-bold">Mouvement HIVE</span> synchronise votre flotte d'agents par un simple scellement vocal. &rdquo;
            </p>

            <Link href="#pricing" className="inline-flex px-16 py-7 bg-[#66fcf1] text-[#0b0c10] font-black text-[12px] uppercase tracking-[0.4em] rounded-xl hover:shadow-[0_0_60px_rgba(102,252,241,0.5)] transition-all flex items-center gap-4 group btn-haptic">
              CONNECTER VOTRE CALIBRE
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="flex-1 relative w-full max-w-md">
            <div className="card-saphir border-white/10 p-3 shadow-2xl relative overflow-hidden">
              {/* Mechanical Light Effect */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#66fcf1]/30 to-transparent animate-pulse" />

              <div className="bg-[#0b0c10] rounded-2xl h-[700px] overflow-hidden border border-white/5 relative flex flex-col">
                {/* Secure Channel Header */}
                <div className="bg-white/5 p-10 flex items-center gap-6 border-b border-white/10 backdrop-blur-3xl">
                  <div className="w-16 h-16 rounded-full border-2 border-[#66fcf1]/30 p-1 relative">
                    <img src="/agents/hive_v2.png?v=3" alt="Hive" className="w-full h-full rounded-full object-cover grayscale opacity-70" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0b0c10]" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl tracking-tighter uppercase stat-value">HIVE /// ELA</h4>
                    <p className="text-[10px] text-[#66fcf1] font-mono tracking-[0.3em] uppercase opacity-60">SYNC_NOMINAL_10.4</p>
                  </div>
                </div>

                {/* Transmission Stream */}
                <div className="p-10 space-y-10 mt-auto bg-gradient-to-b from-transparent to-[#66fcf1]/5">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-[#005c4b]/80 backdrop-blur-xl p-6 rounded-3xl rounded-tr-none ml-auto w-fit max-w-[90%] text-sm text-white/90 border border-white/10 shadow-2xl font-light italic"
                  >
                    &bdquo; Lance une campagne de prospection sur les CEO tech à Paris. &rdquo;
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-[#202c33]/90 backdrop-blur-xl p-6 rounded-3xl rounded-tl-none w-fit max-w-[90%] text-sm text-[#66fcf1] border border-[#66fcf1]/20 shadow-2xl font-mono"
                  >
                    [SYSTEM] Bien reçu. J'active NEXUS sur LinkedIn.
                    <br /><br />
                    Cible : CEO Tech @ Paris. Extraction des calibres en cours... 🦾
                  </motion.div>
                </div>

                {/* Input Console */}
                <div className="p-6 bg-[#202c33] border-t border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-black">+</div>
                  <div className="flex-1 h-12 bg-black/40 rounded-full px-6 flex items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">TRANSMISSION...</div>
                  <div className="w-12 h-12 rounded-full bg-[#66fcf1] flex items-center justify-center text-[#0b0c10] shadow-[0_0_20px_rgba(102,252,241,0.5)]"><Zap size={20} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* --- 3 STEPS (LES PILIERS) --- */}
      <section className="py-48 px-8 bg-[#0f0f16]/30 relative overflow-hidden snap-start" >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#66fcf1]/5 blur-[150px] rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-40">
            <h2 className="text-5xl md:text-[8rem] font-black mb-10 stat-value text-white uppercase tracking-tighter leading-tight">
              L'AVANTAGE<br />
              <span className="text-[#66fcf1]">INJUSTE.</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light italic uppercase tracking-widest">
              &bdquo; Le monde se divise en deux : ceux qui règlent les complications, et ceux qui les subissent. &rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: "OMNIPRÉSENCE",
                desc: "Saturez l'espace numérique avec une régularité de métronome. LinkedIn, X, TikTok — un seul calibre pour tout dominer.",
                accent: "CHRONOGI // ALLIAGE"
              },
              {
                title: "PRÉCISION",
                desc: "Hooks neuromarketing taillés au diamant. Capturez l'attention en 0.01 micro-seconde avant que l'oeil ne cligne.",
                accent: "CALIBRE // SAPHIR"
              },
              {
                title: "SOUVERAINETÉ",
                desc: "Transformez chaque tick d'horloge en revenus passifs. Votre business devient une complication perpétuelle de profit.",
                accent: "HERITAGE // NOBLE"
              }
            ].map((item, i) => (
              <div key={i} className={`card-saphir flex flex-col items-center text-center p-16 group hover:border-[#66fcf1]/40 transition-all duration-1000 ${i === 1 ? 'md:translate-y-16' : i === 2 ? 'md:translate-y-32' : ''}`}>
                <div className="mb-12 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.5em] text-gray-700 group-hover:text-[#66fcf1] transition-colors backdrop-blur-xl">
                  {item.accent}
                </div>
                <h3 className="text-4xl font-black mb-10 stat-value text-white tracking-tighter uppercase">{item.title}</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed font-light uppercase tracking-wider">{item.desc}</p>

                <div className="mt-16 w-16 h-px bg-white/10 group-hover:bg-[#66fcf1]/40 group-hover:w-24 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* --- PRICING --- */}
      <section className="py-40 px-8 bg-[#0b0c10] snap-start relative overflow-hidden" id="pricing" >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#66fcf1]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-32">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-xl">
              <span className="text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.3em]">TARIFS // ALLIAGE NOBLE</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black mb-10 stat-value text-white tracking-tighter uppercase">INVESTISSEZ DANS<br /><span className="text-[#66fcf1]">VOTRE HÉRITAGE.</span></h2>
            <p className="text-xl text-gray-500 font-light italic max-w-2xl mx-auto leading-relaxed">
              &bdquo; Rentabilité mécanique. Performance garantie par le scellement algorithmique. &rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* STARTER */}
            <div className="card-saphir p-12 flex flex-col group hover:border-white/20 transition-all">
              <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-gray-500">Mouvement Starter</h3>
              <div className="flex items-baseline gap-1 mb-10 text-white">
                <span className="text-6xl font-black stat-value tracking-tighter">37€</span>
                <span className="text-gray-700 text-[10px] font-mono uppercase tracking-widest">/mois</span>
              </div>
              <p className="text-[11px] text-gray-600 mb-10 min-h-[40px] font-light italic leading-relaxed">L'essentiel pour automatiser vos premières complications.</p>
              <div className="space-y-6 mb-12 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> 1 CALIBRE IA</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> 1.000 CRÉDITS</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> SUPPORT STANDARD</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> ACCÈS CADRAN LIVE</div>
              </div>
              <Link href="/signup?plan=starter" className="w-full py-5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-center hover:bg-white hover:text-black transition-all btn-haptic">INITIALISER</Link>
            </div>

            {/* PRO */}
            <div className="card-saphir p-12 flex flex-col relative border-[#66fcf1]/20 shadow-[0_0_50px_rgba(102,252,241,0.05)] transform md:-translate-y-12 group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#66fcf1] rounded-full text-[8px] font-black uppercase tracking-[0.3em] text-[#0b0c10]">
                RECOMMANDE
              </div>
              <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-[#66fcf1]">Mouvement Pro</h3>
              <div className="flex items-baseline gap-1 mb-10 text-white">
                <span className="text-6xl font-black stat-value tracking-tighter">197€</span>
                <span className="text-gray-700 text-[10px] font-mono uppercase tracking-widest">/mois</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-10 min-h-[40px] font-light italic leading-relaxed">La suite de complications complète pour scaler votre Empire.</p>
              <div className="space-y-6 mb-12 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> 3 CALIBRES IA</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> 2.500 CRÉDITS</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> COMMANDE VOCALE HIVE</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> SUPPORT PRIORITAIRE</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> INTÉGRATION CRM</div>
              </div>
              <Link href="/signup?plan=growth" className="w-full py-5 bg-[#66fcf1] text-[#0b0c10] rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-center hover:shadow-[0_0_40px_rgba(102,252,241,0.4)] transition-all btn-haptic">DÉPLOYER LA FORCE</Link>
            </div>

            {/* GOD MODE */}
            <div className="card-saphir p-12 bg-gradient-to-br from-[#1f2833]/40 to-black/40 border-white/10 group">
              <h3 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-[#c5c6c7]">Mouvement Suprême</h3>
              <div className="flex items-baseline gap-1 mb-10 text-white">
                <span className="text-6xl font-black stat-value tracking-tighter">497€</span>
                <span className="text-gray-700 text-[10px] font-mono uppercase tracking-widest">/mois</span>
              </div>
              <p className="text-[11px] text-[#c5c6c7] mb-10 min-h-[40px] font-light italic leading-relaxed">Pour ceux qui ne concurrencent pas, mais qui règnent par la Précision.</p>
              <div className="space-y-6 mb-12 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#c5c6c7] uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> DOMINATION TOTALE</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#c5c6c7] uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> CRÉDITS ILLIMITÉS</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#c5c6c7] uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> SERVEUR DÉDIÉ</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#c5c6c7] uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 text-[#66fcf1]" /> ACCÈS DIRECT ARCHITECTES</div>
              </div>
              <Link href="/signup?plan=god_mode" className="w-full py-5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] text-center transition-all btn-haptic">INITIALISER GOD MODE</Link>
            </div>
          </div>

          <div className="mt-24 text-center">
            <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.5em]">
              TOUS LES PRIX SONT EN EUR HT // TVA APPLICABLE SELON VOTRE JURIDICTION // GARANTIE DE 30 CYCLES
            </p>
          </div>
        </div>
      </section >

      {/* --- PARTNERSHIP SECTION (Revenue Engine) --- */}
      <section className="py-40 px-8 relative snap-start overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(102,252,241,0.02),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 mb-10">
              <span className="text-[#66fcf1] font-black text-[10px] uppercase tracking-[0.4em]">FORGEZ L'EMPIRE</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white uppercase tracking-tighter leading-none">
              REJOIGNEZ LA<br /><span className="text-[#66fcf1]">MANUFACTURE.</span>
            </h2>
            <p className="text-xl text-gray-500 font-light italic leading-relaxed mb-12">
              Devenez un maillon de notre infrastructure. Touchez <span className="text-white font-bold">30% de commission récurrente à vie</span> sur chaque calibre déployé via votre lien de tracking.
            </p>
            <Link href="/partners" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#66fcf1] transition-all btn-haptic">
              ACCÉDER AU PROGRAMME PARTENAIRE
            </Link>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-square rounded-[60px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#66fcf1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="text-6xl font-black text-white stat-value">30%</div>
                  <div className="w-16 h-16 border border-[#66fcf1]/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                    <Zap className="text-[#66fcf1]" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.4em]">
                    <div className="w-8 h-px bg-[#66fcf1]" /> REVENUS PASSIFS RÉCURRENTS
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
                    <div className="w-8 h-px bg-white/10" /> PAIEMENTS AUTOMATISÉS
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
                    <div className="w-8 h-px bg-white/10" /> TRACKING SÉCURISÉ (90 JOURS)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER (The Grand Manufacture) --- */}
      <footer className="py-32 px-8 bg-[#0b0c10] border-t border-white/5 relative z-10 snap-start overflow-hidden">
        {/* Background Mechanical Detail */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#66fcf1]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">

            {/* Branding Column */}
            <div className="md:col-span-5 space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 border border-[#66fcf1]/30 rounded-full flex items-center justify-center bg-white/5 relative group">
                  <div className="w-10 h-10 border border-[#66fcf1] rounded-full border-t-transparent animate-[spin_6s_linear_infinite]" />
                  <div className="absolute inset-0 bg-[#66fcf1]/5 rounded-full blur-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white stat-value tracking-tighter uppercase">EMPIRE LABORATORY</h2>
                  <p className="text-[10px] text-[#66fcf1] font-black uppercase tracking-[0.4em]">MANUFACTURE D'IA DE HAUTE PRÉCISION</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 font-light italic leading-relaxed uppercase tracking-[0.1em] max-w-sm">
                &bdquo; Nous ne créons pas seulement des algorithmes. Nous forgeons les calibres qui orchestreront le futur de votre souveraineté numérique. &rdquo;
              </p>
              <div className="flex gap-6">
                {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                  <Link key={social} href="#" className="w-10 h-10 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center hover:border-[#66fcf1]/30 hover:bg-[#66fcf1]/5 transition-all group">
                    <span className="text-[8px] font-black uppercase text-gray-700 group-hover:text-[#66fcf1]">{social[0]}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              {[
                { title: "CALIBRES", links: ["Vox", "Nexus", "Sentinel", "Hive"] },
                {
                  title: "MANUFACTURE", links: [
                    { name: "Genèse", href: "#" },
                    { name: "Espace Presse", href: "/press" },
                    { name: "Affiliation", href: "/partners" },
                    { name: "Tarifs", href: "/pricing" }
                  ]
                },
                {
                  title: "PROTOCOLES", links: [
                    { name: "Termes", href: "/legal-shield" },
                    { name: "Confidentialité", href: "/legal-shield" },
                    { name: "Sécurité", href: "#" }
                  ]
                }
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
                    <div className="w-4 h-px bg-[#66fcf1]/30" /> {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={typeof link === 'string' ? link : link.name}>
                        <Link href={typeof link === 'string' ? "#" : link.href} className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] hover:text-white transition-colors">
                          {typeof link === 'string' ? link : link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <span className="text-[8px] font-mono text-gray-800 uppercase tracking-[0.4em]">LAT: 48.8566 // LONG: 2.3522</span>
              <div className="w-1 h-1 rounded-full bg-[#66fcf1]/30" />
              <span className="text-[8px] font-mono text-gray-800 uppercase tracking-[0.4em]">ELA-V10.4-RELEASE</span>
            </div>

            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">
              © 2026 ELA // SOUVERAINE PRÉCISION // TOUS DROITS RÉSERVÉS
            </p>

            <div className="flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">ALL SYSTEMS NOMINAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
