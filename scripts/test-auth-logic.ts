import { authOptions } from '../lib/auth-config';
import { db as prisma } from '../core/db';
import { verifyPassword } from '../lib/auth-utils';

async function testAuth() {
    const email = 'admin@genesis.ai';
    const password = 'Genesis2025!';

    console.log('--- Testing Auth for:', email, '---');

    const user = await prisma.user.findUnique({
        where: { email }
    }) as any;

    if (!user) {
        console.error('❌ User not found in DB');
        return;
    }

    console.log('✅ User found in DB. ID:', user.id);
    console.log('Stored hashed password:', user.password);

    if (!user.password) {
        console.error('❌ User has NO password set!');
        return;
    }

    const isValid = verifyPassword(password, user.password);
    console.log('Password verification result:', isValid ? '✅ VALID' : '❌ INVALID');

    // Verify what auth-config would return
    // @ts-ignore
    const authorize = authOptions.providers.find(p => p.id === 'credentials')?.authorize;
    if (authorize) {
        const result = await authorize({ email, password }, {} as any);
        console.log('Authorize result:', result ? '✅ SUCCESS' : '❌ FAILED');
    }
}

testAuth();
