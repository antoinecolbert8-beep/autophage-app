"use client";

import Navigation from "./navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/app/loading";
import SovereignCursor from "./SovereignCursor";
import GoldenParticles from "./GoldenParticles";
import LiveSocialProof from "./LiveSocialProof";

/**
 * PAGE TRANSITION VARIANTS
 * Professional fade + subtle slide for premium feel
 */
const pageVariants = {
    initial: {
        opacity: 0,
        y: 8,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smooth feel
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1.0],
        },
    },
};

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Landing page shouldn't have sidebar
    const isLanding = pathname === "/";
    const isAuthPage = pathname.includes("/signup") || pathname.includes("/login") || pathname.includes("/setup") || pathname.includes("/payment") || pathname.includes("/admin");

    // SYSTEM BOOT STATE
    const [isBooting, setIsBooting] = useState(true);

    useEffect(() => {
        // "System Boot" simulation - runs once per session to reinforce the "Genesis OS" feel
        const hasBooted = typeof window !== 'undefined' ? sessionStorage.getItem("genesis_boot_complete") : null;

        if (!hasBooted) {
            const timer = setTimeout(() => {
                setIsBooting(false);
                sessionStorage.setItem("genesis_boot_complete", "true");
            }, 2200); // 2.2s boot sequence
            return () => clearTimeout(timer);
        } else {
            setIsBooting(false);
        }
    }, []);

    if (isBooting) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-cyan-500/30">
            {/* Background Gradients for Genesis Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[128px] opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Global Navigation - Excluded on Landing, Auth, and Setup */}
            {!isLanding && !isAuthPage && <Navigation />}

            {/* Main Content Area with Page Transitions */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className={`relative z-10 ${!isLanding && !isAuthPage ? "ml-20 lg:ml-64 p-4 md:p-8" : ""
                        }`}
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            {/* Live Social Proof only */}
            <LiveSocialProof />
        </div>
    );
}
