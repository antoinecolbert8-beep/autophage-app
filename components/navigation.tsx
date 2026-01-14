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

  // LOGIQUE STRICTE ET CORRIGÉE
  // On affiche la Sidebar UNIQUEMENT si l'URL commence par ces chemins précis :
  const isProtectedPage =
    (pathname?.startsWith("/dashboard") ||       // Tout le dashboard
      pathname?.startsWith("/admin") ||           // L'admin
      pathname?.startsWith("/agent-swarm")) &&    // L'outil spécifique

    pathname !== "/dashboard/agents" &&          // Exception : Page "9 Armes"
    pathname !== "/features";                    // Exception : Page Features

  if (!isProtectedPage) {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-[#0f0f16] flex flex-col z-40 transition-all duration-300">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-black text-xs text-white">G</div>
        <span className="font-bold text-xl tracking-tight text-white">GENESIS</span>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Pilotage</div>
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors mb-4 ${pathname === "/dashboard"
            ? "bg-white/10 text-white border border-white/5"
            : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <LineIconLayoutDashboard size={18} />
          <span>Vue d'ensemble</span>
        </Link>

        <div className="mb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Opérations</div>
        <div className="space-y-1 mb-6">
          <Link
            href="/dashboard/agent"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${isActive("/dashboard/agent")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <LineIconUsers size={18} />
            <span>Mes Agents</span>
          </Link>

          <Link
            href="/dashboard/content"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${isActive("/dashboard/content")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <LineIconZap size={18} />
            <span>Générateur</span>
          </Link>
        </div>

        <div className="mb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Performance</div>
        <div className="space-y-1">
          <Link
            href="/dashboard/analytics"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${isActive("/dashboard/analytics")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <LineIconBarChart size={18} />
            <span>Analytique</span>
          </Link>

          <Link
            href="/dashboard/billing"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${isActive("/dashboard/billing")
              ? "bg-white/10 text-white border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <LineIconSettings size={18} />
            <span>Abonnement</span>
          </Link>
        </div>
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
