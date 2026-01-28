"use client";

/**
 * 👑 LOGO ELA OFFICIEL (Version Master)
 * Sceau doré souverain
 */

export const ELALogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#fcd34d', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="logoGlowGold">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Sceau Doré */}
    <circle
      cx="60"
      cy="60"
      r="54"
      stroke="url(#logoGradGold)"
      strokeWidth="4"
      fill="none"
      filter="url(#logoGlowGold)"
    />

    <circle
      cx="60"
      cy="60"
      r="48"
      stroke="url(#logoGradGold)"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />

    {/* Lettres E.L.A. Stylisées */}
    <path
      d="M 40 45 L 60 45 M 40 60 L 55 60 M 40 75 L 60 75 M 40 45 L 40 75"
      stroke="url(#logoGradGold)"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
      filter="url(#logoGlowGold)"
    />
    <path
      d="M 65 45 L 65 75 L 85 75"
      stroke="url(#logoGradGold)"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 50 25 L 70 25 M 60 25 L 60 95 M 45 95 L 75 95"
      stroke="white"
      strokeWidth="2"
      fill="none"
      opacity="0.1"
    />
  </svg>
);

export const ELALogoFull = ({ className = "h-10" }: { className?: string }) => (
  <div className="flex items-center space-x-3">
    <ELALogo className="w-10 h-10" />
    <span className={`${className} font-black text-2xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent`}>
      ELA
    </span>
  </div>
);
