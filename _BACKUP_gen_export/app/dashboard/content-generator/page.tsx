"use client";

import Link from "next/link";
import { useState } from "react";
import {
    LineIconChevronLeft,
    LineIconZap,
    LineIconCheck
} from "@/components/LineIcons";

export default function ContentGeneratorPage() {
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => setGenerating(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">AI Content Generator</h1>
                </div>
            </div>

            <div className="p-8 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8 mb-8">
                            <h3 className="font-bold mb-6">Paramètres de Génération</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Thème / Sujet</label>
                                    <input type="text" placeholder="ex: Les avantages de l'IA pour les PME" className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#667eea] outline-none transition-colors" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Type de contenu</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white hover:bg-white/20">Article de Blog</button>
                                        <button className="px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white">Post LinkedIn</button>
                                        <button className="px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white">Newsletter</button>
                                        <button className="px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white">Script Vidéo</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Ton</label>
                                    <select className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-white outline-none">
                                        <option>Professionnel</option>
                                        <option>Persuasif</option>
                                        <option>Humoristique</option>
                                        <option>Inspirant</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="w-full mt-8 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Génération en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <LineIconZap size={20} />
                                        <span>Générer le contenu</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8 h-full min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                            <h3 className="font-bold">Résultat</h3>
                            <div className="flex gap-2">
                                <button className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400 hover:text-white">Copier</button>
                                <button className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400 hover:text-white">Enregistrer</button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto rounded-lg bg-[#0a0a0f] p-4 text-gray-300 leading-relaxed font-light border border-white/5">
                            {generating ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                                    <p className="animate-pulse">L'IA rédige votre chef d'oeuvre...</p>
                                </div>
                            ) : (
                                <p className="italic text-gray-500">Le contenu généré apparaîtra ici.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
