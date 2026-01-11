"use client";

/**
 * 💎 ICÔNES PREMIUM SIMPLIFIÉES - 100% VISIBLES
 * Sophistiquées mais optimisées pour le rendu
 */

export const PremiumAgentIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="agentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    
    {/* Hexagone */}
    <path 
      d="M 50 10 L 80 25 L 80 60 L 50 75 L 20 60 L 20 25 Z" 
      fill="url(#agentGrad)" 
      opacity="0.2"
      stroke="url(#agentGrad)"
      strokeWidth="2"
    />
    
    {/* Réseau neuronal */}
    <circle cx="50" cy="25" r="4" fill="url(#agentGrad)"/>
    <circle cx="70" cy="35" r="3" fill="url(#agentGrad)"/>
    <circle cx="70" cy="55" r="3" fill="url(#agentGrad)"/>
    <circle cx="50" cy="65" r="4" fill="url(#agentGrad)"/>
    <circle cx="30" cy="55" r="3" fill="url(#agentGrad)"/>
    <circle cx="30" cy="35" r="3" fill="url(#agentGrad)"/>
    
    {/* Connexions */}
    <line x1="50" y1="25" x2="70" y2="35" stroke="url(#agentGrad)" strokeWidth="1" opacity="0.5"/>
    <line x1="70" y1="35" x2="70" y2="55" stroke="url(#agentGrad)" strokeWidth="1" opacity="0.5"/>
    <line x1="70" y1="55" x2="50" y2="65" stroke="url(#agentGrad)" strokeWidth="1" opacity="0.5"/>
    <line x1="50" y1="65" x2="30" y2="55" stroke="url(#agentGrad)" strokeWidth="1" opacity="0.5"/>
    <line x1="30" y1="55" x2="30" y2="35" stroke="url(#agentGrad)" strokeWidth="1" opacity="0.5"/>
    <line x1="30" y1="35" x2="50" y2="25" stroke="url(#agentGrad)" strokeWidth="1" opacity="0.5"/>
  </svg>
);

export const PremiumLightningIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    
    <path
      d="M 55 10 L 30 50 L 48 50 L 40 90 L 70 45 L 52 45 Z"
      fill="url(#lightGrad)"
      stroke="#fff"
      strokeWidth="2"
    />
  </svg>
);

export const PremiumSecurityIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    
    {/* Bouclier */}
    <path 
      d="M 50 10 L 80 25 L 80 55 Q 80 75, 50 90 Q 20 75, 20 55 L 20 25 Z" 
      fill="url(#shieldGrad)"
      stroke="#fff"
      strokeWidth="2"
    />
    
    {/* Cadenas */}
    <rect x="40" y="50" width="20" height="20" rx="3" fill="#065f46"/>
    <path
      d="M 42 50 L 42 40 Q 42 30, 50 30 Q 58 30, 58 40 L 58 50"
      stroke="#065f46"
      strokeWidth="4"
      fill="none"
    />
    <circle cx="50" cy="60" r="3" fill="#10b981"/>
  </svg>
);

export const PremiumAnalyticsIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    
    {/* Axes */}
    <line x1="15" y1="80" x2="85" y2="80" stroke="url(#chartGrad)" strokeWidth="2"/>
    <line x1="15" y1="80" x2="15" y2="20" stroke="url(#chartGrad)" strokeWidth="2"/>
    
    {/* Barres */}
    <rect x="25" y="55" width="8" height="25" fill="url(#chartGrad)" rx="2"/>
    <rect x="38" y="45" width="8" height="35" fill="url(#chartGrad)" rx="2"/>
    <rect x="51" y="50" width="8" height="30" fill="url(#chartGrad)" rx="2"/>
    <rect x="64" y="35" width="8" height="45" fill="url(#chartGrad)" rx="2"/>
    <rect x="77" y="40" width="8" height="40" fill="url(#chartGrad)" rx="2"/>
    
    {/* Courbe */}
    <path
      d="M 15 70 Q 30 60, 42 50 Q 54 40, 68 30 Q 80 20, 85 25"
      stroke="#f59e0b"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const PremiumGlobeIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    
    {/* Globe */}
    <circle cx="50" cy="50" r="35" fill="none" stroke="url(#globeGrad)" strokeWidth="2"/>
    
    {/* Latitude */}
    <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.5"/>
    <ellipse cx="50" cy="50" rx="35" ry="25" fill="none" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.5"/>
    
    {/* Longitude */}
    <ellipse cx="50" cy="50" rx="15" ry="35" fill="none" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.5"/>
    <ellipse cx="50" cy="50" rx="25" ry="35" fill="none" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.5"/>
    
    {/* Points */}
    <circle cx="50" cy="15" r="3" fill="url(#globeGrad)"/>
    <circle cx="73" cy="30" r="3" fill="url(#globeGrad)"/>
    <circle cx="73" cy="70" r="3" fill="url(#globeGrad)"/>
    <circle cx="50" cy="85" r="3" fill="url(#globeGrad)"/>
    <circle cx="27" cy="70" r="3" fill="url(#globeGrad)"/>
    <circle cx="27" cy="30" r="3" fill="url(#globeGrad)"/>
  </svg>
);

export const PremiumRocketIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    
    {/* Corps */}
    <path
      d="M 50 15 Q 55 20, 58 30 L 58 70 L 53 78 L 50 80 L 47 78 L 42 70 L 42 30 Q 45 20, 50 15"
      fill="url(#rocketGrad)"
      stroke="#fff"
      strokeWidth="1"
    />
    
    {/* Fenêtre */}
    <circle cx="50" cy="35" r="7" fill="#1e293b"/>
    <circle cx="50" cy="35" r="5" fill="#0f172a"/>
    
    {/* Ailerons */}
    <path d="M 42 55 L 30 73 L 35 70 L 42 63 Z" fill="#7c3aed"/>
    <path d="M 58 55 L 70 73 L 65 70 L 58 63 Z" fill="#7c3aed"/>
    
    {/* Flammes */}
    <path d="M 47 80 L 45 88 L 47 90 Z" fill="url(#flameGrad)"/>
    <path d="M 50 80 L 48 90 L 52 90 Z" fill="url(#flameGrad)"/>
    <path d="M 53 80 L 53 90 L 55 88 Z" fill="url(#flameGrad)"/>
  </svg>
);

export const PremiumInfinityIcon = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    
    <path
      d="M 20 50 Q 30 30, 40 50 Q 50 70, 60 50 Q 70 30, 80 50 Q 70 70, 60 50 Q 50 30, 40 50 Q 30 70, 20 50 Z"
      fill="none"
      stroke="url(#infinityGrad)"
      strokeWidth="5"
      strokeLinecap="round"
    />
  </svg>
);
