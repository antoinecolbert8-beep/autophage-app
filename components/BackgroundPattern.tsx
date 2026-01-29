"use client";

/**
 * 🌌 PATTERN DE FOND SIGNATURE ELA
 * Identité visuelle unique - Grid néon avec effet perspective
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const BackgroundPattern = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid néon avec perspective */}
      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'rotateX(60deg) translateZ(-200px)',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '80px 80px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Lignes de scan horizontales */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(0deg, transparent 98%, rgba(6, 182, 212, 0.3) 98%, rgba(6, 182, 212, 0.3) 100%)',
          backgroundSize: '100% 40px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '0% 100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Points lumineux aux intersections */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[...Array(30)].map((_, i) => {
          const x = (i % 6) * 20 + 10;
          const y = Math.floor(i / 6) * 20 + 10;
          const delay = i * 0.1;

          return (
            <motion.circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r="2"
              fill={['#06b6d4', '#8b5cf6', '#ec4899'][i % 3]}
              filter="url(#glow)"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </svg>

      {/* Vignette gradient pour fade sur les bords */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0014] via-transparent to-[#0a0014]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0014] via-transparent to-[#0a0014]" />
    </div>
  );
};
