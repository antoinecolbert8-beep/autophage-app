'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface RealTimeContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const RealTimeContext = createContext<RealTimeContextType>({
    socket: null,
    isConnected: false,
});

export const useRealTime = () => useContext(RealTimeContext);

export const RealTimeProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!(session?.user as any)?.id) return;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
        if (!appUrl) {
            console.warn('[RealTime] NEXT_PUBLIC_APP_URL missing. Socket skipped.');
            return;
        }

        // Initialize socket
        const socketInstance = io(appUrl, {
            path: '/api/socket',
            addTrailingSlash: false,
            timeout: 5000, // Fail-fast if server is unreachable
        });

        socketInstance.on('connect', () => {
            console.log('[Socket] Connected');
            setIsConnected(true);

            // Subscribe to organization and user rooms
            // In a real app, orgId should be in the session
            const user = session?.user as any;
            const orgId = user?.organizationId;
            if (orgId) {
                socketInstance.emit('subscribe', orgId);
            }
            if (user?.id) {
                socketInstance.emit('subscribe_user', user.id);
            }
        });

        socketInstance.on('disconnect', () => {
            console.log('[Socket] Disconnected');
            setIsConnected(false);
        });

        // Global event listeners
        socketInstance.on('new_lead', (lead: any) => {
            toast.success(`Nouveau lead: ${lead.name || lead.email}`, {
                description: `Score: ${lead.score}/100 - ${lead.company || ''}`,
            });
        });

        socketInstance.on('revenue_update', (data: any) => {
            toast.success(`Revenu reçu: +${data.amount}€`, {
                description: `Client: ${data.customerName}`,
            });
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [session]);

    return (
        <RealTimeContext.Provider value={{ socket, isConnected }}>
            {children}
        </RealTimeContext.Provider>
    );
};
