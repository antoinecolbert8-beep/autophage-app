"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  LineIconChevronLeft,
  LineIconZap,
  LineIconShield,
  LineIconBarChart,
  LineIconUsers,
  LineIconBell,
} from "@/components/AppIcons";

interface GodModeStatus {
  selfPromotion: boolean;
  linkedinBot: boolean;
  emailSequences: boolean;
  viralEngine: boolean;
  autoEngage: boolean;
  shopifyBroadcast: boolean;
  crm_sync: boolean;
}

function ToggleSwitch({
  enabled,
  onChange,
  loading,
}: {
  enabled: boolean;
  onChange: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${enabled ? "bg-[#66fcf1]" : "bg-white/10 border border-white/10"}`}
      aria-label="Toggle"
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 shadow-md ${enabled ? "left-8 bg-[#0b0c10]" : "left-1 bg-gray-400"
          }`}
      />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}

interface AutoToggleRowProps {
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  loading: boolean;
  badge?: string;
  badgeColor?: string;
  onToggle: () => void;
}

function AutoToggleRow({
  title,
  description,
  icon,
  enabled,
  loading,
  badge,
  badgeColor = "bg-[#66fcf1]/10 text-[#66fcf1] border-[#66fcf1]/20",
  onToggle,
}: AutoToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all duration-300 ${enabled ? "bg-[#66fcf1]/10" : "bg-white/5"
            }`}
        >
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-sm text-white">{title}</p>
            {badge && (
              <span
                className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full border ${badgeColor}`}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <span
          className={`text-[9px] font-mono uppercase tracking-widest hidden sm:block ${enabled ? "text-[#66fcf1]" : "text-gray-600"
            }`}
        >
          {enabled ? "ACTIF" : "INACTIF"}
        </span>
        <ToggleSwitch enabled={enabled} onChange={onToggle} loading={loading} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [godMode, setGodMode] = useState<GodModeStatus>({
    selfPromotion: false,
    linkedinBot: false,
    emailSequences: false,
    viralEngine: false,
    autoEngage: false,
    shopifyBroadcast: false,
    crm_sync: false,
  });
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [triggeringPromo, setTriggeringPromo] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/god-mode/status");
      if (res.ok) {
        const data = await res.json();
        if (data.status) setGodMode(data.status);
      }
    } catch {
      // Use defaults
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const toggle = async (key: keyof GodModeStatus) => {
    if (loadingKey) return;
    setLoadingKey(key);
    const newValue = !godMode[key];

    try {
      const res = await fetch("/api/god-mode/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: key, enabled: newValue }),
      });

      if (res.ok) {
        setGodMode((prev) => ({ ...prev, [key]: newValue }));
        toast.success(
          newValue
            ? `✅ ${key} activé avec précision chirurgicale.`
            : `⏸️ ${key} mis en pause.`,
          { duration: 3000 }
        );
      } else {
        toast.error("Erreur lors de la mise à jour.");
      }
    } catch {
      toast.error("Connexion perdue. Réessayez.");
    } finally {
      setLoadingKey(null);
    }
  };

  const triggerPromoNow = async () => {
    setTriggeringPromo(true);
    try {
      const res = await fetch("/api/cron/self-promotion", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ""}`,
        },
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        toast.success("🚀 Cycle God Mode déclenché ! Vérifiez les analytics.", {
          duration: 5000,
        });
      } else {
        toast.info("Cycle terminé. Vérifier les logs.");
      }
    } catch {
      toast.error("Impossible de déclencher le cycle.");
    } finally {
      setTriggeringPromo(false);
    }
  };

  const automationFeatures: Array<{
    key: keyof GodModeStatus;
    title: string;
    description: string;
    icon: string;
    badge?: string;
    badgeColor?: string;
  }> = [
      {
        key: "selfPromotion",
        title: "Auto-Promotion God Mode",
        description:
          "Publie du contenu viral sur LinkedIn, X, Instagram, Facebook automatiquement selon les créneaux optimaux.",
        icon: "🚀",
        badge: "CRON HORAIRE",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      },
      {
        key: "linkedinBot",
        title: "Bot LinkedIn Chirurgical",
        description:
          "Visite des profils cibles, like des posts stratégiques, répond aux commentaires avec IA via RAG.",
        icon: "💼",
        badge: "STEALTH",
        badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      },
      {
        key: "emailSequences",
        title: "Séquences Email Autonomes",
        description:
          "Onboarding, relance, et conversion automatisées par IA. Segmentation comportementale en temps réel.",
        icon: "📧",
      },
      {
        key: "viralEngine",
        title: "Viral Engine IA",
        description:
          "Analyse et optimise chaque contenu pour un score viral maximal avant publication.",
        icon: "⚡",
        badge: "NEURAL",
        badgeColor: "bg-[#66fcf1]/10 text-[#66fcf1] border-[#66fcf1]/20",
      },
      {
        key: "autoEngage",
        title: "Auto-Engagement Réseau",
        description:
          "Répond aux commentaires, like les posts pertinents et envoie des DMs stratégiques sur toutes les plateformes.",
        icon: "🎯",
      },
      {
        key: "shopifyBroadcast",
        title: "Broadcase Ventes Shopify",
        description:
          "Diffuse les nouvelles commandes Shopify en temps réel sur les réseaux pour créer une preuve sociale virale.",
        icon: "🛍️",
      },
      {
        key: "crm_sync",
        title: "Sync CRM Autonome",
        description:
          "Synchronise automatiquement les leads LinkedIn, email et Stripe vers HubSpot / Pipedrive.",
        icon: "🔄",
      },
    ];

  const activeCount = Object.values(godMode).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Paramètres & God Mode</h1>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              Centre de contrôle souverain
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${activeCount > 0
              ? "bg-[#66fcf1]/10 text-[#66fcf1] border-[#66fcf1]/20"
              : "bg-white/5 text-gray-500 border-white/5"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${activeCount > 0 ? "bg-[#66fcf1] animate-pulse" : "bg-gray-600"}`}
            />
            {activeCount} / {automationFeatures.length} actifs
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        {/* GOD MODE PANEL */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0f1a1a] to-[#0b0c10] border border-[#66fcf1]/20 overflow-hidden shadow-[0_0_60px_rgba(102,252,241,0.05)]">
          <div className="p-6 border-b border-[#66fcf1]/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black uppercase tracking-[0.15em] text-white">
                ⚡ GOD MODE — Moteur Autonome
              </h2>
              <p className="text-[11px] text-gray-500 mt-1">
                Activez chaque module d&apos;acquisition et de promotion
                automatique
              </p>
            </div>
            <button
              onClick={triggerPromoNow}
              disabled={triggeringPromo}
              className="px-4 py-2 bg-[#66fcf1] text-[#0b0c10] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {triggeringPromo ? (
                <>
                  <span className="w-3 h-3 border-2 border-[#0b0c10]/50 border-t-transparent rounded-full animate-spin" />
                  Exécution...
                </>
              ) : (
                "▶ Déclencher Maintenant"
              )}
            </button>
          </div>

          <div className="p-6">
            {loadingStatus ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-3 w-40 bg-white/5 rounded animate-pulse" />
                        <div className="h-2 w-56 bg-white/5 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="w-14 h-7 bg-white/5 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              automationFeatures.map((feature) => (
                <AutoToggleRow
                  key={feature.key}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  enabled={godMode[feature.key]}
                  loading={loadingKey === feature.key}
                  badge={feature.badge}
                  badgeColor={feature.badgeColor}
                  onToggle={() => toggle(feature.key)}
                />
              ))
            )}
          </div>

          {/* Quick link to analytics */}
          <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
            <p className="text-[10px] text-gray-500 font-mono">
              Cron Schedule : Horaire (toutes les heures, UTC)
            </p>
            <Link
              href="/analytics/self-promotion"
              className="text-[10px] text-[#66fcf1] hover:underline font-bold uppercase tracking-widest"
            >
              Voir Analytics →
            </Link>
          </div>
        </div>

        {/* PROFIL SOUVERAIN (GAMIFIÉ) */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0a0f12] to-[#0d141b] border border-white/5 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <LineIconUsers size={120} />
          </div>

          <div className="p-8 relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#66fcf1] mb-8 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]">
              <LineIconZap size={14} /> Profil Souverain
            </h2>

            <div className="flex flex-col md:flex-row gap-12">

              {/* Avatar & Level */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#66fcf1]/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#0a0a0f] to-[#121c22] border-2 border-[#66fcf1]/30 flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] text-[#66fcf1] font-bold tracking-widest uppercase mb-1">Niveau</span>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">12</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-white">Fondateur ELA</h3>
                  <p className="text-xs text-blue-400 font-mono mt-1">XP : 8,450 / 12,000</p>
                </div>
              </div>

              {/* Stats & Guild */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <LineIconBarChart size={16} />
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Score AQCI</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white">124.5</span>
                    <span className="text-xs text-green-400 mb-1 font-mono">+12.4%</span>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <LineIconUsers size={16} />
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coalition</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white block">La Cité d'Or</span>
                    <span className="text-xs text-blue-400 opacity-80 uppercase tracking-widest block mt-1">Rang: Fondateur</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="w-full bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">Lien de Parrainage Actif (Spore)</label>
                      <div className="flex items-center gap-2">
                        <code className="bg-black border border-[#66fcf1]/20 text-[#66fcf1] px-4 py-2 rounded-lg text-sm">ref.ela-revolution.com/a4f89d</code>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-[#66fcf1]/10 to-blue-500/10 hover:from-[#66fcf1]/20 hover:to-blue-500/20 text-[#66fcf1] hover:text-white border border-[#66fcf1]/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                      Partager
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SÉCURITÉ */}
        <div className="rounded-2xl bg-[#0f0f1a] border border-white/5 p-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
            <LineIconShield size={14} className="text-gray-400" />
            Sécurité & Authentification
          </h2>

          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div>
              <p className="font-bold text-sm">Double Authentification (2FA)</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Renforcez la sécurité de votre compte Sovereign.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#66fcf1]">
                ACTIF
              </span>
              <div className="w-14 h-7 bg-[#66fcf1] rounded-full p-1 cursor-pointer">
                <div className="w-5 h-5 bg-[#0b0c10] rounded-full ml-auto" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-bold text-sm">Mot de passe</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Fortress-protégé avec chiffrement AES-256.
              </p>
            </div>
            <button className="px-4 py-2 border border-white/10 rounded-xl text-sm hover:bg-white/5 transition-colors font-bold">
              Modifier
            </button>
          </div>
        </div>

        {/* LIENS RAPIDES */}
        <div className="rounded-2xl bg-[#0f0f1a] border border-white/5 p-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
            Navigation rapide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                href: "/dashboard/integrations",
                label: "Intégrations",
                icon: "🔌",
              },
              {
                href: "/dashboard/billing",
                label: "Facturation & Crédits",
                icon: "💳",
              },
              {
                href: "/analytics/self-promotion",
                label: "Analytics Auto-Promo",
                icon: "📊",
              },
              { href: "/dashboard/agent", label: "Agent IA", icon: "🤖" },
              {
                href: "/dashboard/campaigns",
                label: "Campagnes",
                icon: "🎯",
              },
              { href: "/dashboard/leads", label: "Prospects", icon: "👥" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
