# 🎨 DOCUMENTATION FRONTEND - DARK INTELLIGENCE

## Vue d'ensemble

Cette application Next.js 14+ implémente l'intégralité des interfaces **Autophage Enterprise** avec le style "Dark Intelligence" et Glassmorphism 2.0.

---

## 📁 Structure des Pages

### 1. **Landing Page** (`app/page.tsx`)
- ✅ Hero Section avec Mesh Gradient animé
- ✅ Live Mirror Scanner interactif
- ✅ Live Pulse World Map (simulation)
- ✅ Pricing Bento Grid (3 tiers : Starter, Pro, Elite)

**Fonctionnalités:**
- QR Code scan simulation
- Animation radar WebGL
- Typographie monumentale
- Boutons CTA avec effets glow

---

### 2. **Dashboard War Room** (`app/dashboard-war-room/page.tsx`)
- ✅ Flux Neural en temps réel (terminal logs)
- ✅ Odomètre de Profit avec rolling numbers
- ✅ Visualiseur de Spectre Vocal (waveform)
- ✅ Métriques de performance (appels, leads, conversion)
- ✅ Jauges de température du marché

**Fonctionnalités:**
- Logs IA en direct
- Animation waveform audio
- Compteurs animés
- Barres de progression

---

### 3. **Sales Factory** (`app/sales-factory/page.tsx`)
- ✅ Galerie des Identités (avatars HeyGen)
- ✅ Panneau de réglages ADN (tonalité, langue)
- ✅ Pipeline Miroir avec scan de site
- ✅ Preview PIP (Picture-in-Picture)

**Fonctionnalités:**
- Sélection d'avatars
- Scan radar d'URL
- Génération de script personnalisé
- Stats de performance vidéo

---

### 4. **Agent Swarm** (`app/agent-swarm/page.tsx`)
- ✅ Organigramme Neural en losange
- ✅ 4 Agents IA (Trésorier, Opportuniste, Manager, Créateur)
- ✅ Synapses lumineuses animées
- ✅ Boîte à Décisions (flux de conscience)
- ✅ Bouton Veto

**Fonctionnalités:**
- Navigation entre agents
- Visualisation des décisions
- Statuts en temps réel
- Stats du Swarm

---

### 5. **Telephony & Vox** (`app/telephony-vox/page.tsx`)
- ✅ Journal de Guerre (historique appels)
- ✅ Lecteur audio dynamique
- ✅ Analyseur d'Humeur (Mood-Bar)
- ✅ Transcription synchronisée
- ✅ Score de persuasion

**Fonctionnalités:**
- Lecture audio avec waveform
- Mood indicators (froid/chaud)
- Transcription en temps réel
- Notes IA (Chris Voss methods)

---

### 6. **Legal Shield** (`app/legal-shield/page.tsx`)
- ✅ Radar de Conformité (score 360°)
- ✅ 4 Secteurs de scan (RGPD, LinkedIn, Instagram, Copyright)
- ✅ Terminal d'Auto-Réparation
- ✅ Coffre-Fort Juridique
- ✅ Bouton Stabiliser

**Fonctionnalités:**
- Radar scan animation
- Logs d'auto-réparation
- Documents générés par IA
- Métriques de sécurité

---

### 7. **WhatsApp Command Center** (`app/whatsapp-command/page.tsx`)
- ✅ QR Code d'Appairage
- ✅ Simulation téléphone 3D
- ✅ Bibliothèque de Commandes
- ✅ Prompt Builder
- ✅ Statut de connexion en temps réel

**Fonctionnalités:**
- Connexion simulée
- Messages WhatsApp interactifs
- Commandes vocales/texte
- Constructeur de commandes

---

### 8. **Admin Master** (`app/admin-master/page.tsx`)
- ✅ Global Kill Switch
- ✅ Vue Flotte de Guerre (tous les clients)
- ✅ Infrastructure Monitor (8 containers Docker)
- ✅ Analytics de Marge Nette
- ✅ Prédiction de Churn
- ✅ Gestionnaire de Licences

**Fonctionnalités:**
- Shadow View pour chaque client
- Monitoring CPU/RAM en temps réel
- Calcul profit réel (Stripe - API costs)
- Globe Wireframe 3D (simulation)

