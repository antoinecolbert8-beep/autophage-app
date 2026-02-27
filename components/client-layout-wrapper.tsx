"use client";

import Navigation from "./navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { ReferralTracker } from "./ReferralTracker";
import { NeuralPulse } from "./AdvancedVisuals";

/**
 * PAGE TRANSITION VARIANTS
 * Professional fade + subtle slide for premium feel
 */
const pageVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.98,
        filter: "blur(10px)",
    },
    enter: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // Custom cinematic ease
        },
    },
    exit: {
        opacity: 0,
        scale: 1.02,
        filter: "blur(10px)",
        transition: {
            duration: 0.4,
            ease: [0.7, 0, 0.84, 0],
        },
    },
};

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // --- LA LOGIQUE MATRICE (GOLD VERSION) ---

    // 1. Définition des zones STRICTEMENT protégées (où la Sidebar DOIT apparaître)
    const isProtectedZone =
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/agent-swarm"); // Note: On cible l'outil précis, pas juste "/agent"

    // 2. Définition des exceptions (Pages qui commencent par les mots ci-dessus mais qui sont publiques)
    // Par exemple, si tu as une page marketing qui s'appelle "/agents", elle ne doit pas avoir de sidebar.
    const isPublicException =
        pathname === "/agents" ||
        pathname === "/dashboard/agents" || // Exception spécifique demandée précédemment
        pathname === "/features";

    // 3. Verdict final : On affiche la Sidebar seulement si on est en zone protégée ET pas dans une exception
    const showSidebar = isProtectedZone && !isPublicException;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-cyan-500/30">
            <Suspense fallback={null}>
                <ReferralTracker />
            </Suspense>
            {/* Background Gradients for ELA Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#66fcf1]/5 rounded-full blur-[128px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1f2833]/10 rounded-full blur-[128px] opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <NeuralPulse />

            {/* Global Navigation - Controlled by Matrix Logic */}
            {showSidebar && <Navigation />}

            {/* Main Content Area */}
            <motion.main
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={`relative z-10 ${showSidebar ? "ml-20 lg:ml-64 p-4 md:p-8" : ""
                    }`}
            >
                {children}
            </motion.main>
        </div>
    );
}
