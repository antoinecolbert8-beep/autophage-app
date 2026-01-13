"use client";

import { useEffect, useState } from "react";

/**
 * 🔱 SOVEREIGN CURSOR
 * Custom cursor with golden halo and trail effect
 */
export default function SovereignCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

    useEffect(() => {
        let trailId = 0;

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Create trail point
            const newPoint = { x: e.clientX, y: e.clientY, id: trailId++ };
            setTrail((prev) => [...prev, newPoint].slice(-8)); // Keep last 8 points

            // Check if hovering clickable element
            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === "pointer" ||
                target.tagName === "A" ||
                target.tagName === "BUTTON"
            );
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <>
            {/* Hide default cursor on desktop */}
            <style jsx global>{`
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

            {/* Trail particles */}
            {trail.map((point, i) => (
                <div
                    key={point.id}
                    className="fixed pointer-events-none z-[9999] mix-blend-screen"
                    style={{
                        left: point.x,
                        top: point.y,
                        transform: "translate(-50%, -50%)",
                        opacity: (i + 1) / trail.length * 0.4,
                        transition: "opacity 0.1s ease-out",
                    }}
                >
                    <div
                        className="w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 blur-sm"
                        style={{
                            animation: `fadeCursorTrail ${0.8}s ease-out forwards`,
                        }}
                    />
                </div>
            ))}

            {/* Main cursor - golden halo */}
            <div
                className="fixed pointer-events-none z-[10000] transition-all duration-200 ease-out mix-blend-screen hidden md:block"
                style={{
                    left: position.x,
                    top: position.y,
                    transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
                }}
            >
                {/* Outer glow */}
                <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-600/20 blur-xl animate-pulse" />
                </div>

                {/* Inner halo */}
                <div className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 opacity-80" />
                    <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-yellow-200 to-amber-400" />
                </div>

                {/* Center dot */}
                <div className="absolute w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>

            <style jsx>{`
        @keyframes fadeCursorTrail {
          to {
            opacity: 0;
            transform: scale(0.5);
          }
        }
      `}</style>
        </>
    );
}
