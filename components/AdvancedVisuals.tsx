"use client";

/**
 * 💎 COMPOSANTS VISUELS ULTRA-AVANCÉS
 * Le niveau visuel le plus élevé jamais créé
 */

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

// 🌟 Mesh Gradient Animé (comme Stripe)
export const MeshGradient = () => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/30" />
      <div className="absolute top-0 left-0 w-full h-full">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: Math.random() * 600 + 200,
              height: Math.random() * 600 + 200,
              background: `radial-gradient(circle, ${['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)]
                }40 0%, transparent 70%)`,
            }}
            animate={{
              x: [Math.random() * dimensions.width, Math.random() * dimensions.width],
              y: [Math.random() * dimensions.height, Math.random() * dimensions.height],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// 🎬 Particules 3D avec profondeur
export const Particles3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
    }> = [];

    const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 0, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Effet d'attraction vers la souris
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          particle.vx += dx * 0.00005;
          particle.vy += dy * 0.00005;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        if (particle.z > 1000 || particle.z < 0) particle.vz *= -1;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const scale = 1000 / (1000 + particle.z);
        const size = particle.size * scale;
        const opacity = Math.max(0.2, 1 - particle.z / 1000);

        ctx.fillStyle = particle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Connecter les particules proches
        particles.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = particle.color + '20';
            ctx.lineWidth = (150 - distance) / 150;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// 🎯 Curseur Custom Magnétique
export const MagneticCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-4 h-4 bg-cyan-400 rounded-full" />
      </motion.div>
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <div className="w-10 h-10 border-2 border-cyan-400/50 rounded-full" />
      </motion.div>
    </>
  );
};

