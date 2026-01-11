"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LineIconChevronLeft,
    LineIconShield,
    LineIconCheck
} from "@/components/LineIcons";

export default function ConsentPage() {
    const router = useRouter();

    const integrations = [
        { id: "google-analytics", name: "Google Analytics", connected: true },
        { id: "linkedin", name: "LinkedIn", connected: false },
        { id: "twitter", name: "X (Twitter)", connected: false },
        { id: "stripe", name: "Stripe", connected: true },
        { id: "instagram", name: "Instagram", connected: false },
    ];

    const handleConnect = (providerId: string) => {
        router.push(`/api/auth/${providerId}`);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Confidentialité & Connexions</h1>
                </div>
            </div>

            <div className="p-8 max-w-4xl mx-auto">
                <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
                            <LineIconShield size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Statut RGPD : Conforme</h3>
                            <p className="text-gray-400 text-sm">Toutes vos données sont stockées en France et chiffrées.</p>
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-lg mb-6">Intégrations & Accès Données</h3>
                <div className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden text-sm">
                    {integrations.map((app, i) => (
                        <div key={i} className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center font-bold">
                                    {app.name.charAt(0)}
                                </div>
                                <span className="font-bold">{app.name}</span>
                            </div>
                            {app.connected ? (
                                <span className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-full">
                                    <LineIconCheck size={14} /> Connecté
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleConnect(app.id)}
                                    className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                                >
                                    Connecter
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
