"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, CreditCard, Lock, Loader2, ShieldCheck, Zap } from "lucide-react";
import { PLANS } from "@/lib/stripe-pricing";

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const planKey = (searchParams?.get("plan") || "STARTER").toUpperCase() as keyof typeof PLANS;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/payment");
        }
    }, [status, router]);

    const plan = PLANS[planKey] || PLANS.STARTER;

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            // For God Mode (no Stripe Price ID), redirect to external payment link
            if (!plan.stripePriceId && plan.paymentLink) {
                window.location.href = plan.paymentLink;
                return;
            }

            // For all other plans, use the authenticated checkout API
            const response = await fetch('/api/subscriptions/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: planKey }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de la création de la session de paiement.");
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("URL de paiement introuvable.");
            }
        } catch (err: any) {
            console.error("Payment Error:", err);
            setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans flex items-center justify-center p-8 relative overflow-hidden selection:bg-[#66fcf1]/30">
            {/* Background Mechanical Atmosphere */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#66fcf1]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-2xl w-full relative z-10">
                <Link href="/pricing" className="inline-flex items-center gap-3 text-gray-700 hover:text-[#66fcf1] transition-all mb-12 group uppercase text-[10px] font-black tracking-[0.3em]">
                    <span className="w-8 h-px bg-current opacity-30 group-hover:w-12 transition-all" />
                    RETOUR AUX OFFRES
                </Link>

                <div className="card-saphir p-12 relative group overflow-hidden">
                    {/* Corner Mechanical Detail */}
                    <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-[#66fcf1]/10 rounded-tr-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                            <span className="text-[8px] font-black text-[#66fcf1] uppercase tracking-[0.3em]">SYNCHRONISATION STRIPE // SÉCURISÉ</span>
                        </div>
                        <h1 className="text-3xl font-black mb-4 tracking-tighter uppercase text-white stat-value">
                            FINALISER LE CALIBRE.
                        </h1>
                        <p className="text-gray-500 text-[11px] font-light italic leading-relaxed uppercase tracking-[0.1em]">
                            &bdquo; Vous allez être redirigé vers l'interface de scellement transactionnel de niveau 1. &rdquo;
                        </p>
                    </div>

                    {/* Plan Summary Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-10 relative overflow-hidden group/plan">
                        <div className="absolute top-0 right-0 w-1 h-full bg-[#66fcf1] opacity-30 shadow-[0_0_20px_rgba(102,252,241,0.5)]" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover/plan:border-[#66fcf1]/30 transition-colors duration-700">
                                    <Zap className="text-[#66fcf1] w-6 h-6 animate-pulse" />
                                </div>
                                <div>
                                    <p className="font-black text-white uppercase tracking-[0.2em]">{plan.name}</p>
                                    <p className="text-[9px] text-gray-500 font-mono uppercase tracking-tighter">ÉCHÉANCE MENSUELLE // PROTOCOLE ELA</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-white stat-value tracking-tighter">{plan.price}€</p>
                                <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.2em]">HT / MOIS</p>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-8">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4 ml-1">CALIBRES INCLUS :</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] text-gray-500 font-light italic">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#66fcf1]/50 shadow-[0_0_8px_rgba(102,252,241,0.3)] shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-8 p-5 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-4 animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
                            {error}
                        </div>
                    )}

                    {/* CTA Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading || status !== "authenticated"}
                        className="w-full py-6 bg-[#66fcf1] text-[#0b0c10] font-black text-[12px] uppercase tracking-[0.4em] rounded-xl hover:shadow-[0_0_50px_rgba(102,252,241,0.4)] transition-all flex items-center justify-center gap-4 btn-haptic disabled:opacity-50 mb-8"
                    >
                        {loading ? (
                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 border-2 border-[#0b0c10] border-t-transparent rounded-full animate-spin" />
                                SYNC SECURE...
                            </div>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                ACTIVER LE CALIBRE ({plan.price}€)
                            </>
                        )}
                    </button>

                    {/* Trust Indicators (Mechanical) */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-center gap-4 text-[8px] text-gray-700 font-black uppercase tracking-[0.3em]">
                            <Lock className="w-3 h-3 text-[#66fcf1]/50" />
                            <span>AES-256 SSL // STRIPE // PCI DSS COMPLIANCE</span>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center gap-6 group/guarantee">
                            <div className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center bg-white/5 group-hover/guarantee:border-[#66fcf1]/30 transition-colors duration-700">
                                <ShieldCheck className="w-6 h-6 text-gray-600 group-hover/guarantee:text-[#66fcf1] transition-colors" />
                            </div>
                            <div>
                                <p className="font-black text-[10px] text-white uppercase tracking-widest mb-1">GARANTIE DE SATISFACTION</p>
                                <p className="text-[9px] text-gray-600 font-light italic uppercase tracking-tighter">REBOURSEMENT SÉCURISÉ SOUS 30 CYCLES SI NON SATISFAIT.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
