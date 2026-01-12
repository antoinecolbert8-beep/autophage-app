"use client";

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconZap,
    LineIconCheck
} from "@/components/AppIcons";

export default function BillingPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Facturation & Crédits</h1>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <div className="flex-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="font-bold opacity-80 mb-2">Crédits Disponibles</p>
                            <h2 className="text-5xl font-black mb-6">4,500</h2>
                            <button className="bg-white text-[#764ba2] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                Recharger
                            </button>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 blur-[80px] rounded-full pointer-events-none" />
                    </div>

                    <div className="flex-1 bg-[#13131f] border border-white/5 rounded-2xl p-8">
                        <h3 className="font-bold mb-4">Plan Actuel : PRO</h3>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <LineIconCheck size={16} className="text-green-400" />
                                Accès à 9 agents
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <LineIconCheck size={16} className="text-green-400" />
                                Support prioritaire
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <LineIconCheck size={16} className="text-green-400" />
                                API illimitée
                            </li>
                        </ul>
                        <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Gérer l'abonnement →</button>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-6">Historique des transactions</h3>
                <div className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase text-gray-400 font-bold">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Montant</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4">Facture</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="p-4 text-sm">12 Jan 2026</td>
                                <td className="p-4 text-sm font-bold">Pack Crédits (5000)</td>
                                <td className="p-4 text-sm text-gray-300">49.00 €</td>
                                <td className="p-4"><span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">Payé</span></td>
                                <td className="p-4"><button className="text-[#667eea] hover:underline text-sm">PDF</button></td>
                            </tr>
                            <tr>
                                <td className="p-4 text-sm">01 Jan 2026</td>
                                <td className="p-4 text-sm font-bold">Abonnement PRO (Mensuel)</td>
                                <td className="p-4 text-sm text-gray-300">199.00 €</td>
                                <td className="p-4"><span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">Payé</span></td>
                                <td className="p-4"><button className="text-[#667eea] hover:underline text-sm">PDF</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
