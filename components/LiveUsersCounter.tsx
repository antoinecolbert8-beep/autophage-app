'use client';

import { useEffect, useState } from 'react';
import { useRealTime } from './RealTimeProvider';
import { Users } from 'lucide-react';

/**
 * LIVE USERS COUNTER
 * Shows the number of active users on the platform in real-time
 */
export function LiveUsersCounter() {
    const { socket, isConnected } = useRealTime();
    const [count, setCount] = useState(1);

    useEffect(() => {
        if (!socket) return;

        // Listen for global user count updates
        socket.on('active_users_update', (newCount: number) => {
            setCount(newCount);
        });

        return () => {
            socket.off('active_users_update');
        };
    }, [socket]);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium animate-pulse">
            <Users className="w-3.5 h-3.5" />
            <span>{count} LIVE</span>
            {!isConnected && <span className="text-red-500 ml-1">●</span>}
        </div>
    );
}
