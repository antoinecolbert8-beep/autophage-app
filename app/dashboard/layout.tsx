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
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // On localhost — always allow, no session needed (dev mode)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setAuthorized(true);
            setChecked(true);
            return;
        }

        if (status === 'loading') return;

        if (status === 'authenticated' && session?.user) {
            setAuthorized(true);
            setChecked(true);
            return;
        }

        if (status === 'unauthenticated') {
            setChecked(true);
            router.push('/login');
        }
    }, [session, status, router]);

    // Show spinner only during initial check (very brief on localhost)
    if (!checked) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center flex-col gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 text-sm font-mono">Initialisation...</p>
            </div>
        );
    }

    if (!authorized) {
        return null;
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
