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
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-2xl w-full relative z-10">
                <Link href="/pricing" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Retour aux offres
                </Link>

                <div className="bg-[#13131f] border border-white/10 rounded-3xl p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black mb-2 uppercase tracking-wide">🚀 Finaliser l'abonnement</h1>
                        <p className="text-gray-400">Vous êtes redirigé vers Stripe, la solution de paiement sécurisée n°1.</p>
                    </div>

                    {/* Plan Summary */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Zap className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold">{plan.name}</p>
                                    <p className="text-sm text-gray-400">Facturation mensuelle</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black">{plan.price}€</p>
                                <p className="text-xs text-gray-400">/mois</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <p className="text-sm font-semibold text-gray-300 mb-2">Inclus :</p>
                            <ul className="space-y-1.5">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* CTA Button — redirects to real Stripe Checkout */}
                    <button
                        onClick={handlePayment}
                        disabled={loading || status !== "authenticated"}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Redirection vers Stripe...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                Payer {plan.price}€/mois — Sécurisé par Stripe
                            </>
                        )}
                    </button>

                    {/* Trust indicators */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                        <Lock className="w-3 h-3 text-green-400" />
                        <span>Paiement 256-bit SSL · Stripe · PCI DSS Level 1</span>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-4 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-green-400 shrink-0" />
                        <div>
                            <p className="font-bold text-sm text-white">Garantie 30 jours satisfait ou remboursé</p>
                            <p className="text-xs text-gray-400">Sans condition ni question.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
