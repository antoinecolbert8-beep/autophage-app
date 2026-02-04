'use client';

import { useEffect } from 'react';

interface ConversionPixelProps {
    event: 'purchase' | 'signup' | 'upgrade' | 'referral';
    value?: number;
    email?: string;
    source?: string;
    metadata?: string;
}

export function ConversionPixel({ event, value = 0, email, source, metadata }: ConversionPixelProps) {
    useEffect(() => {
        // Build tracking URL
        const params = new URLSearchParams();
        params.set('event', event);
        if (value) params.set('value', value.toString());
        if (email) params.set('email', email);
        if (source) params.set('source', source);
        if (metadata) params.set('metadata', metadata);

        const pixelUrl = `/api/track/conversion?${params.toString()}`;

        // Create invisible pixel
        const img = new Image();
        img.src = pixelUrl;
        img.style.display = 'none';
        document.body.appendChild(img);

        console.log(`[ConversionPixel] Tracked: ${event} - ${value}€`);

        // Cleanup
        return () => {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        };
    }, [event, value, email, source, metadata]);

    return null; // Invisible component
}
