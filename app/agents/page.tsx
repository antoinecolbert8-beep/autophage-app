
import React from 'react';
import Link from "next/link";
import { LineIconCheck, LineIconZap, LineIconShield, LineIconArrowRight } from "@/components/AppIcons";

export default function AgentsPage() {
    const flywheel = [
        {
            stage: "Attraction Massive",
            desc: "Capter l'attention là où elle se trouve par la viralité et le SEO.",
            color: "text-[#66fcf1]",
            agents: [
                {
                    name: "APEX",
                    role: "X/Social Scale",
                    img: "/agents/nexus_v2.png?v=4",
                    desc: "Sature l'espace sémantique sur X et Instagram en boucle autonome.",
                    gradient: "from-pink-500 to-rose-600",
                    capabilities: ["Rédaction virale IA", "Publication auto", "Calendrier 24/7"]
                },
                {
                    name: "VISION",
                    role: "YouTube/Shorts SEO",
                    img: "/agents/vox_v2.png?v=4",
                    desc: "Décline le contenu viral en scripts vidéos et Shorts pour l'autorité long terme.",
                    gradient: "from-blue-500 to-indigo-500",
                    capabilities: ["Scripts Vidéo IA", "Chapitrage SEO", "Titres à fort clic"]
                }
            ]
        },
        {
            stage: "Éducation Profonde",
            desc: "Transformer l'attention en autorité via des canaux propriétaires.",
            color: "text-[#45a29e]",
            agents: [
                {
                    name: "NEXUS",
                    role: "LinkedIn Authority",
                    img: "/agents/nexus_v2.png?v=4",
                    desc: "Prospecte et crée une autorité In-Bound sur le réseau professionnel n°1.",
                    gradient: "from-[#667eea] to-[#764ba2]",
                    capabilities: ["Outreach Professionnel", "Ghostwriting LinkedIn", "Lead Scoring"]
                },
                {
                    name: "CORE",
                    role: "Email/Substack",
                    img: "/agents/vox_v2.png?v=4",
                    desc: "Gère votre liste de contacts (Souveraineté) pour ne jamais dépendre d'un algorithme.",
                    gradient: "from-amber-500 to-orange-600",
                    capabilities: ["Newsletters Hebdo", "Drip Campaigns", "Extraction FAQ HIVE"]
                }
            ]
        },
        {
            stage: "Conversion Rapide",
            desc: "Encaisser les revenus et gérer la relation client en direct.",
            color: "text-[#c5c6c7]",
            agents: [
                {
                    name: "FORGE",
                    role: "E-Commerce Hub",
                    img: "/agents/sentinel_v2.png?v=4",
                    desc: "Optimise votre boutique Shopify et lance des promos basées sur les stocks.",
                    gradient: "from-green-500 to-emerald-600",
                    capabilities: ["Descriptions Produits IA", "Sync Inventaire", "Promos Autonomes"]
                },
                {
                    name: "HIVE",
                    role: "WhatsApp Closer",
                    img: "/agents/hive_v2.png?v=4",
                    desc: "Ferme les ventes et répond aux questions via WhatsApp 24h/24.",
                    gradient: "from-emerald-400 to-teal-500",
                    capabilities: ["Vente assistée par chat", "Support Client IA", "Commandes par message"]
                }
            ]
        },
        {
            stage: "Expansion Infinie",
            desc: "Utiliser l'argent et le réseau pour multiplier la portée.",
            color: "text-[#66fcf1]",
            agents: [
                {
                    name: "PULSE",
                    role: "Ads Scalability",
                    img: "/agents/hive_v2.png?v=4",
                    desc: "Transforme vos meilleurs contenus organiques en publicités Meta/Google rentables.",
                    gradient: "from-cyan-500 to-blue-600",
                    capabilities: ["Ad Copy Créatif", "Ciblage Audiences", "Optimisation ROAS"]
                },
                {
                    name: "ECHO",
                    role: "Affiliate Leverage",
                    img: "/agents/sentinel_v2.png?v=4",
                    desc: "Recrute vos clients en ambassadeurs et automatise les commissions.",
                    gradient: "from-violet-500 to-indigo-700",
                    capabilities: ["Recrutement Affiliés", "Suivi Commissions", "Kits de Com Auto"]
                }
            ]
        }
    ];

    const foundations = [
        { name: "VOX", role: "Telephony", img: "/agents/vox_v2.png?v=4", gradient: "from-blue-400 to-blue-600", desc: "Réceptionniste vocale intelligente." },
        { name: "SENTINEL", role: "Legal", img: "/agents/sentinel_v2.png?v=4", gradient: "from-slate-500 to-slate-700", desc: "Conformité RGPD et audit contrats." },
        { name: "ORACLE", role: "Intelligence", img: "/agents/vox_v2.png?v=4", gradient: "from-purple-500 to-indigo-600", desc: "Analyses prédictives et ROI." },
        { name: "GHOST", role: "Enrichment", img: "/agents/nexus_v2.png?v=4", gradient: "from-gray-500 to-gray-700", desc: "Scraping et enrichissement leads." },
        { name: "SYNC", role: "Lifecycle", img: "/agents/hive_v2.png?v=4", gradient: "from-teal-500 to-emerald-600", desc: "Unification données et CRM." },
    ];

    return (
        <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#66fcf1]/30 selection:text-white overflow-x-hidden pt-32 px-6">
            <div className="max-w-7xl mx-auto mb-20 text-center md:text-left">
                <Link href="/" className="text-[#66fcf1] hover:text-[#45a29e] mb-8 inline-block font-black text-[10px] uppercase tracking-[0.2em]">← RETOUR AU CADRAN</Link>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl">
                    <span className="text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.3em]">MANUFACTURE ELA // AGENTS D'ÉLITE</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black mb-8 uppercase leading-[0.9] tracking-tighter stat-value text-white">13 FORCES<br /><span className="text-[#66fcf1]">SOUVERAINES.</span></h1>
                <p className="text-xl text-gray-500 max-w-3xl font-light leading-relaxed">
                    " Ne gérez plus des outils. Pilotez une force d'élite automatisée organisée pour la performance totale. "
                </p>
            </div>

            {/* Flywheel Sections */}
            <div className="max-w-7xl mx-auto space-y-32 pb-32">
                {flywheel.map((section, idx) => (
                    <div key={idx} className="space-y-12 snap-start">
                        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-8 border-b border-white/5 pb-8">
                            <span className="text-6xl md:text-8xl font-black text-white opacity-[0.03] stat-value">0{idx + 1}</span>
                            <div>
                                <h2 className={`text-4xl font-black uppercase tracking-tighter stat-value ${section.color}`}>{section.stage}</h2>
                                <p className="text-gray-600 font-light italic">{section.desc}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {section.agents.map((agent, i) => (
                                <div key={i} className="card-saphir overflow-hidden flex flex-col md:flex-row group hover:border-[#66fcf1]/20 p-0">
                                    <div className="w-full md:w-2/5 aspect-square relative">
                                        <img src={agent.img} alt={agent.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-60 group-hover:opacity-80" />
                                        <div className={`absolute inset-0 bg-gradient-to-br from-[#0b0c10] via-transparent to-transparent opacity-40`}></div>
                                    </div>
                                    <div className="p-10 flex flex-col justify-center flex-1">
                                        <div className={`w-fit px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black mb-6 uppercase tracking-[0.2em] text-[#66fcf1]`}>{agent.role}</div>
                                        <h3 className="text-4xl font-black mb-4 stat-value text-white tracking-tighter">{agent.name}</h3>
                                        <p className="text-gray-500 mb-8 text-[11px] font-light leading-relaxed italic">"{agent.desc}"</p>
                                        <ul className="space-y-3 mb-10">
                                            {agent.capabilities.map((cap, j) => (
                                                <li key={j} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em] text-gray-600 group-hover:text-[#c5c6c7] transition-colors">
                                                    <LineIconZap size={14} className="text-[#66fcf1]" /> {cap}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href={`/signup?agent=${agent.name}`} className="flex items-center justify-between w-full py-4 px-8 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] group/btn hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all btn-haptic">
                                            <span>DÉPLOYER</span>
                                            <LineIconArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Foundations Section */}
            <div className="max-w-7xl mx-auto pt-32 pb-40 border-t border-white/5 snap-start">
                <div className="mb-16">
                    <h2 className="text-5xl font-black uppercase mb-4 tracking-tighter stat-value text-white">LA FONDATION</h2>
                    <p className="text-gray-500 font-light">Les agents de support spécialisés qui stabilisent votre infrastructure.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {foundations.map((agent, j) => (
                        <div key={j} className="p-8 rounded-2xl card-saphir border-white/5 hover:border-[#66fcf1]/20 transition-all group text-center flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/5 mx-auto mb-6 flex items-center justify-center relative overflow-hidden group-hover:border-[#66fcf1]/30 transition-all duration-700">
                                <img src={agent.img} alt={agent.name} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" />
                                <span className="relative font-black text-2xl text-white opacity-40 group-hover:opacity-90">{agent.name[0]}</span>
                            </div>
                            <h4 className="font-black text-xl mb-2 text-white tracking-tighter stat-value">{agent.name}</h4>
                            <p className="text-[10px] text-[#66fcf1] uppercase font-black tracking-[0.2em] mb-4">{agent.role}</p>
                            <p className="text-[11px] text-gray-500 font-light italic line-clamp-2 leading-relaxed">{agent.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
