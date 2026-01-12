"use client";

/**
 * 🤖 PAGE AGENTS - VERSION PROFESSIONNELLE
 */

import Link from "next/link";
import { LineIconRocket, LineIconCpu, LineIconZap, LineIconBarChart, LineIconUsers, LineIconShield, LineIconGlobe, LineIconClock, LineIconTarget } from "@/components/LineIcons";

export default function AgentsPage() {
  const agents = [
    { icon: LineIconCpu, name: "Atlas", status: "Actif", tasks: 847, color: "indigo" },
    { icon: LineIconZap, name: "Nexus", status: "Actif", tasks: 623, color: "purple" },
    { icon: LineIconBarChart, name: "Pulse", status: "Actif", tasks: 1205, color: "blue" },
    { icon: LineIconTarget, name: "Oracle", status: "Actif", tasks: 456, color: "cyan" },
    { icon: LineIconUsers, name: "Apex", status: "Actif", tasks: 789, color: "pink" },
    { icon: LineIconShield, name: "Vault", status: "Actif", tasks: 234, color: "green" },
    { icon: LineIconGlobe, name: "Echo", status: "Actif", tasks: 567, color: "orange" },
    { icon: LineIconClock, name: "Quantum", status: "Actif", tasks: 890, color: "red" },
    { icon: LineIconTarget, name: "Lex", status: "Actif", tasks: 345, color: "violet" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <LineIconRocket size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Genesis</span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/content" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Contenu
              </Link>
              <Link href="/dashboard/agents" className="text-gray-900 font-semibold">
                Agents
              </Link>
              <Link href="/dashboard/analytics" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Analytics
              </Link>
              <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Paramètres
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Mes Agents IA</h1>
          <p className="text-gray-600 text-lg">Gérez et surveillez vos 9 agents autonomes</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <div key={i} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <agent.icon size={28} className="text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {agent.status}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-1">{agent.name}</h3>
              <p className="text-gray-600 mb-4">{agent.tasks} tâches ce mois</p>

              <button className="btn-primary w-full justify-center text-sm py-2">
                Configurer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
