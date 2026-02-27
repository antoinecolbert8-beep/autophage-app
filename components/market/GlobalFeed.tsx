"use client";

import React, { useState, useEffect } from 'react';
import { Search, Globe, ChevronRight } from 'lucide-react';
import { TrustBadge } from '@/components/ui/TrustBadge';

interface Listing {
    id: string;
    title: string;
    description: string;
    category: string;
    priceCent: number;
    user: { name: string; avatar: string | null };
}

export const GlobalFeed = () => {
    const [intent, setIntent] = useState('');
    const [language, setLanguage] = useState('fr');
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDiscovery();
    }, [language]); // Re-fetch on language change

    const fetchDiscovery = async (searchIntent?: string) => {
        setLoading(true);
        const searchParams = new URLSearchParams({ lang: language });
        if (searchIntent || intent) searchParams.append('intent', searchIntent || intent);

        try {
            const res = await fetch(`/api/market/discovery?${searchParams.toString()}`);
            const data = await res.json();
            if (data.success) {
                setListings(data.listings);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDiscovery(intent);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Moteur Sémantique Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                    Discovery Engine
                </h1>
                <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                    Dites-nous ce dont vous avez besoin. L'IA trouve le profil parfait au-delà des mots-clés.
                </p>

                <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-32 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition-all backdrop-blur-md"
                        placeholder="Ex: Je cherche quelqu'un pour transformer mes vlogs en pubs..."
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-xl font-medium transition-all flex items-center"
                    >
                        Matcher
                    </button>
                </form>

                {/* The Reality Translator Toggle */}
                <div className="mt-6 flex justify-center items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Polyglot Native:</span>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-slate-800 border-none text-slate-300 text-sm rounded cursor-pointer"
                    >
                        <option value="fr">Français</option>
                        <option value="en">English (US)</option>
                        <option value="ja">日本語 (Japanese)</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </div>

            {/* Pinterest-Style Grid Feed */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
                    {listings.map((listing) => (
                        <div key={listing.id} className="group flex flex-col justify-between p-6 bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/60 rounded-2xl transition-all cursor-pointer hover:border-emerald-500/50 shadow-lg shadow-black/20">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                                        {listing.category}
                                    </span>
                                    {/* Mock Sovereign score for display demo */}
                                    <TrustBadge score={Math.floor(Math.random() * 20) + 80} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                    {listing.title}
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed">
                                    {listing.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold font-mono">
                                        {listing.user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">{listing.user.name}</span>
                                </div>
                                <div className="flex items-center text-emerald-400 font-bold">
                                    {listing.priceCent / 100} €
                                    <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {listings.length === 0 && (
                        <div className="col-span-12 text-center text-slate-500 py-12">
                            Aucun talent ne correspond à cette intention. Mettez le Matchmaker sur le coup.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
