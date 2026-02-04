'use client';

import { useEffect, useState } from 'react';

interface Post {
    id: string;
    platform: string;
    content: string;
    mediaUrl: string | null;
    status: string;
    performance_score: number;
    publishedAt: string | null;
    createdAt: string;
    user: { name: string; email: string };
    metrics: {
        views: number;
        likes: number;
        comments: number;
        shares: number;
        saves: number;
        clicks: number;
    } | null;
}

interface Analytics {
    posts: Post[];
    summary: {
        totalPosts: number;
        published: number;
        failed: number;
        avgScore: number;
        totalEngagement: number;
        totalViews: number;
    };
    platformBreakdown: Record<string, { count: number; avgScore: number }>;
    recommendations: string[];
}

export default function SelfPromotionAnalytics() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics/self-promotion');
            const data = await res.json();
            if (data.success) {
                setAnalytics(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
                <div className="text-white text-xl">Chargement des analytics...</div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
                <div className="text-red-400 text-xl">Erreur de chargement</div>
            </div>
        );
    }

    const filteredPosts = filter === 'all'
        ? analytics.posts
        : analytics.posts.filter(p => p.platform === filter);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-blue-400';
        if (score >= 40) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
        if (score >= 60) return 'bg-blue-500/20 border-blue-500/30';
        if (score >= 40) return 'bg-yellow-500/20 border-yellow-500/30';
        return 'bg-red-500/20 border-red-500/30';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        🚀 Analytics Auto-Promotion
                    </h1>
                    <p className="text-slate-400">
                        Surveillance autonome des publications et performance IA
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                        <div className="text-slate-400 text-sm mb-1">Total Posts</div>
                        <div className="text-3xl font-bold text-white">{analytics.summary.totalPosts}</div>
                        <div className="text-emerald-400 text-xs mt-2">✅ {analytics.summary.published} publiés</div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                        <div className="text-slate-400 text-sm mb-1">Score Moyen</div>
                        <div className={`text-3xl font-bold ${getScoreColor(analytics.summary.avgScore)}`}>
                            {analytics.summary.avgScore}/100
                        </div>
                        <div className="text-slate-500 text-xs mt-2">Performance globale</div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                        <div className="text-slate-400 text-sm mb-1">Engagement Total</div>
                        <div className="text-3xl font-bold text-purple-400">
                            {analytics.summary.totalEngagement.toLocaleString()}
                        </div>
                        <div className="text-slate-500 text-xs mt-2">Likes + Comments + Shares</div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                        <div className="text-slate-400 text-sm mb-1">Vues Totales</div>
                        <div className="text-3xl font-bold text-blue-400">
                            {analytics.summary.totalViews.toLocaleString()}
                        </div>
                        <div className="text-slate-500 text-xs mt-2">Impressions cumulées</div>
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur border border-purple-500/30 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span>🧠</span> Insights IA
                    </h2>
                    <div className="space-y-2">
                        {analytics.recommendations.map((rec, idx) => (
                            <div key={idx} className="text-slate-300 flex items-start gap-2">
                                <span className="text-purple-400">→</span>
                                <span>{rec}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Breakdown */}
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">📊 Performance par Plateforme</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Object.entries(analytics.platformBreakdown).map(([platform, data]) => (
                            <div
                                key={platform}
                                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${filter === platform
                                        ? 'bg-purple-500/20 border-purple-500'
                                        : 'bg-slate-800/50 border-slate-700'
                                    }`}
                                onClick={() => setFilter(filter === platform ? 'all' : platform)}
                            >
                                <div className="text-slate-400 text-xs mb-1">{platform}</div>
                                <div className="text-white font-bold text-lg">{data.count}</div>
                                <div className={`text-sm ${getScoreColor(data.avgScore)}`}>
                                    {data.avgScore.toFixed(1)}/100
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">📝 Publications Récentes</h2>
                        {filter !== 'all' && (
                            <button
                                onClick={() => setFilter('all')}
                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
                            >
                                Afficher tout
                            </button>
                        )}
                    </div>

                    {filteredPosts.map(post => (
                        <div
                            key={post.id}
                            className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-slate-800 text-white text-sm rounded-full">
                                            {post.platform}
                                        </span>
                                        <span className={`px-3 py-1 border rounded-full text-sm ${getScoreBg(post.performance_score)} ${getScoreColor(post.performance_score)}`}>
                                            Score: {post.performance_score.toFixed(1)}
                                        </span>
                                        <span className="text-slate-500 text-sm">
                                            {post.publishedAt
                                                ? new Date(post.publishedAt).toLocaleString('fr-FR')
                                                : 'Non publié'
                                            }
                                        </span>
                                    </div>

                                    <div className="text-slate-300 mb-4 whitespace-pre-wrap">
                                        {post.content ? post.content.substring(0, 300) + (post.content.length > 300 ? '...' : '') : 'Pas de contenu'}
                                    </div>

                                    {post.metrics && (
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="text-slate-400">👁️</span>
                                                <span className="text-white">{post.metrics.views.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-red-400">❤️</span>
                                                <span className="text-white">{post.metrics.likes.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-blue-400">💬</span>
                                                <span className="text-white">{post.metrics.comments.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-green-400">🔁</span>
                                                <span className="text-white">{post.metrics.shares.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {post.mediaUrl && (
                                    <img
                                        src={post.mediaUrl}
                                        alt="Post media"
                                        className="w-32 h-32 object-cover rounded-lg border border-slate-700"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
