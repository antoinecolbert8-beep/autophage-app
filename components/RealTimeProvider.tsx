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
        if (!session?.user?.id) return;

        // Initialize socket
        const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || '', {
            path: '/api/socket',
            addTrailingSlash: false,
        });

        socketInstance.on('connect', () => {
            console.log('[Socket] Connected');
            setIsConnected(true);

            // Subscribe to organization and user rooms
            // In a real app, orgId should be in the session
            const orgId = (session.user as any).organizationId;
            if (orgId) {
                socketInstance.emit('subscribe', orgId);
            }
            socketInstance.emit('subscribe_user', session.user.id);
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
