"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LineIconLayoutDashboard,
  LineIconUsers,
  LineIconSettings,
  LineIconLogOut,
  LineIconZap,
  LineIconBarChart,
} from "@/components/AppIcons";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-[#0f0f16] flex flex-col z-40 transition-all duration-300">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-black text-xs text-white">G</div>
        <span className="font-bold text-xl tracking-tight text-white">GENESIS</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname === "/dashboard"
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconLayoutDashboard size={18} />
          <span>Vue d'ensemble</span>
        </Link>

        <Link
          href="/dashboard/agent"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/dashboard/agent")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconUsers size={18} />
          <span>Mes Agents</span>
        </Link>

        <Link
          href="/dashboard/content"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/dashboard/content")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconZap size={18} />
          <span>Générateur</span>
        </Link>

        <Link
          href="/dashboard/analytics"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/dashboard/analytics")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconBarChart size={18} />
          <span>Analytique</span>
        </Link>

        <Link
          href="/dashboard/billing"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/dashboard/billing")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconZap size={18} />
          <span>Facturation</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-white/5 bg-[#0f0f16]">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive("/dashboard/settings")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconSettings size={18} />
          <span>Paramètres</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left mt-2 font-medium">
          <LineIconLogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
