"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { LineIconShield } from "./AppIcons";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-8 text-center font-mono">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 animate-pulse">
                        <LineIconShield size={32} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-red-500">
                        SYSTEM FAILURE /// CRITICAL ERROR
                    </h1>
                    <p className="text-gray-400 mb-8 max-w-md">
                        Une anomalie a été détectée dans le noyau. Le rendu visuel a été interrompu pour protéger l'intégrité du système.
                    </p>
                    <div className="bg-black/50 border border-red-500/20 rounded-lg p-4 mb-8 text-left max-w-2xl w-full overflow-auto max-h-40">
                        <p className="text-red-400 text-xs">{this.state.error?.toString()}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
                    >
                        RELANCER LE SYSTÈME
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
