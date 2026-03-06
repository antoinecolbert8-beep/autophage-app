import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, Mail, MessageSquare, Globe, Award, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "Espace Presse | ELA - Ressources Officielles",
    description: "Accédez au kit média officiel de ELA. Logos, screenshots, et informations officielles pour les journalistes et créateurs de contenu.",
    openGraph: {
        title: "ELA Press Kit - Ressources Officielles",
        description: "Tout ce dont vous avez besoin pour parler de la révolution ELA.",
    }
};

export default function PressPage() {
    return (
        <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#66fcf1]/30 overflow-x-hidden">
            {/* Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#66fcf1]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            {/* HEADER */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-gray-500 hover:text-[#66fcf1] transition-colors">
                        <ArrowLeft size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">RETOUR</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/logo-ela.png" alt="ELA" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-black tracking-tighter text-white">ELA <span className="text-[#66fcf1]">PRESS</span></span>
                    </Link>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-24 text-center">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                            <span className="text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.3em]">ESPACE MÉDIA // RESSOURCES OFFICIELLES</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase text-white">
                            L'I.A. QUI DESSINE<br /><span className="text-[#66fcf1]">LE FUTUR DU SaaS.</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                            " ELA n'est pas un outil. C'est l'infrastructure souveraine de la performance automatisée. "
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        {[
                            { label: "ENTREPRISES", value: "12,400+", icon: <Users className="text-[#66fcf1]" size={20} /> },
                            { label: "PAYS", value: "48", icon: <Globe className="text-[#66fcf1]" size={20} /> },
                            { label: "RETENUE CLIENT", value: "98.2%", icon: <Award className="text-[#66fcf1]" size={20} /> }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-4 opacity-50">
                                    {stat.icon}
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{stat.label}</span>
                                </div>
                                <div className="text-4xl font-black text-white">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Assets Section */}
                    <section className="mb-24">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-[#66fcf1]"></span> KIT MÉDIA
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 rounded-3xl hover:border-[#66fcf1]/30 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <img src="/logo-ela.png" alt="Logo" className="w-12 h-12" />
                                    </div>
                                    <Download className="text-gray-600 group-hover:text-[#66fcf1] transition-colors" size={24} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">Logos & Identité</h3>
                                <p className="text-sm text-gray-500 mb-6 font-light">Variantes transparentes, sombres et iconographie haute résolution.</p>
                                <div className="text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.2em]">TÉLÉCHARGER .ZIP (12MB)</div>
                            </div>

                            <div className="group bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 rounded-3xl hover:border-[#66fcf1]/30 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <div className="w-12 h-12 border-2 border-dashed border-white/20 rounded flex items-center justify-center text-[8px] font-black text-white/50">MOCKUPS</div>
                                    </div>
                                    <Download className="text-gray-600 group-hover:text-[#66fcf1] transition-colors" size={24} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">Screenshots & UI</h3>
                                <p className="text-sm text-gray-500 mb-6 font-light">Aperçus du dashboard v10.4 et des fonctionnalités clés.</p>
                                <div className="text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.2em]">TÉLÉCHARGER .ZIP (45MB)</div>
                            </div>
                        </div>
                    </section>

                    {/* Press Contacts */}
                    <section className="bg-[#66fcf1] p-12 rounded-[40px] text-[#0b0c10] flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-md">
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">CONTACT PRESSE</h2>
                            <p className="font-medium mb-6">Pour toute demande d'interview, d'information complémentaire ou de partenariat média.</p>
                            <div className="flex flex-col gap-4">
                                <a href="mailto:press@ela-revolution.com" className="flex items-center gap-3 font-black text-sm uppercase tracking-widest hover:underline">
                                    <Mail size={18} /> press@ela-revolution.com
                                </a>
                                <a href="#" className="flex items-center gap-3 font-black text-sm uppercase tracking-widest hover:underline">
                                    <MessageSquare size={18} /> @ela_corp_news
                                </a>
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                            <button className="w-full md:w-auto px-12 py-5 bg-[#0b0c10] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-transform duration-300">
                                PLANIFIER UNE INTERVIEW
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 text-center">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">© 2026 ELA CORP. TOUS DROITS RÉSERVÉS.</p>
            </footer>
        </div>
    );
}
