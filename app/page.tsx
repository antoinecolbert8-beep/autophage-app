import Link from 'next/link';
import { db } from "@/core/db";
import { ArrowRight, Bot, Zap, TrendingUp, ShieldCheck, Activity, Users, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
    // Live Stats Fetching
    const totalUsers = await db.user.count();
    const warChest = await db.warChest.findUnique({ where: { id: 1 } });
    const budgetFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((warChest?.available_budget_cents || 0) / 100);

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-slate-800 backdrop-blur-md fixed w-full z-50 top-0">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Autophage</span>
                    </div>
                    <div className="flex gap-4 text-sm font-medium text-slate-400">
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="/dashboard" className="text-white hover:text-blue-400 transition-colors">Login</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        System Online • v1.0.4
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-slate-200 to-slate-500 text-transparent bg-clip-text">
                        The First AI that <br />
                        <span className="text-blue-500">Grows Itself.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Autophage is a closed-loop organism. It generates content, buys ads,
                        harvests revenue, and rewrites its own growth logic.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-900/50"
                        >
                            Initialize System <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Live Stats Section */}
            <section className="py-10 border-y border-slate-900 bg-slate-950/50">
                <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 text-center divide-x divide-slate-800/50">
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-1 text-slate-400 uppercase text-xs tracking-wider">
                            <Users className="w-4 h-4" /> Assimilated Users
                        </div>
                        <div className="text-3xl font-mono font-bold text-white">{totalUsers.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-1 text-slate-400 uppercase text-xs tracking-wider">
                            <DollarSign className="w-4 h-4" /> WarChest Reserves
                        </div>
                        <div className="text-3xl font-mono font-bold text-green-400">{budgetFormatted}</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-1 text-slate-400 uppercase text-xs tracking-wider">
                            <Activity className="w-4 h-4" /> System Status
                        </div>
                        <div className="text-3xl font-mono font-bold text-blue-400">AUTONOMOUS</div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6 bg-slate-900/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">The Cycle</h2>
                        <p className="text-slate-400 text-lg">How the organism sustains itself.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1: Hunt */}
                        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-red-500/50 transition-all group hover:-translate-y-2">
                            <div className="w-14 h-14 bg-red-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">1. Hunt (Ads)</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Campaign Commander scans the horizon, deploying capital into Meta&apos;s ad network.
                                It identifies &quot;Winner&quot; patterns and kills weak creatives instantly.
                            </p>
                        </div>

                        {/* Card 2: Feed */}
                        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-green-500/50 transition-all group hover:-translate-y-2">
                            <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-7 h-7 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">2. Feed (Revenue)</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Converted users generate revenue. The &quot;Spore&quot; engine incentivizes viral sharing,
                                funneling 40% of all profits directly back into the WarChest.
                            </p>
                        </div>

                        {/* Card 3: Evolve */}
                        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all group hover:-translate-y-2">
                            <div className="w-14 h-14 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">3. Evolve (Reinvest)</h3>
                            <p className="text-slate-400 leading-relaxed">
                                The organism learns. High ROAS strategies are fed back into the Content Forge AI,
                                creating smarter, more effective genetic iterations of ad copy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-900 text-center text-slate-600 bg-slate-950">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Bot className="w-5 h-5" />
                    <span className="font-bold text-slate-400">Autophage</span>
                </div>
                <p className="mb-4">© 2026 Autophage Systems. Self-Replicating Codebase.</p>
            </footer>
        </div>
    );
}

