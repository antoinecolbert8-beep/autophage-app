import dotenv from 'dotenv';
import readline from 'readline';
import { hashPassword } from '../lib/auth-utils';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function main() {
    console.log("\n🛡️  GENESIS ADMIN ELEVATION PROTOCOL 🛡️");
    console.log("=========================================\n");

    const email = process.argv[2] || await question("Enter the email of the user to elevate to GOD MODE (Admin): ");

    if (!email) {
        console.error("❌ Email is required.");
        process.exit(1);
    }

    console.log(`\n🔍 Searching for user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`❌ User not found in local database.`);
        console.log(`\nPossible causes:`);
        console.log(`1. User has not signed up in the app yet.`);
        console.log(`2. Database is empty.`);

        const create = await question("\nDo you want to FORCE CREATE this user locally? (y/n): ");

        if (create.toLowerCase() === 'y') {
            // Mock organization creation if needed
            // We need an organization text
            const org = await prisma.organization.create({
                data: {
                    name: "Admin Org",
                    domain: "admin.genesis.local",
                    tier: "enterprise"
                }
            });


            const password = await question("Enter the password for this ADMIN: ");
            if (!password) {
                console.error("❌ Password is required for new users.");
                process.exit(1);
            }
            const hashedPassword = hashPassword(password);

            const newUser = await prisma.user.create({
                data: {
                    email,
                    name: "Genesis Admin",
                    role: "admin",
                    password: hashedPassword,
                    currentPlan: "enterprise",
                    organizationId: org.id
                }
            });
            console.log(`\n✅ SUPER ADMIN CREATED: ${newUser.email}`);
        } else {
            console.log("Aborted.");
        }

    } else {
        // Elevate
        const updatePassword = await question("Do you want to update/set the password for this user? (y/n): ");
        let data: any = { role: 'admin', currentPlan: 'enterprise' };

        if (updatePassword.toLowerCase() === 'y') {
            const password = await question("Enter new password: ");
            if (password) {
                data.password = hashPassword(password);
            }
        }

        await prisma.user.update({
            where: { id: user.id },
            data,
        });
        console.log(`\n✅ SUCCESS: User ${email} is now an ADMIN (God Mode).`);
    }

    await prisma.$disconnect();
    rl.close();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
