"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Check, AlertTriangle, Loader2 } from "lucide-react";

export default function ConsentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState({
        gdpr_consent: false,
        ai_data_usage: false,
        marketing_emails: false
    });

    useEffect(() => {
        // Load existing preferences
        fetch('/api/user/preferences')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setPreferences({
                        gdpr_consent: data.data.gdpr_consent,
                        ai_data_usage: data.data.ai_data_usage,
                        marketing_emails: data.data.marketing_emails
                    });
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        if (!preferences.gdpr_consent) {
            alert("Veuillez accepter les conditions générales pour continuer.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences)
            });

            if (res.ok) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-[#13131f] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Shield className="text-blue-400" size={24} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">PROTECTION DES DONNÉES</h1>
                </div>

                <p className="text-gray-400 mb-8 leading-relaxed">
                    ELA AI respecte les normes **RGPD (GDPR)**. Vos données sont chiffrées au repos via le protocole FORTRESS. Veuillez configurer vos préférences avant d'accéder à votre tableau de bord.
                </p>

                <div className="space-y-4 mb-8">
                    <label className={`flex items-start gap-4 cursor-pointer p-4 rounded-xl border transition-all ${preferences.gdpr_consent ? 'bg-blue-500/10 border-blue-500/30' : 'bg-[#0a0a0f] border-white/5 hover:border-white/10'}`}>
                        <input
                            type="checkbox"
                            checked={preferences.gdpr_consent}
                            onChange={(e) => setPreferences({ ...preferences, gdpr_consent: e.target.checked })}
                            className="mt-1 w-5 h-5 rounded bg-white/10 border-white/20 accent-blue-500 cursor-pointer"
                        />
                        <div>
                            <span className="text-sm font-bold block mb-1">Conditions Générales (CGU/CGV)</span>
                            <span className="text-xs text-gray-400">J'accepte le traitement de mes données pour le fonctionnement du service.</span>
                        </div>
                    </label>

                    <label className={`flex items-start gap-4 cursor-pointer p-4 rounded-xl border transition-all ${preferences.ai_data_usage ? 'bg-purple-500/10 border-purple-500/30' : 'bg-[#0a0a0f] border-white/5 hover:border-white/10'}`}>
                        <input
                            type="checkbox"
                            checked={preferences.ai_data_usage}
                            onChange={(e) => setPreferences({ ...preferences, ai_data_usage: e.target.checked })}
                            className="mt-1 w-5 h-5 rounded bg-white/10 border-white/20 accent-purple-500 cursor-pointer"
                        />
                        <div>
                            <span className="text-sm font-bold block mb-1">Entraînement IA & Amélioration</span>
                            <span className="text-xs text-gray-400">J'autorise l'utilisation anonymisée de mes interactions pour améliorer les agents ELA.</span>
                        </div>
                    </label>

                    <label className={`flex items-start gap-4 cursor-pointer p-4 rounded-xl border transition-all ${preferences.marketing_emails ? 'bg-green-500/10 border-green-500/30' : 'bg-[#0a0a0f] border-white/5 hover:border-white/10'}`}>
                        <input
                            type="checkbox"
                            checked={preferences.marketing_emails}
                            onChange={(e) => setPreferences({ ...preferences, marketing_emails: e.target.checked })}
                            className="mt-1 w-5 h-5 rounded bg-white/10 border-white/20 accent-green-500 cursor-pointer"
                        />
                        <div>
                            <span className="text-sm font-bold block mb-1">Communications & Stratégies</span>
                            <span className="text-xs text-gray-400">Recevoir des rapports de performance et des nouvelles opportunités par email.</span>
                        </div>
                    </label>
                </div>

                <div className="flex gap-4">
                    <Link href="/api/auth/signout" className="flex-1 py-3 text-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-bold text-gray-400 hover:text-white flex items-center justify-center gap-2">
                        Se Déconnecter
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all font-black text-white rounded-lg shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                        ACTIVER LE SHIELD
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    <Shield size={12} /> Encrypted via Fortress Protocol v1.0
                </div>
            </div>
        </div>
    );
}
