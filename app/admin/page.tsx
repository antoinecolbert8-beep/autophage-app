"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LineIconShield, LineIconZap } from "@/components/AppIcons";
import { Lock, User, AlertTriangle } from "lucide-react";

/**
 * ADMIN AUTHENTICATION
 * 
 * Credentials:
 * Username: admin@genesis.io
 * Password: GodMode2024!
 */

const ADMIN_CREDENTIALS = {
  username: "admin@genesis.io",
  password: "GodMode2024!"
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Store admin session
        if (typeof window !== 'undefined') {
          localStorage.setItem('genesis_admin_auth', 'true');
          localStorage.setItem('genesis_admin_session', Date.now().toString());
        }
        router.push("/admin-master");
      } else {
        setError("Identifiants incorrects. Accès refusé.");
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-red-500/30">
            <LineIconShield size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">ADMIN SOVEREIGN</h1>
          <p className="text-gray-500">Accès restreint • Zone protégée</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#13131f] border border-red-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-red-400 font-medium">Zone d'administration sécurisée</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Identifiant Admin</label>
              <div className="relative">
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-red-500 transition-colors font-mono"
                  placeholder="admin@genesis.io"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Mot de passe</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-red-500 transition-colors font-mono"
                  placeholder="••••••••••••"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Vérification...
                </>
              ) : (
                <>
                  <LineIconZap size={20} />
                  ACCÉDER AU PANNEAU ADMIN
                </>
              )}
            </button>
          </form>

          {/* Credentials Hint (for demo purposes - remove in production) */}
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-xs text-gray-500 font-mono text-center">
              <span className="text-gray-400">Credentials:</span><br />
              <span className="text-white">admin@genesis.io</span> / <span className="text-white">GodMode2024!</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 ELA • Sovereign Infrastructure
        </p>
      </div>
    </div>
  );
}
