import { fortress } from './fortress';

/**
 * 🛡️ PRIVACY SHIELD (RGPD Layer)
 * Handles encryption/decryption of PII (Personal Identifiable Information).
 */
export class PrivacyShield {

    /**
     * Encrypts sensitive data (Email, Phone, Names) before DB storage.
     */
    static async protect(data: string): Promise<string> {
        if (!data) return data;
        // Prefix with [ENCRYPTED] to allow easy detection/rotation
        const encrypted = await fortress.encrypt(data);
        return `ENC:${encrypted}`;
    }

    /**
     * Decrypts DB data for internal use.
     */
    static async reveal(payload: string): Promise<string> {
        if (!payload || !payload.startsWith('ENC:')) return payload;

        try {
            const encryptedData = payload.replace('ENC:', '');
            return await fortress.decrypt(encryptedData);
        } catch (error) {
            console.error("❌ PrivacyShield: Decryption failed. This might be raw data or corrupted.", error);
            return payload; // Fallback to raw if decryption fails (safeguard)
        }
    }

    /**
     * Anonymizes data for deletion requests.
     */
    static anonymize(text: string): string {
        if (!text) return text;
        return `ANON_${Math.random().toString(36).substring(2, 10)}`;
    }
}
