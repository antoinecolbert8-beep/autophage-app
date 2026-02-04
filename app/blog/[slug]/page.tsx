"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Article {
    title: string;
    content: string;
    metaDescription: string;
    publishedAt: string;
    wordCount: number;
}

export default function ArticlePage() {
    const params = useParams();
    const slug = params?.slug as string | undefined;
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        fetch(`/api/blog/articles/${slug}`)
            .then(res => res.json())
            .then(data => {
                setArticle(data.article);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">Chargement...</div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">Article introuvable</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <article className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
                <div className="text-gray-500 mb-8">
                    📅 {new Date(article.publishedAt).toLocaleDateString('fr-FR')} · 📝 {article.wordCount} mots
                </div>
                <div
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
                />
            </article>
        </div>
    );
}
