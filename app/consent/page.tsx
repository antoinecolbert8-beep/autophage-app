"use client";

import Link from "next/link";

export default function ConsentPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-[#13131f] border border-white/5 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-2xl font-bold mb-4">Politique de Consentement</h1>
                <p className="text-gray-400 mb-6 leading-relaxed">
                    Chez ELA, nous prenons votre vie privée au sérieux. Avant de continuer, veuillez confirmer votre accord avec nos conditions d'utilisation et notre politique de traitement des données par intelligence artificielle.
                </p>

                <div className="space-y-4 mb-8">
                    <label className="flex items-start gap-4 cursor-pointer p-4 bg-[#0a0a0f] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <input type="checkbox" className="mt-1 w-5 h-5 rounded bg-white/10 border-white/20 checked:bg-[#667eea]" />
                        <span className="text-sm text-gray-300">
                            J'accepte que mes données soient traitées par les algorithmes de ELA AI à des fins d'amélioration de service.
                        </span>
                    </label>
                    <label className="flex items-start gap-4 cursor-pointer p-4 bg-[#0a0a0f] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <input type="checkbox" className="mt-1 w-5 h-5 rounded bg-white/10 border-white/20 checked:bg-[#667eea]" />
                        <span className="text-sm text-gray-300">
                            J'ai lu et j'accepte les Conditions Générales d'Utilisation (CGU).
                        </span>
                    </label>
                </div>

                <div className="flex gap-4">
                    <Link href="/" className="flex-1 py-3 text-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-bold text-gray-400 hover:text-white">
                        Refuser
                    </Link>
                    <Link href="/dashboard" className="flex-1 py-3 text-center rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity font-bold text-white">
                        Accepter & Continuer
                    </Link>
                </div>
            </div>
        </div>
    );
}
