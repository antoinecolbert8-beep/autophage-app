/**
 * CDN & ASSET OPTIMIZATION UTILITY
 * Handles asset URLs, Cloudflare/Vercel CDN integration, 
 * and automatic image optimization.
 */

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export class AssetManager {

    /**
     * Get CDN URL for an asset
     */
    static getAssetUrl(path: string): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;

        // Ensure path starts with /
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;

        // In development, or if no CDN configured, use local URL
        if (!CDN_URL || process.env.NODE_ENV === 'development') {
            return `${APP_URL}${normalizedPath}`;
        }

        return `${CDN_URL}${normalizedPath}`;
    }

    /**
     * Get optimized image URL (Vercel/Next.js Image Optimization compatible)
     */
    static getOptimizedImageUrl(path: string, width: number = 800, quality: number = 75): string {
        const url = this.getAssetUrl(path);

        // Vercel Image Optimization pattern
        if (process.env.NODE_ENV === 'production') {
            return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
        }

        return url;
    }

    /**
     * Get platform logo (with fallback)
     */
    static getPlatformLogo(platform: string): string {
        const logos: Record<string, string> = {
            'LINKEDIN': '/assets/logos/linkedin.svg',
            'INSTAGRAM': '/assets/logos/instagram.svg',
            'FACEBOOK': '/assets/logos/facebook.svg',
            'X_PLATFORM': '/assets/logos/x.svg',
            'TWITTER': '/assets/logos/x.svg',
            'TIKTOK': '/assets/logos/tiktok.svg',
            'SNAPCHAT': '/assets/logos/snapchat.svg'
        };

        return logos[platform.toUpperCase()] || '/assets/logos/default.svg';
    }

    /**
     * Get feature illustration
     */
    static getFeatureIllustration(feature: string): string {
        return this.getOptimizedImageUrl(`/assets/illustrations/${feature}.png`);
    }
}
