import { hashPassword } from "../lib/auth-utils";
import { prisma } from "../core/db";

async function reset() {
    const email = "admin@genesis.ai";
    const password = "Souverain2026!";
    const hashedPassword = hashPassword(password);

    console.log(`🔐 [AuthReset] Generating new hash for ${email}...`);

    try {
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log("✅ [AuthReset] Succès! Le mot de passe a été mis à jour.");
        process.exit(0);
    } catch (err: any) {
        console.error("❌ [AuthReset] Échec:", err.message);
        process.exit(1);
    }
}

reset();
