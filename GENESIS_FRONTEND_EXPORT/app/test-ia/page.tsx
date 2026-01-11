"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
} from "@/components/LineIcons";

export default function TestIAPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold">Zone de Test IA (Sandbox)</h1>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-6">Mode Simulation Activé</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Cette zone vous permet de tester les capacités brutes de nos modèles sans affecter vos données de production.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-8 bg-[#13131f] border border-white/5 rounded-2xl hover:border-purple-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-bold mb-2">Reasoning</h3>
              <p className="text-xs text-gray-500">Testez la logique complexe et la résolution de problèmes.</p>
            </div>
            <div className="p-8 bg-[#13131f] border border-white/5 rounded-2xl hover:border-blue-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold mb-2">Speed</h3>
              <p className="text-xs text-gray-500">Mesurez la latence de réponse en temps réel.</p>
            </div>
            <div className="p-8 bg-[#13131f] border border-white/5 rounded-2xl hover:border-green-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-bold mb-2">Creativity</h3>
              <p className="text-xs text-gray-500">Générez des concepts abstraits et visuels.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
