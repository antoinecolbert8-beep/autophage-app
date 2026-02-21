
import React from 'react';
import Link from "next/link";
import { LineIconCheck, LineIconZap, LineIconShield, LineIconArrowRight } from "@/components/AppIcons";

export default function AgentsPage() {
    const flywheel = [
        {
            stage: "Attraction Massive",
            desc: "Capter l'attention là où elle se trouve par la viralité et le SEO.",
            color: "text-pink-500",
            agents: [
                {
                    name: "APEX",
                    role: "X/Social Domination",
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
            color: "text-purple-500",
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
            color: "text-emerald-500",
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
            color: "text-amber-500",
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
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-[#ec4899] selection:text-white overflow-x-hidden pt-32 px-6">
            <div className="max-w-7xl mx-auto mb-20 text-center md:text-left">
                <Link href="/" className="text-purple-400 hover:text-purple-300 mb-8 inline-block font-bold">← Retour</Link>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 mb-6 backdrop-blur-md">
                    <span className="text-sm font-bold text-purple-400 uppercase tracking-widest">L'EMPIRE SOUVERAIN</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black mb-8 uppercase leading-tight tracking-tighter">13 FORCES<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">INFINIES.</span></h1>
                <p className="text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
                    Ne gérez plus des outils. Pilotez une force d'élite automatisée organisée pour la domination totale.
                </p>
            </div>

            {/* Flywheel Sections */}
            <div className="max-w-7xl mx-auto space-y-20 pb-20">
                {flywheel.map((section, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6 border-b border-white/10 pb-6">
                            <span className="text-4xl md:text-6xl font-black opacity-10">0{idx + 1}</span>
                            <div>
                                <h2 className={`text-3xl font-black uppercase ${section.color}`}>{section.stage}</h2>
                                <p className="text-gray-500 font-medium">{section.desc}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {section.agents.map((agent, i) => (
                                <div key={i} className="rounded-[2.5rem] bg-[#13131f] border border-white/5 overflow-hidden flex flex-col md:flex-row group hover:border-white/20 transition-all duration-500">
                                    <div className="w-full md:w-2/5 aspect-square relative">
                                        <img src={agent.img} alt={agent.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-40 mix-blend-overlay`}></div>
                                    </div>
                                    <div className="p-8 flex flex-col justify-center flex-1">
                                        <div className={`w-fit px-3 py-1 rounded-full bg-gradient-to-r ${agent.gradient} text-[10px] font-bold mb-4 uppercase tracking-widest`}>{agent.role}</div>
                                        <h3 className="text-3xl font-black mb-4">{agent.name}</h3>
                                        <p className="text-gray-400 mb-6 text-sm italic">"{agent.desc}"</p>
                                        <ul className="space-y-2 mb-8">
                                            {agent.capabilities.map((cap, j) => (
                                                <li key={j} className="flex items-center gap-2 text-xs text-gray-300">
                                                    <LineIconZap size={12} className="text-yellow-500" /> {cap}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href={`/signup?agent=${agent.name}`} className="flex items-center justify-between w-full py-3 px-6 bg-white text-black rounded-xl font-bold group/btn hover:bg-gray-200 transition-all">
                                            <span>Déployer</span>
                                            <LineIconArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Foundations Section */}
            <div className="max-w-7xl mx-auto pt-20 pb-32 border-t border-white/10">
                <div className="mb-12">
                    <h2 className="text-4xl font-black uppercase mb-4">La Fondation</h2>
                    <p className="text-gray-500">Les agents de support spécialisés qui stabilisent votre empire.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {foundations.map((agent, j) => (
                        <div key={j} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
                                <img src={agent.img} alt={agent.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-30`}></div>
                                <span className="relative font-black text-xl">{agent.name[0]}</span>
                            </div>
                            <h4 className="font-black text-lg mb-1">{agent.name}</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">{agent.role}</p>
                            <p className="text-xs text-gray-400 line-clamp-2">{agent.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
