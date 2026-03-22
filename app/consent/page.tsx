"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function ConsentPage() {
    return (
        <main className="min-h-screen bg-[#050508] bg-luxe-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#0066FF]/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#FF007A]/10 rounded-full blur-[120px] animate-pulse" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white/5 backdrop-blur-2xl neon-white-border rounded-3xl p-8 md:p-12 relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="w-16 h-16 bg-gradient-to-tr from-[#0066FF] to-[#FF007A] rounded-2xl flex items-center justify-center mb-6 neon-white-shadow">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Audit de <span className="text-gradient-luxe">Souveraineté</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl">
                        Validation des couches de sécurité ELA et revue de conformité RGPD. Vos données sont sanctuarisées selon le protocole AES-256 GCM.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-6">
                        <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <Lock className="w-6 h-6 text-[#0066FF] shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Chiffrement End-to-End</h3>
                                <p className="text-sm text-white/50">Flux synchronisés via tunnels TLS 1.3 propriétaires.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <Eye className="w-6 h-6 text-[#FF007A] shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Transparence Algorithmique</h3>
                                <p className="text-sm text-white/50">Journalisation complète des décisions du Swarm.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#13131f] rounded-2xl p-6 border border-white/10">
                        <h3 className="flex items-center gap-2 font-semibold mb-4">
                            <Info className="w-5 h-5 text-white/40" />
                            Limites de l'IA
                        </h3>
                        <ul className="space-y-3 text-sm text-white/60">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Pas de décision financière sans validation humaine "Hard-Sync".</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Isolation stricte des environnements Client vs Engine.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                                <span>Temps de rétention des logs limité à 7 jours glissants.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-mono text-white/40 uppercase tracking-widest">Sovereign Audit Active</span>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all font-medium">
                            Détails Techniques
                        </button>
                        <button onClick={() => window.location.href = '/login'} className="px-8 py-3 rounded-full bg-white text-[#050508] hover:bg-[#0066FF] hover:text-white transition-all font-bold">
                            Accepter & Continuer
                        </button>
                    </div>
                </div>
            </motion.div>
            
            <footer className="absolute bottom-8 text-white/20 text-xs font-mono tracking-widest uppercase">
                &copy; 2026 ELA REVOLUTION - PROTOCOLE DE CONFIANCE SOUVERAINE
            </footer>
        </main>
    );
}
