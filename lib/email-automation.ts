/**
 * 📧 EMAIL SEQUENCES - Séquences de Conversion Elite
 * Séquences automatiques pour convertir les prospects en clients payants
 * Via MAKE.com (triggerAutomation) ou Resend direct si configuré
 */

import { triggerAutomation } from "./automations";

// ─── Types ────────────────────────────────────────
export type EmailSequenceType =
    | 'WELCOME'          // Bienvenue après inscription
    | 'ONBOARDING_DAY1'  // J+1 : Activation
    | 'ONBOARDING_DAY3'  // J+3 : Valeur ajoutée
    | 'UPGRADE_NUDGE'    // Upsell vers plan supérieur
    | 'REACTIVATION'     // Inactif > 7 jours
    | 'PAYMENT_FAILED'   // Paiement échoué
    | 'TRIAL_END';       // Fin de période d'essai

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ela-revolution.com';

// ─── Templates Email ──────────────────────────────
const TEMPLATES: Record<EmailSequenceType, (data: Record<string, string>) => { subject: string; html: string }> = {

    WELCOME: (d) => ({
        subject: `⚡ Bienvenue dans l'Empire, ${d.name || 'Souverain'} — Votre cerveau IA est prêt`,
        html: `
<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
  <h1 style="color: #f5c518; font-size: 28px; margin-bottom: 8px;">⚡ L'Empire répond.</h1>
  <p style="color: #aaa; font-size: 14px;">Compte activé le ${new Date().toLocaleDateString('fr-FR')}</p>
  
  <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
    ${d.name || 'Souverain'},<br><br>
    Pendant que vous lisez cet email, <strong>des entrepreneurs manuels perdent 3h</strong> sur des tâches qu'ELA gère en 90 secondes.
  </p>
  
  <div style="background: #1a1a1a; border-left: 3px solid #f5c518; padding: 16px; margin: 24px 0; border-radius: 4px;">
    <p style="margin: 0; font-size: 14px; color: #f5c518;"><strong>🎯 Votre première mission :</strong></p>
    <p style="margin: 8px 0 0; font-size: 14px;">Générez votre 1er post viral LinkedIn automatisé en 60 secondes.</p>
  </div>
  
  <a href="${APP_URL}/dashboard" style="display: inline-block; background: #f5c518; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin-top: 16px;">
    🚀 Activer Mon Empire →
  </a>
  
  <p style="margin-top: 32px; font-size: 13px; color: #666;">
    P.S. — Chaque heure sans ELA = 150€ de productivité perdue. L'Empire n'attend pas.
  </p>
</div>`
    }),

    ONBOARDING_DAY1: (d) => ({
        subject: `📊 ${d.name || 'Souverain'}, voici ce que votre IA a déjà analysé pour vous`,
        html: `
<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
  <h1 style="color: #f5c518; font-size: 24px;">24h après votre activation</h1>
  
  <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
    Voici ce qu'ELA a préparé pour vous pendant que vous dormiez :
  </p>
  
  <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; color: #f5c518;">✅ <strong>Analyse de votre marché</strong> — Complète</p>
    <p style="margin: 8px 0 0; color: #aaa; font-size: 13px;">3 opportunités détectées dans votre secteur</p>
    <br>
    <p style="margin: 0; color: #f5c518;">✅ <strong>5 posts LinkedIn</strong> — Prêts à publier</p>
    <p style="margin: 8px 0 0; color: #aaa; font-size: 13px;">Optimisés pour l'algorithme (heure de pointe : 8h30)</p>
    <br>
    <p style="margin: 0; color: #f5c518;">✅ <strong>Pipeline de leads</strong> — 12 contacts identifiés</p>
    <p style="margin: 8px 0 0; color: #aaa; font-size: 13px;">Décideurs dans votre secteur, prêts pour l'engagement</p>
  </div>
  
  <a href="${APP_URL}/dashboard" style="display: inline-block; background: #f5c518; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
    Voir Mon Tableau de Bord →
  </a>
</div>`
    }),

    ONBOARDING_DAY3: (d) => ({
        subject: `💰 La méthode qu'utilisent les 1% pour automatiser à 100% — PDF offert`,
        html: `
<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
  <h1 style="color: #f5c518; font-size: 24px;">Le secret des fondateurs à 7 chiffres</h1>
  
  <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
    ${d.name || 'Souverain'},<br><br>
    Les fondateurs qui génèrent 7 chiffres ne travaillent pas plus. <br>
    <strong>Ils délèguent à des systèmes, pas à des humains.</strong>
  </p>
  
  <p style="font-size: 16px; line-height: 1.6;">
    ELA est ce système. Voici ce que nos clients Empire réalisent en 30 jours :
  </p>
  
  <ul style="color: #f5c518; font-size: 15px; line-height: 2;">
    <li>+340% de reach LinkedIn sans effort manuel</li>
    <li>12 prospects qualifiés/semaine générés automatiquement</li>
    <li>4h/jour récupérées sur les tâches administratives</li>
    <li>3,2x ROI moyen sur l'abonnement en 60 jours</li>
  </ul>
  
  <a href="${APP_URL}/dashboard" style="display: inline-block; background: #f5c518; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin-top: 16px;">
    ⚡ Activer la Pleine Puissance →
  </a>
</div>`
    }),

    UPGRADE_NUDGE: (d) => ({
        subject: `🔓 ${d.name || 'Vous'} avez atteint 80% de vos crédits — Passez au niveau supérieur`,
        html: `
<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
  <h1 style="color: #f5c518; font-size: 24px;">⚠️ Votre Empire est limité</h1>
  
  <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
    Votre current plan approche de ses limites. Chaque crédit épuisé = 
    <strong>une opportunité de croissance manquée.</strong>
  </p>
  
  <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="color: #f5c518; margin: 0;"><strong>Passez au Plan ${d.nextPlan || 'Pro'}</strong></p>
    <p style="color: #aaa; font-size: 14px; margin: 8px 0 0;">
      ${d.nextCredits || '5000'} crédits · ${d.nextPlanPrice || '197'}€/mois · Accès complet
    </p>
  </div>
  
  <a href="${APP_URL}/pricing?upgrade=true" style="display: inline-block; background: #f5c518; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
    Débloquer Mon Empire Complet →
  </a>
</div>`
    }),

    REACTIVATION: (d) => ({
        subject: `⏰ ${d.name || 'Souverain'}, votre Empire vous attend — Reprendre la domination`,
        html: `
<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
  <h1 style="color: #f5c518; font-size: 24px;">Pendant votre absence...</h1>
  
  <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
    Vos concurrents ont publié <strong>47 posts</strong> sur LinkedIn. <br>
    Vos prospects ont reçu <strong>8 messages de vos compétiteurs</strong>. <br><br>
    <strong>L'Empire ne dort jamais. Mais sans vous, il est en pause.</strong>
  </p>
  
  <a href="${APP_URL}/dashboard" style="display: inline-block; background: #f5c518; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin-top: 16px;">
    🔥 Reprendre la Domination →
  </a>
</div>`
    }),

    PAYMENT_FAILED: (d) => ({
        subject: `⚠️ Action requise : Mettez à jour votre paiement pour garder votre Empire`,
        html: `
<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
  <h1 style="color: #ef4444; font-size: 24px;">⚠️ Paiement échoué</h1>
  <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
    Nous n'avons pas pu traiter votre paiement. Pour éviter l'interruption de service, mettez à jour vos informations de paiement maintenant.
  </p>
  <a href="${APP_URL}/billing" style="display: inline-block; background: #ef4444; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin-top: 16px;">
    Mettre à Jour Mon Paiement →
  </a>
</div>`
    }),

    TRIAL_END: (d) => ({
        subject: `⏳ ${d.name || 'Votre'} accès ELA se termine dans 24h — Sécurisez votre Empire`,
        html: `
<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 40px; border-radius: 12px;">
  <h1 style="color: #f5c518; font-size: 24px;">⏳ 24h avant la fin</h1>
  <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
    Dans 24h, votre accès ELA sera limité. <br>Tout ce que vous avez construit s'endort — sauf si vous agissez maintenant.
  </p>
  <a href="${APP_URL}/pricing" style="display: inline-block; background: #f5c518; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin-top: 16px;">
    Garder Mon Empire Actif →
  </a>
</div>`
    }),
};

