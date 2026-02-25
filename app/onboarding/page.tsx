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
        color: "bg-white/5",
        glow: "hover:border-[#66fcf1]/50",
        description: "FORCE B2B // CALIBRE RÉSEAU",
        connectUrl: "/dashboard/integrations?platform=linkedin",
    },
    {
        id: "TWITTER",
        label: "Twitter / X",
        icon: Twitter,
        color: "bg-white/5",
        glow: "hover:border-[#66fcf1]/50",
        description: "VIRALITÉ HAUTE FRÉQUENCE",
        connectUrl: "/dashboard/integrations?platform=twitter",
    },
    {
        id: "INSTAGRAM",
        label: "Instagram",
        icon: Instagram,
        color: "bg-white/5",
        glow: "hover:border-[#66fcf1]/50",
        description: "REACH VISUEL // ESTHÉTIQUE NOBLE",
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
        <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden selection:bg-[#66fcf1]/30">
            {/* Background glows */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full" />

            <div className="w-full max-w-2xl relative z-10">

                {/* ── Header ── */}
                <motion.div {...fadeUp} className="text-center mb-16">
                    {isWelcome && (
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-xl">
                            <span className="text-[10px] font-black text-[#66fcf1] uppercase tracking-[0.3em]">CALIBRATION // INITIALISATION</span>
                        </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase stat-value text-white">
                        VOTRE PREMIER POST EN{" "}
                        <span className="text-[#66fcf1]">
                            300 SECONDES.
                        </span>
                    </h1>
                    <p className="text-gray-500 text-[11px] font-light italic leading-relaxed uppercase tracking-[0.1em]">
                        &bdquo; Synchronisez vos calibres stratégiques pour obtenir un résultat immédiat. &rdquo;
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
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-700 ${isDone
                                            ? "bg-[#66fcf1] border-[#66fcf1] shadow-[0_0_20px_rgba(102,252,241,0.3)]"
                                            : isActive
                                                ? "border-[#66fcf1] bg-white/5 shadow-lg shadow-[#66fcf1]/10"
                                                : "border-white/5 bg-white/[0.02]"
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
                        <motion.div key="step1" {...fadeUp} className="card-saphir p-10 relative group">
                            <h2 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-[#66fcf1]">Phase 01 // Connexion</h2>
                            <p className="text-gray-500 text-[11px] font-light italic leading-relaxed mb-10">
                                Sélectionnez le calibre social que vous souhaitez synchroniser aujourd'hui.
                            </p>

                            <div className="grid gap-3 mb-6">
                                {PLATFORMS.map((p) => {
                                    const Icon = p.icon;
                                    const isConnected = connectedPlatforms.includes(p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => handleSelectPlatform(p.id)}
                                            className={`flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-500 text-left ${selectedPlatform === p.id
                                                ? "border-[#66fcf1]/50 bg-white/5 shadow-lg shadow-[#66fcf1]/5"
                                                : "border-white/5 hover:border-white/10 bg-white/[0.02]"
                                                } btn-haptic`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 ${selectedPlatform === p.id ? "border-[#66fcf1]/50 shadow-inner" : ""}`}>
                                                <Icon className={`w-5 h-5 ${selectedPlatform === p.id ? "text-[#66fcf1]" : "text-gray-600"}`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-black uppercase tracking-[0.2em] text-[10px] ${selectedPlatform === p.id ? "text-white" : "text-gray-500"}`}>{p.label}</p>
                                                <p className="text-[9px] text-gray-700 font-mono tracking-wider uppercase mt-1">{p.description}</p>
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
                                    className="w-full py-5 bg-[#66fcf1] text-[#0b0c10] font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:shadow-[0_0_40px_rgba(102,252,241,0.4)] transition-all btn-haptic flex items-center justify-center gap-3"
                                >
                                    <Link2 className="w-4 h-4" />
                                    CONNECTER LE CALIBRE
                                </motion.button>
                            )}

                            {selectedPlatform && connectedPlatforms.includes(selectedPlatform) && (
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all btn-haptic flex items-center justify-center gap-3"
                                >
                                    SUITE PROTOCOLAIRE <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* ───── STEP 2 ───── */}
                    {step === 2 && (
                        <motion.div key="step2" {...fadeUp} className="card-saphir p-10">
                            <h2 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-[#66fcf1]">Phase 02 // Génération</h2>
                            <p className="text-gray-500 text-[11px] font-light italic leading-relaxed mb-10">
                                Définissez l'angle d'attaque stratégique — l'IA orchestrera la mécanique.
                            </p>

                            <div className="mb-10">
                                <label className="block text-[8px] font-black uppercase tracking-[0.3em] mb-4 text-gray-600">
                                    OBJECTIF DU CALIBRE
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !isGenerating && topic.trim() && handleGenerate()}
                                    placeholder="Ex: productivité, automatisation IA, domination..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-white placeholder-gray-800 focus:outline-none focus:border-[#66fcf1]/50 transition-all text-[11px] font-black uppercase tracking-[0.1em]"
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !topic.trim()}
                                className="w-full py-5 bg-[#66fcf1] text-[#0b0c10] font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:shadow-[0_0_40px_rgba(102,252,241,0.4)] transition-all btn-haptic flex items-center justify-center gap-3"
                            >
                                {isGenerating ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> SYNCHRONISATION...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4" /> GÉNÉRER LE CALIBRE</>
                                )}
                            </button>
                        </motion.div>
                    )}

                    {/* ───── STEP 3 ───── */}
                    {step === 3 && (
                        <motion.div key="step3" {...fadeUp} className="card-saphir p-10">
                            <h2 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-[#66fcf1]">Phase 03 // Publication</h2>
                            <p className="text-gray-500 text-[11px] font-light italic leading-relaxed mb-10">
                                Le calibre est prêt. Vérifiez l'alignement avant l'exécution finale.
                            </p>

                            {generatedPost && !publishResult && (
                                <>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8 relative group">
                                        <span className="absolute top-4 right-6 text-[8px] text-gray-700 font-black uppercase tracking-[0.3em]">
                                            PLATFORME: {generatedPost.platform}
                                        </span>
                                        <textarea
                                            className="w-full bg-transparent text-[11px] text-gray-200 leading-relaxed font-black uppercase tracking-[0.1em] resize-none outline-none min-h-[150px]"
                                            value={generatedPost.content}
                                            onChange={(e) =>
                                                setGeneratedPost({ ...generatedPost, content: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 py-5 border border-white/10 text-gray-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all btn-haptic"
                                        >
                                            RÉ-INITIALISER
                                        </button>
                                        <button
                                            onClick={handlePublish}
                                            disabled={isPublishing}
                                            className="flex-[2] py-5 bg-[#66fcf1] text-[#0b0c10] font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:shadow-[0_0_40px_rgba(102,252,241,0.4)] transition-all flex items-center justify-center gap-3 btn-haptic disabled:opacity-50"
                                        >
                                            {isPublishing ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> EXÉCUTION...</>
                                            ) : (
                                                <><Rocket className="w-4 h-4" /> PUBLIER LE CALIBRE</>
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
                                    className={`rounded-2xl p-10 text-center ${publishResult.success
                                        ? "bg-white/5 border border-[#66fcf1]/30"
                                        : "bg-white/5 border border-red-500/30"
                                        }`}
                                >
                                    <p className="text-2xl font-black mb-4 stat-value text-white uppercase tracking-tighter">
                                        {publishResult.success ? "SYNCHRONISATION TERMINÉE" : "ERREUR DE CALIBRE"}
                                    </p>
                                    <p className="text-[11px] text-gray-500 italic leading-relaxed mb-10 font-light">"{publishResult.message}"</p>
                                    <button
                                        onClick={handleGoToDashboard}
                                        className="w-full py-5 bg-[#66fcf1] text-[#0b0c10] font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all btn-haptic flex items-center justify-center gap-3"
                                    >
                                        ACCÉDER AU CADRAN PRINCIPAL <ArrowRight className="w-4 h-4" />
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
