"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateWithBrainAction } from "@/actions/ai-logic";

// Configuration des styles selon l'abonnement
const THEMES = {
  BASIC: { bg: "bg-slate-950", accent: "text-slate-400", border: "border-slate-800" },
  ADVANCED: { bg: "bg-[#051010]", accent: "text-emerald-400", border: "border-emerald-900" },
  ELITE: { bg: "bg-[#050515]", accent: "text-blue-400", border: "border-blue-900" },
  GOD_MODE: { bg: "bg-black", accent: "text-purple-500", border: "border-purple-500/50" }
};

export default function ClientDashboard() {
  const router = useRouter();
  
  // --- ÉTATS GLOBAUX ---
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [tier, setTier] = useState("BASIC");
  const [paymentStatus, setPaymentStatus] = useState("checking");
  
  // États pour l'autonomie (God Mode)
  const [revenue, setRevenue] = useState(12450);
  const [autoLogs, setAutoLogs] = useState<string[]>([]);

  useEffect(() => {
    // 1. VÉRIFICATION SÉCURITÉ & PAIEMENT
    const userTier = localStorage.getItem("user_tier");
    const status = localStorage.getItem("payment_status");
    
    if (!userTier) {
      router.push("/"); // Pas connecté ? Dehors.
      return;
    }
    
    setTier(userTier);

    // Simulation check mensuel
    setTimeout(() => {
      // Pour le test, on considère que c'est payé si le localStorage dit 'active' ou rien
      if (status === "failed") setPaymentStatus("failed");
      else setPaymentStatus("authorized");
    }, 1000);

    // 2. LANCEMENT DU SYSTÈME AUTONOME (Uniquement God Mode)
    if (userTier === "GOD_MODE") {
      const actions = [
        "✅ Client 'Studio 44' signé (Virement reçu)",
        "🤖 Post LinkedIn viral publié (+450 vues en 10min)",
        "🔍 150 Prospects qualifiés extraits",
        "📧 Campagne de relance : 45% taux d'ouverture"
      ];
      let i = 0;
      const interval = setInterval(() => {
        setAutoLogs(prev => [actions[i % actions.length], ...prev].slice(0, 5));
        if (i % 4 === 0) setRevenue(prev => prev + 297); // Encaissement auto
        i++;
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [router]);

  const theme = THEMES[tier as keyof typeof THEMES] || THEMES.BASIC;

  // --- ÉCRAN DE BLOCAGE (Paiement échoué) ---
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-950/30 border border-red-500 p-8 rounded-2xl text-center backdrop-blur-xl">
          <div className="text-4xl mb-4">⛔</div>
          <h2 className="text-2xl font-black text-red-500 uppercase mb-2">Accès Suspendu</h2>
          <p className="text-red-200 text-sm mb-6">Le prélèvement mensuel pour votre abonnement {tier} a échoué.</p>
          <button onClick={() => router.push("/")} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg uppercase">
            Mettre à jour la carte bancaire
          </button>
        </div>
      </div>
    );
  }

  // --- ÉCRAN DE CHARGEMENT ---
  if (paymentStatus === "checking") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-slate-500 font-mono text-xs animate-pulse">
        VÉRIFICATION DES DROITS D'ACCÈS...
      </div>
    );
  }

  // --- INTERFACE PRINCIPALE ---
  return (
    <div className={`min-h-screen ${theme.bg} text-white font-sans transition-colors duration-1000 flex`}>
      
      {/* SIDEBAR POLYMORPHE */}
      <aside className={`w-20 lg:w-64 border-r ${theme.border} p-6 flex flex-col justify-between hidden md:flex`}>
        <div>
          <div className="text-2xl font-black italic mb-10 tracking-tighter">A<span className={theme.accent}>.</span></div>
          <nav className="space-y-2">
            <div className={`p-3 rounded-lg ${theme.bg === 'bg-black' ? 'bg-purple-900/20 text-white' : 'text-slate-500'} font-bold text-sm cursor-pointer`}>Dashboard</div>
            <div className="p-3 text-slate-500 hover:text-white text-sm cursor-pointer">Campagnes</div>
            <div className="p-3 text-slate-500 hover:text-white text-sm cursor-pointer">Facturation</div>
          </nav>
        </div>
        
        {/* UPSELL POUR LES NON-GOD MODE */}
        {tier !== "GOD_MODE" && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-black border border-slate-800">
            <p className="text-[10px] text-slate-400 mb-2 uppercase font-bold">Passez au niveau supérieur</p>
            <button onClick={() => { localStorage.setItem("user_tier", "GOD_MODE"); window.location.reload(); }} className="w-full py-2 bg-white text-black text-xs font-black uppercase rounded hover:scale-105 transition-transform">
              Upgrade God Mode
            </button>
          </div>
        )}
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Vue d'ensemble</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${tier === 'GOD_MODE' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
              Mode Actif : <span className={`${theme.accent} font-black uppercase`}>{tier}</span>
            </p>
          </div>
          {tier === "GOD_MODE" && (
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Revenu Généré (Auto)</p>
              <p className="text-3xl font-black text-white">{revenue.toLocaleString()} €</p>
            </div>
          )}
        </header>

        {/* SECTION AUTONOME : UNIQUEMENT GOD MODE */}
        {tier === "GOD_MODE" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Colonne 1 : Prospection Auto */}
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-purple-900/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <h3 className="text-sm font-bold text-slate-300 uppercase mb-4 flex items-center justify-between">
                Acquisition Clients <span className="text-[10px] bg-green-500/20 text-green-400 px-2 rounded">LIVE</span>
              </h3>
              <div className="space-y-3 font-mono text-xs h-32 overflow-hidden">
                {autoLogs.map((log, i) => (
                  <div key={i} className="text-slate-400 animate-in fade-in slide-in-from-left-4">{log}</div>
                ))}
              </div>
            </div>

            {/* Colonne 2 : Stratégie Organique */}
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-purple-900/30">
              <h3 className="text-sm font-bold text-slate-300 uppercase mb-4">Viralité Organique</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-500">LinkedIn</span>
                <span className="text-xs text-green-400 font-bold">3 Posts/Jour ✅</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-500">Instagram</span>
                <span className="text-xs text-green-400 font-bold">3 Reels/Jour ✅</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Twitter (X)</span>
                <span className="text-xs text-green-400 font-bold">Auto-Thread ✅</span>
              </div>
            </div>
            
            {/* Colonne 3 : SEO Darwinien */}
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-purple-900/30 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center text-xl font-black mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">98%</div>
               <h3 className="text-sm font-bold text-white uppercase">Score SEO</h3>
               <p className="text-[10px] text-slate-500 mt-2">Votre Landing Page s'est auto-optimisée 4 fois ce matin.</p>
            </div>
          </div>
        ) : (
          /* VERSION RESTREINTE (BASIC/ADVANCED) */
          <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-3xl text-center mb-8">
            <h3 className="text-xl font-bold text-slate-400 mb-2">Mode Pilote Manuel</h3>
            <p className="text-slate-600 mb-6">L'automatisation complète, l'encaissement et le SEO Darwinien sont réservés aux membres GOD MODE.</p>
            <button onClick={() => { localStorage.setItem("user_tier", "GOD_MODE"); window.location.reload(); }} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-black uppercase text-sm hover:scale-105 transition-transform shadow-lg">
              Débloquer l'Autonomie (2997€/mois)
            </button>
          </div>
        )}

        {/* SECTION CONTENU : CONNECTÉE AU CERVEAU RÉEL */}
        <div className={`p-8 rounded-3xl border ${theme.border} bg-black/20 mt-8`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            Générateur de Contenu Stratégique
            {tier === "GOD_MODE" && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">MOTEUR GPT-4o CONNECTÉ</span>}
          </h3>
          
          <div className="space-y-4">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={tier === "GOD_MODE" ? "Ex: 'Vends mon coaching High-Ticket pour des dentistes' (Je génère les 3 réseaux)..." : "Sujet du post (Limité à 1)..."} 
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition-all h-32 resize-none placeholder:text-slate-600"
            />
            
            <div className="flex justify-between items-center">
               <div className="text-xs text-slate-500 flex gap-3 font-mono">
                  <span className={tier === "GOD_MODE" ? "text-green-400 font-bold" : "text-slate-600"}>[LINKEDIN]</span>
                  <span className={tier === "GOD_MODE" ? "text-pink-400 font-bold" : "text-slate-600"}>[INSTA]</span>
                  <span className={tier === "GOD_MODE" ? "text-white font-bold" : "text-slate-600"}>[X]</span>
               </div>
               
               <button 
                  disabled={loading}
                  onClick={async () => {
                    if (!prompt) return;
                    setLoading(true);
                    // On force l'IA à agir selon le rang de l'utilisateur
                    const contextPrompt = tier === "GOD_MODE" 
                      ? `[MODE GOD_MODE ACTIVÉ] Agis comme une Agence Média Autonome. Génère 3 posts distincts (LinkedIn expert, Twitter punchy, Instagram script Reel) sur ce sujet : "${prompt}". Utilise mes modules de persuasion.`
                      : `[MODE BASIC] Génère un seul post LinkedIn simple sur : "${prompt}".`;
                      
                    const res = await generateWithBrainAction(contextPrompt);
                    if (res.output) setResult(res.output);
                    setLoading(false);
                  }}
                  className={`px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 ${tier === "GOD_MODE" ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
               >
                  {loading ? "Création des posts..." : (tier === "GOD_MODE" ? "🚀 Lancer la Production (x3)" : "Poster (x1)")}
               </button>
            </div>
          </div>

          {/* AFFICHAGE DU RÉSULTAT RÉEL */}
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6"></div>
              <div className="bg-[#050505] rounded-xl border border-white/10 p-6 shadow-inner">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Contenu Généré par le Cerveau :</h4>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-light text-sm">
                  {result}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button className="text-[10px] uppercase font-bold text-green-400 hover:text-green-300">Copier tout</button>
                  <button className="text-[10px] uppercase font-bold text-purple-400 hover:text-purple-300">Planifier Auto</button>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
