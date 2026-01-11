"use client";

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconZap
} from "@/components/LineIcons";

export default function WhatsAppCommandPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">WhatsApp Command Center</h1>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-black mb-6">Contrôlez votre empire depuis votre poche.</h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            HIVE est votre interface de commande WhatsApp. Envoyez des instructions vocales ou textuelles pour piloter l'&ensemble de votre infrastructure Genesis.
                        </p>

                        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6 mb-8">
                            <h3 className="font-bold mb-4 text-green-400">Grimoire de l'Empereur (Commandes)</h3>
                            <ul className="space-y-3 font-mono text-sm text-gray-300">
                                <li className="flex items-center gap-2"><span className="text-green-500">/stats</span> Rapport journalier instantané</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">/deploy [x]</span> Lance une nouvelle campagne</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">/killswitch</span> Arrêt d'urgence des bots</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-[300px] h-[600px] border-8 border-gray-800 rounded-[3rem] bg-[#0a0a0f] relative overflow-hidden shadow-2xl">
                            {/* Phone Notion */}
                            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 z-20 flex justify-center">
                                <div className="w-32 h-4 bg-black rounded-b-xl"></div>
                            </div>

                            <div className="h-full bg-[url('https://i.imgur.com/8Q5F5zM.png')] bg-cover bg-center flex flex-col justify-end p-4">
                                {/* Simulated WA Interface */}
                                <div className="bg-[#075e54] absolute top-8 left-0 right-0 h-16 flex items-center px-4 z-10">
                                    <div className="w-8 h-8 rounded-full bg-white/20 mr-3"></div>
                                    <span className="font-bold text-white">Genesis Hive</span>
                                </div>

                                <div className="space-y-2 mb-16 relative z-0 mt-20 overflow-hidden">
                                    <div className="self-end bg-[#dcf8c6] text-black p-2 rounded-lg rounded-tr-none text-xs ml-auto w-fit max-w-[80%] shadow">
                                        HIVE, donne-moi le CA du jour.
                                    </div>
                                    <div className="self-start bg-white text-black p-2 rounded-lg rounded-tl-none text-xs mr-auto w-fit max-w-[80%] shadow">
                                        <strong>💰 Revenu journalier :</strong> 4,250 €<br />
                                        📈 +12% vs hier.<br />
                                        32 nouveaux leads qualifiés.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
