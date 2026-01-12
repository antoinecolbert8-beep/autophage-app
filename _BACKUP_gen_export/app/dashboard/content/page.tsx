"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconPlus,
} from "@/components/LineIcons";

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Générateur de Contenu</h1>
        </div>
        <button className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors">
          <LineIconPlus size={16} />
          <span>Créer</span>
        </button>
      </div>

      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center mx-auto mb-6 opacity-20">
            <LineIconPlus size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucun contenu généré</h2>
          <p className="text-gray-400 mb-8">Utilisez le bouton "Créer" pour lancer votre première génération de contenu par IA.</p>
          <button className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full font-bold shadow-[0_0_20px_rgba(118,75,162,0.4)] hover:shadow-[0_0_30px_rgba(118,75,162,0.6)] transition-all">
            Démarrer le générateur
          </button>
        </div>
      </div>
    </div>
  );
}
