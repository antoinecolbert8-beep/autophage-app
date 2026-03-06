"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BiometricScanner } from "@/components/AdvancedVisuals";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect. Vérifiez vos identifiants.");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Trigger cinematic scan before redirect
        setLoading(false);
        setIsScanning(true);
      }
    } catch (err: any) {
      setError(err.message || "Erreur de connexion. Réessayez.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans selection:bg-[#66fcf1]/30 overflow-hidden relative">
      <AnimatePresence>
        {isScanning && (
          <BiometricScanner
            onComplete={() => {
              setIsScanning(false);
              router.push("/dashboard");
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>

      {/* Background Glows (Orbital) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#66fcf1]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header (Saphir Navigation) */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="h-24 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 border border-[#66fcf1]/30 rounded-full flex items-center justify-center bg-white/5 relative group-hover:border-[#66fcf1]/60 transition-colors duration-700">
                <div className="w-6 h-6 border border-[#66fcf1] rounded-full border-t-transparent animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-0 bg-[#66fcf1]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <span className="text-xl font-black tracking-[0.3em] uppercase text-white stat-value pt-1">ELA</span>
            </Link>
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-[#66fcf1] transition-colors flex items-center gap-2">
              <span className="w-4 h-px bg-current opacity-30" /> RETOUR AU CADRAN
            </Link>
          </div>
        </div>
      </header>

      {/* Login Gateway */}
      <div className="flex-1 flex items-center justify-center p-8 min-h-screen relative z-10">
        <div className="w-full max-w-[440px]">
          <div className="card-saphir p-12 relative group overflow-hidden">
            {/* Corner Mechanical Detail */}
            <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-[#66fcf1]/10 rounded-tr-3xl pointer-events-none" />

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                <span className="text-[8px] font-black text-[#66fcf1] uppercase tracking-[0.3em]">GATEWAY // ACCÈS SÉCURISÉ</span>
              </div>
              <h1 className="text-3xl font-black mb-3 tracking-tighter uppercase text-white stat-value">
                BON RETOUR.
              </h1>
              <p className="text-gray-500 text-[11px] font-light leading-relaxed uppercase tracking-[0.1em]">
                " Ré-activez vos protocoles opérationnels. "
              </p>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-4 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-600 ml-1">IDENTIFIANT EMAIL</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#66fcf1]/40 text-white placeholder:text-gray-800 transition-all text-[11px] font-black uppercase tracking-wider"
                    placeholder="VOTRE@EMAIL.COM"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-600">CLÉ DE SÉCURITÉ</label>
                  <Link href="/auth/forgot-password" name="forgot-password" className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-[#66fcf1] transition-colors">
                    OUBLI ?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#66fcf1]/40 text-white placeholder:text-gray-800 transition-all text-[11px] font-black uppercase tracking-wider"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-white/10 bg-white/5 flex items-center justify-center transition-colors group-hover:border-[#66fcf1]/30">
                    <input type="checkbox" className="hidden peer" />
                    <div className="w-2 h-2 rounded-full bg-[#66fcf1] opacity-0 peer-checked:opacity-100 transition-opacity shadow-[0_0_8px_rgba(102,252,241,1)]" />
                  </div>
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest group-hover:text-gray-400 transition-colors">MÉMORISER L'ACCÈS</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#66fcf1] text-[#0b0c10] font-black text-[10px] uppercase tracking-[0.4em] rounded-xl hover:shadow-[0_0_40px_rgba(102,252,241,0.3)] transition-all flex items-center justify-center gap-3 btn-haptic disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#0b0c10] border-t-transparent rounded-full animate-spin" />
                ) : (
                  "INITIALISER LA SESSION"
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em]">
                PAS ENCORE DE COMPTE ?{" "}
                <Link href="/signup" className="text-white hover:text-[#66fcf1] transition-colors ml-2 underline underline-offset-4 decoration-[#66fcf1]/30">
                  CRÉER UN COMPTE
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.4em] leading-loose">
              EN VOUS CONNECTANT, VOUS ACCEPTEZ NOS{" "}
              <Link href="/legal/terms" className="text-gray-500 hover:text-white transition-colors">CGV</Link>
              {" "}ET NOTRE{" "}
              <Link href="/legal/privacy" className="text-gray-500 hover:text-white transition-colors">CONFIDENTIALITÉ</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
