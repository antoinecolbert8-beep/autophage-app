import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.alloc(32, process.env.LEDGER_SECRET_KEY || 'ela-sovereign-pulse-legacy-key-32');
const IV_LENGTH = 16;

/**
 * 📜 LEGACY LEDGER (Sovereign Archiving)
 * Chiffre et archive les événements critiques pour immuabilité et audit.
 */
export class LegacyLedger {
    /**
     * Archive un événement avec chiffrement AES-256
     */
    static async archiveEvent(payload: any) {
        try {
            const text = JSON.stringify(payload);
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            const archive = {
                data: encrypted.toString('hex'),
                iv: iv.toString('hex'),
                hash: crypto.createHash('sha256').update(text).digest('hex'),
                timestamp: new Date().toISOString()
            };

            // En production, on écrirait dans une table 'LegacyArchive' ou un bucket S3
            console.log(`📜 [Ledger] Event archived with SHA-256: ${archive.hash.substring(0, 10)}...`);

            return archive;
        } catch (error) {
            console.error("❌ [Ledger] Archiving failure:", error);
            throw error;
        }
    }

    /**
     * Déchiffre une archive (pour audit)
     */
    static decryptEvent(archive: { data: string, iv: string }) {
        const iv = Buffer.from(archive.iv, 'hex');
        const encryptedText = Buffer.from(archive.data, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return JSON.parse(decrypted.toString());
    }
}
