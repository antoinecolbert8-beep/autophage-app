"use client";

import { useState, useEffect, useRef } from 'react';

type Log = {
    id: number;
    lvl: 'INFO' | 'WARN' | 'CRIT' | 'SUCC';
    msg: string;
    path: string;
    time: string;
};

export const OmniscienceTerminal = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initial fake logs
    useEffect(() => {
        const initialLogs: Log[] = [
            { id: 1, lvl: 'INFO', msg: 'System Boot Sequence Initiated', path: 'KERNEL', time: new Date().toISOString() },
            { id: 2, lvl: 'SUCC', msg: 'Fortress Shield: ACTIVE', path: 'SECURITY', time: new Date().toISOString() },
            { id: 3, lvl: 'INFO', msg: 'Omniscience Module: CONNECTED', path: 'OBSERVER', time: new Date().toISOString() },
        ];
        setLogs(initialLogs);

        // Simulate Real-time Activity
        const interval = setInterval(() => {
            const actions = [
                { lvl: 'INFO', msg: 'Incoming Request (IP: 192.168.1.X)', path: '/api/auth/session' },
                { lvl: 'SUCC', msg: 'Lead Enricher Agent finalized task', path: 'AGENT-007' },
                { lvl: 'WARN', msg: 'Rate Limit Threshold approached (80%)', path: 'API/GATEWAY' },
                { lvl: 'INFO', msg: 'Pulse check: Heartbeat signal received', path: 'CRON/SELF-PROMO' },
                { lvl: 'INFO', msg: 'User navigation', path: '/dashboard/settings' },
                { lvl: 'INFO', msg: 'LinkedIn Auto-Poster Triggered', path: 'GOD-MODE/AUTO' },
                { lvl: 'CRIT', msg: 'Anomalous attempt detected (SQLi attempt blocked)', path: 'WAF/SHIELD' },
                { lvl: 'INFO', msg: 'Neural Network Re-weighting: +0.42% accuracy', path: 'BRAIN/NEURO' },
                { lvl: 'SUCC', msg: 'Omni-channel Saturation phase delta: COMPLETED', path: 'OMNI/EXEC' },
            ];

            const randomAction = actions[Math.floor(Math.random() * actions.length)] as any;
            const newLog: Log = {
                id: Date.now(),
                lvl: randomAction.lvl,
                msg: randomAction.msg,
                path: randomAction.path,
                time: new Date().toLocaleTimeString()
            };

            setLogs(prev => [...prev.slice(-15), newLog]); // Keep last 15
        }, 800);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getColor = (lvl: string) => {
        switch (lvl) {
            case 'CRIT': return 'text-red-500 animate-pulse';
            case 'WARN': return 'text-yellow-500';
            case 'SUCC': return 'text-green-400';
            default: return 'text-blue-400';
        }
    };

    return (
        <div className="h-64 overflow-y-auto p-4 space-y-2 bg-black/90 scrollbar-hide">
            {logs.map((log) => (
                <div key={log.id} className="grid grid-cols-12 gap-2 opacity-90 hover:opacity-100 transition-opacity">
                    <span className="col-span-2 text-gray-600">[{log.time}]</span>
                    <span className={`col-span-1 ${getColor(log.lvl)} font-bold`}>{log.lvl}</span>
                    <span className="col-span-3 text-purple-400 truncate">{log.path}</span>
                    <span className="col-span-6 text-gray-300">{log.msg}</span>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
};
