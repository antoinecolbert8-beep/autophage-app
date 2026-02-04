"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LineIconCheck, LineIconShield, LineIconZap } from "@/components/AppIcons";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";

import { PLANS } from "@/lib/stripe-pricing";

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "starter";
    const [loading, setLoading] = useState(false);

    const prices = {
        starter: "37.00",
        growth: "197.00",
        god_mode: "497.00"
    };

    const currentPrice = prices[plan as keyof typeof prices] || "99.00";



    const handlePayment = () => {
        setLoading(true);

        // Find the correct plan configuration
        const planConfig = Object.values(PLANS).find(p => p.id === plan) || PLANS.STARTER;

        // Redirect to Stripe Payment Link
        if (planConfig.paymentLink) {
            // Persist intent before redirecting
            if (typeof window !== 'undefined') {
                localStorage.setItem('ela_pending_plan', plan);
            }
            window.location.href = planConfig.paymentLink;
        } else {
            console.error("No payment link found for plan:", plan);
            // Fallback for God Mode if link missing (or contact sales)
            if (plan === 'god_mode') {
                // Temporary fallback until user provides link
                alert("Lien de paiement God Mode en cours de configuration. Veuillez contacter le support.");
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

                {/* Left Col: Order Summary */}
                <div className="bg-[#13131f] border border-white/10 rounded-3xl p-8 flex flex-col">
                    <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors group">
                        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                        <span>Annuler la commande</span>
                    </Link>

                    <h1 className="text-3xl font-black mb-2 uppercase">🚀 VALIDATION FINALE</h1>
                    <p className="text-gray-300 mb-4 font-bold">Vous êtes à <span className="text-yellow-500">30 secondes</span> de la domination absolue.</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-8">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-red-400">🔥 Offre valable 27 minutes</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <LineIconZap className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold capitalize">Plan {plan.replace('_', ' ')}</h3>
                                <p className="text-sm text-gray-400">Facturation Mensuelle</p>
                            </div>
                        </div>
                        <div className="font-mono text-xl font-bold">{currentPrice}€</div>
                    </div>

                    <div className="space-y-4 mb-auto">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Sous-total</span>
                            <span>{currentPrice}€</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Taxes (Estimées)</span>
                            <span>0.00€</span>
                        </div>
                        <div className="h-px bg-white/10 my-4"></div>
                        <div className="flex justify-between text-lg font-bold text-white">
                            <span>Total à payer</span>
                            <span>{currentPrice}€</span>
                        </div>
                    </div>

                    {/* Plan Features */}
                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                        <h4 className="font-bold text-sm mb-3 text-white">✅ Inclus dans votre plan :</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                {plan === 'god_mode' ? 'Agents illimités' : plan === 'growth' ? '5 agents inclus' : '2 agents inclus'}
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                {plan === 'god_mode' ? 'Crédits illimités' : plan === 'growth' ? '10,000 crédits/mois' : '2,000 crédits/mois'}
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                Support {plan === 'god_mode' ? 'prioritaire dédié' : plan === 'growth' ? 'prioritaire' : 'email'}
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                Accès Dashboard complet
                            </li>
                        </ul>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <LineIconShield className="text-green-500" size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-white">Garantie 30 jours</p>
                                <p className="text-xs text-gray-400">Satisfait ou 100% remboursé, sans condition.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                        <Lock size={12} className="text-blue-400" />
                        <span>Paiement sécurisé SSL 256-bits via Stripe.</span>
                    </div>
                </div>

                {/* Right Col: Payment Form */}
                <div className="bg-[#13131f] border border-white/10 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <CreditCard className="text-blue-400" />
                        Détails du paiement
                    </h2>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Titulaire de la carte</label>
                            <input type="text" placeholder="John Doe" className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Numéro de carte</label>
                            <div className="relative">
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-blue-500 transition-colors font-mono" required />
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Expiration</label>
                                <input type="text" placeholder="MM/YY" className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors font-mono" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">CVC</label>
                                <div className="relative">
                                    <input type="text" placeholder="123" className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-blue-500 transition-colors font-mono" required />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>Traitement sécurisé...</>
                            ) : (
                                <>
                                    Confirmer le paiement <LineIconCheck />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale">
                        <div className="h-6 bg-white/20 w-10 rounded"></div>
                        <div className="h-6 bg-white/20 w-10 rounded"></div>
                        <div className="h-6 bg-white/20 w-10 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// function LinkBack removed

