"use client";

/**
 * 🎨 ICÔNES CUSTOM ULTRA-SOPHISTIQUÉES
 * Identité visuelle unique Genesis
 */

export const AgentIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="agentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Hexagone externe */}
    <path d="M50 5 L85 25 L85 65 L50 85 L15 65 L15 25 Z" 
      stroke="url(#agentGrad)" 
      strokeWidth="2" 
      fill="none"
      filter="url(#glow)"
    />
    {/* Hexagone interne */}
    <path d="M50 20 L70 32 L70 58 L50 70 L30 58 L30 32 Z" 
      fill="url(#agentGrad)" 
      opacity="0.2"
    />
    {/* Cercle central */}
    <circle cx="50" cy="50" r="15" fill="url(#agentGrad)" filter="url(#glow)"/>
    {/* Points de connexion */}
    <circle cx="50" cy="20" r="3" fill="#06b6d4"/>
    <circle cx="70" cy="32" r="3" fill="#8b5cf6"/>
    <circle cx="70" cy="58" r="3" fill="#ec4899"/>
    <circle cx="50" cy="70" r="3" fill="#06b6d4"/>
    <circle cx="30" cy="58" r="3" fill="#8b5cf6"/>
    <circle cx="30" cy="32" r="3" fill="#ec4899"/>
    {/* Lignes de connexion */}
    <line x1="50" y1="35" x2="50" y2="20" stroke="#06b6d4" strokeWidth="1" opacity="0.5"/>
  </svg>
);

export const AutomationIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="autoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Engrenages */}
    <g transform="translate(30, 35)">
      <circle cx="0" cy="0" r="18" fill="url(#autoGrad)" opacity="0.3"/>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <rect
          key={i}
          x="-3"
          y="-22"
          width="6"
          height="8"
          fill="url(#autoGrad)"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="8" fill="url(#autoGrad)"/>
    </g>
    <g transform="translate(60, 55)">
      <circle cx="0" cy="0" r="15" fill="url(#autoGrad)" opacity="0.3"/>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <rect
          key={i}
          x="-2.5"
          y="-18"
          width="5"
          height="6"
          fill="url(#autoGrad)"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="6" fill="url(#autoGrad)"/>
    </g>
    {/* Flèche circulaire */}
    <path
      d="M 80 30 A 20 20 0 1 1 70 20"
      stroke="url(#autoGrad)"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <polygon points="80,30 75,35 85,35" fill="url(#autoGrad)"/>
  </svg>
);

export const BrainAIIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Cerveau stylisé */}
    <path
      d="M 30 45 Q 25 35, 30 28 Q 35 20, 45 20 Q 50 15, 55 20 Q 65 20, 70 28 Q 75 35, 70 45 Q 75 55, 70 65 Q 65 75, 50 75 Q 35 75, 30 65 Q 25 55, 30 45"
      fill="url(#brainGrad)"
      opacity="0.3"
    />
    {/* Réseau neuronal */}
    <circle cx="35" cy="30" r="4" fill="#8b5cf6"/>
    <circle cx="50" cy="25" r="4" fill="#8b5cf6"/>
    <circle cx="65" cy="30" r="4" fill="#8b5cf6"/>
    <circle cx="40" cy="50" r="4" fill="#ec4899"/>
    <circle cx="60" cy="50" r="4" fill="#ec4899"/>
    <circle cx="50" cy="65" r="4" fill="#8b5cf6"/>
    {/* Connexions */}
    <line x1="35" y1="30" x2="50" y2="25" stroke="url(#brainGrad)" strokeWidth="1.5" opacity="0.6"/>
    <line x1="50" y1="25" x2="65" y2="30" stroke="url(#brainGrad)" strokeWidth="1.5" opacity="0.6"/>
    <line x1="35" y1="30" x2="40" y2="50" stroke="url(#brainGrad)" strokeWidth="1.5" opacity="0.6"/>
    <line x1="65" y1="30" x2="60" y2="50" stroke="url(#brainGrad)" strokeWidth="1.5" opacity="0.6"/>
    <line x1="40" y1="50" x2="50" y2="65" stroke="url(#brainGrad)" strokeWidth="1.5" opacity="0.6"/>
    <line x1="60" y1="50" x2="50" y2="65" stroke="url(#brainGrad)" strokeWidth="1.5" opacity="0.6"/>
  </svg>
);

