import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Hash a password using scrypt
 */
export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64, { N: 1024, r: 8, p: 1, maxmem: 32 * 1024 * 1024 });
    return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
    const [salt, key] = hash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = scryptSync(password, salt, 64, { N: 1024, r: 8, p: 1, maxmem: 32 * 1024 * 1024 });
    return timingSafeEqual(keyBuffer, derivedKey);
}
