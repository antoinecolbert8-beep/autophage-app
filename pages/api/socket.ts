import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/next';

/**
 * SOCKET.IO SERVER INITIALIZER
 * Provides real-time communication for the dashboard
 */

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log('[Socket.io] Initializing server...');
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: '/api/socket',
            addTrailingSlash: false,
        });

        io.on('connection', (socket) => {
            console.log(`[Socket.io] Client connected: ${socket.id}`);

            // Room-based subscription (one room per organization)
            socket.on('subscribe', (orgId: string) => {
                socket.join(`org:${orgId}`);
                console.log(`[Socket.io] Socket ${socket.id} joined room org:${orgId}`);
            });

            // User-specific room
            socket.on('subscribe_user', (userId: string) => {
                socket.join(`user:${userId}`);
                console.log(`[Socket.io] Socket ${socket.id} joined room user:${userId}`);
            });

            socket.on('disconnect', () => {
                console.log(`[Socket.io] Client disconnected: ${socket.id}`);
            });
        });

        res.socket.server.io = io;
    } else {
        // console.log('[Socket.io] Server already initialized');
    }
    res.end();
};

export default ioHandler;
