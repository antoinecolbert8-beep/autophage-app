"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Navigation from "@/components/navigation";
import { RealTimeProvider } from '@/components/RealTimeProvider';
import { Toaster } from 'sonner';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (status === 'loading') return; // Wait for session to resolve

        if (status === 'authenticated' && session?.user) {
            setAuthorized(true);
            return;
        }

        // Not authenticated — redirect to login
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [session, status, router]);

    // Show spinner while loading
    if (status === 'loading' || !authorized) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center flex-col gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 text-sm font-mono">Vérification des accès...</p>
            </div>
        );
    }

    return (
        <RealTimeProvider>
            <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
                <Navigation />
                <main className="flex-1 w-full md:ml-64 pb-24 md:pb-0 h-full overflow-y-auto overflow-x-hidden scroll-smooth transition-all duration-300">
                    {children}
                </main>
            </div>
            <Toaster position="top-right" richColors theme="dark" />
        </RealTimeProvider>
    );
}
