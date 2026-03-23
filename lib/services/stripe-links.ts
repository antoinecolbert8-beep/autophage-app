import { PLANS } from '../stripe-pricing';

/**
 * 💰 STRIPE LINK GENERATOR
 * Returns conversion-optimized payment links from pre-configured ELA plans
 */
export async function createEnterpriseCheckoutLink(leadId: string, organizationId: string) {
    console.log(`🔗 [StripeLinks] Fetching static payment link for Organization: ${organizationId}`);
    
    // We use the EMPIRE (Enterprise) link by default for top-tier closing
    // This bypasses the need for a working sk_live for dynamic session creation
    const link = "https://buy.stripe.com/fZu7sL6gZfkj4uxfYp8";
    
    return `${link}?client_reference_id=${leadId}`;
}
