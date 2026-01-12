"use client";

import Link from "next/link";
import {
  LineIconChevronLeft,
  LineIconShield,
  LineIconUsers
} from "@/components/AppIcons";

export default function AdminMasterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <LineIconChevronLeft size={20} className="text-gray-400" />
          </Link>
          <h1 className="text-xl font-bold text-red-500">MASTER ADMIN</h1>
        </div>
        <div className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/50 rounded font-bold text-xs uppercase">
          Restricted Access
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
            <h3 className="text-red-400 font-bold text-sm">Active Users</h3>
            <p className="text-3xl font-bold mt-2">12,482</p>
          </div>
          <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
            <h3 className="text-red-400 font-bold text-sm">MRR</h3>
            <p className="text-3xl font-bold mt-2">842k €</p>
          </div>
          <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
            <h3 className="text-red-400 font-bold text-sm">Server Load</h3>
            <p className="text-3xl font-bold mt-2">34%</p>
          </div>
          <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
            <h3 className="text-red-400 font-bold text-sm">Incidents</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>

        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8">
          <h3 className="font-bold mb-6">User Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase font-bold text-gray-500 bg-white/5">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="p-3 font-mono">USR-{1000 + i}</td>
                    <td className="p-3">admin{i}@client.com</td>
                    <td className="p-3"><span className="text-white font-bold">Enterprise</span></td>
                    <td className="p-3"><span className="text-green-400">Active</span></td>
                    <td className="p-3"><button className="text-red-400 hover:text-red-300">Ban</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
