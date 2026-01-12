"use client";

/**
 * 💬 WHATSAPP COMMAND CENTER
 * Mobile Command Post - Pilotage total par WhatsApp
 */

import { useState } from "react";

const COMMAND_EXAMPLES = [
  {
    category: "📊 Prospection",
    commands: [
      { voice: "Agent Opportuniste, génère un rapport vidéo des leads de la nuit", result: "Vidéo 30s envoyée" },
      { voice: "Lance une campagne LinkedIn sur la niche E-commerce", result: "Campagne lancée" },
    ],
  },
  {
    category: "💰 Finance",
    commands: [
      { voice: "Status global", result: "CA du jour : 1247€, Appels : 34" },
      { voice: "Quel est mon bénéfice net cette semaine ?", result: "Bénéfice : 4532€" },
    ],
  },
  {
    category: "📈 Contenu",
    commands: [
      { voice: "Crée une vidéo sur l'automatisation SaaS", result: "Vidéo générée en 2min" },
      { voice: "Poste sur Instagram et TikTok maintenant", result: "2 posts publiés" },
    ],
  },
  {
    category: "🚨 Urgence",
    commands: [
      { voice: "Stop tout", result: "Tous les bots en pause" },
      { voice: "Redémarre le bot LinkedIn", result: "Bot redémarré" },
    ],
  },
];

export default function WhatsAppCommand() {
  const [connected, setConnected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(COMMAND_EXAMPLES[0]);

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-bold mb-2 neon-text">💬 WhatsApp Command</h1>
        <p className="text-slate-400 text-lg">
          Mobile Command Post - Pilotez votre empire depuis votre poche
        </p>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gauche - QR Code d'Appairage */}
          <div>
            <div className="glass-intense p-12 text-center">
              <h3 className="text-2xl font-bold mb-8">
                {connected ? "✅ Système Connecté" : "📱 Appairage"}
              </h3>

              {!connected ? (
                <>
                  {/* QR Code simulation */}
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="radar-scan">
                      <div className="w-full h-full bg-white rounded-3xl p-4 flex items-center justify-center">
                        <div className="text-black text-8xl">⬛</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 mb-6">
                    Scannez ce QR Code avec WhatsApp pour lier votre compte
                  </p>

                  <button
                    onClick={() => setConnected(true)}
                    className="btn-primary"
                  >
                    🔗 Simuler la connexion
                  </button>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-6 animate-pulse">✅</div>
                  <p className="text-2xl font-bold text-emerald-400 mb-4">
                    Connexion Établie
                  </p>
                  <p className="text-slate-400 mb-6">
                    L'IA attend vos ordres sur WhatsApp
                  </p>

                  {/* Statut connexion */}
                  <div className="frosted p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-400">Latence</span>
                      <span className="text-lg font-bold text-emerald-400">42ms</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate-400">Dernière commande</span>
                      <span className="text-lg font-bold">Il y a 5min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Messages aujourd'hui</span>
                      <span className="text-lg font-bold neon-text">47</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setConnected(false)}
                    className="mt-6 w-full py-3 bg-red-900/50 hover:bg-red-800 border border-red-500 rounded-xl font-bold transition"
                  >
                    🔓 Déconnecter
                  </button>
                </>
              )}
            </div>

            {/* Simulation téléphone */}
            <div className="mt-8 mx-auto max-w-sm">
              <div className="glass-intense rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl">
                {/* Notch */}
                <div className="h-8 bg-black flex items-center justify-center">
                  <div className="w-32 h-6 bg-slate-900 rounded-full"></div>
                </div>

                {/* Screen */}
                <div className="bg-gradient-to-b from-[#0a3d3d] to-[#000000] p-4 h-[500px] relative">
                  {/* WhatsApp Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-emerald-800">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      🤖
                    </div>
                    <div>
                      <p className="font-bold text-white">Autophage AI</p>
                      <p className="text-xs text-emerald-400">En ligne</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-xs text-white">
                        🤖 Bonjour Chef ! J'ai détecté 12 nouveaux leads qualifiés cette nuit.
                        Voulez-vous que je lance les appels ?
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">08:32</p>
                    </div>

                    <div className="bg-emerald-700 p-3 rounded-2xl rounded-tr-none max-w-[80%] ml-auto">
                      <p className="text-xs text-white">Oui, lance 🚀</p>
                      <p className="text-[10px] text-emerald-200 mt-1">08:35</p>
                    </div>

                    <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-xs text-white">
                        ✅ Compris. 12 appels programmés. Estimation : 4 RDV fixés d'ici ce soir.
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">08:36</p>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Commande vocale ou texte..."
                      className="flex-1 px-4 py-2 bg-slate-800 rounded-full text-white text-sm"
                    />
                    <button className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      🎤
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Droite - Bibliothèque de Commandes */}
          <div>
            <div className="glass-intense p-8">
              <h3 className="text-2xl font-bold mb-6">📚 Grimoire de l'Empereur</h3>

              {/* Categories */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {COMMAND_EXAMPLES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedCategory.category === cat.category
                        ? "glass-intense border-2 border-indigo-500"
                        : "frosted hover:glass"
                    }`}
                  >
                    <p className="font-bold text-sm">{cat.category}</p>
                  </button>
                ))}
              </div>

              {/* Commandes */}
              <div className="space-y-4">
                {selectedCategory.commands.map((cmd, i) => (
                  <div key={i} className="frosted p-6 rounded-2xl">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">🎤</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-300 mb-1">
                          "{cmd.voice}"
                        </p>
                        <p className="text-xs text-slate-500">Commande vocale</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pl-11">
                      <span className="text-xl">💬</span>
                      <p className="text-sm text-emerald-400">
                        → {cmd.result}
                      </p>
                    </div>

                    <button className="w-full mt-4 py-2 bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-500/30 rounded-lg text-xs font-bold transition">
                      📋 Copier la commande
                    </button>
                  </div>
                ))}
              </div>

              {/* Prompt Builder */}
              <div className="mt-8 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/50 p-6 rounded-2xl">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <span>🛠️</span>
                  Constructeur de Commandes
                </h4>
                
                <div className="space-y-3">
                  <select className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm">
                    <option>Dis à l'IA de...</option>
                    <option>Lance</option>
                    <option>Génère</option>
                    <option>Analyse</option>
                    <option>Envoie</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Action précise..."
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                  />

                  <button className="w-full btn-primary">
                    ✨ Générer la commande
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





