"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface SystemHealth {
    database: string;
    stripe: string;
    openai: string;
    supabase: string;
    stripeWebhookConfigured: boolean;
    supabaseManagementToken: boolean;
    netlifyUrl: string;
    projectRef: string;
    timestamp: string;
}

interface GodModeStatus {
    selfPromotion: boolean;
    linkedinBot: boolean;
    emailSequences: boolean;
    viralEngine: boolean;
    autoEngage: boolean;
    shopifyBroadcast: boolean;
    crm_sync: boolean;
}

const STATUS_COLORS: Record<string, string> = {
    connected: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    configured: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    ACTIVE_HEALTHY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    already_active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    disconnected: "text-red-400 bg-red-400/10 border-red-400/30",
    missing: "text-red-400 bg-red-400/10 border-red-400/30",
    INACTIVE_PAUSED: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    token_missing: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    resuming: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    unknown: "text-gray-400 bg-gray-400/10 border-gray-400/30",
};

function StatusBadge({ status, label }: { status: string; label?: string }) {
    const color = STATUS_COLORS[status] || STATUS_COLORS.unknown;
    const text = label || status;
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${color}`}>
            {text}
        </span>
    );
}

function MetricCard({ icon, title, value, sub, color = "cyan" }: {
    icon: string; title: string; value: string | number; sub?: string; color?: string;
}) {
    const colorMap: Record<string, string> = {
        cyan: "from-[#66fcf1]/10 border-[#66fcf1]/20 shadow-[#66fcf1]/5",
        red: "from-red-500/10 border-red-500/20 shadow-red-500/5",
        purple: "from-purple-500/10 border-purple-500/20 shadow-purple-500/5",
        amber: "from-amber-500/10 border-amber-500/20 shadow-amber-500/5",
    };
    return (
        <div className={`rounded-2xl bg-gradient-to-br ${colorMap[color]} to-transparent border p-5 shadow-xl`}>
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{title}</p>
            <p className="text-2xl font-black text-white mt-1">{value}</p>
            {sub && <p className="text-[10px] text-gray-500 mt-1">{sub}</p>}
        </div>
    );
}

export default function AdminBrainPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [godMode, setGodMode] = useState<GodModeStatus | null>(null);
    const [loadingHealth, setLoadingHealth] = useState(true);
    const [resumingDb, setResumingDb] = useState(false);
    const [configuringStripe, setConfiguringStripe] = useState(false);
    const [dbPollInterval, setDbPollInterval] = useState<NodeJS.Timeout | null>(null);

    // Auth guard — admin only
    useEffect(() => {
        if (status === "unauthenticated") router.push("/admin");
        if (status === "authenticated" && session?.user?.role !== "admin") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    const fetchHealth = useCallback(async () => {
        try {
            const [healthRes, godRes] = await Promise.all([
                fetch("/api/admin/system/health"),
                fetch("/api/god-mode/status"),
            ]);
            if (healthRes.ok) setHealth(await healthRes.json());
            if (godRes.ok) {
                const d = await godRes.json();
                if (d.status) setGodMode(d.status);
            }
        } catch {
            // silent
        } finally {
            setLoadingHealth(false);
        }
    }, []);

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 15000); // refresh every 15s
        return () => clearInterval(interval);
    }, [fetchHealth]);

    const handleResumeSupabase = async () => {
        setResumingDb(true);
        try {
            const res = await fetch("/api/admin/system/supabase-resume", { method: "POST" });
            const data = await res.json();

            if (data.status === "already_active") {
                toast.success("✅ Supabase déjà actif et en bonne santé !");
            } else if (data.status === "resuming") {
                toast.info("⏳ Supabase se réveille... Attends 60 secondes.", { duration: 8000 });
                // Poll every 10s to check if DB is back
                const poll = setInterval(async () => {
                    await fetchHealth();
                    if (health?.database === "connected") {
                        clearInterval(poll);
                        toast.success("🚀 Supabase est actif ! La DB est connectée.");
                    }
                }, 10000);
                setDbPollInterval(poll);
                setTimeout(() => clearInterval(poll), 120000); // stop after 2 min
            } else if (data.error) {
                if (data.manualUrl) {
                    toast.error(`⚠️ ${data.error}`, { duration: 5000 });
                    window.open(data.manualUrl, "_blank");
                } else {
                    toast.error(data.error);
                }
            }
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setResumingDb(false);
        }
    };

    const handleConfigureStripe = async () => {
        setConfiguringStripe(true);
        try {
            const res = await fetch("/api/admin/system/stripe-configure", { method: "POST" });
            const data = await res.json();
            if (data.status === "ok") {
                toast.success("✅ Webhook Stripe trouvé/créé !");
                window.open(data.dashboardUrl, "_blank");
                toast.info("📋 Copie le Signing Secret depuis la page Stripe qui vient de s'ouvrir.", { duration: 8000 });
            } else {
                toast.error(data.error || "Erreur Stripe");
            }
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setConfiguringStripe(false);
        }
    };

    const toggleGodModeAll = async (enabled: boolean) => {
        const features = ["selfPromotion", "linkedinBot", "emailSequences", "viralEngine", "autoEngage", "shopifyBroadcast", "crm_sync"];
        await Promise.all(features.map(f =>
            fetch("/api/god-mode/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feature: f, enabled }),
            })
        ));
        await fetchHealth();
        toast.success(enabled ? "⚡ GOD MODE TOTAL ACTIVÉ — ELA est autonome." : "⏸️ God Mode mis en pause.");
    };

    if (status === "loading" || loadingHealth) {
        return (
            <div className="min-h-screen bg-[#030308] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-[#66fcf1]/30 border-t-[#66fcf1] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#66fcf1] font-mono text-sm tracking-widest uppercase animate-pulse">Initialisation du cerveau...</p>
                </div>
            </div>
        );
    }

    const godModeActiveCount = godMode ? Object.values(godMode).filter(Boolean).length : 0;
    const isDbConnected = health?.database === "connected";
    const isSupabaseActive = health?.supabase === "ACTIVE_HEALTHY" || health?.supabase === "already_active";
    const isStripeOk = health?.stripe === "configured";
    const isWebhookOk = health?.stripeWebhookConfigured;
    const isOpenAiOk = health?.openai === "configured";
    const isFullyOperational = isDbConnected && isStripeOk && isWebhookOk && isOpenAiOk;

    return (
        <div className="min-h-screen bg-[#030308] text-white overflow-hidden">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#66fcf1]/5 blur-[200px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 blur-[200px] rounded-full" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(102,252,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(102,252,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Link href="/admin-master" className="text-gray-600 hover:text-white transition text-sm">← Admin</Link>
                            <span className="text-gray-700">/</span>
                            <span className="text-[#66fcf1] text-sm font-mono">brain.control</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                            🧠 <span className="bg-gradient-to-r from-[#66fcf1] to-white bg-clip-text text-transparent">CERVEAU ELA</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 font-mono">Centre de contrôle souverain • Admin uniquement</p>
                    </div>
                    <div className="text-right">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${isFullyOperational
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${isFullyOperational ? "bg-emerald-400" : "bg-amber-400"}`} />
                            {isFullyOperational ? "SYSTÈME OPÉRATIONNEL" : "ACTIVATION REQUISE"}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1 font-mono">
                            {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString("fr-FR") : "--:--"}
                        </p>
                    </div>
                </div>

                {/* Critical Actions Banner */}
                {(!isDbConnected || !isWebhookOk) && (
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
                        <h2 className="text-amber-400 font-black text-sm uppercase tracking-widest mb-4">⚠️ Actions critiques requises</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!isDbConnected && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <p className="text-white font-bold text-sm mb-1">🗄️ Base de données hors ligne</p>
                                    <p className="text-gray-400 text-xs mb-3">Supabase est en pause. Clique pour le réveiller.</p>
                                    <button
                                        onClick={handleResumeSupabase}
                                        disabled={resumingDb}
                                        className="w-full py-2 bg-[#66fcf1] text-[#030308] rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all disabled:opacity-50"
                                    >
                                        {resumingDb ? "⏳ Réveil en cours..." : "▶ RÉVEILLER SUPABASE"}
                                    </button>
                                    {!health?.supabaseManagementToken && (
                                        <p className="text-amber-400 text-[10px] mt-2">
                                            ⚠️ SUPABASE_MANAGEMENT_TOKEN manquant dans .env — le bouton ouvrira le dashboard Supabase.
                                        </p>
                                    )}
                                </div>
                            )}
                            {!isWebhookOk && (
                                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                    <p className="text-white font-bold text-sm mb-1">💳 Webhook Stripe non configuré</p>
                                    <p className="text-gray-400 text-xs mb-3">Stripe ne peut pas envoyer les events de paiement.</p>
                                    <button
                                        onClick={handleConfigureStripe}
                                        disabled={configuringStripe}
                                        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {configuringStripe ? "⏳ Configuration..." : "▶ CONFIGURER STRIPE"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* System Health Grid */}
                <div>
                    <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-4">Santé du système</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col gap-3">
                            <span className="text-xl">🗄️</span>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Base de données</p>
                            <StatusBadge status={health?.database || "unknown"} />
                        </div>
                        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col gap-3">
                            <span className="text-xl">☁️</span>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Supabase</p>
                            <StatusBadge status={health?.supabase || "unknown"} label={
                                health?.supabase === "ACTIVE_HEALTHY" ? "ACTIF" :
                                    health?.supabase === "INACTIVE_PAUSED" ? "EN PAUSE" :
                                        health?.supabase === "token_missing" ? "TOKEN MANQUANT" :
                                            health?.supabase || "..."
                            } />
                        </div>
                        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col gap-3">
                            <span className="text-xl">💳</span>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Stripe</p>
                            <StatusBadge status={isWebhookOk ? "configured" : "missing"} label={isWebhookOk ? "WEBHOOK OK" : "WEBHOOK MANQUANT"} />
                        </div>
                        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col gap-3">
                            <span className="text-xl">🤖</span>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">OpenAI / DALL-E</p>
                            <StatusBadge status={health?.openai || "unknown"} label={health?.openai === "configured" ? "OPÉRATIONNEL" : "MANQUANT"} />
                        </div>
                    </div>
                </div>

                {/* God Mode Control */}
                <div className="rounded-2xl bg-gradient-to-br from-[#0f1a1a] to-[#030308] border border-[#66fcf1]/20 overflow-hidden shadow-[0_0_60px_rgba(102,252,241,0.05)]">
                    <div className="p-6 border-b border-[#66fcf1]/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-[0.15em]">⚡ GOD MODE — Cerveau Autonome</h2>
                            <p className="text-xs text-gray-500 mt-1">{godModeActiveCount}/7 modules actifs</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => toggleGodModeAll(false)}
                                className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/5 transition"
                            >
                                ⏸ Tout pause
                            </button>
                            <button
                                onClick={() => toggleGodModeAll(true)}
                                className="px-4 py-2 bg-[#66fcf1] text-[#030308] rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] transition-all"
                            >
                                ⚡ TOUT ACTIVER
                            </button>
                        </div>
                    </div>
                    {godMode ? (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { key: "selfPromotion", icon: "🚀", label: "Auto-Promotion", desc: "Posts LinkedIn/X/IG toutes les heures" },
                                { key: "linkedinBot", icon: "💼", label: "Bot LinkedIn", desc: "Prospection & DMs automatiques" },
                                { key: "emailSequences", icon: "📧", label: "Emails Autonomes", desc: "Onboarding & nurturing IA" },
                                { key: "viralEngine", icon: "⚡", label: "Viral Engine", desc: "Optimisation viralité DALL-E 3" },
                                { key: "autoEngage", icon: "🎯", label: "Auto-Engagement", desc: "Répond commentaires & DMs" },
                                { key: "shopifyBroadcast", icon: "🛍️", label: "Shopify Broadcast", desc: "Diffuse les ventes en temps réel" },
                                { key: "crm_sync", icon: "🔄", label: "CRM Sync", desc: "HubSpot / Pipedrive automatique" },
                            ].map(({ key, icon, label, desc }) => {
                                const isActive = godMode[key as keyof GodModeStatus];
                                return (
                                    <div key={key} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isActive
                                        ? "bg-[#66fcf1]/5 border-[#66fcf1]/20"
                                        : "bg-white/[0.02] border-white/5"
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{icon}</span>
                                            <div>
                                                <p className="text-sm font-bold">{label}</p>
                                                <p className="text-[10px] text-gray-500">{desc}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-mono uppercase font-black tracking-widest px-2 py-1 rounded-full border ${isActive
                                            ? "text-[#66fcf1] bg-[#66fcf1]/10 border-[#66fcf1]/30"
                                            : "text-gray-600 bg-white/5 border-white/5"
                                            }`}>
                                            {isActive ? "ON" : "OFF"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-6 text-gray-500 text-sm text-center">
                            {isDbConnected ? "Chargement du statut..." : "⚠️ Base de données requise pour afficher le God Mode"}
                        </div>
                    )}
                </div>

                {/* Cron Schedule */}
                <div className="rounded-2xl bg-[#0a0a12] border border-white/5 p-6">
                    <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-4">📡 Crons Netlify — Horaires de diffusion</h2>
                    <div className="space-y-2">
                        {[
                            { name: "Self-Promotion Engine", schedule: "Toutes les heures (UTC)", status: "active", icon: "🚀" },
                            { name: "Morning Viral Post", schedule: "09:00 UTC (10h Paris)", status: "active", icon: "🌅" },
                            { name: "Evening Recap", schedule: "18:00 UTC (19h Paris)", status: "active", icon: "🌆" },
                            { name: "LinkedIn Engage", schedule: "Lun-Ven 10h + 14h UTC", status: "active", icon: "💼" },
                            { name: "Matchmaker", schedule: "03:00 UTC (4h Paris)", status: "active", icon: "🎯" },
                            { name: "Daily Recap", schedule: "23:00 UTC (0h Paris)", status: "active", icon: "📊" },
                            { name: "Heartbeat", schedule: "Toutes les 5 min", status: "active", icon: "💓" },
                        ].map((cron) => (
                            <div key={cron.name} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                                <div className="flex items-center gap-3">
                                    <span>{cron.icon}</span>
                                    <div>
                                        <p className="text-sm font-bold">{cron.name}</p>
                                        <p className="text-[10px] text-gray-500 font-mono">{cron.schedule}</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono uppercase font-black tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                                    {cron.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl bg-[#0a0a12] border border-white/5 p-6">
                    <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-4">🛠️ Actions rapides Admin</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { href: "/admin-master", label: "Dashboard Admin", icon: "🏛️" },
                            { href: "/dashboard/settings", label: "God Mode", icon: "⚡" },
                            { href: "/api/cron/self-promotion", label: "Déclencher Promo", icon: "🚀", external: true },
                            { href: "https://supabase.com/dashboard", label: "Supabase DB", icon: "🗄️", external: true },
                            { href: "https://dashboard.stripe.com", label: "Stripe", icon: "💳", external: true },
                            { href: "https://app.netlify.com", label: "Netlify Deploy", icon: "🚀", external: true },
                            { href: "/analytics/self-promotion", label: "Analytics", icon: "📊" },
                            { href: "/dashboard", label: "Dashboard Client", icon: "👥" },
                        ].map((action) => (
                            <a
                                key={action.href}
                                href={action.href}
                                target={action.external ? "_blank" : undefined}
                                rel={action.external ? "noopener noreferrer" : undefined}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group"
                            >
                                <span className="text-lg">{action.icon}</span>
                                <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors">{action.label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-gray-700 font-mono">
                    ELA SOVEREIGN BRAIN — Admin only • Auto-refresh 15s • {health?.netlifyUrl || ""}
                </p>
            </div>
        </div>
    );
}
