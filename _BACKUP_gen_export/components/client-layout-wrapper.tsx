"use client";

import Navigation from "./navigation";
import { usePathname } from "next/navigation";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Landing page shouldn't have sidebar
    const isLanding = pathname === "/";

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-cyan-500/30">
            {/* Background Gradients for Genesis Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[128px] opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Global Navigation - Excluded on Landing */}
            {!isLanding && <Navigation />}

            {/* Main Content Area */}
            <main
                className={`relative z-10 transition-all duration-300 ${!isLanding ? "ml-20 lg:ml-64 p-4 md:p-8" : ""
                    }`}
            >
                {children}
            </main>
        </div>
    );
}
