import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * WHATSAPP NOTIFICATIONS
 * Notifications en temps réel pour chaque action du système
 */

export interface NotificationPayload {
    type: 'post_published' | 'lead_scored' | 'meeting_transcribed' | 'proposal_sent' | 'revenue_received' | 'alert';
    title: string;
    message: string;
    data?: Record<string, any>;
    priority: 'high' | 'medium' | 'low';
}

export class WhatsAppNotifier {

    private static adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || '';

    /**
     * Envoyer une notification WhatsApp
     */
    static async send(payload: NotificationPayload): Promise<void> {
        if (!this.adminPhone) {
            console.warn('[WhatsApp] Admin phone number not configured');
            return;
        }

        const message = this.formatMessage(payload);

        try {
            if (client) {
                await client.messages.create({
                    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                    to: `whatsapp:${this.adminPhone}`,
                    body: message
                });

                console.log(`[WhatsApp] ✅ Notification sent: ${payload.type}`);
            } else {
                console.log(`[WhatsApp] SIMULATED notification:\n${message}`);
            }
        } catch (error) {
            console.error('[WhatsApp] Failed to send notification:', error);
        }
    }

    /**
     * Notification: Nouveau post publié
     */
    static async notifyPostPublished(params: {
        platform: string;
        content: string;
        url?: string;
        metrics?: { likes?: number; comments?: number; shares?: number };
    }): Promise<void> {
        const { platform, content, url, metrics } = params;

        const preview = content.substring(0, 100) + (content.length > 100 ? '...' : '');

        let metricsText = '';
        if (metrics) {
            metricsText = `\n📊 Métriques: ${metrics.likes || 0} likes, ${metrics.comments || 0} commentaires, ${metrics.shares || 0} partages`;
        }

        await this.send({
            type: 'post_published',
            title: `📝 Nouveau post sur ${platform}`,
            message: `*Post publié avec succès*\n\n${preview}${metricsText}${url ? `\n\n🔗 ${url}` : ''}`,
            data: { platform, url },
            priority: 'medium'
        });
    }

    /**
     * Notification: Lead chaud détecté
     */
    static async notifyHotLead(params: {
        leadName: string;
        score: number;
        company?: string;
        nextAction: string;
    }): Promise<void> {
        const { leadName, score, company, nextAction } = params;

        await this.send({
            type: 'lead_scored',
            title: '🔥 Lead ultra-chaud détecté !',
            message: `*${leadName}*${company ? ` (${company})` : ''}\n\n🎯 Score: ${score}/100\n\n✅ Action recommandée:\n${nextAction}`,
            priority: 'high'
        });
    }

    /**
     * Notification: Meeting transcrit
     */
    static async notifyMeetingTranscribed(params: {
        meetingTitle: string;
        duration: number;
        actionItems: number;
        sentiment: string;
    }): Promise<void> {
        const { meetingTitle, duration, actionItems, sentiment } = params;

        const sentimentEmoji = sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😟' : '😐';

        await this.send({
            type: 'meeting_transcribed',
            title: '📝 Meeting transcrit',
            message: `*${meetingTitle}*\n\n⏱️ Durée: ${Math.round(duration / 60)} min\n${sentimentEmoji} Sentiment: ${sentiment}\n✅ ${actionItems} action items créés`,
            priority: 'medium'
        });
    }

    /**
     * Notification: Proposition envoyée
     */
    static async notifyProposalSent(params: {
        clientName: string;
        amount: number;
        signatureUrl: string;
    }): Promise<void> {
        const { clientName, amount, signatureUrl } = params;

        await this.send({
            type: 'proposal_sent',
            title: '📄 Proposition envoyée',
            message: `*${clientName}*\n\n💰 Montant: €${amount}\n\n🔗 Signature: ${signatureUrl}`,
            priority: 'high'
        });
    }

    /**
     * Notification: Revenu reçu
     */
    static async notifyRevenueReceived(params: {
        amount: number;
        source: string;
        splits?: number;
    }): Promise<void> {
        const { amount, source, splits } = params;

        await this.send({
            type: 'revenue_received',
            title: '💰 Nouveau paiement reçu !',
            message: `€${amount} de ${source}${splits ? `\n\n📊 Distribué à ${splits} bénéficiaires` : ''}`,
            priority: 'high'
        });
    }

    /**
     * Notification: Alerte système
     */
    static async notifyAlert(params: {
        level: 'critical' | 'warning' | 'info';
        title: string;
        description: string;
    }): Promise<void> {
        const { level, title, description } = params;

        const emoji = level === 'critical' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️';

        await this.send({
            type: 'alert',
            title: `${emoji} ${title}`,
            message: description,
            priority: level === 'critical' ? 'high' : 'medium'
        });
    }

    /**
     * Digest quotidien
     */
    static async sendDailyDigest(stats: {
        postsPublished: number;
        leadsScored: number;
        revenueGenerated: number;
        topPerformingPost?: { platform: string; engagement: number };
    }): Promise<void> {
        const { postsPublished, leadsScored, revenueGenerated, topPerformingPost } = stats;

        let message = `*📊 Résumé Quotidien ELA*\n\n`;
        message += `📝 Posts publiés: ${postsPublished}\n`;
        message += `🎯 Leads scorés: ${leadsScored}\n`;
        message += `💰 Revenus: €${revenueGenerated}\n`;

        if (topPerformingPost) {
            message += `\n🏆 Top post: ${topPerformingPost.platform} (${topPerformingPost.engagement} engagements)`;
        }

        await this.send({
            type: 'alert',
            title: '📊 Digest Quotidien',
            message,
            priority: 'low'
        });
    }

    /**
     * Formatage du message
     */
    private static formatMessage(payload: NotificationPayload): string {
        const priorityEmoji = payload.priority === 'high' ? '🔴' : payload.priority === 'medium' ? '🟡' : '🟢';

        const timestamp = new Date().toLocaleString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `${priorityEmoji} *${payload.title}*\n\n${payload.message}\n\n_${timestamp}_`;
    }

    /**
     * Commandes interactives
     */
    static async handleCommand(command: string): Promise<string> {
        const cmd = command.toLowerCase().trim();

        switch (cmd) {
            case 'stats':
                return '📊 Stats en cours de récupération...';

            case 'stop':
                return '⏸️ Notifications désactivées. Répondez START pour réactiver.';

            case 'start':
                return '▶️ Notifications réactivées !';

            case 'help':
                return `*Commandes disponibles:*\n\n• STATS - Voir les stats\n• STOP - Désactiver notifications\n• START - Activer notifications\n• HELP - Cette aide`;

            default:
                return `Commande non reconnue. Répondez HELP pour voir les commandes.`;
        }
    }
}
