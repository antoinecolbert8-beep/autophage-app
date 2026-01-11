"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Server, Key, Lock, Shield, CheckCircle2 } from "lucide-react";

export default function SetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [config, setConfig] = useState({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
        OPENAI_API_KEY: "",
        STRIPE_SECRET_KEY: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                setSuccess(true);
                // Simulate a delay for "System Reboot" effect
                setTimeout(() => {
                    // In a real scenario, we might trigger a server restart or tell user to do it
                    // Here we just redirect to dashboard or show success
                }, 2000);
            } else {
                alert("Erreur lors de l'écriture de la configuration.");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur de connexion.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
                <div className="text-center space-y-6 max-w-lg p-8 border border-green-500/30 rounded-2xl bg-green-900/10">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-500">CONFIGURATION REÇUE</h1>
                    <p className="text-gray-400">
                        Les clés cryptographiques ont été injectées dans le noyau (fichier .env).
                    </p>
                    <div className="p-4 bg-black border border-white/10 rounded text-sm text-yellow-500 space-y-2">
                        <p className="font-bold">⚠️ ACTION REQUISE</p>
                        <p>Le serveur doit redémarrer pour appliquer les changements.</p>
                    </div>
                    <div className="pt-4">
                        <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">Retour à l'accueil</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans">
            <div className="max-w-4xl mx-auto py-20 px-6">

                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-6 shadow-lg shadow-purple-500/20">
                        <Server className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Configuration Système</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Initialisez les variables d'environnement critiques pour activer la pleine puissance de Genesis.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-[#0a0a0f] border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">

                    {/* Ambient Background */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none"></div>

                    {/* Supabase Section */}
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Server size={20} /></div>
                            <h2 className="text-xl font-bold">Supabase (Base de données)</h2>
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Project URL</label>
                                <input name="NEXT_PUBLIC_SUPABASE_URL" value={config.NEXT_PUBLIC_SUPABASE_URL} onChange={handleChange} placeholder="https://xyz.supabase.co" className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors font-mono text-sm" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Anon Key (Public)</label>
                                    <input name="NEXT_PUBLIC_SUPABASE_ANON_KEY" value={config.NEXT_PUBLIC_SUPABASE_ANON_KEY} onChange={handleChange} placeholder="eyJnh..." className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors font-mono text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Service Role Key (Secret)</label>
                                    <input name="SUPABASE_SERVICE_ROLE_KEY" type="password" value={config.SUPABASE_SERVICE_ROLE_KEY} onChange={handleChange} placeholder="eyJnh..." className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors font-mono text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OpenAI Section */}
                    <div className="space-y-6 relative z-10 pt-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Server size={20} /></div>
                            <h2 className="text-xl font-bold">OpenAI (Intelligence)</h2>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
                            <div className="relative">
                                <input name="OPENAI_API_KEY" type="password" value={config.OPENAI_API_KEY} onChange={handleChange} placeholder="sk-..." className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 pl-12 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm" />
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Stripe Section */}
                    <div className="space-y-6 relative z-10 pt-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Lock size={20} /></div>
                            <h2 className="text-xl font-bold">Stripe (Paiements)</h2>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Secret Key</label>
                            <input name="STRIPE_SECRET_KEY" type="password" value={config.STRIPE_SECRET_KEY} onChange={handleChange} placeholder="sk_test_..." className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm" />
                        </div>
                    </div>

                    {/* DEBUG / UNLOCK SECTION */}
                    <div className="space-y-6 relative z-10 pt-6 border-t border-white/10 mt-6">
                        <div className="flex items-center gap-3 pb-4">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><Shield size={20} /></div>
                            <h2 className="text-xl font-bold text-red-500">Zone Morte (Debug)</h2>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-xl flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-red-400">Forcer l'accès Dashboard</h3>
                                <p className="text-sm text-gray-500">Utilisez ceci si vous êtes bloqué sur la page de Signup malgré la configuration.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem('genesis_paid', 'true');
                                        localStorage.setItem('genesis_tier', 'grand_horloger');
                                        localStorage.setItem('genesis_user_name', 'Admin System');
                                        localStorage.removeItem('genesis_simulate_external'); // Clear simulation if unlocking
                                        alert("Accès forcé activé. Vous êtes maintenant Grand Horloger.");
                                        window.location.href = '/dashboard';
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors"
                            >
                                DÉVERROUILLER
                            </button>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl flex items-center justify-between mt-4">
                            <div>
                                <h3 className="font-bold text-blue-400">Mode Simulation Client</h3>
                                <p className="text-sm text-gray-500">Simuler une connexion externe (Bloque le God Mode Localhost) pour tester le parcours client réel.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.removeItem('genesis_paid');
                                        localStorage.setItem('genesis_simulate_external', 'true');
                                        alert("Mode Simulation Activé. Vous allez être traité comme un nouveau client (Bloqué).");
                                        window.location.href = '/dashboard';
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors"
                            >
                                SIMULER CLIENT
                            </button>
                        </div>
                    </div>

                    <div className="pt-8 flex items-center justify-end border-t border-white/10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Écriture en cours..." : <>Enregistrer la configuration <Save size={18} /></>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
