"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconShield,
  LineIconCheck
} from "@/components/AppIcons";

export default function LegalShieldPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Legal Shield AI</h1>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
            <LineIconShield size={32} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Bouclier Actif</h2>
            <p className="text-emerald-200">Votre infrastructure est conforme RGPD, CCPA et ePrivacy. Aucune faille détectée.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
            <h3 className="font-bold mb-6">Analyses Automatiques</h3>
            <div className="space-y-4">
              {[
                "Contrats Clients (CGV/CGU)",
                "Politiques de Confidentialité",
                "Accords de Non-Divulgation (NDA)",
                "Mentions Légales",
                "Conformité Cookies"
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-xl border border-white/5">
                  <span className="font-medium text-sm">{item}</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-green-400">
                    <LineIconCheck size={14} /> Vérifié
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
            <h3 className="font-bold mb-6">Générateur de Documents</h3>
            <p className="text-gray-400 mb-6 text-sm">Créez des documents juridiques sur mesure, instantanément validés par l'IA.</p>
            <div className="space-y-4">
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left px-6">
                <span className="font-bold block text-white">Créer un Contrat de Prestation</span>
                <span className="text-xs text-gray-500">Pour freelances et agences</span>
              </button>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left px-6">
                <span className="font-bold block text-white">Générer une mise en demeure</span>
                <span className="text-xs text-gray-500">Recouvrement amiable</span>
              </button>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left px-6">
                <span className="font-bold block text-white">Audit de Site Web</span>
                <span className="text-xs text-gray-500">Scan complet d'URL</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
