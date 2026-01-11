"use client";

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconGlobe,
    LineIconSearch,
    LineIconTrendingUp
} from "@/components/LineIcons";

export default function SEOPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">SEO & Visibilité</h1>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-2">Domaine à analyser</label>
                            <div className="flex items-center bg-[#0a0a0f] border border-white/10 rounded-lg overflow-hidden">
                                <span className="pl-4 text-gray-500"><LineIconGlobe size={18} /></span>
                                <input type="text" placeholder="ex: mon-site-web.com" className="w-full bg-transparent border-none p-3 text-white focus:ring-0" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-2">Mots-clés cibles</label>
                            <div className="flex items-center bg-[#0a0a0f] border border-white/10 rounded-lg overflow-hidden">
                                <span className="pl-4 text-gray-500"><LineIconSearch size={18} /></span>
                                <input type="text" placeholder="ex: intelligence artificielle, saas" className="w-full bg-transparent border-none p-3 text-white focus:ring-0" />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg font-bold hover:opacity-90 transition-opacity">
                                Analyser
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-[#13131f] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <LineIconTrendingUp size={20} className="text-green-400" />
                            Opportunités de Mots-clés
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-xs uppercase text-gray-400 font-bold">
                                    <tr>
                                        <th className="p-3">Mot-clé</th>
                                        <th className="p-3">Volume</th>
                                        <th className="p-3">Difficulté</th>
                                        <th className="p-3">Priorité</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <tr key={item} className="hover:bg-white/5 transition-colors">
                                            <td className="p-3 text-sm font-medium">optimisation ia {item}</td>
                                            <td className="p-3 text-sm text-gray-400">12.5k</td>
                                            <td className="p-3">
                                                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                    <div style={{ width: `${Math.random() * 100}%` }} className="h-full bg-green-400"></div>
                                                </div>
                                            </td>
                                            <td className="p-3"><span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold">Haute</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Recommandations</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-sm font-bold text-red-400 mb-1">Critique</p>
                                <p className="text-sm text-gray-300">3 pages manquent de méta-descriptions.</p>
                            </div>
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <p className="text-sm font-bold text-yellow-400 mb-1">Important</p>
                                <p className="text-sm text-gray-300">La vitesse de chargement mobile est lente (5.2s).</p>
                            </div>
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-sm font-bold text-green-400 mb-1">Succès</p>
                                <p className="text-sm text-gray-300">Votre score technique a augmenté de 12%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
