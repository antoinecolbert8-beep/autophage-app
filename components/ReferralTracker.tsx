"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!searchParams) return;

        const ref = searchParams.get("ref");
        if (ref) {
            console.log(`[REFERRAL] 🎯 Code detected in URL: ${ref}`);

            // Store in localStorage for immediate reference during signup
            localStorage.setItem("ela_referral_source", ref);

            // Store in a cookie for persistence (mocking 90 days)
            // In a real app, use a library like js-cookie
            const expires = new Date();
            expires.setDate(expires.getDate() + 90);
            document.cookie = `ela_ref=${ref}; expires=${expires.toUTCString()}; path=/`;
        }
    }, [searchParams]);

    return null; // Silent component
}
