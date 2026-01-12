"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
} from "@/components/AppIcons";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Paramètres</h1>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        <div className="bg-[#13131f] border border-white/5 rounded-xl p-8 mb-8">
          <h3 className="text-lg font-bold mb-6">Profil</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nom complet</label>
              <input type="text" value="Alexandre" className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#667eea] outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input type="email" value="alexandre@example.com" className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#667eea] outline-none transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-[#13131f] border border-white/5 rounded-xl p-8">
          <h3 className="text-lg font-bold mb-6">Sécurité</h3>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
            <div>
              <p className="font-bold">Double authentification (2FA)</p>
              <p className="text-sm text-gray-400">Renforcez la sécurité de votre compte.</p>
            </div>
            <div className="w-12 h-6 bg-green-500/20 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-green-500 rounded-full ml-auto"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Mot de passe</p>
              <p className="text-sm text-gray-400">Dernière modification il y a 3 mois.</p>
            </div>
            <button className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">Modifier</button>
          </div>
        </div>
      </div>
    </div>
  );
}
