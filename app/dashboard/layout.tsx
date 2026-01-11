"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // SECURITY CHECK: Has the user paid?
        // In a real app, this would check a JWT claim or server-side session.
        // For this demonstration/prototype, we use the local flag set by the Payment Page.
        const hasPaid = localStorage.getItem('genesis_paid') === 'true';

        if (!hasPaid) {
            // BYPASS: Allow Localhost / Dev to proceed without payment
            // UNLESS: Simulation Mode is active (to test client flow)
            const isSimulation = localStorage.getItem('genesis_simulate_external') === 'true';

            if (!isSimulation && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                setAuthorized(true);
                // Auto-inject God Mode for dev experience
                localStorage.setItem('genesis_paid', 'true');
                localStorage.setItem('genesis_tier', 'grand_horloger');
                return;
            }

            // Redirect to payment if trying to access dashboard without paying
            router.push('/signup?plan=starter'); // Force them through the funnel
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
