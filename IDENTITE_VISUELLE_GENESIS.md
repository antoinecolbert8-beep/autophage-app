# 🎨 IDENTITÉ VISUELLE - GENESIS

## 🎯 **OBJECTIF**
Créer une identité visuelle **premium et impactante** qui pulvérise Limova tout en restant professionnelle.

---

## 🌈 **PALETTE DE COULEURS**

### **Couleurs Primaires:**
```css
/* Gradient Signature Genesis */
--genesis-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Bleu Principal (Confiance, Tech) */
--primary-blue: #667eea;
--primary-blue-light: #818cf8;
--primary-blue-dark: #4f46e5;

/* Violet Principal (Innovation, Premium) */
--primary-purple: #764ba2;
--primary-purple-light: #a78bfa;
--primary-purple-dark: #6d28d9;
```

### **Couleurs Secondaires:**
```css
/* Cyan (Modernité) */
--accent-cyan: #06b6d4;
--accent-cyan-light: #22d3ee;

/* Rose (Créativité) */
--accent-pink: #ec4899;
--accent-pink-light: #f472b6;

/* Vert (Succès) */
--accent-green: #10b981;
--accent-green-light: #34d399;

/* Orange (Énergie) */
--accent-orange: #f59e0b;
--accent-orange-light: #fbbf24;
```

### **Couleurs Neutres:**
```css
/* Fond */
--bg-primary: #0a0a0f;      /* Noir légèrement bleuté */
--bg-secondary: #13131a;    /* Gris très foncé */
--bg-card: #1a1a24;         /* Gris foncé avec teinte */

/* Texte */
--text-primary: #ffffff;
--text-secondary: #a1a1aa;  /* Gris moyen */
--text-tertiary: #71717a;   /* Gris clair */

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.08);
--border-medium: rgba(255, 255, 255, 0.15);
--border-strong: rgba(255, 255, 255, 0.3);
```

---

## 🎭 **LOGO GENESIS**

### **Variations:**

1. **Logo Principal** (avec gradient)
   - Symbole: G stylisé dans un hexagone
   - Couleur: Gradient bleu-violet
   - Usage: Header, footer, documents officiels

2. **Logo Monochrome** (blanc)
   - Pour fonds sombres
   - Icône seule ou avec texte

3. **Logo Icon** (favicon)
   - G simplifié
   - 32x32, 64x64, 128x128

### **Caractéristiques:**
- Forme géométrique (hexagone = technologie + structure)
- Gradient dynamique (innovation)
- Lisible à toutes tailles
- Moderne et intemporel

---

## 📝 **TYPOGRAPHIE**

### **Titres (Display):**
```css
font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
font-weight: 700-800 (Bold/ExtraBold);
letter-spacing: -0.03em (tight);
```

### **Corps de texte:**
```css
font-family: 'Inter', system-ui, sans-serif;
font-weight: 400-500 (Regular/Medium);
letter-spacing: -0.01em;
line-height: 1.6;
```

### **Code/Technique:**
```css
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

---

## ✨ **EFFETS VISUELS**

### **1. Glassmorphism**
```css
backdrop-filter: blur(20px);
background: rgba(26, 26, 36, 0.7);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### **2. Glow Effects**
```css
/* Sur hover des cards */
box-shadow: 0 0 40px rgba(102, 126, 234, 0.3);

/* Sur les CTA */
box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
```

### **3. Gradient Borders**
```css
border: 1px solid transparent;
background: linear-gradient(#1a1a24, #1a1a24) padding-box,
            linear-gradient(135deg, #667eea, #764ba2) border-box;
```

### **4. Animated Gradients**
```css
background: linear-gradient(270deg, #667eea, #764ba2, #06b6d4);
background-size: 400% 400%;
animation: gradientShift 8s ease infinite;
```

---

## 🎨 **ILLUSTRATIONS**

### **Style:**
- **Isométrique 3D** (moderne, tech)
- **Flat avec ombres longues** (clean, lisible)
- **Gradient overlays** (premium)
- **Line art minimaliste** (élégant)

### **Couleurs des illustrations:**
- Base: Gradient bleu-violet
- Accents: Cyan, rose, vert
- Ombres: Violet foncé (30% opacity)

### **Sujets:**
- Agents IA (robots stylisés)
- Dashboards/interfaces
- Réseaux/connexions
- Croissance/analytics

---

## 🔲 **ICÔNES**

### **Style:**
- **Duotone** (2 couleurs)
- **Taille:** 24x24px base
- **Stroke:** 2px
- **Coins:** Arrondis (4px radius)

### **Couleurs:**
- Primaire: Gradient ou couleur solide
- Secondaire: 30% opacity de la primaire

### **Animations:**
- Hover: Scale 1.1 + rotation 5deg
- Active: Pulse effect

---

## 📐 **SPACING & LAYOUT**

### **Grid:**
- 12 colonnes
- Gap: 24px (desktop), 16px (mobile)
- Max-width: 1280px (desktop), 1440px (large)

### **Spacing Scale:**
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

### **Border Radius:**
```css
--radius-sm: 8px;   /* Boutons */
--radius-md: 12px;  /* Cards */
--radius-lg: 16px;  /* Sections */
--radius-xl: 24px;  /* Hero elements */
--radius-full: 9999px; /* Pills/badges */
```

---

## 🎬 **ANIMATIONS**

### **Timings:**
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

--easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### **Types:**
1. **Fade In Up** - Entrée des éléments
2. **Scale** - Hover des boutons/cards
3. **Glow Pulse** - CTA attention
4. **Gradient Shift** - Backgrounds animés
5. **Float** - Illustrations flottantes

---

## 🎯 **ÉLÉMENTS SIGNATURES**

### **1. Hero Gradient Background**
```css
background: 
  radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.15), transparent 50%),
  radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.15), transparent 50%),
  #0a0a0f;
```

### **2. Glow Cards**
Cards avec effet de brillance au survol

### **3. Animated Particles**
Particules flottantes subtiles en background

### **4. Gradient Text**
Titres avec gradient animé

### **5. Floating Elements**
Illustrations qui flottent légèrement

---

## 📱 **RESPONSIVE**

### **Breakpoints:**
```css
--mobile: 640px;
--tablet: 768px;
--laptop: 1024px;
--desktop: 1280px;
--wide: 1536px;
```

### **Adaptations:**
- Mobile: Stack vertical, texte plus petit
- Tablet: 2 colonnes, navigation simplifiée
- Desktop: Pleine expérience, animations complètes

---

## ✅ **CHECKLIST APPLICATION**

- [ ] Logo gradient en header
- [ ] Fond avec gradient radial subtle
- [ ] Cards avec glassmorphism
- [ ] CTA avec glow effects
- [ ] Icônes duotone colorées
- [ ] Illustrations isométriques
- [ ] Texte avec accents de couleur
- [ ] Hover effects animés
- [ ] Particules background
- [ ] Gradient borders sur sections importantes

---

**Cette identité pulvérise Limova par:**
1. ✅ Gradient signature unique
2. ✅ Glassmorphism premium
3. ✅ Animations subtiles mais impactantes
4. ✅ Couleurs qui évoquent tech + innovation
5. ✅ Visuels plus riches sans sacrifier le professionnalisme


