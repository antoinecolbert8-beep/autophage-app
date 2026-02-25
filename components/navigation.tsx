"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LineIconLayoutDashboard,
  LineIconUsers,
  LineIconSettings,
  LineIconLogOut,
  LineIconZap,
  LineIconBarChart,
  LineIconShield,
  LineIconMail,
} from "@/components/AppIcons";
import { LiveUsersCounter } from "./LiveUsersCounter";

export default function Navigation() {
  const pathname = usePathname();

  const isProtectedPage =
    (pathname?.startsWith("/dashboard") ||
      pathname?.startsWith("/admin") ||
      pathname?.startsWith("/agent-swarm")) &&
    pathname !== "/dashboard/agents" &&
    pathname !== "/features";

  if (!isProtectedPage) {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col z-40 transition-all duration-300">
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#66fcf1] to-[#45a29e] flex items-center justify-center font-black text-sm text-[#0b0c10] shadow-[0_0_20px_rgba(102,252,241,0.2)]">E</div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase italic">ELA</span>
        </div>
        <LiveUsersCounter />
      </div>

      <nav className="flex-1 p-6 overflow-y-auto space-y-8">
        {pathname?.startsWith("/admin-master") ? (
          /* --- MENU ADMIN --- */
          <div className="space-y-4">
            <div className="px-2 text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Infrastructure</div>
            <Link
              href="/admin-master"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all relative group ${pathname === "/admin-master"
                ? "bg-red-600/10 text-red-500 border border-red-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
            >
              <LineIconShield size={18} />
              <span>Cortex Central</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-gray-500 hover:text-white hover:bg-white/5"
            >
              <LineIconLogOut size={18} />
              <span>Quitter Admin</span>
            </Link>
          </div>
        ) : (
          /* --- MENU UTILISATEUR STANDARD --- */
          <>
            <div className="space-y-4">
              <div className="px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Command Center</div>
              <Link
                href="/dashboard-war-room"
                className={`flex items-center gap-3 px-4 py-4 rounded-xl font-black transition-all relative group overflow-hidden ${pathname === "/dashboard-war-room"
                  ? "bg-red-600/20 text-red-500 border border-red-600/30 shadow-[0_0_20px_rgba(220,38,38,0.15)]"
                  : "bg-red-600/5 text-red-600/60 border border-red-600/10 hover:bg-red-600/10 hover:text-red-600"
                  }`}
              >
                <div className="absolute inset-0 bg-red-600/5 animate-[pulse_3s_infinite]" />
                <LineIconZap size={18} className="relative z-10" />
                <span className="relative z-10">WAR ROOM</span>
                <span className="absolute right-3 top-3 w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_#dc2626]" />
              </Link>
            </div>

            <div className="space-y-4 pt-4">
              <div className="px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Intelligence</div>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === "/dashboard"
                    ? "bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/20 shadow-[0_0_15px_rgba(102,252,241,0.1)]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <LineIconLayoutDashboard size={18} />
                  <span>Overview</span>
                </Link>

                <Link
                  href="/dashboard/analytics"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive("/dashboard/analytics")
                    ? "bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/20"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <LineIconBarChart size={18} />
                  <span>Performance</span>
                </Link>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="px-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Swarm Operations</div>
              <div className="space-y-1">
                <Link
                  href="/dashboard/agent"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive("/dashboard/agent")
                    ? "bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/20"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <LineIconUsers size={18} />
                  <span>Agents</span>
                </Link>

                <Link
                  href="/dashboard/content"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive("/dashboard/content")
                    ? "bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/20"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <LineIconZap size={18} />
                  <span>Générateur</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all mb-2 ${isActive("/dashboard/settings")
            ? "bg-white/10 text-white border border-white/5"
            : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconSettings size={18} />
          <span>Paramètres</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all text-left font-bold text-sm">
          <LineIconLogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
