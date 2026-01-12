# 🎨 AUTOPHAGE - FRONTEND "DARK INTELLIGENCE"

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev

# Build pour production
npm run build

# Démarrage en production
npm start
```

L'application sera accessible sur **http://localhost:3000**

---

## 📋 Pages Disponibles

### 🏠 Landing Page
**Route:** `/`

**Description:** Portail de sidération avec:
- Hero Section mesh gradient
- Live Mirror Scanner
- World Map avec impulsions
- Pricing (Starter 99€ / Pro 299€ / Elite 999€)

---

### ⚔️ Dashboard War Room
**Route:** `/dashboard-war-room`

**Description:** Cockpit de commandement avec:
- Flux Neural (logs temps réel)
- Odomètre de profit
- Spectre vocal (waveform)
- Métriques live

**Utilisation:**
- Voir l'activité des bots en direct
- Surveiller les revenus
- Écouter les appels IA

---

### 🎬 Sales Factory
**Route:** `/sales-factory`

**Description:** Creative Lab pour vidéos personnalisées:
- Galerie d'avatars IA
- Réglages DNA (style, voix)
- Pipeline Miroir (scan de site)
- Preview PIP

**Utilisation:**
1. Sélectionner un avatar
2. Entrer l'URL du prospect
3. Générer la vidéo Miroir

---

### 🧠 Agent Swarm
**Route:** `/agent-swarm`

**Description:** Salle de stratégie multi-agents:
- 4 Agents (Trésorier, Opportuniste, Manager, Créateur)
- Organigramme neural
- Flux de conscience
- Bouton Veto

**Utilisation:**
- Cliquer sur un agent pour voir sa pensée
- Lire les décisions automatiques
- Intervenir si nécessaire

---

### ☎️ Telephony & Vox
**Route:** `/telephony-vox`

**Description:** Sniper vocal:
- Journal des appels
- Lecteur audio + waveform
- Analyseur d'humeur
- Transcription synchronisée
- Score de persuasion

**Utilisation:**
- Sélectionner un appel
- Lire la transcription
- Analyser la performance

---

### 🛡️ Legal Shield
**Route:** `/legal-shield`

**Description:** Security Vault:
- Radar de conformité
- Scan RGPD / Quotas
- Terminal auto-réparation
- Coffre-fort juridique

**Utilisation:**
- Surveiller le score de sécurité
- Consulter les logs d'auto-réparation
- Stabiliser si score < 90

---

### 💬 WhatsApp Command
**Route:** `/whatsapp-command`

**Description:** Mobile Command Post:
- QR Code d'appairage
- Simulation téléphone
- Bibliothèque de commandes
- Prompt Builder

**Utilisation:**
1. Scanner le QR Code (simulation)
2. Consulter les commandes vocales
3. Utiliser le constructeur

---

### 👑 Admin Master
**Route:** `/admin-master`

**Description:** The Overseer (Réservé admin):
- Kill Switch global
- Flotte de guerre (tous clients)
- Infrastructure Monitor
- Analytics marge nette
- Prédiction de churn

**Utilisation:**
- Surveiller tous les clients
- Shadow View (voir comme le client)
- Gérer les licences

---

## 🎨 Système de Design

### Classes Utilitaires

#### Glassmorphism
```tsx
<div className="glass">Contenu</div>
<div className="glass-intense">Contenu renforcé</div>
<div className="frosted">Verre dépoli</div>
```

#### Effets Glow
```tsx
<div className="glow-indigo">Lueur bleue</div>
<div className="glow-emerald">Lueur verte</div>
<div className="glow-pulse">Pulsation</div>
```

#### Backgrounds
```tsx
<div className="mesh-gradient">Gradient animé</div>
<div className="neural-grid">Grille technique</div>
```

#### Typography
```tsx
<h1 className="hero-title">Titre massif</h1>
<span className="neon-text">Texte néon</span>
<span className="elite-accent">Accent or</span>
<div className="terminal">Police mono</div>
```

#### Buttons
```tsx
<button className="btn-primary">Action principale</button>
<button className="btn-elite">Action Elite</button>
```

---

## 🧩 Composants

### Navigation
```tsx
import Navigation from "@/components/navigation";
// Auto-imported dans layout.tsx
```

### StatsCard
```tsx
import StatsCard from "@/components/stats-card";

<StatsCard
  icon="💰"
  label="Revenus"
  value="12,450€"
  trend="+24%"
/>
```

### ProgressBar
```tsx
import ProgressBar from "@/components/progress-bar";

<ProgressBar
  label="Score RGPD"
  value={98}
  max={100}
  color="emerald"
/>
```

---

## 🎬 Animations

### Radar Pulse
```tsx
<div className="radar-scan">
  <div className="w-32 h-32 rounded-full border-4 border-indigo-500 glow-pulse" />
</div>
```

### Rolling Numbers
```tsx
<span className="rolling-number">12,450</span>
```

### Waveform
```tsx
<div className="waveform">
  {Array.from({ length: 50 }).map((_, i) => (
    <div key={i} className="waveform-bar" />
  ))}
</div>
```

---

## 📱 Responsive

Breakpoints Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Exemple:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Grille responsive */}
</div>
```

---

## 🔧 Configuration

### Couleurs personnalisées
Modifier `app/globals.css`:

```css
:root {
  --indigo-electric: #6366f1; /* Couleur IA */
  --emerald-profit: #10b981;  /* Couleur Profit */
}
```

### Polices
Utilise **Geist Mono** et **Archivo** (à installer):

```bash
npm install @next/font
```

---

## 🚨 Troubleshooting

### La navigation ne s'affiche pas
✅ Vérifier que `<Navigation />` est dans `layout.tsx`

### Les animations sont saccadées
✅ Activer l'accélération GPU:
```css
transform: translateZ(0);
```

### Le glassmorphism n'apparaît pas
✅ Vérifier que `backdrop-filter` est supporté:
```css
@supports (backdrop-filter: blur(24px)) {
  /* Styles glassmorphism */
}
```

---

## 🎯 Roadmap Frontend

### Phase 1 (Actuelle) ✅
- [x] Toutes les pages UI
- [x] Système de design
- [x] Navigation
- [x] Composants réutilisables

### Phase 2 (À venir)
- [ ] Intégration WebGL/Three.js
- [ ] Connexion API backend
- [ ] WebSocket temps réel
- [ ] Authentification

### Phase 3 (Future)
- [ ] PWA (Progressive Web App)
- [ ] Notifications push
- [ ] Offline mode
- [ ] Dark/Light mode toggle

---

## 💡 Exemples de Code

### Page complète
```tsx
"use client";

export default function MyPage() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-12">
        <h1 className="text-5xl font-bold neon-text">Titre</h1>
        <p className="text-slate-400">Description</p>
      </header>

      <div className="glass-intense p-8">
        {/* Contenu */}
      </div>
    </div>
  );
}
```

### Composant glassmorphique
```tsx
<div className="glass p-6 rounded-2xl hover:scale-105 transition-transform">
  <div className="text-3xl mb-3">🎯</div>
  <h3 className="font-bold mb-2">Titre</h3>
  <p className="text-slate-400 text-sm">Description</p>
</div>
```

---

## 📚 Ressources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Hooks:** https://react.dev/reference/react

---

## 🎉 Félicitations !

Vous avez maintenant accès à l'interface la plus avancée pour l'automatisation IA. Profitez de la **Dark Intelligence** ! 🚀

**Made with ❤️ by Autophage Team**





