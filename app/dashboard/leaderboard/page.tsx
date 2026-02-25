'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Users, Crown, Zap, TrendingUp, Copy, Check, Share2, Gift } from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Publisher {
    rank: number;
    userId: string;
    name: string;
    avatar: string | null;
    postCount: number;
}

interface Referrer {
    rank: number;
    userId: string;
    name: string;
    avatar: string | null;
    activeReferrals: number;
    tier: number;
}

interface ReferralInfo {
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    activeReferrals: number;
    pendingReferrals: number;
    currentTier: number;
    nextTier: { activeNeeded: number; reward: string; tier: number } | null;
    referrals: { id: string; status: string; name: string; avatar: string | null; joinedAt: string }[];
}

const TIER_REWARDS: Record<number, { label: string; color: string; icon: any }> = {
    0: { label: 'Débutant', color: 'text-gray-400', icon: Users },
    1: { label: 'Pro 7j', color: 'text-blue-400', icon: Zap },
    3: { label: '100 Crédits', color: 'text-emerald-400', icon: Gift },
    5: { label: 'Pro Permanent', color: 'text-violet-400', icon: Star },
    10: { label: 'Empire Builder', color: 'text-amber-400', icon: Crown },
    25: { label: 'God Mode', color: 'text-rose-400', icon: Trophy },
};

function TierBadge({ tier }: { tier: number }) {
    const info = TIER_REWARDS[tier] || TIER_REWARDS[0];
    const Icon = info.icon;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${info.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {info.label}
        </span>
    );
}

