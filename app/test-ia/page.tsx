"use client"
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  // Simulation du paiement Stripe
  const handleSubscribe = async (tier: string) => {
    setProcessing(tier);
    // Ici on simulerait l'appel à Stripe
    setTimeout(() => {
      // On sauvegarde le niveau d'abonnement dans le navigateur (simulation BDD)
      localStorage.setItem("user_tier", tier);
      localStorage.setItem("payment_status", "active");
      localStorage.setItem("next_check", new Date(Date.now() + 30*24*60*60*1000).toISOString()); // +30 jours
      router.push("/dashboard");
    }, 2000);
  };

  const tiers = [
    { id: "BASIC", name: "STARTUP", price: "197€", feat: ["1 Post/jour", "Accès Manuel"], color: "border-slate-600", bg: "bg-slate-900" },
    { id: "ADVANCED", name: "SCALE", price: "497€", feat: ["3 Posts/jour", "Planification"], color: "border-emerald-600", bg: "bg-emerald-900/20" },
    { id: "ELITE", name: "DOMINATION", price: "997€", feat: ["Viral Engine", "Dashboard Client"], color: "border-blue-600", bg: "bg-blue-900/20" },
    { 
      id: "GOD_MODE", 
      name: "GOD MODE (PRO)", 
      price: "2997€", 
      feat: ["AUTONOMIE TOTALE", "Closing & Encaissement Auto", "3 Posts/j/réseau", "SEO Darwinien", "Admin Marque Blanche"], 
      color: "border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]", 
      bg: "bg-gradient-to-b from-purple-900/40 to-black",
      badge: "BEST SELLER"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-purple-500">
      <nav className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <h1 className="text-2xl font-black italic tracking-tighter">AUTOPHAGE<span className="text-purple-500">.</span></h1>
        <Link href="/auth/login" className="text-xs font-bold uppercase hover:text-purple-400 transition-colors">Connexion Client</Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase">
            L'Agence <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Autonome</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            N'embauchez plus. Installez le God Mode. Votre système prospecte, poste et encaisse seul.
          </p>
        </div>

        {/* GRILLE DES ABONNEMENTS (Du - cher au + cher) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {tiers.map((tier) => (
            <div key={tier.id} className={`relative p-8 rounded-3xl border ${tier.color} ${tier.bg} flex flex-col h-full transition-transform hover:-translate-y-2 duration-300`}>
              {tier.badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{tier.badge}</div>}
              
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{tier.name}</h3>
              <div className="text-4xl font-black mb-6">{tier.price}<span className="text-sm font-normal text-slate-500">/mois</span></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {tier.feat.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                    <span className="text-purple-500">✔</span> {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSubscribe(tier.id)}
                disabled={processing === tier.id}
                className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${tier.id === 'GOD_MODE' ? 'bg-white text-black hover:bg-purple-50' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {processing === tier.id ? "Vérification..." : "Débloquer l'accès"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
