/**
 * 🛒 SHOPIFY HUB — API Réelle
 * Connexion directe à l'API Admin Shopify REST.
 * Configure ta boutique sur /dashboard/integrations
 */

import { db as prisma } from "@/core/db";

export interface ShopifyProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    handle: string;
    imageUrl: string;
}

export interface ShopifyOrder {
    id: string;
    totalPrice: number;
    currency: string;
    lineItems: { title: string; quantity: number }[];
    createdAt: string;
}

// ─── Credentials Resolution ───────────────────────────────────────────────────

async function getShopifyCredentials(organizationId?: string): Promise<{ shopDomain: string; accessToken: string } | null> {
    // 1. Try DB integration first (per-org)
    if (organizationId) {
        try {
            const integration = await prisma.integration.findFirst({
                where: { organizationId, provider: 'SHOPIFY', status: 'active' }
            });
            if (integration) {
                const creds = JSON.parse(integration.credentials);
                if (creds.shopDomain && creds.accessToken) {
                    return { shopDomain: creds.shopDomain, accessToken: creds.accessToken };
                }
            }
        } catch (e) {
            console.error('[SHOPIFY] DB credential parse error:', e);
        }
    }

    // 2. Fallback to ENV variables
    const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    if (shopDomain && accessToken) {
        return { shopDomain, accessToken };
    }

    return null;
}

// ─── Core Shopify API Call ────────────────────────────────────────────────────

async function shopifyFetch<T>(
    endpoint: string,
    creds: { shopDomain: string; accessToken: string }
): Promise<T | null> {
    const url = `https://${creds.shopDomain}/admin/api/2024-01${endpoint}`;
    try {
        const res = await fetch(url, {
            headers: {
                'X-Shopify-Access-Token': creds.accessToken,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });
        if (!res.ok) {
            console.error(`[SHOPIFY] API error ${res.status}: ${await res.text()}`);
            return null;
        }
        return res.json() as Promise<T>;
    } catch (e) {
        console.error('[SHOPIFY] Network error:', e);
        return null;
    }
}

// ─── ShopifyAutomation Class ──────────────────────────────────────────────────

export class ShopifyAutomation {

    /**
     * Fetch real products from Shopify Admin API
     */
    static async syncProducts(organizationId: string): Promise<ShopifyProduct[]> {
        console.log(`[SHOPIFY] Syncing real products for org: ${organizationId}`);

        const creds = await getShopifyCredentials(organizationId);
        if (!creds) {
            console.warn('[SHOPIFY] ⚠️ No credentials found. Configure on /dashboard/integrations');
            return [];
        }

        const data = await shopifyFetch<{ products: any[] }>('/products.json?limit=10&fields=id,title,body_html,variants,images,handle', creds);
        if (!data?.products) return [];

        return data.products.map((p) => ({
            id: String(p.id),
            title: p.title,
            description: p.body_html?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
            price: parseFloat(p.variants?.[0]?.price || '0'),
            currency: 'EUR',
            handle: p.handle,
            imageUrl: p.images?.[0]?.src || '/assets/feat_productivity.png',
        }));
    }

    /**
     * Get the best-selling product (first product by Shopify default sort = best-selling)
     */
    static async getBestseller(organizationId: string): Promise<ShopifyProduct | null> {
        const products = await this.syncProducts(organizationId);
        return products[0] || null;
    }

    /**
     * Fetch recent orders from Shopify
     */
    static async getRecentOrders(organizationId: string, sinceMinutes = 60): Promise<ShopifyOrder[]> {
        console.log(`[SHOPIFY] Fetching recent orders (last ${sinceMinutes}min)`);

        const creds = await getShopifyCredentials(organizationId);
        if (!creds) {
            console.warn('[SHOPIFY] ⚠️ No credentials found for orders. Configure on /dashboard/integrations');
            return [];
        }

        const since = new Date(Date.now() - sinceMinutes * 60 * 1000).toISOString();
        const data = await shopifyFetch<{ orders: any[] }>(
            `/orders.json?status=any&created_at_min=${since}&limit=5&fields=id,total_price,currency,line_items,created_at`,
            creds
        );

        if (!data?.orders) return [];

        return data.orders.map((o) => ({
            id: String(o.id),
            totalPrice: parseFloat(o.total_price || '0'),
            currency: o.currency || 'EUR',
            lineItems: (o.line_items || []).map((li: any) => ({
                title: li.title,
                quantity: li.quantity,
            })),
            createdAt: o.created_at,
        }));
    }

    /**
     * Generate a promo code for a product
     */
    static async generatePromoCampaign(productId: string): Promise<{ code: string; discount: string }> {
        const uniqueSuffix = Date.now().toString(36).toUpperCase();
        return {
            code: `ELA_${uniqueSuffix}`,
            discount: "15%"
        };
    }
}
