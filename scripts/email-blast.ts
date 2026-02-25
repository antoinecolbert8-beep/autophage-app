import { db as prisma } from '../core/db';
import { sendRealEmail } from '../lib/services/send-grid';

async function emailBlastProtocol() {
    console.log("📧 ACTIVATING EMAIL BLAST PROTOCOL...");

    const users = await prisma.user.findMany({
        select: { email: true, name: true }
    });

    if (users.length === 0) {
        console.warn("⚠️ No users found in database to alert.");
        return;
    }

    console.log(`📣 Found ${users.length} users. Preparing transmission...`);

    const subject = "⚠️ ALERTE : Ouverture de l'Infrastructure ELA (Presse & Partenaires)";

    for (const user of users) {
        const html = `
            <div style="font-family: sans-serif; background: #0b0c10; color: #c5c6c7; padding: 40px; border-radius: 20px;">
                <h1 style="color: #66fcf1; text-transform: uppercase; letter-spacing: 2px;">Protocole d'Ouverture Activé</h1>
                <p>Bonjour ${user.name || 'Agent'},</p>
                <p>L'infrastructure <strong>ELA</strong> franchit une étape majeure aujourd'hui.</p>
                <div style="background: rgba(102, 252, 241, 0.1); padding: 20px; border-left: 4px solid #66fcf1; margin: 20px 0;">
                    <p><strong>🚨 Nouveautés :</strong></p>
                    <ul>
                        <li><strong>Espace Presse :</strong> Ressources officielles et Kit Média v10.4 disponibles.</li>
                        <li><strong>Programme Partenaire :</strong> 30% de commission récurrente à vie sur chaque parrainage.</li>
                    </ul>
                </div>
                <p>Rejoignez la manufacture et commencez à bâtir votre empire de revenus dès maintenant.</p>
                <a href="https://ela-revolution.com/partners" style="display: inline-block; background: #66fcf1; color: #0b0c10; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 10px; text-transform: uppercase;">Accéder au Programme</a>
                <p style="margin-top: 40px; font-size: 10px; opacity: 0.5;">© 2026 ELA CORP // SOUVERAINE PRÉCISION</p>
            </div>
        `;

        const sent = await sendRealEmail(user.email, subject, html);
        if (sent) {
            console.log(`✅ Alert sent to ${user.email}`);
        } else {
            console.warn(`❌ Failed to send to ${user.email} (Simulation fallback)`);
        }
    }

    console.log("🏆 EMAIL BLAST COMPLETE.");
}

emailBlastProtocol().catch(err => {
    console.error("💥 Blast Crashed:", err);
    process.exit(1);
});
