"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconUsers,
  LineIconZap
} from "@/components/LineIcons";

export default function TelephonyVoxPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Telephony VOX System</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          <span className="font-mono text-sm text-red-400">LIVE CALLING</span>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold mb-6">Visualisation Spectrale</h3>
            <div className="h-64 bg-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative">
              {/* Simulated Waveform */}
              <div className="flex items-center gap-1 h-32 w-full px-8 justify-center">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} style={{ height: `${Math.random() * 100}%` }} className="w-2 bg-blue-500 rounded-full animate-pulse mx-0.5 transform transition-all duration-75"></div>
                ))}
              </div>
              <div className="absolute bottom-4 left-4 text-xs font-mono text-blue-400">
                Signal: -42dB | Jitter: 2ms
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button className="flex-1 py-3 bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg font-bold hover:bg-red-500/30 transition-colors">
                Terminer l'appel
              </button>
              <button className="flex-1 py-3 bg-white/5 text-white border border-white/10 rounded-lg font-bold hover:bg-white/10 transition-colors">
                Mettre en attente
              </button>
            </div>
          </div>

          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6 flex flex-col">
            <h3 className="font-bold mb-6">Transcription Temps Réel</h3>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar h-[350px]">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                <div className="bg-[#2a2a35] p-3 rounded-tr-xl rounded-b-xl max-w-[80%]">
                  <p className="text-gray-300 text-sm">Bonjour, je souhaiterais obtenir des informations sur votre offre Enterprise.</p>
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0"></div>
                <div className="bg-blue-900/40 p-3 rounded-tl-xl rounded-b-xl max-w-[80%] border border-blue-500/20">
                  <p className="text-blue-100 text-sm">Absolument. Notre offre Enterprise inclut un accès illimité à tous nos agents. Souhaitez-vous une démo ?</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                <div className="bg-[#2a2a35] p-3 rounded-tr-xl rounded-b-xl max-w-[80%]">
                  <p className="text-gray-300 text-sm">Oui, cela m'intéresse. Quelles sont vos disponibilités ?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
