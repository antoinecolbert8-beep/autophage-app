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
import { CyberGlitch } from "./AdvancedVisuals";
import { signOut } from "next-auth/react";

function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left font-medium text-sm min-h-[44px]"
    >
      <LineIconLogOut size={20} />
      <span>Déconnexion</span>
    </button>
  );
}

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
    <aside className="fixed bottom-0 md:left-0 md:top-0 md:bottom-0 w-full md:w-64 border-t md:border-r border-white/10 bg-[#0a0a0f]/80 backdrop-blur-2xl flex md:flex-col z-50 transition-all duration-300">
      <div className="hidden md:flex h-20 items-center justify-between px-6 border-b border-white/5 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white shadow-sm">E</div>
          <span className="font-bold text-xl tracking-tight text-white uppercase">ELA</span>
        </div>
        <LiveUsersCounter />
      </div>

      <nav className="flex-1 flex md:flex-col justify-around md:justify-start p-2 md:p-6 overflow-x-auto md:overflow-y-auto md:space-y-6 scrollbar-hide">
        {pathname?.startsWith("/admin-master") ? (
          /* --- MENU ADMIN --- */
          <div className="flex w-full md:w-auto md:flex-col justify-around md:justify-start gap-2 md:gap-4 md:space-y-4">
            <div className="hidden md:block px-2 text-[10px] font-medium text-red-500 uppercase tracking-widest flex-shrink-0">Infrastructure</div>
            <Link
              href="/admin-master"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 md:px-4 md:py-3 rounded-[14px] font-medium transition-all relative min-h-[44px] min-w-[44px] ${pathname === "/admin-master"
                ? "bg-white/10 text-white border border-white/5"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <LineIconShield size={20} />
              <span className="text-[10px] md:text-sm">Cortex</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 md:px-4 md:py-3 rounded-[14px] font-medium transition-all text-gray-400 hover:text-white hover:bg-white/5 min-h-[44px] min-w-[44px]"
            >
              <LineIconLogOut size={20} />
              <span className="text-[10px] md:text-sm">Quitter</span>
            </Link>
          </div>
        ) : (
          /* --- MENU UTILISATEUR STANDARD --- */
          <div className="flex w-full md:w-auto md:flex-col justify-around md:justify-start gap-2 md:gap-4">

            <Link
              href="/dashboard-war-room"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 md:px-4 md:py-3 rounded-[14px] font-medium transition-all relative overflow-hidden min-h-[44px] min-w-[44px] ${pathname === "/dashboard-war-room"
                ? "bg-white/10 text-white border border-white/5"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <LineIconZap size={20} className="relative z-10" />
              <span className="text-[10px] md:text-sm relative z-10">Centre Stratégique</span>
            </Link>

            <Link
              href="/dashboard"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 md:px-4 md:py-3 rounded-[14px] font-medium transition-all min-h-[44px] min-w-[44px] ${pathname === "/dashboard"
                ? "bg-white/10 text-white border border-white/5 shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <LineIconLayoutDashboard size={20} />
              <span className="text-[10px] md:text-sm">Dashboard</span>
            </Link>

            <Link
              href="/dashboard/analytics"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 md:px-4 md:py-3 rounded-[14px] font-medium transition-all min-h-[44px] min-w-[44px] ${isActive("/dashboard/analytics")
                ? "bg-white/10 text-white border border-white/5"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <LineIconBarChart size={20} />
              <span className="text-[10px] md:text-sm">Performances</span>
            </Link>

            <Link
              href="/dashboard/agent"
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 md:px-4 md:py-3 rounded-[14px] font-medium transition-all min-h-[44px] min-w-[44px] ${isActive("/dashboard/agent")
                ? "bg-white/10 text-white border border-white/5"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <LineIconUsers size={20} />
              <span className="text-[10px] md:text-sm">Agents</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="hidden md:block p-6 border-t border-white/5 bg-transparent">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-[14px] font-medium transition-all mb-2 min-h-[44px] ${isActive("/dashboard/settings")
            ? "bg-white/10 text-white border border-white/5"
            : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconSettings size={20} />
          <span className="text-sm flex-1">Paramètres</span>
          <span className="text-[8px] bg-[#66fcf1]/10 text-[#66fcf1] border border-[#66fcf1]/20 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">⚡ GOD</span>
        </Link>
        <LogoutButton />
      </div>
    </aside>

  );
}
