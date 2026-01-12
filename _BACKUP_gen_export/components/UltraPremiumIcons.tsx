"use client";

/**
 * 🎨 ICÔNES ULTRA-PREMIUM - NIVEAU APPLE/STRIPE
 * Sophistication maximale avec effets 3D, ombres, et détails complexes
 */

import { motion } from "framer-motion";

// 🚀 Agent IA Ultra-Sophistiqué
export const UltraPremiumAgentIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg 
    className={className} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.05, rotate: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <defs>
      <linearGradient id="ultraGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
        <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
      </linearGradient>
      <filter id="ultraGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feFlood floodColor="#06b6d4" floodOpacity="0.5"/>
        <feComposite in2="blur" operator="in"/>
        <feComposite in="SourceGraphic"/>
      </filter>
      <filter id="innerShadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="0" dy="2" result="offsetblur"/>
        <feFlood floodColor="#000" floodOpacity="0.3"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Cercle externe avec effet 3D */}
    <circle cx="100" cy="100" r="90" fill="url(#ultraGrad1)" opacity="0.1" filter="url(#ultraGlow)"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="url(#ultraGrad1)" strokeWidth="3" opacity="0.3"/>
    
    {/* Hexagone principal avec profondeur */}
    <g filter="url(#innerShadow)">
      <path 
        d="M 100 30 L 160 60 L 160 130 L 100 160 L 40 130 L 40 60 Z" 
        fill="rgba(6, 182, 212, 0.2)"
        stroke="url(#ultraGrad1)"
        strokeWidth="2.5"
      />
    </g>
    
    {/* Réseau neuronal central */}
    {[
      {x: 100, y: 60, r: 8},
      {x: 140, y: 80, r: 6},
      {x: 140, y: 120, r: 6},
      {x: 100, y: 140, r: 8},
      {x: 60, y: 120, r: 6},
      {x: 60, y: 80, r: 6}
    ].map((node, i) => (
      <g key={i}>
        <circle 
          cx={node.x} 
          cy={node.y} 
          r={node.r + 4} 
          fill="url(#ultraGrad1)" 
          opacity="0.2"
          filter="url(#ultraGlow)"
        >
          <animate 
            attributeName="r" 
            values={`${node.r + 4};${node.r + 8};${node.r + 4}`} 
            dur="3s" 
            begin={`${i * 0.5}s`} 
            repeatCount="indefinite"
          />
        </circle>
        <circle 
          cx={node.x} 
          cy={node.y} 
          r={node.r} 
          fill="url(#ultraGrad1)"
          filter="url(#ultraGlow)"
        />
        <circle 
          cx={node.x} 
          cy={node.y} 
          r={node.r / 2} 
          fill="#fff" 
          opacity="0.8"
        />
      </g>
    ))}
    
    {/* Connexions animées */}
    <g opacity="0.4">
      {[[100,60,140,80],[140,80,140,120],[140,120,100,140],[100,140,60,120],[60,120,60,80],[60,80,100,60]].map((line, i) => (
        <line 
          key={i}
          x1={line[0]} 
          y1={line[1]} 
          x2={line[2]} 
          y2={line[3]} 
          stroke="url(#ultraGrad1)" 
          strokeWidth="2"
        >
          <animate 
            attributeName="stroke-opacity" 
            values="0.2;1;0.2" 
            dur="2s" 
            begin={`${i * 0.3}s`} 
            repeatCount="indefinite"
          />
        </line>
      ))}
    </g>
    
    {/* Particules orbitales */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
      const x = 100 + 70 * Math.cos((angle * Math.PI) / 180);
      const y = 100 + 70 * Math.sin((angle * Math.PI) / 180);
      return (
        <circle key={i} cx={x} cy={y} r="3" fill="#06b6d4" opacity="0.6">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 100 100`}
            to={`360 100 100`}
            dur="20s"
            begin={`${i * 0.5}s`}
            repeatCount="indefinite"
          />
        </circle>
      );
    })}
  </motion.svg>
);

// ⚡ Lightning Ultra-Premium
export const UltraPremiumLightningIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg 
    className={className} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.1, rotate: -5 }}
  >
    <defs>
      <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <filter id="lightningGlow">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feFlood floodColor="#fbbf24" floodOpacity="0.8"/>
        <feComposite in2="blur" operator="in" result="glow"/>
        <feMerge>
          <feMergeNode in="glow"/>
          <feMergeNode in="glow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Éclairs multiples avec profondeur */}
    <g filter="url(#lightningGlow)">
      {/* Éclair principal */}
      <path
        d="M 110 20 L 60 100 L 95 100 L 80 180 L 140 90 L 105 90 Z"
        fill="url(#lightningGrad)"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Éclair secondaire (ombre) */}
      <path
        d="M 115 25 L 65 105 L 100 105 L 85 185 L 145 95 L 110 95 Z"
        fill="rgba(251, 191, 36, 0.3)"
        stroke="none"
      />
      {/* Highlights */}
      <path
        d="M 100 30 L 75 90 L 90 90"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
    
    {/* Particules d'énergie */}
    {[...Array(8)].map((_, i) => {
      const x = 100 + (Math.random() - 0.5) * 120;
      const y = 100 + (Math.random() - 0.5) * 120;
      return (
        <circle key={i} cx={x} cy={y} r="2" fill="#fbbf24">
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite"/>
          <animate attributeName="r" values="2;4;2" dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite"/>
        </circle>
      );
    })}
  </motion.svg>
);

// 🛡️ Security Shield Ultra-Premium
export const UltraPremiumSecurityIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg 
    className={className} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="shieldGlow">
        <feGaussianBlur stdDeviation="6"/>
        <feFlood floodColor="#10b981" floodOpacity="0.6"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <radialGradient id="shieldShine">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
    </defs>
    
    {/* Bouclier avec effet métallique */}
    <path 
      d="M 100 20 L 160 50 L 160 110 Q 160 150, 100 180 Q 40 150, 40 110 L 40 50 Z" 
      fill="url(#shieldGrad)"
      filter="url(#shieldGlow)"
    />
    {/* Reflet métallique */}
    <path 
      d="M 100 20 L 160 50 L 160 110 Q 160 130, 140 145 L 100 20 Z" 
      fill="url(#shieldShine)"
    />
    {/* Bordure avec profondeur */}
    <path 
      d="M 100 20 L 160 50 L 160 110 Q 160 150, 100 180 Q 40 150, 40 110 L 40 50 Z" 
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Cadenas 3D */}
    <g transform="translate(100, 100)">
      {/* Corps du cadenas */}
      <rect x="-25" y="0" width="50" height="45" rx="8" fill="#065f46" opacity="0.8"/>
      <rect x="-25" y="0" width="50" height="45" rx="8" fill="url(#shieldGrad)"/>
      <rect x="-23" y="2" width="46" height="43" rx="7" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      
      {/* Anse */}
      <path
        d="M -15 0 L -15 -20 Q -15 -35, 0 -35 Q 15 -35, 15 -20 L 15 0"
        stroke="url(#shieldGrad)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        filter="url(#shieldGlow)"
      />
      <path
        d="M -15 0 L -15 -20 Q -15 -35, 0 -35 Q 15 -35, 15 -20 L 15 0"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Trou de serrure */}
      <circle cx="0" cy="18" r="6" fill="#065f46"/>
      <circle cx="0" cy="18" r="5" fill="#000" opacity="0.5"/>
      <rect x="-2" y="18" width="4" height="15" rx="2" fill="#000" opacity="0.5"/>
      
      {/* Highlight */}
      <circle cx="0" cy="18" r="2" fill="#fff" opacity="0.6"/>
    </g>
    
    {/* Scan lines animation */}
    <rect x="35" y="45" width="130" height="2" fill="#10b981" opacity="0.5">
      <animate attributeName="y" values="45;135;45" dur="3s" repeatCount="indefinite"/>
    </rect>
  </motion.svg>
);

// 📊 Analytics Ultra-Premium
export const UltraPremiumAnalyticsIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg 
    className={className} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.05 }}
  >
    <defs>
      <linearGradient id="analyticsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <filter id="analyticsGlow">
        <feGaussianBlur stdDeviation="5"/>
        <feFlood floodColor="#6366f1" floodOpacity="0.5"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Grille de fond */}
    <g opacity="0.15">
      {[...Array(10)].map((_, i) => (
        <line key={i} x1="30" y1={40 + i * 14} x2="170" y2={40 + i * 14} stroke="#6366f1" strokeWidth="0.5"/>
      ))}
      {[...Array(10)].map((_, i) => (
        <line key={i} x1={30 + i * 14} y1="40" x2={30 + i * 14} y2="160" stroke="#6366f1" strokeWidth="0.5"/>
      ))}
    </g>
    
    {/* Axes */}
    <line x1="30" y1="160" x2="170" y2="160" stroke="url(#analyticsGrad)" strokeWidth="3" strokeLinecap="round"/>
    <line x1="30" y1="160" x2="30" y2="40" stroke="url(#analyticsGrad)" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Barres 3D avec ombres */}
    {[
      {x: 50, height: 50, delay: 0},
      {x: 75, height: 70, delay: 0.1},
      {x: 100, height: 60, delay: 0.2},
      {x: 125, height: 90, delay: 0.3},
      {x: 150, height: 80, delay: 0.4}
    ].map((bar, i) => (
      <g key={i}>
        {/* Ombre */}
        <rect 
          x={bar.x + 2} 
          y={162 - bar.height} 
          width="15" 
          height={bar.height} 
          fill="#000" 
          opacity="0.2"
          rx="2"
        />
        {/* Barre principale */}
        <rect 
          x={bar.x} 
          y={160 - bar.height} 
          width="15" 
          height={bar.height} 
          fill="url(#analyticsGrad)"
          filter="url(#analyticsGlow)"
          rx="2"
        >
          <animate 
            attributeName="height" 
            values={`0;${bar.height};${bar.height}`} 
            dur="1.5s" 
            begin={`${bar.delay}s`} 
            fill="freeze"
          />
          <animate 
            attributeName="y" 
            values={`160;${160 - bar.height};${160 - bar.height}`} 
            dur="1.5s" 
            begin={`${bar.delay}s`} 
            fill="freeze"
          />
        </rect>
        {/* Highlight */}
        <rect 
          x={bar.x + 2} 
          y={160 - bar.height + 2} 
          width="4" 
          height={bar.height - 4} 
          fill="#fff" 
          opacity="0.3"
          rx="1"
        />
      </g>
    ))}
    
    {/* Courbe de tendance */}
    <path
      d="M 30 140 Q 60 120, 80 110 Q 100 100, 120 80 Q 140 60, 170 50"
      stroke="#f59e0b"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      filter="url(#analyticsGlow)"
      strokeDasharray="5,5"
    >
      <animate attributeName="stroke-dashoffset" values="0;10;0" dur="2s" repeatCount="indefinite"/>
    </path>
    
    {/* Points de données */}
    {[[30,140],[80,110],[120,80],[170,50]].map((point, i) => (
      <g key={i}>
        <circle cx={point[0]} cy={point[1]} r="6" fill="#f59e0b" opacity="0.3">
          <animate attributeName="r" values="6;10;6" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite"/>
        </circle>
        <circle cx={point[0]} cy={point[1]} r="4" fill="#f59e0b"/>
        <circle cx={point[0]} cy={point[1]} r="2" fill="#fff" opacity="0.8"/>
      </g>
    ))}
  </motion.svg>
);

// 🌐 Globe Network Ultra-Premium
export const UltraPremiumGlobeIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg 
    className={className} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotateY: [0, 360] }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <defs>
      <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <radialGradient id="globeShine">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
      <filter id="globeGlow">
        <feGaussianBlur stdDeviation="4"/>
        <feFlood floodColor="#06b6d4" floodOpacity="0.5"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Globe sphère */}
    <circle cx="100" cy="100" r="70" fill="url(#globeGrad)" opacity="0.2" filter="url(#globeGlow)"/>
    <circle cx="100" cy="100" r="65" fill="none" stroke="url(#globeGrad)" strokeWidth="2"/>
    
    {/* Latitude lines */}
    {[0.3, 0.5, 0.7].map((ratio, i) => (
      <ellipse 
        key={i}
        cx="100" 
        cy="100" 
        rx="65" 
        ry={65 * ratio} 
        fill="none" 
        stroke="url(#globeGrad)" 
        strokeWidth="1" 
        opacity="0.4"
      />
    ))}
    
    {/* Longitude lines */}
    {[0, 30, 60, 90, 120, 150].map((angle, i) => (
      <ellipse 
        key={i}
        cx="100" 
        cy="100" 
        rx={65 * Math.abs(Math.cos((angle * Math.PI) / 180))} 
        ry="65" 
        fill="none" 
        stroke="url(#globeGrad)" 
        strokeWidth="1" 
        opacity="0.4"
        transform={`rotate(${angle} 100 100)`}
      />
    ))}
    
    {/* Points de connexion animés */}
    {[
      {x: 100, y: 35}, {x: 145, y: 60}, {x: 145, y: 140},
      {x: 100, y: 165}, {x: 55, y: 140}, {x: 55, y: 60}
    ].map((point, i) => (
      <g key={i}>
        <circle cx={point.x} cy={point.y} r="8" fill="#06b6d4" opacity="0.2">
          <animate attributeName="r" values="8;12;8" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite"/>
        </circle>
        <circle cx={point.x} cy={point.y} r="5" fill="url(#globeGrad)" filter="url(#globeGlow)"/>
        <circle cx={point.x} cy={point.y} r="2" fill="#fff"/>
      </g>
    ))}
    
    {/* Lignes de connexion pulsantes */}
    {[[100,35,145,60],[145,60,145,140],[145,140,100,165]].map((line, i) => (
      <line 
        key={i}
        x1={line[0]} 
        y1={line[1]} 
        x2={line[2]} 
        y2={line[3]} 
        stroke="url(#globeGrad)" 
        strokeWidth="2"
        opacity="0.6"
      >
        <animate 
          attributeName="stroke-dasharray" 
          values="0,100;100,0" 
          dur="2s" 
          begin={`${i * 0.5}s`} 
          repeatCount="indefinite"
        />
      </line>
    ))}
    
    {/* Reflet lumineux */}
    <ellipse cx="85" cy="75" rx="30" ry="40" fill="url(#globeShine)"/>
  </motion.svg>
);

// 🚀 Rocket Ultra-Premium
export const UltraPremiumRocketIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg 
    className={className} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ y: -10, scale: 1.1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <defs>
      <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <filter id="rocketGlow">
        <feGaussianBlur stdDeviation="6"/>
        <feFlood floodColor="#ec4899" floodOpacity="0.6"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Fumée de propulsion */}
    {[...Array(5)].map((_, i) => (
      <circle 
        key={i}
        cx="100" 
        cy={160 + i * 15} 
        r={8 + i * 3} 
        fill="#94a3b8" 
        opacity={0.3 - i * 0.05}
      >
        <animate 
          attributeName="cy" 
          values={`${160 + i * 15};${200 + i * 15}`} 
          dur="2s" 
          begin={`${i * 0.3}s`} 
          repeatCount="indefinite"
        />
        <animate 
          attributeName="opacity" 
          values={`${0.3 - i * 0.05};0`} 
          dur="2s" 
          begin={`${i * 0.3}s`} 
          repeatCount="indefinite"
        />
      </circle>
    ))}
    
    {/* Corps de la fusée avec effet métallique */}
    <g filter="url(#rocketGlow)">
      <path
        d="M 100 30 Q 110 40, 115 60 L 115 140 L 105 155 L 100 160 L 95 155 L 85 140 L 85 60 Q 90 40, 100 30"
        fill="url(#rocketGrad)"
      />
      {/* Highlight métallique */}
      <path
        d="M 100 30 Q 110 40, 115 60 L 115 100 L 100 30"
        fill="rgba(255,255,255,0.2)"
      />
      <path
        d="M 100 30 Q 110 40, 112 60 L 112 100"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        fill="none"
      />
    </g>
    
    {/* Fenêtre avec reflet */}
    <circle cx="100" cy="70" r="15" fill="#1e293b"/>
    <circle cx="100" cy="70" r="12" fill="#0f172a"/>
    <circle cx="95" cy="65" r="4" fill="rgba(255,255,255,0.6)"/>
    
    {/* Ailerons avec profondeur */}
    <g>
      {/* Aileron gauche */}
      <path d="M 85 110 L 60 145 L 70 140 L 85 125 Z" fill="#7c3aed"/>
      <path d="M 85 110 L 60 145 L 70 140 L 85 125 Z" fill="url(#rocketGrad)" opacity="0.7"/>
      <path d="M 85 110 L 65 130 L 70 128" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/>
      
      {/* Aileron droit */}
      <path d="M 115 110 L 140 145 L 130 140 L 115 125 Z" fill="#7c3aed"/>
      <path d="M 115 110 L 140 145 L 130 140 L 115 125 Z" fill="url(#rocketGrad)" opacity="0.7"/>
      <path d="M 115 110 L 135 130 L 130 128" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/>
    </g>
    
    {/* Flammes animées */}
    <g>
      {[95, 100, 105].map((x, i) => (
        <path
          key={i}
          d={`M ${x} 160 Q ${x - 5} 175, ${x} 190 Q ${x + 5} 175, ${x} 160`}
          fill="url(#flameGrad)"
          opacity="0.8"
        >
          <animate 
            attributeName="d" 
            values={`M ${x} 160 Q ${x - 5} 175, ${x} 190 Q ${x + 5} 175, ${x} 160;
                     M ${x} 160 Q ${x - 8} 180, ${x} 200 Q ${x + 8} 180, ${x} 160;
                     M ${x} 160 Q ${x - 5} 175, ${x} 190 Q ${x + 5} 175, ${x} 160`}
            dur="0.8s"
            begin={`${i * 0.2}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
    </g>
    
    {/* Étincelles */}
    {[...Array(8)].map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x = 100 + 20 * Math.cos(angle);
      const y = 170 + 20 * Math.sin(angle);
      return (
        <circle key={i} cx={x} cy={y} r="2" fill="#fbbf24">
          <animate attributeName="opacity" values="0;1;0" dur="1s" begin={`${i * 0.125}s`} repeatCount="indefinite"/>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0;${10 * Math.cos(angle)},${10 * Math.sin(angle)}`}
            dur="1s"
            begin={`${i * 0.125}s`}
            repeatCount="indefinite"
          />
        </circle>
      );
    })}
  </motion.svg>
);
