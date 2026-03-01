"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, RefreshCcw, Home } from "lucide-react";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const getErrorMessage = (errorCode: string | null) => {
        switch (errorCode) {
            case "Configuration":
                return "Erreur de configuration serveur. NEXTAUTH_SECRET ou NEXTAUTH_URL est probablement manquant.";
            case "AccessDenied":
                return "Accès refusé. Vous n'avez pas les permissions nécessaires pour accéder à cette zone.";
            case "Verification":
                return "Le jeton de vérification a expiré ou a déjà été utilisé.";
            default:
                return "Une erreur inattendue est survenue lors de l'authentification.";
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center p-8 font-sans selection:bg-[#66fcf1]/30">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-900/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg card-saphir p-12 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-black mb-4 tracking-tighter uppercase text-white stat-value">
                    ÉCHEC D'IDENTIFICATION
                </h1>

                <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-8 leading-relaxed">
                    {getErrorMessage(error)}
                </p>

                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all group"
                    >
                        <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                        TENTER UNE NOUVELLE ACCRÉDITATION
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-transparent text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-[#66fcf1] transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        REPLI VERS LE QG
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-[9px] text-gray-600 font-mono uppercase italic">
                            Debug Raw Error: {error || "none"}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