// ─── Fonctions d'Envoi ────────────────────────────
export async function sendEmail(email: string, subject: string, html: string): Promise<boolean> {
    const result = await triggerAutomation("SEND_EMAIL", {
        email,
        subject,
        html,
        text: html.replace(/<[^>]*>/g, ''), // Version texte strip HTML
        date: new Date().toISOString()
    });

    if (result.success) {
        console.log(`✅ [EMAIL] Envoi réussi → ${email} | Sujet: ${subject.substring(0, 40)}...`);
        return true;
    } else {
        console.error(`⚠️ [EMAIL] Échec Make → ${result.message}`);
        return false;
    }
}

export async function sendSequenceEmail(
    type: EmailSequenceType,
    email: string,
    data: Record<string, string> = {}
): Promise<boolean> {
    const template = TEMPLATES[type](data);
    return sendEmail(email, template.subject, template.html);
}

// ─── Séquence Complète J0 → J3 ──────────────────
export async function triggerOnboardingSequence(email: string, name: string) {
    console.log(`[EMAIL SEQUENCE] Démarrage onboarding pour ${email}`);

    // J0 - Bienvenue immédiat
    await sendSequenceEmail('WELCOME', email, { name });

    // J1 - Rappel (délégué à MAKE pour le timing)
    await triggerAutomation("SCHEDULE_EMAIL", {
        email,
        name,
        type: 'ONBOARDING_DAY1',
        delay_hours: '24'
    });

    // J3 - Valeur + Social Proof
    await triggerAutomation("SCHEDULE_EMAIL", {
        email,
        name,
        type: 'ONBOARDING_DAY3',
        delay_hours: '72'
    });

    console.log(`✅ [EMAIL SEQUENCE] Séquence onboarding programmée pour ${email}`);
}

export default { sendEmail, sendSequenceEmail, triggerOnboardingSequence };
