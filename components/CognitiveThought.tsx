"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const THOUGHTS = [
    "Analyse des vecteurs de croissance en cours...",
    "Optimisation du graphe de connaissances...",
    "Détection d'une opportunité de saturation sur le segment Tech...",
    "Ajustement de la pression marketing (Scoring: 9.4/10)",
    "Neutralisation d'un signal de churn utilisateur...",
    "Génération d'un contenu viral hybride (Texte/Vidéo)...",
    "Synchronisation des essaims de prospection...",
    "ÉVALUATION : Taux de domination projeté : 99.8%",
];

export function CognitiveThought() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % THOUGHTS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">ELA COGNITION</span>
            </div>
            <div className="h-6 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs text-white/70 italic font-light tracking-wide"
                    >
                        "{THOUGHTS[index]}"
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
}
