"use client";

import { useState } from "react";
import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconPlus,
    LineIconZap,
    LineIconMail,
    LineIconShield,
    LineIconTarget,
    LineIconCheck
} from "@/components/AppIcons";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Globe, Key, FileText, Send, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterPage() {
    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState("");
    const [tone, setTone] = useState("professional");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
        if (!topic) {
            toast.error("Veuillez entrer un sujet");
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            const response = await fetch("/api/content/gemini-generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic,
                    platform: "NEWSLETTER",
                    contentType: "HTML_NEWSLETTER",
                    tone,
                    keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
                }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.content);
                toast.success("Newsletter générée avec brio !");
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Erreur de génération:", error);
            toast.error("Échec de la génération. Réessayez.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papier");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* --- HEADER --- */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-xl z-30">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="text-amber-400 w-5 h-5" />
                            SEO Newsletter Master
                        </h1>
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Générateur de transmission souverain</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* --- LEFT COLUMN: CONFIGURATION --- */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-sm font-bold text-blue-400 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                            <LineIconTarget size={16} /> Configuration
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Sujet de la Newsletter</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Ex: L'impact de l'IA générative sur le SEO en 2026..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-blue-500/50 outline-none transition-all h-32 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Mots-clés SEO (séparés par des virgules)</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-4 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="SEO, IA, Marketing..."
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Ton du contenu</label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500/50 outline-none transition-all appearance-none"
                                >
                                    <option value="professional">Expert / Professionnel</option>
                                    <option value="casual">Conversationnel / Amical</option>
                                    <option value="viral">Provocateur / Viral</option>
                                    <option value="educational">Pédagogique / Tuto</option>
                                </select>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 group"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 group-hover:fill-current transition-all" />
                                        <span>GÉNÉRER LA TRANSMISSION</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                            <LineIconShield className="text-blue-400" size={16} /> Mode Souverain Actif
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Toutes vos données sont traitées localement et optimisées via notre modèle Gemini 2.0 pour garantir une souveraineté sémantique totale.
                        </p>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: PREVIEW & SEO --- */}
                <div className="lg:col-span-8 space-y-8">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#13131f]/50 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-20 text-center min-h-[600px]"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mb-8">
                                    <LineIconMail size={48} className="text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Prêt pour l'Impact ?</h3>
                                <p className="text-gray-400 max-w-sm mb-10 text-lg">
                                    Configurez vos paramètres et lancez la génération pour obtenir une newsletter optimisée pour le SEO et l'engagement.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <LineIconCheck size={14} className="text-green-500" /> SEO Validé
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <LineIconCheck size={14} className="text-green-500" /> HTML Sémantique
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* SEO REPORT CARD */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-xs font-bold text-amber-400 mb-4 flex items-center gap-2 uppercase">
                                            <Globe size={14} /> Aperçu Google (SERP)
                                        </h3>
                                        <div className="space-y-1">
                                            <div className="text-blue-400 text-lg font-medium hover:underline cursor-pointer truncate">
                                                {result.seo?.title || "Titre de la page"}
                                            </div>
                                            <div className="text-green-600 text-xs mb-2">
                                                ela-revolution.com › newsletter › {result.seo?.slug}
                                            </div>
                                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                                {result.seo?.description || "Pas de description générée."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-xs font-bold text-cyan-400 mb-4 flex items-center gap-2 uppercase">
                                            <Key size={14} /> Mots-clés Stratégiques
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.seo?.keywords.map((kw: string, i: number) => (
                                                <span key={i} className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENT EDITOR / PREVIEW */}
                                <div className="bg-[#13131f] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <div className="bg-black/40 px-8 py-5 flex items-center justify-between border-b border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                            </div>
                                            <span className="text-xs font-mono text-gray-400">newsletter_{result.seo?.slug}.html</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => copyToClipboard(result.text)}
                                                className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white"
                                                title="Copier le code"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold text-xs hover:bg-gray-200 transition-all">
                                                <Send size={14} /> Diffuser
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-10 font-sans leading-relaxed max-h-[700px] overflow-y-auto custom-scrollbar prose prose-invert prose-blue max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: result.text }} />
                                    </div>

                                    {/* TAGS / HASHTAGS FOR SOCIAL CROSS-POSTING */}
                                    <div className="p-8 border-t border-white/5 bg-black/20 flex flex-wrap gap-3">
                                        <span className="text-xs font-bold text-gray-500 uppercase mr-2 mt-1">Social Hub:</span>
                                        {result.hashtags?.map((h: string, i: number) => (
                                            <span key={i} className="text-xs text-blue-400 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
        
        .prose h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 2rem; background: linear-gradient(to right, #60a5fa, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .prose h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #93c5fd; }
        .prose p { margin-bottom: 1.5rem; color: #a1a1aa; line-height: 1.8; }
        .prose strong { color: #fff; }
        .prose a { color: #60a5fa; text-decoration: none; border-bottom: 1px solid rgba(96, 165, 250, 0.3); }
        .prose a:hover { border-bottom: 1px solid #60a5fa; }
      `}</style>
        </div>
    );
}
