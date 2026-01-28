"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/supabase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Real Supabase authentication
      await authService.signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion. Vérifiez vos identifiants.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(6,4,3)] text-white">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <img src="/logo-ela.png" alt="ELA" className="w-10 h-10 object-contain" />
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">ELA</span>
            </Link>
            <Link href="/" className="text-sm font-medium hover:opacity-80">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-[15px] p-10 backdrop-blur-sm">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-semibold mb-2">
                Bon retour !
              </h1>
              <p className="text-[rgba(255,255,255,0.7)]">
                Connectez-vous pour accéder à votre espace
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent text-white placeholder:text-[rgba(255,255,255,0.3)]"
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent text-white placeholder:text-[rgba(255,255,255,0.3)]"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span>Se souvenir de moi</span>
                </label>
                <Link href="/auth/forgot-password" className="hover:opacity-80 font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-limova letter-spaced w-full justify-center text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
              >
                {loading ? "Connexion..." : "S e  c o n n e c t e r"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-[rgba(255,255,255,0.1)] text-center">
              <p className="text-[rgba(255,255,255,0.7)]">
                Pas encore de compte ?{" "}
                <Link href="/signup" className="font-semibold hover:opacity-80">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-[rgba(255,255,255,0.5)] mt-6">
            En vous connectant, vous acceptez nos{" "}
            <Link href="/legal/terms" className="hover:opacity-80 underline">
              CGV
            </Link>
            {" "}et notre{" "}
            <Link href="/legal/privacy" className="hover:opacity-80 underline">
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
