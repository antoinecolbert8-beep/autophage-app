"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    Linkedin, Twitter, Facebook, Instagram, ShoppingBag, MessageCircle, Video,
    ChevronLeft, Check, X, Plus, Eye, EyeOff, Loader2, Zap, Shield, RefreshCw,
    Youtube, Mail, Target, Share2, Ghost, PenLine, Hash, Code
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Integration {
    id: string;
    provider: string;
    status: string;
    hasCredentials: boolean;
    lastSync: string | null;
}

interface PlatformConfig {
    key: string;
    label: string;
    icon: React.ElementType;
    color: string;
    gradient: string;
    description: string;
    fields: { key: string; label: string; placeholder: string; type?: string }[];
}

// ─── Platform Definitions ────────────────────────────────────────────────────

const PLATFORMS: PlatformConfig[] = [
    {
        key: "LINKEDIN",
        label: "LinkedIn",
        icon: Linkedin,
        color: "text-blue-400",
        gradient: "from-blue-600 to-blue-900",
        description: "Publiez des articles et posts professionnels directement sur votre profil et votre page entreprise.",
        fields: [
            { key: "accessToken", label: "Access Token", placeholder: "AQV..." },
            { key: "personUrn", label: "Person URN", placeholder: "urn:li:person:XXXXXX" },
            { key: "organizationUrn", label: "Organization URN (optionnel)", placeholder: "urn:li:organization:XXXXXX" },
        ]
    },
    {
        key: "X_PLATFORM",
        label: "X / Twitter",
        icon: Twitter,
        color: "text-sky-400",
        gradient: "from-sky-500 to-slate-800",
        description: "Postez des tweets, threads et répondez aux tendances en temps réel.",
        fields: [
            { key: "apiKey", label: "API Key", placeholder: "xxxxxxxxx" },
            { key: "apiSecret", label: "API Secret", placeholder: "xxxxxxxxx", type: "password" },
            { key: "accessToken", label: "Access Token", placeholder: "000000000-xxxxxxxxx" },
            { key: "accessTokenSecret", label: "Access Token Secret", placeholder: "xxxxxxxxx", type: "password" },
        ]
    },
    {
        key: "FACEBOOK",
        label: "Facebook",
        icon: Facebook,
        color: "text-indigo-400",
        gradient: "from-indigo-600 to-blue-900",
        description: "Publiez sur votre Page Facebook, gérez les publicités et accédez aux analytics.",
        fields: [
            { key: "pageAccessToken", label: "Page Access Token", placeholder: "EAAh...", type: "password" },
            { key: "pageId", label: "Page ID", placeholder: "123456789" },
        ]
    },
    {
        key: "INSTAGRAM",
        label: "Instagram",
        icon: Instagram,
        color: "text-pink-400",
        gradient: "from-pink-600 to-purple-800",
        description: "Publiez des photos, Reels et Stories sur votre compte Instagram Business.",
        fields: [
            { key: "accessToken", label: "Access Token", placeholder: "EAAh...", type: "password" },
            { key: "accountId", label: "Instagram Account ID", placeholder: "17841XXXXXXXXXX" },
        ]
    },
    {
        key: "SHOPIFY",
        label: "Shopify",
        icon: ShoppingBag,
        color: "text-green-400",
        gradient: "from-green-600 to-emerald-900",
        description: "Synchronisez vos produits et diffusez automatiquement des alertes de ventes.",
        fields: [
            { key: "shopDomain", label: "Domaine Boutique", placeholder: "votre-boutique.myshopify.com" },
            { key: "accessToken", label: "Admin API Token", placeholder: "shpat_...", type: "password" },
        ]
    },
    {
        key: "WHATSAPP",
        label: "WhatsApp / Twilio",
        icon: MessageCircle,
        color: "text-emerald-400",
        gradient: "from-emerald-500 to-teal-900",
        description: "Recevez des alertes en temps réel et interagissez avec vos leads via WhatsApp.",
        fields: [
            { key: "accountSid", label: "Twilio Account SID", placeholder: "ACxxxxxxxxxxxx" },
            { key: "authToken", label: "Auth Token", placeholder: "xxxxxxxxx", type: "password" },
            { key: "fromNumber", label: "Numéro Twilio WhatsApp", placeholder: "whatsapp:+14155238886" },
            { key: "adminPhone", label: "Votre numéro admin", placeholder: "+33XXXXXXXXX" },
        ]
    },
    {
        key: "TIKTOK",
        label: "TikTok",
        icon: Video,
        color: "text-red-400",
        gradient: "from-red-500 to-pink-900",
        description: "Publiez des vidéos et exploitez les tendances virales pour une portée maximale.",
        fields: [
            { key: "accessToken", label: "Access Token", placeholder: "act.xxxx...", type: "password" },
            { key: "openId", label: "Open ID", placeholder: "xxxxxxxxx" },
        ]
    },
    {
        key: "YOUTUBE_SEO",
        label: "YouTube / Shorts",
        icon: Youtube,
        color: "text-rose-500",
        gradient: "from-rose-600 to-red-900",
        description: "Pilotez le SEO vidéo via l'Agent VISION. Publiez des Shorts et vidéos longues automatiquement.",
        fields: [
            { key: "apiKey", label: "YouTube API Key", placeholder: "AIza..." },
            { key: "channelId", label: "Channel ID", placeholder: "UC..." },
            { key: "oauthToken", label: "OAuth Access Token", placeholder: "ya29...", type: "password" },
        ]
    },
    {
        key: "EMAIL_NEWSLETTER",
        label: "Email / Substack",
        icon: Mail,
        color: "text-amber-400",
        gradient: "from-amber-500 to-orange-900",
        description: "Agent CORE : Gérez votre liste de contacts souveraine et automatisez vos Newsletters.",
        fields: [
            { key: "apiKey", label: "SMTP / API Key", placeholder: "sk_...", type: "password" },
            { key: "fromEmail", label: "Email d'expédition", placeholder: "contact@votre-domaine.com" },
            { key: "provider", label: "Service (Resend / Sendgrid / Mailgun)", placeholder: "resend" },
        ]
    },
    {
        key: "ADS_SCALE",
        label: "Meta & Google Ads",
        icon: Target,
        color: "text-cyan-400",
        gradient: "from-cyan-500 to-blue-900",
        description: "Agent PULSE : Transformez vos succès organiques en publicités haute performance.",
        fields: [
            { key: "metaAdsId", label: "Meta Ad Account ID", placeholder: "act_..." },
            { key: "googleAdsId", label: "Google Ads ID", placeholder: "123-456-7890" },
            { key: "dailyBudget", label: "Budget Journalier Max (€)", placeholder: "50" },
        ]
    },
    {
        key: "AFFILIATE_LEVERAGE",
        label: "ECHO / Affiliation",
        icon: Share2,
        color: "text-violet-400",
        gradient: "from-violet-500 to-indigo-900",
        description: "Multipliez votre portée en transformant vos clients en ambassadeurs rémunérés.",
        fields: [
            { key: "portalDomain", label: "Domaine Portail Affiliés", placeholder: "partners.votre-domaine.com" },
            { key: "commissionRate", label: "Commission (%)", placeholder: "30" },
            { key: "stripeConnectId", label: "Stripe Connect ID (Optionnel)", placeholder: "acct_..." },
        ]
    },
    {
        key: "SNAPCHAT",
        label: "Snapchat",
        icon: Ghost,
        color: "text-yellow-400",
        gradient: "from-yellow-400 to-yellow-600",
        description: "Touchez une audience jeune avec des Stories éphémères et du contenu viral.",
        fields: [
            { key: "accessToken", label: "Access Token", placeholder: "snap_...", type: "password" },
        ]
    },
    {
        key: "REDDIT",
        label: "Reddit",
        icon: Share2,
        color: "text-orange-500",
        gradient: "from-orange-500 to-red-700",
        description: "Engagez les communautés de niche dans les Subreddits pertinents.",
        fields: [
            { key: "clientId", label: "Client ID", placeholder: "xxxxxxxxx" },
            { key: "clientSecret", label: "Client Secret", placeholder: "xxxxxxxxx", type: "password" },
            { key: "username", label: "Username", placeholder: "u/votre-nom" },
            { key: "password", label: "Password", placeholder: "xxxxxxxxx", type: "password" },
        ]
    },
    {
        key: "MEDIUM",
        label: "Medium",
        icon: PenLine,
        color: "text-white",
        gradient: "from-gray-700 to-black",
        description: "Publiez des articles de fond pour asseoir votre autorité intellectuelle.",
        fields: [
            { key: "integrationToken", label: "Integration Token", placeholder: "xxxxxxxxx", type: "password" },
        ]
    },
    {
        key: "HACKERNEWS",
        label: "Hacker News",
        icon: Hash,
        color: "text-orange-600",
        gradient: "from-orange-400 to-orange-700",
        description: "Soumettez vos contenus aux bâtisseurs et ingénieurs du monde entier.",
        fields: [
            { key: "topic", label: "Default Topic", placeholder: "Show HN" },
        ]
    },
    {
        key: "DEVTO",
        label: "Dev.to",
        icon: Code,
        color: "text-gray-100",
        gradient: "from-blue-900 to-slate-900",
        description: "Connectez-vous à la plus grande communauté de développeurs au monde.",
        fields: [
            { key: "apiKey", label: "API Key", placeholder: "xxxxxxxxx", type: "password" },
        ]
    },
];

