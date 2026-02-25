"use client";

/**
 * 💎 COMPOSANTS VISUELS ULTRA-AVANCÉS
 * Le niveau visuel le plus élevé jamais créé
 */

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// 🌟 Mesh Gradient Animé (comme Stripe)
export const MeshGradient = () => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
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
      <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse -z-10 blur-sm transition-opacity" />
      <div className="group-hover:animate-[glitch_0.3s_ease-in-out_infinite] transition-all">
        {children}
      </div>
    </div>
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
export const TacticalMap = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
        {/* Simplified World Outline */}
        <path
          d="M150,150 L200,140 L250,160 L300,150 L350,180 L320,250 L280,300 L200,320 L150,280 Z"
          fill="none" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="2 2"
        />
        <path
          d="M500,100 L600,80 L700,120 L750,200 L700,300 L600,350 L500,320 Z"
          fill="none" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="2 2"
        />
        <path
          d="M800,250 L850,220 L900,280 L880,350 L820,320 Z"
          fill="none" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="2 2"
        />

        {/* Animated Attack Points */}
        {[...Array(15)].map((_, i) => (
          <g key={i}>
            <motion.circle
              cx={Math.random() * 800 + 100}
              cy={Math.random() * 300 + 100}
              r="2"
              fill="#dc2626"
              animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            />
            <motion.circle
              cx={Math.random() * 800 + 100}
              cy={Math.random() * 300 + 100}
              r="15"
              fill="none"
              stroke="#dc2626"
              strokeWidth="0.2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 0.5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: Math.random() * 5 }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

// 🔚 Footer (Placeholder fix if needed, but keeping the core visuals)
