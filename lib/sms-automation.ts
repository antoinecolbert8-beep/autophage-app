import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * SMS AUTOMATION
 * Reminders, confirmations, follow-ups automatiques
 */

export interface SMSTemplate {
    id: string;
    name: string;
    content: string;
    variables: string[]; // ex: ['firstName', 'appointmentTime']
}

export class SMSAutomation {

    private static templates: Record<string, SMSTemplate> = {
        'appointment_reminder': {
            id: 'appointment_reminder',
            name: 'Reminder RDV',
            content: 'Bonjour {{firstName}}, rappel de votre RDV demain à {{time}}. Répondez OUI pour confirmer ou NON pour annuler.',
            variables: ['firstName', 'time']
        },
        'appointment_confirmation': {
            id: 'appointment_confirmation',
            name: 'Confirmation RDV',
            content: 'Merci {{firstName}} ! Votre RDV est confirmé pour le {{date}} à {{time}}. À bientôt ! 🚀',
            variables: ['firstName', 'date', 'time']
        },
        'follow_up_cold': {
            id: 'follow_up_cold',
            name: 'Follow-up Lead Froid',
            content: 'Salut {{firstName}}, j\'ai vu que vous aviez consulté notre offre. Des questions ? Je suis là pour vous aider 😊',
            variables: ['firstName']
        },
        'follow_up_warm': {
            id: 'follow_up_warm',
            name: 'Follow-up Lead Chaud',
            content: '{{firstName}}, suite à notre échange, j\'ai préparé une démo personnalisée. Quand êtes-vous disponible ? 📞',
            variables: ['firstName']
        },
        'onboarding_welcome': {
            id: 'onboarding_welcome',
            name: 'Welcome Client',
            content: 'Bienvenue chez ELA {{firstName}} ! 🎉 Votre compte est prêt. Besoin d\'aide pour démarrer ? Répondez START',
            variables: ['firstName']
        },
        'payment_reminder': {
            id: 'payment_reminder',
            name: 'Reminder Paiement',
            content: '{{firstName}}, votre paiement de €{{amount}} arrive à échéance le {{date}}. Cliquez ici pour régler: {{link}}',
            variables: ['firstName', 'amount', 'date', 'link']
        }
    };

    /**
     * Envoi d'un SMS
     */
    static async sendSMS(params: {
        to: string;
        templateId: string;
        variables: Record<string, string>;
    }): Promise<void> {
        const { to, templateId, variables } = params;

        const template = this.templates[templateId];
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }

        // Remplacer les variables
        let message = template.content;
        template.variables.forEach(varName => {
            const placeholder = `{{${varName}}}`;
            message = message.replace(placeholder, variables[varName] || '');
        });

        try {
            if (accountSid && authToken) {
                await client.messages.create({
                    body: message,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: to
                });

                console.log(`[SMS] Sent "${template.name}" to ${to}`);
            } else {
                console.log(`[SMS] SIMULATED: "${message}" → ${to}`);
            }
        } catch (error) {
            console.error(`[SMS] Failed to send to ${to}:`, error);
        }
    }

    /**
     * Reminder automatique RDV (24h avant)
     */
    static async scheduleAppointmentReminder(params: {
        leadId: string;
        phone: string;
        firstName: string;
        appointmentDate: Date;
    }): Promise<void> {
        const { phone, firstName, appointmentDate } = params;

        const reminderTime = new Date(appointmentDate);
        reminderTime.setHours(reminderTime.getHours() - 24);

        const now = new Date();
        const delay = reminderTime.getTime() - now.getTime();

        if (delay > 0) {
            setTimeout(async () => {
                await this.sendSMS({
                    to: phone,
                    templateId: 'appointment_reminder',
                    variables: {
                        firstName,
                        time: appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                    }
                });
            }, delay);

            console.log(`[SMS] Scheduled reminder for ${firstName} in ${Math.round(delay / 1000 / 60)} minutes`);
        }
    }

    /**
     * Follow-up automatique basé sur lead score
     */
    static async sendLeadFollowUp(params: {
        leadId: string;
        phone: string;
        firstName: string;
        leadTier: 'hot' | 'warm' | 'cold';
    }): Promise<void> {
        const { phone, firstName, leadTier } = params;

        const templateId = leadTier === 'cold' ? 'follow_up_cold' : 'follow_up_warm';

        await this.sendSMS({
            to: phone,
            templateId,
            variables: { firstName }
        });
    }

    /**
     * Confirmation de RDV
     */
    static async sendAppointmentConfirmation(params: {
        phone: string;
        firstName: string;
        appointmentDate: Date;
    }): Promise<void> {
        const { phone, firstName, appointmentDate } = params;

        await this.sendSMS({
            to: phone,
            templateId: 'appointment_confirmation',
            variables: {
                firstName,
                date: appointmentDate.toLocaleDateString('fr-FR'),
                time: appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }
        });
    }

    /**
     * Welcome message nouveau client
     */
    static async sendWelcomeMessage(params: {
        phone: string;
        firstName: string;
    }): Promise<void> {
        const { phone, firstName } = params;

        await this.sendSMS({
            to: phone,
            templateId: 'onboarding_welcome',
            variables: { firstName }
        });
    }

    /**
     * Reminder de paiement
     */
    static async sendPaymentReminder(params: {
        phone: string;
        firstName: string;
        amount: number;
        dueDate: Date;
        paymentLink: string;
    }): Promise<void> {
        const { phone, firstName, amount, dueDate, paymentLink } = params;

        await this.sendSMS({
            to: phone,
            templateId: 'payment_reminder',
            variables: {
                firstName,
                amount: amount.toString(),
                date: dueDate.toLocaleDateString('fr-FR'),
                link: paymentLink
            }
        });
    }

    /**
     * Bulk SMS pour campagnes
     */
    static async sendBulkSMS(params: {
        recipients: Array<{ phone: string; firstName: string }>;
        templateId: string;
        additionalVariables?: Record<string, string>;
    }): Promise<{ sent: number; failed: number }> {
        const { recipients, templateId, additionalVariables = {} } = params;

        let sent = 0;
        let failed = 0;

        for (const recipient of recipients) {
            try {
                await this.sendSMS({
                    to: recipient.phone,
                    templateId,
                    variables: {
                        firstName: recipient.firstName,
                        ...additionalVariables
                    }
                });
                sent++;

                // Rate limiting: 1 SMS/sec pour éviter spam
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                failed++;
            }
        }

        console.log(`[SMS] Bulk campaign complete: ${sent} sent, ${failed} failed`);
        return { sent, failed };
    }
}
