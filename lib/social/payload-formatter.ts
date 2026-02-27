import { SocialPost } from '../social-media-manager';

export class PayloadFormatter {
    /**
     * Adapte le contenu du post aux contraintes spécifiques de chaque plateforme.
     * Empêche les erreurs de validation HTTP (ex: 400 Bad Request) dues à des textes trop longs.
     */
    static format(post: SocialPost): string {
        let content = post.content || '';

        // Déduplication des sauts de ligne excessifs
        content = content.replace(/\n{3,}/g, '\n\n');

        switch (post.platform) {
            case 'TWITTER':
            case 'X_PLATFORM' as any:
                return this.formatForTwitter(content);

            case 'LINKEDIN':
                return this.formatForLinkedIn(content);

            case 'INSTAGRAM':
                return this.formatForInstagram(content);

            default:
                // Par défaut, on ne tronque pas violemment, sauf limite absurde (ex: 10000 chars)
                return content.substring(0, 5000);
        }
    }

    private static formatForTwitter(content: string): string {
        const TWITTER_MAX_LENGTH = 280;

        // Si le contenu est court, on le laisse tranquille
        if (content.length <= TWITTER_MAX_LENGTH) {
            return content;
        }

        // Une URL compte pour 23 caractères sur Twitter indépendamment de sa vraie taille.
        // Pour l'instant, approche prudente : hard cutoff à 277 chars + "..."
        // TODO: Gérer la création de Threads (Threadify) si le contenu dépasse largement.
        const truncated = content.substring(0, TWITTER_MAX_LENGTH - 3);

        // Éviter de couper au milieu d'un mot
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
            return truncated.substring(0, lastSpace) + '...';
        }

        return truncated + '...';
    }

    private static formatForLinkedIn(content: string): string {
        const LINKEDIN_MAX_LENGTH = 3000;

        if (content.length <= LINKEDIN_MAX_LENGTH) {
            return content;
        }

        const truncated = content.substring(0, LINKEDIN_MAX_LENGTH - 3);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
            return truncated.substring(0, lastSpace) + '...';
        }

        return truncated + '...';
    }

    private static formatForInstagram(content: string): string {
        const INSTAGRAM_MAX_LENGTH = 2200;

        if (content.length <= INSTAGRAM_MAX_LENGTH) {
            return content;
        }

        const truncated = content.substring(0, INSTAGRAM_MAX_LENGTH - 3);
        return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
    }
}
