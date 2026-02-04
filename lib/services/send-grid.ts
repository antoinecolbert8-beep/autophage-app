
import axios from 'axios';

/**
 * 📧 SendGrid Native Integration
 * Enables REAL email sending without Make.com dependency.
 */
export async function sendRealEmail(to: string, subject: string, htmlContent: string) {
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey || apiKey.includes("SG...")) {
        console.warn("⚠️ SendGrid API Key missing or placeholder. Falling back to simulation.");
        return false;
    }

    try {
        const response = await axios.post('https://api.sendgrid.com/v3/mail/send', {
            personalizations: [{
                to: [{ email: to }]
            }],
            from: { email: "contact@autophage.app", name: "Autophage System" }, // Update with verified sender
            subject: subject,
            content: [{
                type: "text/html",
                value: htmlContent
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 202) {
            console.log(`✅ [REAL WORK] Email sent to ${to} via SendGrid.`);
            return true;
        }
    } catch (error: any) {
        console.error("❌ SendGrid Error:", error.response?.data || error.message);
    }
    return false;
}
