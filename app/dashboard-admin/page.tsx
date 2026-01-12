"use client";
// VERCEL_CACHE_BUST_FINAL

import Link from "next/link";
import {
    LineIconChevronLeft,
    LineIconUsers,
    LineIconZap
} from "@/components/DesignSystemIcons";

export default function DashboardAdminPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <LineIconChevronLeft size={20} className="text-gray-400" />
                    </Link>
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Gestion des Ressources</h2>

                <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-lg">Server Health</h3>
                            <p className="text-green-400 font-bold mt-2">Optimal</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl">
                            <LineIconZap size={24} />
                        </div>
                    </div>
                    <div className="mt-6 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="w-[34%] h-full bg-green-500"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">CPU Usage: 34%</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
                        <h3 className="font-bold mb-4">Pending Approvals</h3>
                        <ul className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <li key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <span className="text-sm">User Request #{i * 42}</span>
                                    <button className="text-xs bg-blue-500 px-3 py-1 rounded text-white">Review</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
                        <h3 className="font-bold mb-4">Security Logs</h3>
                        <div className="space-y-2 font-mono text-xs text-gray-400">
                            <p>[12:00] SSH Login attempt failed (IP: 192.168.1.1)</p>
                            <p>[12:05] Database backup completed</p>
                            <p>[12:10] New admin session started</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
