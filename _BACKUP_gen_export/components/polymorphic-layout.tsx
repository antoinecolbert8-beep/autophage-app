"use client";

/**
 * 🦎 Polymorphic Layout - Layout qui s'adapte à la marque du client
 * Applique les couleurs, fonts, logo dynamiquement
 */

import { useEffect, useState } from "react";

type BrandConfig = {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
};

type PolymorphicLayoutProps = {
  children: React.ReactNode;
  userId?: string;
  brandConfig?: BrandConfig;
};

export function PolymorphicLayout({ children, userId, brandConfig }: PolymorphicLayoutProps) {
  const [brand, setBrand] = useState<BrandConfig | null>(brandConfig ?? null);

  useEffect(() => {
    // Charge la config de marque depuis l'API si userId fourni
    if (userId && !brandConfig) {
      fetch(`/api/preferences?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.preferences) {
            setBrand({
              logoUrl: data.preferences.logoUrl,
              primaryColor: data.preferences.primaryColor,
              secondaryColor: data.preferences.secondaryColor,
              fontFamily: data.preferences.fontFamily,
            });
          }
        })
        .catch((err) => console.error("Erreur chargement marque:", err));
    }
  }, [userId, brandConfig]);

  useEffect(() => {
    // Applique les CSS variables dynamiquement
    if (brand) {
      const root = document.documentElement;
      
      if (brand.primaryColor) {
        root.style.setProperty("--brand-primary", brand.primaryColor);
      }
      
      if (brand.secondaryColor) {
        root.style.setProperty("--brand-secondary", brand.secondaryColor);
      }
      
      if (brand.fontFamily) {
        root.style.setProperty("--brand-font", brand.fontFamily);
      }
    }
  }, [brand]);

  return (
    <div className="polymorphic-wrapper">
      {brand?.logoUrl && (
        <div className="brand-logo-container">
          <img src={brand.logoUrl} alt="Logo" className="brand-logo" />
        </div>
      )}
      {children}
      
      <style jsx>{`
        .polymorphic-wrapper {
          font-family: var(--brand-font, system-ui, sans-serif);
        }
        
        .brand-logo-container {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 50;
        }
        
        .brand-logo {
          height: 40px;
          width: auto;
          object-fit: contain;
        }
        
        /* Variables CSS pour couleurs globales */
        :global(:root) {
          --brand-primary: #3b82f6;
          --brand-secondary: #8b5cf6;
          --brand-font: system-ui, sans-serif;
        }
        
        /* Applique les couleurs de marque aux boutons */
        :global(button.btn-primary) {
          background-color: var(--brand-primary);
        }
        
        :global(button.btn-primary:hover) {
          filter: brightness(1.1);
        }
        
        :global(.text-primary) {
          color: var(--brand-primary);
        }
        
        :global(.bg-primary) {
          background-color: var(--brand-primary);
        }
        
        :global(.border-primary) {
          border-color: var(--brand-primary);
        }
      `}</style>
    </div>
  );
}