// ─── Integration Card ────────────────────────────────────────────────────────

function IntegrationCard({
    platform,
    integration,
    onSave,
    onDisconnect,
}: {
    platform: PlatformConfig;
    integration: Integration | null;
    onSave: (provider: string, credentials: Record<string, string>) => Promise<void>;
    onDisconnect: (provider: string) => Promise<void>;
}) {
    const [expanded, setExpanded] = useState(false);
    const [values, setValues] = useState<Record<string, string>>({});
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);

    const Icon = platform.icon;
    const isConnected = integration?.hasCredentials && integration?.status === "active";

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(platform.key, values);
            setExpanded(false);
        } finally {
            setSaving(false);
        }
    };

    const handleDisconnect = async () => {
        setDisconnecting(true);
        try {
            await onDisconnect(platform.key);
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <div className={`card-saphir overflow-hidden group ${isConnected ? "border-[#66fcf1]/20 shadow-[0_0_20px_rgba(102,252,241,0.05)]" : "border-white/5"
            }`}>
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            {platform.label}
                            {isConnected && (
                                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    ✓ Actif
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-xs">{platform.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isConnected && (
                        <button
                            onClick={handleDisconnect}
                            disabled={disconnecting}
                            className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg border border-red-900/20 text-red-500/70 hover:bg-red-500/5 transition-all btn-haptic"
                        >
                            {disconnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Déconnecter"}
                        </button>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl font-bold transition-all btn-haptic ${isConnected
                            ? "bg-white/5 text-gray-500 hover:bg-white/10"
                            : `bg-gradient-to-r ${platform.gradient} text-white hover:opacity-90 shadow-lg shadow-black/20`
                            }`}
                    >
                        {isConnected ? "Reconfigurer" : "Connecter"}
                    </button>
                </div>
            </div>

            {/* Expanded Form */}
            {expanded && (
                <div className="border-t border-white/5 p-6 space-y-4 bg-black/20">
                    {platform.fields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                                {field.label}
                            </label>
                            <div className="relative">
                                <input
                                    type={field.type === "password" && !showPasswords[field.key] ? "password" : "text"}
                                    placeholder={field.placeholder}
                                    value={values[field.key] || ""}
                                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all font-mono pr-10"
                                />
                                {field.type === "password" && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords((p) => ({ ...p, [field.key]: !p[field.key] }))}
                                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                                    >
                                        {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            {saving ? "Activation..." : "Activer l'intégration"}
                        </button>
                        <button
                            onClick={() => setExpanded(false)}
                            className="px-4 py-3 bg-white/5 rounded-xl text-gray-400 hover:bg-white/10 transition-all text-sm"
                        >
                            Annuler
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-600 flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-blue-500" />
                        Vos credentials sont chiffrés AES-256 et vous appartiennent exclusivement.
                    </p>
                </div>
            )}

            {/* Last Sync Info */}
            {isConnected && integration.lastSync && (
                <div className="px-6 pb-4 flex items-center gap-1.5 text-[10px] text-gray-600">
                    <RefreshCw className="w-3 h-3" />
                    Dernière sync : {new Date(integration.lastSync).toLocaleString("fr-FR")}
                </div>
            )}
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const fetchIntegrations = async () => {
        try {
            const res = await fetch("/api/integrations");
            if (res.ok) {
                const data = await res.json();
                setIntegrations(data.integrations || []);
            }
        } catch (err) {
            toast.error("Erreur de chargement des intégrations");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (provider: string, credentials: Record<string, string>) => {
        const res = await fetch("/api/integrations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider, credentials }),
        });

        if (res.ok) {
            toast.success(`✅ ${provider} activé — ELA publie désormais en autonomie complète !`);
            await fetchIntegrations();
        } else {
            const data = await res.json();
            toast.error(data.error || "Échec de l'activation");
        }
    };

    const handleDisconnect = async (provider: string) => {
        const res = await fetch(`/api/integrations?provider=${provider}`, { method: "DELETE" });
        if (res.ok) {
            toast.success(`${provider} déconnecté`);
            await fetchIntegrations();
        } else {
            toast.error("Échec de la déconnexion");
        }
    };

    const getIntegrationByProvider = (key: string) =>
        integrations.find((i) => i.provider === key) || null;

    const connectedCount = integrations.filter((i) => i.hasCredentials && i.status === "active").length;

    return (
        <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7]">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0b0c10]/80 backdrop-blur-xl z-30">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Zap className="text-blue-400 w-5 h-5" />
                            Centre d'Intégrations
                        </h1>
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                            Connectez vos comptes — ELA publie en autonomie totale
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 text-xs px-4 py-2 rounded-full border ${connectedCount > 0
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 bg-white/5 text-gray-500"
                        }`}>
                        {connectedCount > 0 ? (
                            <><Check className="w-3 h-3" /> {connectedCount} réseau{connectedCount > 1 ? "x" : ""} actif{connectedCount > 1 ? "s" : ""}</>
                        ) : (
                            <><X className="w-3 h-3" /> Aucune connexion active</>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-8">
                {/* Hero Banner — High Precision Style */}
                <div className="mb-10 card-saphir border-[#66fcf1]/10 p-10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-4 tracking-tighter stat-value text-white">
                            🌐 INFRASTRUCTURE DIGITALE <span className="text-[#66fcf1]">CONNECTÉE</span>
                        </h2>
                        <p className="text-gray-500 max-w-xl leading-relaxed text-sm font-light">
                            Entrez vos clés API une seule fois. ELA active son <span className="text-[#66fcf1] font-bold">Système Souverain</span> :
                            publication autonome 24/7, diffusion multi-canal et synchronisation atomique.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={120} className="text-[#66fcf1]" />
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {PLATFORMS.map((platform) => (
                            <IntegrationCard
                                key={platform.key}
                                platform={platform}
                                integration={getIntegrationByProvider(platform.key)}
                                onSave={handleSave}
                                onDisconnect={handleDisconnect}
                            />
                        ))}
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-10 p-6 bg-[#13131f] border border-white/5 rounded-2xl">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-amber-400">
                        <Shield className="w-4 h-4" />
                        Comment obtenir vos clés API ?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                            <p className="font-bold text-white mb-1">LinkedIn</p>
                            <p>Créez une app sur <a href="https://www.linkedin.com/developers" target="_blank" className="text-blue-400 underline">linkedin.com/developers</a>, activez OAuth 2.0 et obtenez votre Access Token via le flow d'autorisation.</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">X / Twitter</p>
                            <p>Rendez-vous sur <a href="https://developer.twitter.com" target="_blank" className="text-sky-400 underline">developer.twitter.com</a>, créez un projet et activez "Read and Write" pour votre app.</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">Facebook / Instagram</p>
                            <p>Depuis <a href="https://developers.facebook.com" target="_blank" className="text-indigo-400 underline">developers.facebook.com</a>, créez une Page App et générez un Page Access Token long-durée.</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">Shopify</p>
                            <p>Dans votre admin Shopify : <strong>Apps &gt; Develop Apps</strong> — créez une app privée avec les scopes "read_products, read_orders".</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">WhatsApp (Twilio)</p>
                            <p>Inscrivez-vous sur <a href="https://www.twilio.com" target="_blank" className="text-emerald-400 underline">twilio.com</a>, activez le "WhatsApp Sandbox" ou achetez un numéro WhatsApp Business.</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">YouTube</p>
                            <p>Activez "YouTube Data API v3" dans la <a href="https://console.cloud.google.com" target="_blank" className="text-rose-400 underline">Google Cloud Console</a>.</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">Email / Ads</p>
                            <p>Utilisez des services comme Resend ou Sendgrid pour l'email, et configurez vos comptes business sur Meta/Google.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
