"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconGlobe
} from "@/components/AppIcons";

export default function WarRoomPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 bg-[url('https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif')] opacity-5 pointer-events-none bg-cover"></div>

      <div className="relative z-10 h-screen flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {/* Fixed the typo in href or passed props if necessary, though href looks fine. Assuming LineIcon might be the issue if it wasn't exported correctly, but checking previous file, it seems ok. The error was likely due to a malformed tag or import in previous version. */}
            <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <LineIconChevronLeft size={20} className="text-gray-400" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-widest uppercase text-red-600">WAR ROOM</h1>
              <span className="text-[10px] font-mono text-red-500/50 tracking-[0.2em]">DEFCON 1 • LIVE OPERATIONS</span>
            </div>
          </div>
          <div className="font-mono text-red-500 text-xl font-bold animate-pulse">
            00:42:15:09
          </div>
        </div>

        <div className="flex-1 p-8 grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-black/50 border border-red-900/20 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[800px] h-[800px] border border-red-900/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
              <div className="w-[600px] h-[600px] border border-red-900/10 rounded-full absolute animate-[spin_40s_linear_infinite_reverse]"></div>
              <div className="w-[400px] h-[400px] border border-red-900/10 rounded-full absolute animate-[spin_20s_linear_infinite]"></div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <LineIconGlobe size={64} className="text-red-600 animate-pulse mx-auto mb-4" />
                <h2 className="text-4xl font-black text-red-600 tracking-tighter">GLOBAL SATURATION</h2>
                <p className="text-red-400/50 font-mono mt-2">TARGET AQ: 100%</p>
              </div>
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-black/50 border border-red-900/20 rounded-xl p-6 overflow-hidden">
              <h3 className="font-mono text-red-500 text-sm mb-4 border-b border-red-900/30 pb-2">LIVE FEED</h3>
              <div className="space-y-2 font-mono text-xs text-red-400/70">
                <p>&gt; [SYSTEM] Attaque marketing lancée sur le secteur Retail...</p>
                <p>&gt; [BOT-142] 500 emails envoyés (Taux ouverture: 82%)</p>
                <p>&gt; [VOX] Appel terminé avec CEO (Durée: 4m12s) -&gt; RDV Pris</p>
                <p>&gt; [ALERTE] Concurrent détecté sur mot-clé &quot;IA Generative&quot;</p>
                <p>&gt; [SYSTEM] Contre-mesure déployée : Augmentation bid +20%</p>
              </div>
            </div>
            <div className="h-48 bg-black/50 border border-red-900/20 rounded-xl p-6 flex items-center justify-center">
              <div className="text-center">
                <p className="font-mono text-red-500/50 text-xs mb-1">REVENU GÉNÉRÉ (SESSION)</p>
                <p className="text-5xl font-black text-red-600">12,450 €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
