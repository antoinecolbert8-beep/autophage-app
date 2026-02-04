'use client';

import { useEffect, useState } from 'react';
import { useRealTime } from './RealTimeProvider';
import { Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricUpdate {
    id: string;
    type: 'lead' | 'post' | 'revenue';
    label: string;
    value: string | number;
    timestamp: Date;
}

/**
 * REAL-TIME ACTIVITY FEED
 * Displays live updates of leads, posts, and revenue
 */
export function RealTimeActivityFeed() {
    const { socket } = useRealTime();
    const [activities, setActivities] = useState<MetricUpdate[]>([]);

    useEffect(() => {
        if (!socket) return;

        const handleNewLead = (lead: any) => {
            const update: MetricUpdate = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'lead',
                label: 'Nouveau Lead',
                value: lead.name || lead.email,
                timestamp: new Date()
            };
            setActivities(prev => [update, ...prev].slice(0, 5));
        };

        const handleRevenue = (data: any) => {
            const update: MetricUpdate = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'revenue',
                label: 'Vente',
                value: `+${data.amount}€`,
                timestamp: new Date()
            };
            setActivities(prev => [update, ...prev].slice(0, 5));
        };

        socket.on('new_lead', handleNewLead);
        socket.on('revenue_update', handleRevenue);

        return () => {
            socket.off('new_lead', handleNewLead);
            socket.off('revenue_update', handleRevenue);
        };
    }, [socket]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Activité Live</h3>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="space-y-2">
                <AnimatePresence initial={false}>
                    {activities.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">En attente d'activité...</p>
                    ) : (
                        activities.map((activity) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${activity.type === 'revenue' ? 'bg-green-500/20 text-green-400' :
                                            activity.type === 'lead' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-400">{activity.label}</p>
                                        <p className="text-sm font-bold">{activity.value}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500">
                                    {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