export const SecurityShieldIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="securityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Bouclier */}
    <path
      d="M 50 10 L 75 25 L 75 50 Q 75 70, 50 85 Q 25 70, 25 50 L 25 25 Z"
      fill="url(#securityGrad)"
      opacity="0.2"
    />
    <path
      d="M 50 10 L 75 25 L 75 50 Q 75 70, 50 85 Q 25 70, 25 50 L 25 25 Z"
      stroke="url(#securityGrad)"
      strokeWidth="2"
      fill="none"
    />
    {/* Cadenas */}
    <rect x="42" y="45" width="16" height="20" rx="2" fill="url(#securityGrad)"/>
    <path
      d="M 45 45 L 45 38 Q 45 33, 50 33 Q 55 33, 55 38 L 55 45"
      stroke="url(#securityGrad)"
      strokeWidth="2.5"
      fill="none"
    />
    <circle cx="50" cy="55" r="2.5" fill="#fff"/>
  </svg>
);

export const AnalyticsChartIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="analyticsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Axes */}
    <line x1="20" y1="75" x2="80" y2="75" stroke="url(#analyticsGrad)" strokeWidth="2"/>
    <line x1="20" y1="75" x2="20" y2="25" stroke="url(#analyticsGrad)" strokeWidth="2"/>
    {/* Courbe */}
    <path
      d="M 20 70 Q 30 60, 35 55 Q 40 45, 45 50 Q 50 40, 55 35 Q 60 25, 70 30"
      stroke="url(#analyticsGrad)"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    {/* Points de données */}
    <circle cx="35" cy="55" r="3" fill="#f59e0b"/>
    <circle cx="45" cy="50" r="3" fill="#f59e0b"/>
    <circle cx="55" cy="35" r="3" fill="#ef4444"/>
    <circle cx="70" cy="30" r="3" fill="#ef4444"/>
    {/* Grille de fond */}
    {[35, 45, 55, 65].map((y, i) => (
      <line key={i} x1="20" y1={y} x2="80" y2={y} stroke="url(#analyticsGrad)" strokeWidth="0.5" opacity="0.3"/>
    ))}
  </svg>
);

export const GlobeNetworkIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Globe */}
    <circle cx="50" cy="50" r="30" stroke="url(#globeGrad)" strokeWidth="2" fill="none"/>
    <ellipse cx="50" cy="50" rx="30" ry="15" stroke="url(#globeGrad)" strokeWidth="1.5" fill="none" opacity="0.6"/>
    <ellipse cx="50" cy="50" rx="15" ry="30" stroke="url(#globeGrad)" strokeWidth="1.5" fill="none" opacity="0.6"/>
    <line x1="20" y1="50" x2="80" y2="50" stroke="url(#globeGrad)" strokeWidth="1.5" opacity="0.6"/>
    {/* Points de connexion */}
    {[
      {x: 50, y: 20}, {x: 70, y: 35}, {x: 70, y: 65}, 
      {x: 50, y: 80}, {x: 30, y: 65}, {x: 30, y: 35}
    ].map((point, i) => (
      <circle key={i} cx={point.x} cy={point.y} r="3" fill="url(#globeGrad)"/>
    ))}
  </svg>
);

export const RocketLaunchIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Fusée */}
    <path
      d="M 50 15 L 60 45 L 55 75 L 50 80 L 45 75 L 40 45 Z"
      fill="url(#rocketGrad)"
    />
    {/* Fenêtre */}
    <circle cx="50" cy="35" r="6" fill="#fff" opacity="0.3"/>
    {/* Aileron gauche */}
    <path d="M 40 50 L 30 65 L 40 60 Z" fill="url(#rocketGrad)" opacity="0.8"/>
    {/* Aileron droit */}
    <path d="M 60 50 L 70 65 L 60 60 Z" fill="url(#rocketGrad)" opacity="0.8"/>
    {/* Flammes */}
    <path d="M 45 80 L 42 90 L 45 85 Z" fill="#f59e0b" opacity="0.8"/>
    <path d="M 50 80 L 48 95 L 50 87 Z" fill="#ef4444" opacity="0.8"/>
    <path d="M 55 80 L 58 90 L 55 85 Z" fill="#f59e0b" opacity="0.8"/>
  </svg>
);

export const LightningBoltIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      d="M 55 10 L 30 50 L 45 50 L 40 90 L 70 45 L 55 45 Z"
      fill="url(#lightningGrad)"
      stroke="#fbbf24"
      strokeWidth="2"
    />
  </svg>
);

export const InfinityLoopIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      d="M 20 50 Q 30 30, 40 50 Q 50 70, 60 50 Q 70 30, 80 50 Q 70 70, 60 50 Q 50 30, 40 50 Q 30 70, 20 50"
      stroke="url(#infinityGrad)"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
