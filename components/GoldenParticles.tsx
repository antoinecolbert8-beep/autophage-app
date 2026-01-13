"use client";

import { useEffect, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
}

/**
 * 🔱 GOLDEN PARTICLES
 * Floating golden particles for sovereign ambiance
 */
export default function GoldenParticles({ count = 30 }: { count?: number }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Initialize particles
        const initialParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.5 + 0.2,
        }));
        setParticles(initialParticles);

        // Animate particles
        const interval = setInterval(() => {
            setParticles((prev) =>
                prev.map((p) => ({
                    ...p,
                    x: (p.x + p.speedX + 100) % 100,
                    y: (p.y + p.speedY + 100) % 100,
                }))
            );
        }, 50);

        return () => clearInterval(interval);
    }, [count]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 blur-[1px] mix-blend-screen"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                        transition: "all 0.05s linear",
                        boxShadow: "0 0 10px rgba(255, 215, 0, 0.3)",
                    }}
                />
            ))}
        </div>
    );
}
