"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2, Link2, Sparkles, Rocket, ChevronRight,
    Linkedin, Twitter, Instagram, ArrowRight, Loader2, Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

interface GeneratedPost {
    content: string;
    platform: string;
}

// ─── Step configs ─────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: "Connecter", icon: Link2 },
    { id: 2, label: "Générer", icon: Sparkles },
    { id: 3, label: "Publier", icon: Rocket },
];

const PLATFORMS = [
    {
        id: "LINKEDIN",
        label: "LinkedIn",
        icon: Linkedin,
        color: "from-blue-600 to-blue-400",
        glow: "shadow-blue-500/30",
        description: "Réseau B2B idéal pour votre audience cible",
        connectUrl: "/dashboard/integrations?platform=linkedin",
    },
    {
        id: "TWITTER",
        label: "Twitter / X",
        icon: Twitter,
        color: "from-sky-500 to-sky-300",
        glow: "shadow-sky-500/30",
        description: "Viralité maximale, engagement instantané",
        connectUrl: "/dashboard/integrations?platform=twitter",
    },
    {
        id: "INSTAGRAM",
        label: "Instagram",
        icon: Instagram,
        color: "from-pink-600 to-orange-400",
        glow: "shadow-pink-500/30",
        description: "Reach visuel, audience grand public",
        connectUrl: "/dashboard/integrations?platform=instagram",
    },
];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.35, ease: "easeOut" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    const isWelcome = searchParams?.get("welcome") === "true";

    const [step, setStep] = useState<Step>(1);
    const [selectedPlatform, setSelectedPlatform] = useState<string>("");
    const [topic, setTopic] = useState<string>("");
    const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishResult, setPublishResult] = useState<{ success: boolean; message: string } | null>(null);
    const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/onboarding");
        }
    }, [status, router]);

    // Check existing integrations
    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/integrations/list")
                .then((r) => r.json())
                .then((data) => {
                    if (data.integrations?.length > 0) {
                        const platforms = data.integrations
                            .filter((i: any) => i.status === "active")
                            .map((i: any) => i.provider as string);
                        setConnectedPlatforms(platforms);
                        // If already has integrations, jump to step 2
                        if (platforms.length > 0 && !isWelcome) {
                            setSelectedPlatform(platforms[0]);
                            setStep(2);
                        }
                    }
                })
                .catch(() => { }); // Non-blocking
        }
    }, [status, isWelcome]);

    // ── Step 1 actions ──────────────────────────────────────────────────────────
    const handleSelectPlatform = (platformId: string) => {
        setSelectedPlatform(platformId);
    };

    const handleConnectPlatform = () => {
        const platform = PLATFORMS.find((p) => p.id === selectedPlatform);
        if (platform) {
            // Open integrations in a new tab to not lose onboarding state
            window.open(platform.connectUrl, "_blank");
            // Optimistically advance after a brief delay
            setTimeout(() => setStep(2), 1500);
        }
    };

    // ── Step 2 actions ──────────────────────────────────────────────────────────
    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setGeneratedPost(null);

        try {
            const res = await fetch("/api/content/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic,
                    platform: selectedPlatform,
                    style: "educational",
                    includeElaBranding: false, // Opt-in only
                }),
            });
            const data = await res.json();
            setGeneratedPost({ content: data.content || data.post || "", platform: selectedPlatform });
            setStep(3);
        } catch {
            setGeneratedPost({
                content: `🚀 ${topic} : voici les 3 règles que j'applique chaque jour.\n\n1. Automatiser ce qui se répète\n2. Déléguer ce qui peut l'être\n3. Optimiser ce qui reste\n\nRésultat ? 3x plus de temps pour ce qui compte vraiment.\n\nEt vous, quelle est votre règle numéro 1 ?`,
                platform: selectedPlatform,
            });
            setStep(3);
        } finally {
            setIsGenerating(false);
        }
    };

    // ── Step 3 actions ──────────────────────────────────────────────────────────
    const handlePublish = async () => {
        if (!generatedPost) return;
        setIsPublishing(true);

        try {
            const res = await fetch("/api/posts/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: generatedPost.content,
                    platform: generatedPost.platform,
                }),
            });
            const data = await res.json();
            setPublishResult({
                success: data.success ?? true,
                message: data.success
                    ? "✅ Post publié avec succès ! Votre premier post automatisé est en ligne."
                    : `⚠️ ${data.error || "Erreur de publication — vérifiez vos credentials dans Intégrations."}`,
            });
        } catch {
            setPublishResult({
                success: false,
                message: "❌ Erreur réseau. Vérifiez vos credentials dans le tableau de bord.",
            });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleGoToDashboard = () => router.push("/dashboard");

    // ── Loading ─────────────────────────────────────────────────────────────────
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        );
    }

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
            {/* Background glows */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full" />

            <div className="w-full max-w-2xl relative z-10">

                {/* ── Header ── */}
                <motion.div {...fadeUp} className="text-center mb-10">
                    {isWelcome && (
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400 border border-cyan-400/30 rounded-full px-4 py-1.5 mb-4">
                            <Zap className="w-3 h-3" /> Bienvenue dans l'Empire ELA
                        </span>
                    )}
                    <h1 className="text-4xl font-black mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                        Votre premier post en{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                            5 minutes
                        </span>
                    </h1>
                    <p className="text-gray-400 text-base">
                        Suivez ces 3 étapes pour obtenir votre premier résultat concret.
                    </p>
                </motion.div>

                {/* ── Step indicator ── */}
                <div className="flex items-center justify-center gap-0 mb-10">
                    {STEPS.map((s, idx) => {
                        const Icon = s.icon;
                        const isActive = step === s.id;
                        const isDone = step > s.id;
                        return (
                            <div key={s.id} className="flex items-center">
                                <div className={`flex flex-col items-center gap-1.5 transition-all duration-300`}>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isDone
                                                ? "bg-cyan-500 border-cyan-500"
                                                : isActive
                                                    ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/30"
                                                    : "border-white/10 bg-white/5"
                                            }`}
                                    >
                                        {isDone ? (
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        ) : (
                                            <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-500"}`} />
                                        )}
                                    </div>
                                    <span className={`text-xs font-semibold ${isActive ? "text-cyan-400" : isDone ? "text-white" : "text-gray-600"}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className={`w-16 h-px mx-2 mb-4 transition-all duration-500 ${step > s.id ? "bg-cyan-500" : "bg-white/10"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ── Card ── */}
                <AnimatePresence mode="wait">
                    {/* ───── STEP 1 ───── */}
                    {step === 1 && (
                        <motion.div key="step1" {...fadeUp} className="bg-[#13131f] border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-2">Connecte ton réseau social</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Choisis la plateforme sur laquelle tu veux publier ton premier post automatisé.
                            </p>

                            <div className="grid gap-3 mb-6">
                                {PLATFORMS.map((p) => {
                                    const Icon = p.icon;
                                    const isConnected = connectedPlatforms.includes(p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => handleSelectPlatform(p.id)}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedPlatform === p.id
                                                    ? "border-cyan-400 bg-cyan-400/5 shadow-lg shadow-cyan-500/20"
                                                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg ${p.glow}`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{p.label}</p>
                                                <p className="text-xs text-gray-400">{p.description}</p>
                                            </div>
                                            {isConnected && (
                                                <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Connecté
                                                </span>
                                            )}
                                            {selectedPlatform === p.id && !isConnected && (
                                                <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedPlatform && !connectedPlatforms.includes(selectedPlatform) && (
                                <motion.button
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleConnectPlatform}
                                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                                >
                                    <Link2 className="w-4 h-4" />
                                    Connecter {PLATFORMS.find((p) => p.id === selectedPlatform)?.label}
                                </motion.button>
                            )}

                            {selectedPlatform && connectedPlatforms.includes(selectedPlatform) && (
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                                >
                                    Continuer <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* ───── STEP 2 ───── */}
                    {step === 2 && (
                        <motion.div key="step2" {...fadeUp} className="bg-[#13131f] border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-2">Génère ton premier post IA</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Donne un sujet ou une thématique — l'IA s'occupe du reste.
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-2 text-gray-300">
                                    Sur quel sujet veux-tu publier ?
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !isGenerating && topic.trim() && handleGenerate()}
                                    placeholder="Ex: productivité, automatisation IA, growth hacking..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all text-sm"
                                />
                            </div>

                            <div className="mb-6 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Styles disponibles</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: "📚 Éducatif", desc: "5 conseils actionnables" },
                                        { label: "📖 Histoire", desc: "Storytelling personnel" },
                                        { label: "🔥 Controversé", desc: "Hot take polarisant" },
                                        { label: "😂 Humour", desc: "Format mème/relatable" },
                                    ].map((s) => (
                                        <div key={s.label} className="bg-white/[0.03] rounded-lg p-2.5">
                                            <p className="text-xs font-semibold">{s.label}</p>
                                            <p className="text-xs text-gray-500">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !topic.trim()}
                                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Génération en cours...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4" /> Générer le post</>
                                )}
                            </button>
                        </motion.div>
                    )}

                    {/* ───── STEP 3 ───── */}
                    {step === 3 && (
                        <motion.div key="step3" {...fadeUp} className="bg-[#13131f] border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-2">Vérifie et publie 🚀</h2>
                            <p className="text-gray-400 text-sm mb-5">
                                Ton post est prêt. Vérifie-le, ajuste si nécessaire, puis publie.
                            </p>

                            {generatedPost && !publishResult && (
                                <>
                                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-5 relative">
                                        <span className="absolute top-3 right-3 text-xs text-gray-500 font-mono">
                                            {generatedPost.platform}
                                        </span>
                                        <textarea
                                            className="w-full bg-transparent text-sm text-gray-200 leading-relaxed resize-none outline-none"
                                            rows={8}
                                            value={generatedPost.content}
                                            onChange={(e) =>
                                                setGeneratedPost({ ...generatedPost, content: e.target.value })
                                            }
                                        />
                                        <p className="text-xs text-gray-600 text-right mt-1">
                                            {generatedPost.content.length} caractères
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 py-3 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white font-semibold rounded-2xl transition-all text-sm"
                                        >
                                            ← Régénérer
                                        </button>
                                        <button
                                            onClick={handlePublish}
                                            disabled={isPublishing}
                                            className="flex-[2] py-3 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-black font-bold rounded-2xl shadow-lg shadow-green-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isPublishing ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Publication...</>
                                            ) : (
                                                <><Rocket className="w-4 h-4" /> Publier maintenant</>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Result state */}
                            {publishResult && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`rounded-2xl p-6 text-center ${publishResult.success
                                            ? "bg-green-500/10 border border-green-500/30"
                                            : "bg-orange-500/10 border border-orange-500/30"
                                        }`}
                                >
                                    <p className="text-lg font-bold mb-2">
                                        {publishResult.success ? "🎉 Félicitations !" : "⚠️ Presque !"}
                                    </p>
                                    <p className="text-sm text-gray-300 mb-6">{publishResult.message}</p>
                                    <button
                                        onClick={handleGoToDashboard}
                                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        Accéder à mon tableau de bord <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Skip link ── */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleGoToDashboard}
                        className="text-sm text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2"
                    >
                        Passer cette étape → Aller directement au dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