---

## 🎨 Système de Design

### Palette de Couleurs

```css
--slate-950: #020617 (Fond principal)
--indigo-electric: #6366f1 (IA)
--emerald-profit: #10b981 (Profit)
--yellow-elite: #fbbf24 (Elite tier)
--red-danger: #ef4444 (Alertes)
```

### Composants Clés

**Glassmorphism:**
- `.glass` : Version basique (blur 24px)
- `.glass-intense` : Version renforcée (blur 32px)

**Effets Glow:**
- `.glow-indigo` : Lueur indigo (IA)
- `.glow-emerald` : Lueur émeraude (Profit)
- `.glow-pulse` : Animation de pulsation

**Backgrounds:**
- `.mesh-gradient` : Gradient animé neural
- `.neural-grid` : Grille de coordonnées
- `.frosted` : Effet verre dépoli

**Typography:**
- `.hero-title` : Titre massif responsive
- `.neon-text` : Effet néon bleu
- `.elite-accent` : Gradient or (Elite)
- `.terminal` : Police monospace

---

## 🧩 Composants Réutilisables

### Navigation (`components/navigation.tsx`)
Sidebar glassmorphique avec collapse/expand

### StatsCard (`components/stats-card.tsx`)
Carte de statistique avec icône, label, valeur, trend

### ProgressBar (`components/progress-bar.tsx`)
Barre de progression colorée avec pourcentage

---

## 🚀 Utilisation

### Installation
```bash
npm install
npm run dev
```

### Routes disponibles
- `/` - Landing Page
- `/dashboard-war-room` - War Room
- `/sales-factory` - Sales Factory
- `/agent-swarm` - Agent Swarm
- `/telephony-vox` - Telephony
- `/legal-shield` - Legal Shield
- `/whatsapp-command` - WhatsApp Command
- `/admin-master` - Admin Master

---

## 🎬 Animations

- **Mesh Gradient** : Fond animé 15s
- **Radar Pulse** : Scan circulaire 3s
- **Rolling Numbers** : Compteurs défilants
- **Waveform** : Barres audio animées
- **Glow Pulse** : Pulsation lumineuse 2s

---

## 📱 Responsive

Toutes les pages sont optimisées pour:
- 📱 Mobile (320px+)
- 💻 Desktop (1024px+)
- 🖥️ Ultra-wide (1920px+)

Grid system avec Tailwind CSS:
- `grid-cols-1` sur mobile
- `md:grid-cols-2` sur tablette
- `lg:grid-cols-3` sur desktop

---

## 🎯 Prochaines Étapes

### Intégrations WebGL/Three.js
- [ ] Carte 3D interactive pour Live Pulse World Map
- [ ] Globe Wireframe pour Infrastructure Monitor
- [ ] Effets de particules pour Agent Swarm

### Animations avancées
- [ ] GSAP pour transitions complexes
- [ ] Framer Motion pour micro-interactions
- [ ] Lottie pour animations JSON

### Backend Réel
- [ ] Connexion API Next.js routes
- [ ] WebSocket pour données temps réel
- [ ] Authentification utilisateur

---

## 💎 Points Forts

✅ **Design Unique** : Glassmorphism 2.0 exclusif
✅ **Performance** : Next.js 14+ avec RSC
✅ **Accessibilité** : Keyboard navigation
✅ **Responsive** : Mobile-first approach
✅ **Animations** : Smooth 60fps
✅ **Code Quality** : TypeScript strict
✅ **SEO Ready** : Metadata optimisés

---

## 🎨 Exemple de Code

### Créer une carte glassmorphique

```tsx
<div className="glass-intense p-8">
  <h3 className="text-2xl font-bold neon-text">Titre</h3>
  <p className="text-slate-400">Description</p>
</div>
```

### Ajouter un effet glow

```tsx
<div className="glass glow-pulse">
  Contenu avec pulsation lumineuse
</div>
```

### Barre de progression

```tsx
<ProgressBar
  label="Score de sécurité"
  value={98}
  max={100}
  color="emerald"
/>
```

---

🎉 **L'interface est 100% opérationnelle et prête pour l'intégration backend !**





