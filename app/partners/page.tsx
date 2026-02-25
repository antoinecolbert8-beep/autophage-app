import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Rocket, ShieldCheck, Zap, ArrowRight, Wallet } from "lucide-react";

export const metadata: Metadata = {
    title: "Programme Partenaire | Gagnez 30% Récurrent avec ELA",
    description: "Devenez ambassadeur ELA et générez des revenus passifs. 30% de commission récurrente à vie sur chaque client parrainé.",
    openGraph: {
        title: "Rejoignez l'Empire ELA - Programme Partenaire",
        description: "Le programme d'affiliation le plus généreux de l'écosystème IA.",
    }
};

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#66fcf1]/30 overflow-x-hidden">
            {/* Absolute background effect */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#66fcf1]/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full" />
            </div>

            <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-gray-500 hover:text-[#66fcf1] transition-colors">
                        <ArrowLeft size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">RETOUR</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#66fcf1] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">PROGRAMME PARTENAIRE v4.0</span>
                    </div>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-32">
                        <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter uppercase text-white leading-[0.9]">
                            BÂTISSEZ VOTRE<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#66fcf1] to-blue-400">EMPIRE DE REVENUS.</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light italic leading-relaxed mb-12">
                            Rejoignez l'élite des ambassadeurs ELA. Touchez 30% de commission récurrente à vie sur chaque abonnement.
                        </p>
                        <Link href="/signup?ref=partner-program" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#66fcf1] transition-all group btn-haptic">
                            DEVENIR PARTENAIRE <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                        {[
                            {
                                title: "30% RÉCURRENT",
                                desc: "Pas de 'one-shot'. Vous touchez votre commission chaque mois, tant que le client reste actif.",
                                icon: <Wallet className="text-[#66fcf1]" size={32} />
                            },
                            {
                                title: "PAIEMENTS ÉCLAIRS",
                                desc: "Retraits automatisés via Stripe Connect dès 50€ de gains accumulés.",
                                icon: <Zap className="text-[#66fcf1]" size={32} />
                            },
                            {
                                title: "TRACKING 90 JOURS",
                                desc: "Un cookie de 90 jours garantit que vous touchez votre commission même si la vente prend du temps.",
                                icon: <ShieldCheck className="text-[#66fcf1]" size={32} />
                            }
                        ].map((benefit, i) => (
                            <div key={i} className="p-10 rounded-[30px] bg-white/5 border border-white/10 hover:border-[#66fcf1]/50 transition-colors group">
                                <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">{benefit.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-light">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Revenue Calculator (Visual Component) */}
                    <section className="mb-32 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#66fcf1]/10 to-transparent blur-[100px] -z-10" />
                        <div className="bg-[#0f1115] border border-white/5 rounded-[40px] p-12 md:p-20 overflow-hidden">
                            <div className="flex flex-col md:flex-row gap-16 items-center">
                                <div className="flex-1">
                                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 italic">
                                        POTENTIEL DE<br /><span className="text-[#66fcf1]">REVENUS PASSIFS.</span>
                                    </h2>
                                    <p className="text-gray-400 mb-10 leading-relaxed">
                                        Sur un plan 'God Mode' à 497€/mois, vous touchez <span className="text-white font-bold">149€ par mois</span> par client.
                                        Avec seulement 10 clients, vous générez <span className="text-[#66fcf1] font-black">1 490€</span> de rente mensuelle.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#66fcf1] w-[75%]" />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                                            <span>ENTRÉE</span>
                                            <span>ASCENSION</span>
                                            <span className="text-[#66fcf1]">DOMINATION MÉCANIQUE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">10 CLIENTS PRO</div>
                                        <div className="text-3xl font-black text-white">590€<span className="text-xs text-gray-600">/mo</span></div>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">30 CLIENTS PRO</div>
                                        <div className="text-3xl font-black text-white">1 770€<span className="text-xs text-gray-600">/mo</span></div>
                                    </div>
                                    <div className="bg-[#66fcf1] p-8 rounded-3xl text-center col-span-2">
                                        <div className="text-[10px] font-black text-[#0b0c10] uppercase tracking-widest mb-2">OBJECTIF 50K REVENUS</div>
                                        <div className="text-4xl font-black text-[#0b0c10]">~336 CLIENTS GOD MODE</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="text-center bg-gradient-to-b from-[#66fcf1]/10 to-transparent p-24 rounded-[60px] border border-[#66fcf1]/20">
                        <Rocket className="mx-auto text-[#66fcf1] mb-8 animate-bounce" size={48} />
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">PRÊT À SCALER ?</h2>
                        <p className="text-gray-400 max-w-xl mx-auto mb-12">
                            L'intégration est instantanée. Accédez à votre tableau de bord partenaire et commencez à distribuer vos liens de tracking dès aujourd'hui.
                        </p>
                        <button className="px-16 py-6 bg-[#66fcf1] text-[#0b0c10] rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:shadow-[0_0_50px_rgba(102,252,241,0.3)] transition-all btn-haptic">
                            ACCÉDER AU DASHBOARD PARTENAIRE
                        </button>
                    </section>
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center text-gray-700">
                <div className="text-[10px] font-black uppercase tracking-[0.5em]">PROGRAMME SOUVERAIN © 2026 ELA CORP.</div>
            </footer>
        </div>
    );
}
