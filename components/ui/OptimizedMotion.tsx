"use client";

/**
 * 🎨 Composants d'animation optimisés avec lazy loading
 * Améliore les performances en chargeant les animations uniquement quand nécessaire
 */

import { motion, type MotionProps, type HTMLMotionProps } from "framer-motion";
import { useEffect, useState } from "react";

// Hook pour détecter si l'élément est visible
export function useInView(ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit = {}) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.1,
      rootMargin: "50px",
      ...options,
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

// Animations prédéfinies optimisées
export const fadeInUp: MotionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const fadeIn: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 },
};

export const scaleIn: MotionProps = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export const slideInLeft: MotionProps = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const slideInRight: MotionProps = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

// Micro-interactions pour boutons
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// Composant optimisé pour les cards
interface OptimizedCardProps extends HTMLMotionProps<"div"> {
  delay?: number;
  children: React.ReactNode;
}

export function OptimizedCard({ delay = 0, children, className, ...props }: OptimizedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Composant bouton avec micro-interactions
interface OptimizedButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function OptimizedButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: OptimizedButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all";
  const variantStyles = {
    primary: "bg-white text-black hover:bg-slate-100",
    secondary: "bg-white/10 border border-white/20 hover:bg-white/20",
    ghost: "bg-transparent hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={buttonHover}
      whileTap={buttonTap}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Composant de shimmer loading (skeleton)
export function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded ${className}`} />
  );
}

// Gradient animé pour le texte (optimisé)
export function AnimatedGradientText({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </motion.span>
  );
}
