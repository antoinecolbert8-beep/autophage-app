"use client";

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconUsers,
    LineIconPlus,
} from "@/components/LineIcons";

export default function LeadsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Gestion des Leads</h1>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <LineIconPlus size={16} />
                    <span>Nouveau Lead</span>
                </button>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                        <p className="text-gray-400 text-sm mb-1">Total Leads</p>
                        <h3 className="text-3xl font-bold">1,204</h3>
                    </div>
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                        <p className="text-gray-400 text-sm mb-1">Convertis</p>
                        <h3 className="text-3xl font-bold text-green-400">142</h3>
                    </div>
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6">
                        <p className="text-gray-400 text-sm mb-1">Score Moyen IA</p>
                        <h3 className="text-3xl font-bold text-[#667eea]">8.4/10</h3>
                    </div>
                </div>

                <div className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase text-gray-400 font-bold">
                            <tr>
                                <th className="p-4">Lead</th>
                                <th className="p-4">Entreprise</th>
                                <th className="p-4">Source</th>
                                <th className="p-4">Score IA</th>
                                <th className="p-4">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <tr key={item} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600"></div>
                                            <div>
                                                <p className="font-bold text-sm">Jean Dupont {item}</p>
                                                <p className="text-xs text-gray-500">jean.d{item}@example.com</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-300">Tech Solutions {item}</td>
                                    <td className="p-4 text-sm text-gray-400">LinkedIn</td>
                                    <td className="p-4">
                                        <span className="font-bold text-green-400">92%</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">Nouveau</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
