import { headers } from 'next/headers';

interface AutomationResponse {
    success: boolean;
    message?: string;
    data?: any;
}

/**
 * Trigger an automation workflow via Make.com
 * @param action - The action identifier (e.g., "GENERATE_POST")
 * @param payload - The data required for the automation
 * @param userId - Optional user ID if available
 */
export async function triggerAutomation(
    action: string,
    payload: Record<string, any>,
    userId?: string
): Promise<AutomationResponse> {
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error("❌ MAKE_WEBHOOK_URL is not defined in environment variables");
        return {
            success: false,
            message: "Configuration error: Automation webhook not configured"
        };
    }

    try {
        const body = {
            action,
            timestamp: new Date().toISOString(),
            payload,
            userId: userId || "anonymous"
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Make.com webhook returned ${response.status} ${response.statusText}`);
        }

        // Attempt to parse response if JSON, otherwise return success
        let responseData = null;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        return {
            success: true,
            message: "Automation triggered successfully",
            data: responseData
        };

    } catch (error) {
        console.error(`❌ Automation Failed [${action}]:`, error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error occurred during automation trigger"
        };
    }
}
