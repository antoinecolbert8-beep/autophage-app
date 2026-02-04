# Guide d'Utilisation du Pixel de Conversion

## Pixel Intégré pour Tracking des Ventes

J'ai créé un système de tracking pixel pour suivre automatiquement les conversions et ventes.

### Comment ça marche

**1. Pixel API**: `/api/track/conversion`
- Pixel transparent 1x1
- Enregistre les conversions dans la table `Conversion`
- Silent failure (retourne toujours le pixel même en cas d'erreur)

**2. Composant React**: `<ConversionPixel />`
- S'utilise dans n'importe quelle page
- Invisible pour l'utilisateur
- Track automatiquement au chargement

### Exemples d'utilisation

#### Dans une page de confirmation de paiement
```tsx
import { ConversionPixel } from '@/components/ConversionPixel';

export default function PaymentSuccess() {
    return (
        <div>
            <h1>Paiement Confirmé!</h1>
            <ConversionPixel 
                event="purchase"
                value={99}
                email="user@example.com"
                source="stripe"
            />
        </div>
    );
}
```

#### Dans une page de signup
```tsx
<ConversionPixel 
    event="signup"
    value={0}
    email={user.email}
    source="organic"
/>
```

#### Dans une page d'upgrade
```tsx
<ConversionPixel 
    event="upgrade"
    value={199}
    email={user.email}
    source="in-app"
    metadata={JSON.stringify({ from: 'free', to: 'pro' })}
/>
```

### Vérifier les conversions

Utilisez le script de vérification:
```bash
npx tsx scripts/check-sales.ts
```

Ou consultez directement la base de données:
```sql
SELECT * FROM Conversion ORDER BY createdAt DESC;
```

### Événements supportés
- `purchase` - Achat/Vente
- `signup` - Inscription
- `upgrade` - Upgrade de plan
- `referral` - Parrainage

### Données trackées
- Type d'événement
- Valeur monétaire
- Email du lead/client
- Source de conversion
- Metadata personnalisée (JSON)
- Timestamp automatique
