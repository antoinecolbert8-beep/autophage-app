'use client';

import { useState, useEffect } from 'react';

interface DominationLoaderProps {
    steps: string[];
    onComplete?: () => void;
    // If true, forces completion even if implementation time isn't up
    forceComplete?: boolean;
}

export function DominationLoader({ steps, onComplete, forceComplete }: DominationLoaderProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (currentStepIndex >= steps.length) {
            if (onComplete) onComplete();
            return;
        }

        // Dynamic timing: faster for early steps, slightly longer for "heavy" middle steps
        // or fast if forceComplete is true
        let delay = forceComplete ? 100 : Math.random() * 800 + 400;

        // Add log animation
        const timeout = setTimeout(() => {
            setLogs((prev) => [...prev, `[SYSTEM] ${steps[currentStepIndex]}... OK`]);
            setCurrentStepIndex((prev) => prev + 1);
        }, delay);

        return () => clearTimeout(timeout);
    }, [currentStepIndex, steps, forceComplete, onComplete]);

    const progress = Math.min((currentStepIndex / steps.length) * 100, 100);

    return (
        <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl bg-black border border-cyber-blue/30 shadow-[0_0_50px_rgba(0,242,255,0.1)] relative overflow-hidden font-mono">
            {/* Background Matrix/Grid effect */}
            <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
                    <span className="text-cyber-blue font-bold tracking-widest text-sm">
                        APEX PROTOCOL // EXECUTING
                    </span>
                </div>
                <span className="text-cyber-green font-bold">
                    {Math.round(progress)}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-900 rounded-full mb-8 relative overflow-hidden border border-white/10">
                <div
                    className="h-full bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink shadow-[0_0_20px_rgba(0,242,255,0.8)] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Terminal Logs */}
            <div className="bg-black/50 rounded-lg p-4 h-48 overflow-y-auto border border-white/5 font-mono text-xs space-y-2 scrollbar-thin scrollbar-thumb-cyber-blue/30">
                {logs.map((log, i) => (
                    <div key={i} className="text-green-500 animate-fadeIn fade-in-up">
                        <span className="text-gray-500 mr-2">
                            {new Date().toLocaleTimeString().split(' ')[0]}.{Math.floor(Math.random() * 999)}
                        </span>
                        {'>'} {log}
                    </div>
                ))}
                {currentStepIndex < steps.length && (
                    <div className="text-cyber-blue animate-pulse">
                        <span className="text-gray-500 mr-2">
                            {new Date().toLocaleTimeString().split(' ')[0]}...
                        </span>
                        {'>'} {steps[currentStepIndex]}<span className="animate-blink">_</span>
                    </div>
                )}
            </div>

            {/* Status Footer */}
            <div className="mt-4 flex justify-between text-xs text-gray-500 uppercase tracking-widest relative z-10">
                <span>Process ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                <span>Encryption: KYBER-1024</span>
            </div>
        </div>
    );
}
