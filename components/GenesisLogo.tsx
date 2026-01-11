"use client";

/**
 * 💎 LOGO GENESIS OFFICIEL
 * Identité visuelle unique et mémorable
 */

export const GenesisLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="logoGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Cercle externe avec effet néon */}
    <circle 
      cx="60" 
      cy="60" 
      r="50" 
      stroke="url(#logoGrad1)" 
      strokeWidth="3" 
      fill="none"
      filter="url(#logoGlow)"
    />
    
    {/* Hexagone interne */}
    <path 
      d="M 60 20 L 95 40 L 95 80 L 60 100 L 25 80 L 25 40 Z" 
      fill="url(#logoGrad1)" 
      opacity="0.1"
    />
    <path 
      d="M 60 20 L 95 40 L 95 80 L 60 100 L 25 80 L 25 40 Z" 
      stroke="url(#logoGrad1)" 
      strokeWidth="2" 
      fill="none"
    />
    
    {/* Lettre "G" stylisée */}
    <path
      d="M 75 45 Q 85 45, 85 55 Q 85 65, 75 65 L 60 65 L 60 55 L 70 55 M 60 35 Q 50 35, 45 40 Q 40 45, 40 55 Q 40 65, 45 70 Q 50 75, 60 75 L 75 75"
      stroke="url(#logoGrad1)"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#logoGlow)"
    />
    
    {/* Points d'énergie */}
    <circle cx="60" cy="20" r="3" fill="#06b6d4">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="95" cy="40" r="3" fill="#8b5cf6">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.33s" repeatCount="indefinite"/>
    </circle>
    <circle cx="95" cy="80" r="3" fill="#ec4899">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.66s" repeatCount="indefinite"/>
    </circle>
    <circle cx="60" cy="100" r="3" fill="#06b6d4">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="25" cy="80" r="3" fill="#8b5cf6">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.33s" repeatCount="indefinite"/>
    </circle>
    <circle cx="25" cy="40" r="3" fill="#ec4899">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.66s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const GenesisLogoFull = ({ className = "h-10" }: { className?: string }) => (
  <div className="flex items-center space-x-3">
    <GenesisLogo className="w-10 h-10" />
    <span className={`${className} font-black text-2xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}>
      GENESIS
    </span>
  </div>
);