// 🌊 Vagues animées (comme Apple)
export const AnimatedWaves = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-20">
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill="url(#wave-gradient)"
          animate={{
            d: [
              "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ✨ Effet de lumière qui suit la souris
export const SpotlightEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle 600px at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.15), transparent 80%)`,
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    />
  );
};

// 🎪 Text Reveal Animation (comme Linear)
export const TextReveal = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  const words = children.split(' ');

  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block mr-2"
          style={{ transformOrigin: 'bottom center' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// 🔮 Glass Card avec effet 3D
export const GlassCard3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = (y - centerY) / 10;
    const rotateYValue = -(x - centerX) / 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-white/10" style={{ transform: 'translateZ(0px)' }} />
      <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'translateZ(-10px)' }} />
    </motion.div>
  );
};

// 🕸️ Neural Web (SVG-based for performance, but ultra-detailed)
export const NeuralWeb = () => {
  const [nodes, setNodes] = useState<{ x: number; y: number; connections: number[] }[]>([]);

  useEffect(() => {
    const newNodes = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      connections: Array.from({ length: 3 }).map(() => Math.floor(Math.random() * 40))
    }));
    setNodes(newNodes);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((node, i) => (
          <g key={i}>
            {node.connections.map((connIndex, j) => (
              <motion.line
                key={j}
                x1={node.x}
                y1={node.y}
                x2={nodes[connIndex]?.x || node.x}
                y2={nodes[connIndex]?.y || node.y}
                stroke="url(#neural-grad)"
                strokeWidth="0.1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
              />
            ))}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="0.2"
              fill="#66fcf1"
              animate={{ r: [0.1, 0.3, 0.1], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            />
          </g>
        ))}
        <defs>
          <linearGradient id="neural-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#66fcf1" stopOpacity="0" />
            <stop offset="50%" stopColor="#66fcf1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#66fcf1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ⚡ Cyber Glitch Utility
export const CyberGlitch = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 -z-10 blur-md transition-opacity" />
      <div className="group-hover:opacity-90 transition-all">
        {children}
      </div>
    </div>
  );
};

// ⚠️ System Notification Overlay (Subtle)
export const GlobalInterference = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-600/[0.02] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 🎨 Grain Texture Overlay
export const GrainTexture = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
};

// 🗺️ Tactical Map (World Map with neural attack points)
export const TacticalMap = ({ events = [] }: { events?: any[] }) => {
  // Mapping of cities to SVG coordinates (1000x500 viewBox)
  const cityCoords: Record<string, { x: number, y: number }> = {
    'Seoul': { x: 830, y: 160 },
    'Paris': { x: 480, y: 130 },
    'New York': { x: 260, y: 170 },
    'Tokyo': { x: 860, y: 170 },
    'Dubai': { x: 620, y: 220 },
    'Berlin': { x: 520, y: 110 },
    'London': { x: 470, y: 110 },
    'San Francisco': { x: 130, y: 180 },
    'Singapore': { x: 780, y: 320 },
    'Sydney': { x: 880, y: 400 },
  };

  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
        {/* Simplified World Outline */}
        <path
          d="M150,150 L200,140 L250,160 L300,150 L350,180 L320,250 L280,300 L200,320 L150,280 Z"
          fill="none" stroke="#66fcf1" strokeWidth="0.5" strokeDasharray="2 2"
          className="opacity-20"
        />
        <path
          d="M500,100 L600,80 L700,120 L750,200 L700,300 L600,350 L500,320 Z"
          fill="none" stroke="#66fcf1" strokeWidth="0.5" strokeDasharray="2 2"
          className="opacity-20"
        />
        <path
          d="M800,250 L850,220 L900,280 L880,350 L820,320 Z"
          fill="none" stroke="#66fcf1" strokeWidth="0.5" strokeDasharray="2 2"
          className="opacity-20"
        />

        {/* Static Background Nodes (Faint) */}
        {[...Array(20)].map((_, i) => (
          <circle
            key={`bg-${i}`}
            cx={100 + (i * 453) % 800}
            cy={100 + (i * 721) % 300}
            r="0.5"
            fill="#dc2626"
            className="opacity-10"
          />
        ))}

        {/* Dynamic Pulse Events from API */}
        <AnimatePresence>
          {events.map((event) => {
            const coords = event.location ? cityCoords[event.location.city] : null;
            if (!coords) return null;

            return (
              <g key={event.id}>
                {/* Core Point */}
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r="3"
                  fill="#ff0000"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                />

                {/* Adrenaline Ripples */}
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r="20"
                  fill="none"
                  stroke="#66fcf1"
                  strokeWidth="0.5"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: [0, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r="40"
                  fill="none"
                  stroke="#66fcf1"
                  strokeWidth="0.2"
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: [0, 1.2, 1.5], opacity: [0.5, 0.2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />

                {/* City Label (Optional/Faint) */}
                <motion.text
                  x={coords.x + 8}
                  y={coords.y + 4}
                  fill="#dc2626"
                  fontSize="8"
                  className="font-mono font-bold uppercase tracking-tighter opacity-60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                >
                  {event.location.city}
                </motion.text>
              </g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
};

// 🌀 Vortex 3D (Interactive Abstract Core)
export const Vortex3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-[600px] h-[600px] rounded-full border border-cyan-500/20 shadow-[0_0_100px_rgba(102,252,241,0.1)]"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
            borderColor: ["rgba(102,252,241,0.1)", "rgba(102,252,241,0.3)", "rgba(102,252,241,0.1)"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full border border-blue-500/10"
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full border border-purple-500/5"
          animate={{ rotate: 180, scale: [0.9, 1, 0.9] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

// 📺 CRT Scanline Effect
export const Scanline = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden opacity-[0.03]">
      <motion.div
        className="w-full h-[100px] bg-gradient-to-b from-transparent via-white to-transparent"
        animate={{ top: ["-100px", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
};

// 🖐️ Biometric Scanner (High-Security Overlay)
export const BiometricScanner = ({ onComplete }: { onComplete?: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("AUTHENTICATING_IDENTITY");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("IDENTITY_VERIFIED");
          setTimeout(() => onComplete?.(), 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center backdrop-blur-3xl">
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Rotating Rings */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 border border-cyan-500/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Progress Circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="160" cy="160" r="140"
            stroke="currentColor" strokeWidth="2"
            className="text-white/5" fill="transparent"
          />
          <motion.circle
            cx="160" cy="160" r="140"
            stroke="currentColor" strokeWidth="2"
            className="text-cyan-500" fill="transparent"
            strokeDasharray={880}
            strokeDashoffset={880 - (880 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Fingerprint Visual */}
        <motion.div
          className="absolute text-cyan-500 opacity-40"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M12 11c0-1.1-.9-2-2-2m2 4c0-2.2-1.8-4-4-4M8 11c0 1.1.9 2 2 2m-2 4c0-3.3 2.7-6 6-6M10 12c0 2.2 1.8 4 4 4m2-4c0 3.3-2.7 6-6 6M12 13c0 1.1.9 2 2 2m2 4c0-5.5-4.5-10-10-10M14 14c0 1.1.9 2 2 2m4 0c0-7.7-6.3-14-14-14M16 16c0 1.1.9 2 2 2" />
          </svg>
        </motion.div>

        {/* Scanner Line */}
        <motion.div
          className="absolute w-[280px] h-px bg-cyan-500 shadow-[0_0_15px_#66fcf1]"
          animate={{ top: ["20%", "80%", "20%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mt-12 text-center space-y-4">
        <p className="text-[#66fcf1] font-mono text-xs tracking-[0.5em] uppercase animate-pulse">{status}</p>
        <div className="text-white/20 font-black text-4xl tracking-tighter uppercase">{progress}%</div>
      </div>

      <div className="absolute bottom-10 font-mono text-[9px] text-gray-700 tracking-[0.3em] uppercase">
        ENCRYPTED_SECURITY_PROTOCOL_v4.0 // ELA_AUTH
      </div>
    </div>
  );
};

// 🔮 OmniSphere (Central 3D Core - Requires Three.js but let's do a high-end SVG/CSS version for compatibility)
export const OmniSphere = () => {
  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center group pointer-events-none">
      {/* Core Glow */}
      <div className="absolute w-[200px] h-[200px] bg-cyan-500/20 blur-[80px] rounded-full animate-pulse" />

      {/* Morphing Shapes */}
      <motion.div
        className="absolute w-[300px] h-[300px] border border-cyan-500/20 rounded-full"
        animate={{
          borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "50% 50% 20% 80% / 50% 20% 80% 50%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
          rotate: 360,
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute w-[350px] h-[350px] border border-blue-500/10 rounded-full"
        animate={{
          borderRadius: ["50% 20% 80% 50% / 50% 50% 20% 80%", "40% 60% 70% 30% / 40% 50% 60% 50%", "50% 20% 80% 50% / 50% 50% 20% 80%"],
          rotate: -360,
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Data Nodes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          animate={{
            x: [Math.cos(i * 30) * 150, Math.cos(i * 30) * 180, Math.cos(i * 30) * 150],
            y: [Math.sin(i * 30) * 150, Math.sin(i * 30) * 180, Math.sin(i * 30) * 150],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ duration: 4 + i % 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: 'blur(1px)' }}
        />
      ))}

      <div className="relative z-10 text-center">
        <h4 className="text-[#66fcf1] font-black text-xs uppercase tracking-[0.5em] mb-2">OMNISCIENCE_CORE</h4>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#66fcf1] to-transparent mx-auto" />
      </div>
    </div>
  );
};

// 🔘 NeuralPulse Effect (Standard component, but can be used as overlay)
export const NeuralPulse = () => {
  const [pulses, setPulses] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setPulses(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setPulses(prev => prev.filter(p => p.id !== id));
      }, 1000);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pulses.map(p => (
        <motion.div
          key={p.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 10, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-12 h-12 border border-cyan-500 rounded-full"
          style={{ left: p.x - 24, top: p.y - 24 }}
        />
      ))}
    </div>
  );
};

// 🌪️ Reality Distortion (Major System Event Overlay)
export const RealityDistortion = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px) brightness(2)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }}
          exit={{ opacity: 0, scale: 0.9, filter: 'blur(40px) brightness(0)' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[300] pointer-events-none overflow-hidden"
        >
          {/* Chromatic Aberration Simulation */}
          <div className="absolute inset-0 bg-red-600/5 mix-blend-screen animate-pulse" style={{ clipPath: 'inset(1px 0 0 0)' }} />
          <div className="absolute inset-0 bg-cyan-600/5 mix-blend-screen animate-pulse-slow" style={{ clipPath: 'inset(0 1px 0 0)' }} />

          {/* Lens Flare Simulation */}
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-white/5 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[140px] animate-pulse-slow" />

          {/* Edge Distortion */}
          <div className="absolute inset-0 border-[40px] border-red-900/10 blur-[60px]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 🌊 Data Tsunami (High-Frequency Stream)
export const DataTsunami = ({ active }: { active: boolean }) => {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    if (!active) {
      setData([]);
      return;
    }
    const interval = setInterval(() => {
      const chars = "010101-ERROR-DOMINANCE-ELA-SYNC-MARKET-CAPTURE-ROI-999";
      const line = Array(15).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
      setData(prev => [line, ...prev].slice(0, 40));
    }, 50);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] pointer-events-none flex font-mono text-[8px] text-red-600/20 leading-none overflow-hidden"
        >
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex-1 whitespace-nowrap overflow-hidden transition-all duration-1000" style={{ writingMode: 'vertical-rl' }}>
              {data.map((line, j) => (
                <span key={j} className="block py-2">{line}</span>
              ))}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 🖥️ Holographic Interface (Floating Data Panels)
export const HolographicInterface = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ rotateX: 20, rotateY: -10, translateZ: 50, opacity: 0 }}
      animate={{ rotateX: 10, rotateY: -5, translateZ: 0, opacity: 1 }}
      className="relative p-6 border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-3xl rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden group"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
      <div className="relative z-10">{children}</div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full group-hover:bg-cyan-500/20 transition-all" />
    </motion.div>
  );
};

// 🔡 Glitch Text (High-End Distortion)
export const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block">
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-red-500 opacity-70"
        animate={{ x: [-2, 2, -1, 0], y: [1, -1, 0] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: 'mirror' }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 -z-20 text-blue-500 opacity-70"
        animate={{ x: [2, -2, 1, 0], y: [-1, 1, 0] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: 'mirror', delay: 0.1 }}
      >
        {text}
      </motion.span>
    </div>
  );
};


// 🔚 Final Visual Library


