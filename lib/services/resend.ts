import { Resend } from 'resend';
import { PrivacyShield } from '../security/privacy';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 📧 Resend Native Integration
 * Enables REAL email sending using the RESEND_API_KEY from .env
 */
export async function sendRealEmail(to: string, subject: string, htmlContent: string) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey.startsWith("re_placeholder")) {
        console.warn("⚠️ Resend API Key missing or placeholder. Falling back to simulation.");
        return false;
    }

    try {
        const revealedEmail = await PrivacyShield.reveal(to);
        const { data, error } = await resend.emails.send({
            from: 'ELA <ela.revolution.ia@gmail.com>', 
            to: [revealedEmail],
            reply_to: 'ela.revolution.ia@gmail.com',
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            console.error("❌ Resend Error:", error);
            return false;
        }

        console.log(`✅ [REAL WORK] Email sent to ${to} via Resend. ID: ${data?.id}`);
        return true;
    } catch (error: any) {
        console.error("❌ Resend Fatal Error:", error.message);
    }
    return false;
}
