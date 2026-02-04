"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Article {
    id: string;
    title: string;
    slug: string;
    metaDescription: string;
    publishedAt: string;
    wordCount: number;
    semanticScore: number;
}

export default function BlogPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blog/articles')
            .then(res => res.json())
            .then(data => {
                setArticles(data.articles || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">Chargement des articles...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Blog Autophage
                </h1>
                <p className="text-xl text-gray-400 mb-12">
                    Insights, tendances et analyses générés par IA
                </p>

                <div className="space-y-8">
                    {articles.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            Aucun article publié pour le moment.
                        </div>
                    ) : (
                        articles.map(article => (
                            <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className="block p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                            >
                                <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                                <p className="text-gray-400 mb-4">{article.metaDescription}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <span>📅 {new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                                    <span>📝 {article.wordCount} mots</span>
                                    <span>🎯 Score SEO: {article.semanticScore}%</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
