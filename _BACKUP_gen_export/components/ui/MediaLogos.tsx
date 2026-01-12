"use client";

/**
 * 📰 Logos médias partenaires - Style sobre et professionnel
 */

export function MediaLogos() {
  const logos = [
    { name: "TechCrunch", width: 120 },
    { name: "Forbes", width: 100 },
    { name: "Les Échos", width: 110 },
    { name: "BFM Business", width: 130 },
    { name: "Le Monde", width: 110 },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:opacity-50 transition-all duration-500">
      {logos.map((logo) => (
        <div
          key={logo.name}
          className="text-slate-600 font-bold tracking-tight"
          style={{ 
            width: logo.width,
            fontSize: "18px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.02em"
          }}
        >
          {logo.name}
        </div>
      ))}
    </div>
  );
}

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
      {/* RGPD Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-sm font-medium text-slate-300">Conformité RGPD</span>
      </div>

      {/* ISO Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-slate-300">ISO 27001</span>
      </div>

      {/* SSL Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-sm font-medium text-slate-300">SSL 256-bit</span>
      </div>

      {/* Uptime Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-slate-300">99.9% Uptime</span>
      </div>
    </div>
  );
}