function Avatar({ name, avatar, size = 8 }: { name: string; avatar: string | null; size?: number }) {
    if (avatar) {
        return <img src={avatar} alt={name} className={`w-${size} h-${size} rounded-full object-cover`} />;
    }
    return (
        <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

function RankIcon({ rank }: { rank: number }) {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-700" />;
    return <span className="text-gray-500 font-mono text-sm w-5 text-center">#{rank}</span>;
}

// ─── Page Principale ──────────────────────────────────────────────────────────

export default function LeaderboardPage() {
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [referrers, setReferrers] = useState<Referrer[]>([]);
    const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [period, setPeriod] = useState('current');

    useEffect(() => {
        fetchAll();
    }, [period]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [lbRes, refRes] = await Promise.all([
                fetch(`/api/leaderboard?period=${period}`),
                fetch('/api/referral'),
            ]);
            if (lbRes.ok) {
                const lb = await lbRes.json();
                setPublishers(lb.topPublishers || []);
                setReferrers(lb.topReferrers || []);
            }
            if (refRes.ok) {
                setReferralInfo(await refRes.json());
            }
        } catch {
            toast.error('Erreur de chargement du leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        if (!referralInfo) return;
        navigator.clipboard.writeText(referralInfo.referralLink);
        setCopied(true);
        toast.success('Lien copié !');
        setTimeout(() => setCopied(false), 2000);
    };

    const progress = referralInfo && referralInfo.nextTier
        ? Math.min(
            (referralInfo.activeReferrals / (referralInfo.activeReferrals + referralInfo.nextTier.activeNeeded)) * 100,
            100
        )
        : 100;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                        <Trophy className="w-4 h-4" />
                        Leaderboard ELA
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
                        Empire Classement
                    </h1>
                    <p className="text-gray-400 text-lg">Les bâtisseurs qui dominent cette semaine</p>
                </motion.div>

                {/* Referral Card */}
                {referralInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/40 to-pink-900/20 border border-violet-500/30 p-6"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                {/* Code + Link */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Share2 className="w-4 h-4 text-violet-400" />
                                        <span className="text-sm text-gray-400 font-medium">Ton lien de parrainage</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-violet-300 font-mono text-sm bg-violet-900/40 rounded-lg px-3 py-2 flex-1 truncate">
                                            {referralInfo.referralLink}
                                        </code>
                                        <button
                                            onClick={copyLink}
                                            className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors"
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-violet-300">{referralInfo.activeReferrals}</div>
                                        <div className="text-xs text-gray-500">Actifs</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-400">{referralInfo.pendingReferrals}</div>
                                        <div className="text-xs text-gray-500">En attente</div>
                                    </div>
                                    <div className="text-center">
                                        <TierBadge tier={referralInfo.currentTier} />
                                        <div className="text-xs text-gray-500 mt-1">Tier actuel</div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress vers prochain tier */}
                            {referralInfo.nextTier && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                        <span>Prochain palier : <strong className="text-white">{referralInfo.nextTier.reward}</strong></span>
                                        <span>{referralInfo.nextTier.activeNeeded} filleuls restants</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Tables */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Top Publishers */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl bg-gray-950/60 border border-gray-800/60 overflow-hidden"
                    >
                        <div className="px-5 py-4 border-b border-gray-800/60 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <h2 className="font-bold text-base">Top Publishers</h2>
                            <span className="ml-auto text-xs text-gray-500">Cette semaine</span>
                        </div>
                        <div className="divide-y divide-gray-800/40">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="px-5 py-3 flex items-center gap-3 animate-pulse">
                                        <div className="w-5 h-4 bg-gray-800 rounded" />
                                        <div className="w-8 h-8 bg-gray-800 rounded-full" />
                                        <div className="flex-1 h-4 bg-gray-800 rounded" />
                                    </div>
                                ))
                            ) : publishers.length === 0 ? (
                                <div className="px-5 py-8 text-center text-gray-500 text-sm">
                                    Aucune publication cette semaine encore.
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {publishers.map((p, idx) => (
                                        <motion.div
                                            key={p.userId}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="px-5 py-3 flex items-center gap-3 hover:bg-gray-900/40 transition-colors"
                                        >
                                            <RankIcon rank={p.rank} />
                                            <Avatar name={p.name} avatar={p.avatar} size={8} />
                                            <span className="flex-1 font-medium text-sm truncate">{p.name}</span>
                                            <span className="text-emerald-400 font-bold text-sm">{p.postCount} posts</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>

                    {/* Top Referrers */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl bg-gray-950/60 border border-gray-800/60 overflow-hidden"
                    >
                        <div className="px-5 py-4 border-b border-gray-800/60 flex items-center gap-2">
                            <Users className="w-5 h-5 text-violet-400" />
                            <h2 className="font-bold text-base">Top Parrainage</h2>
                            <span className="ml-auto text-xs text-gray-500">Filleuls actifs</span>
                        </div>
                        <div className="divide-y divide-gray-800/40">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="px-5 py-3 flex items-center gap-3 animate-pulse">
                                        <div className="w-5 h-4 bg-gray-800 rounded" />
                                        <div className="w-8 h-8 bg-gray-800 rounded-full" />
                                        <div className="flex-1 h-4 bg-gray-800 rounded" />
                                    </div>
                                ))
                            ) : referrers.length === 0 ? (
                                <div className="px-5 py-8 text-center text-gray-500 text-sm">
                                    Sois le premier à parrainer.
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {referrers.map((r, idx) => (
                                        <motion.div
                                            key={r.userId}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="px-5 py-3 flex items-center gap-3 hover:bg-gray-900/40 transition-colors"
                                        >
                                            <RankIcon rank={r.rank} />
                                            <Avatar name={r.name} avatar={r.avatar} size={8} />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm truncate">{r.name}</div>
                                                <TierBadge tier={r.tier} />
                                            </div>
                                            <span className="text-violet-400 font-bold text-sm">{r.activeReferrals} actifs</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Paliers informatifs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-gray-950/60 border border-gray-800/60 p-6"
                >
                    <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-pink-400" />
                        Paliers de récompense
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                            { active: 1, reward: 'Pro 7 jours', tier: 1 },
                            { active: 3, reward: '100 Crédits', tier: 3 },
                            { active: 5, reward: 'Pro Permanent', tier: 5 },
                            { active: 10, reward: 'Empire Builder', tier: 10 },
                            { active: 25, reward: 'God Mode 30j', tier: 25 },
                        ].map((t) => {
                            const current = referralInfo?.activeReferrals || 0;
                            const reached = current >= t.active;
                            return (
                                <div
                                    key={t.active}
                                    className={`rounded-xl border p-3 text-center transition-all ${reached
                                            ? 'border-violet-500/50 bg-violet-900/20'
                                            : 'border-gray-800/60 opacity-60'
                                        }`}
                                >
                                    <div className="text-2xl font-extrabold text-white mb-0.5">{t.active}</div>
                                    <div className="text-xs text-gray-400 mb-1">filleuls actifs</div>
                                    <TierBadge tier={t.tier} />
                                    <div className="text-xs text-gray-300 mt-1">{t.reward}</div>
                                    {reached && (
                                        <div className="mt-1.5 text-xs text-emerald-400 font-semibold">✓ Débloqué</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
