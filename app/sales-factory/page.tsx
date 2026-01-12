"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconUsers,
  LineIconZap
} from "@/components/AppIcons";

export default function SalesFactoryPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Sales Factory</h1>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg font-bold text-sm flex items-center gap-2">
          <LineIconZap size={16} />
          <span>Mode Turbo Actif</span>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Gallery of Identities</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-[#0a0a0f] rounded-xl border-2 border-transparent hover:border-pink-500 transition-colors cursor-pointer flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50 group-hover:opacity-20 transition-opacity"></div>
                  <span className="text-2xl z-10">👤</span>
                </div>
              ))}
              <div className="aspect-square bg-[#0a0a0f] rounded-xl border-2 border-dashed border-gray-700 hover:border-white transition-colors cursor-pointer flex items-center justify-center">
                <span className="text-xl text-gray-500">+</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">Sélectionnez un avatar pour vos campagnes vidéo.</p>
          </div>

          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Cible & Contexte</h3>
            <div className="space-y-4">
              <input type="text" placeholder="URL Profil LinkedIn du prospect" className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" />
              <textarea placeholder="Instruction spécifique pour la vidéo..." className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none h-32 resize-none"></textarea>
              <button className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                Générer la vidéo (1 Crédit)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4 text-pink-500">Reality Injector Preview</h3>
          <div className="h-64 bg-black rounded-xl flex items-center justify-center border border-white/10 text-gray-500">
            L'aperçu de la vidéo générée s'affichera ici.
          </div>
          <div className="mt-4 p-4 bg-[#0a0a0f] rounded-lg border-l-4 border-pink-500">
            <p className="text-sm font-mono text-gray-300">
              <span className="text-pink-500 font-bold">SCRIPT:</span> "Bonjour [Prénom], j'ai vu que chez [Entreprise], vous cherchez à scaler..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
