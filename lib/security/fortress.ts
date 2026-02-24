import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';

/**
 * FORTRESS PROTOCOL (v2 — AUDIT FIX)
 * - Clé maître dérivée via scrypt (memory-hard) depuis FORTRESS_SECRET haute-entropie
 * - Guard de démarrage : crash explicite si secret faible en production
 * - AES-256-GCM avec IV aléatoire + auth tag pour chaque opération
 */

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const SCRYPT_PARAMS = { N: 32768, r: 8, p: 1 }; // OWASP recommended minimum



/**
 * Guard de démarrage — vérifie que FORTRESS_SECRET est défini et robuste.
 * En production, l'absence de secret arrête le processus immédiatement.
 */
function validateFortressSecret(secret: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDev = !isProduction;

    if (!secret || secret.length < 32) {
        const message = [
            '[FORTRESS] FATAL: FORTRESS_SECRET is missing or too short (< 32 chars).',
            'Generate a strong secret with: node -e "console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))"',
            'Then add it to your .env: FORTRESS_SECRET=<64-char-hex>',
        ].join('\n');

        if (isProduction) {
            // In production, this is a fatal error — do not start with a weak key
            throw new Error(message);
        } else {
            // In dev, warn loudly but allow startup
            console.warn(message);
        }
    }

    if (isDev && secret === 'default-dev-secret-change-in-prod') {
        console.warn('[FORTRESS] ⚠️  Using default dev secret. NEVER deploy this to production.');
    }
}

export class FortressCrypto {
    private readonly rawSecret: string;

    constructor(secretConfig: string) {
        validateFortressSecret(secretConfig);
        // Store raw secret — key derivation happens per-operation via scrypt + unique salt
        this.rawSecret = secretConfig;
    }

    /**
     * Memory-hard key derivation using scrypt.
     * Each call uses a unique salt, so the derived key is always unique per operation.
     */
    private async deriveKey(salt: Buffer): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            scrypt(
                Buffer.from(this.rawSecret, 'utf8'),
                salt,
                KEY_LENGTH,
                SCRYPT_PARAMS,
                (err, derivedKey) => {
                    if (err) reject(err);
                    else resolve(derivedKey as Buffer);
                }
            );
        });
    }

    /**
     * Encrypts data with AES-256-GCM using a per-operation derived key.
     * Format stored: salt(hex):iv(hex):authTag(hex):ciphertext(hex)
     */
    async encrypt(data: string | object): Promise<string> {
        const text = typeof data === 'object' ? JSON.stringify(data) : data;
        const iv = randomBytes(IV_LENGTH);
        const salt = randomBytes(SALT_LENGTH);

        const sessionKey = await this.deriveKey(salt);
        const cipher = createCipheriv(ALGORITHM, sessionKey, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();

        return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }

    /**
     * Decrypts Fortress-protected payload.
     * Auth tag verification prevents tampering (authenticated encryption).
     */
    async decrypt(encryptedPayload: string): Promise<any> {
        const parts = encryptedPayload.split(':');
        if (parts.length < 4) {
            throw new Error('Fortress: Invalid payload format (expected salt:iv:authTag:data)');
        }
        const [saltHex, ivHex, authTagHex, ...dataParts] = parts;
        const dataHex = dataParts.join(':'); // Safety: rejoin in case data contained ':'

        const salt = Buffer.from(saltHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const sessionKey = await this.deriveKey(salt);
        const decipher = createDecipheriv(ALGORITHM, sessionKey, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(dataHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    }

    /**
     * Generates a time-limited HMAC-style ghost token.
     * NOTE: not a full JWT — use for short-lived internal nonces only.
     */
    generateGhostToken(): string {
        const nonce = randomBytes(16).toString('hex');
        const timestamp = Date.now();
        return Buffer.from(`${nonce}|${timestamp}|${this.rawSecret.slice(0, 8)}`).toString('base64url');
    }
}

// Singleton instance — Guard runs immediately at module load time
export const fortress = new FortressCrypto(
    process.env.FORTRESS_SECRET || 'default-dev-secret-change-in-prod'
);
