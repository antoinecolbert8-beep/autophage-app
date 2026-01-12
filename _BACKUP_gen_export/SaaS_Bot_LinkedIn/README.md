# 🤖 Bot LinkedIn - Module Python

Bot d'automatisation LinkedIn avec gestion de session persistante, anti-détection et engagement intelligent.

---

## 🚀 Installation

```bash
pip install -r requirements.txt
playwright install chromium
```

---

## 📁 Fichiers

| Fichier | Description |
|---------|-------------|
| `login_saver.py` | Sauvegarde session LinkedIn (run 1x) |
| `user_agent_rotator.py` | Rotation intelligente User-Agent |
| `stealth_config.py` | Configuration anti-détection |
| `engagement_bot.py` | Bot d'engagement (commentaires/likes) |
| `stats_collector.py` | Collecte stats posts |
| `storage_state.json` | Session sauvegardée (JAMAIS commit) |
| `targets.json` | Posts/profils à surveiller |
| `posts_to_track.json` | Posts pour collecte stats |

---

## 🔧 Configuration

### 1. Première connexion

```bash
python login_saver.py
# Connecte-toi manuellement dans la fenêtre Chrome
# Appuie sur Entrée une fois connecté
```

### 2. Configuration des cibles

**`targets.json`** :
```json
{
  "posts": [
    "https://www.linkedin.com/posts/ton-post-id-1",
    "https://www.linkedin.com/posts/ton-post-id-2"
  ],
  "profiles": [
    "https://www.linkedin.com/in/profil-cible-1",
    "https://www.linkedin.com/in/profil-cible-2"
  ]
}
```

**`posts_to_track.json`** :
```json
{
  "posts": [
    "https://www.linkedin.com/posts/ton-post-pour-stats-1",
    "https://www.linkedin.com/posts/ton-post-pour-stats-2"
  ]
}
```

---

## 🎯 Usage

### Bot d'engagement

```bash
python engagement_bot.py
```

**Ce qu'il fait** :
- ✅ Écoute les nouveaux commentaires sur tes posts
- ✅ Filtre Troll/Spam/Lead
- ✅ Répond intelligemment (via RAG)
- ✅ Délai aléatoire 5-45 min
- ✅ Visite profils cibles + like post ancien (sniper)

### Collecte de stats

```bash
python stats_collector.py
```

**Ce qu'il fait** :
- ✅ Récupère views/likes/comments/shares
- ✅ Envoie à l'API Next.js
- ✅ Alimente le feedback loop

---

## ⚙️ Configuration avancée

### Rotation User-Agent

Par défaut : rotation tous les **7 jours**

Modifier :
```python
# user_agent_rotator.py, ligne 44
rotator = UserAgentRotator(rotation_days=7)  # Change ici
```

Force rotation manuelle :
```bash
python -c "from user_agent_rotator import UserAgentRotator; UserAgentRotator().force_rotation()"
```

### Délais humains

Modifier dans `stealth_config.py` :
```python
# Ligne 53
StealthConfig.human_delay(500, 2000)  # min_ms, max_ms
```

### Fréquence engagement

Modifier dans `engagement_bot.py` :
```python
# Ligne 183 - Délai avant réponse (en secondes)
delay_sec = random.randint(300, 2700)  # 5-45 min

# Ligne 246 - Pause entre profils sniper
StealthConfig.human_delay(10000, 20000)  # 10-20 sec
```

---

## 🚨 Sécurité

### ✅ Bonnes pratiques

1. **Limite les actions** : Max 50-100 actions/jour
2. **Varie les horaires** : Pas d'activité 24/7
3. **Pause régulières** : 1-2h de pause entre sessions
4. **Utilise une IP fixe** : Évite VPN/proxies instables
5. **Surveille les alertes LinkedIn** : Si email suspect, arrête immédiatement

### ⚠️ Signes de détection

- Email "Activité inhabituelle"
- Demande de vérification SMS répétée
- Limitation temporaire (shadowban)

**Action immédiate** :
1. Arrête le bot (`Ctrl+C`)
2. Attends 48h
3. Force reconnexion : `python login_saver.py --force`
4. Réduis fréquence (passe cron de 4h à 8h)

---

## 🔄 Cron Automatique

```bash
crontab -e
```

Ajoute :
```cron
# Engagement toutes les 4 heures
0 */4 * * * cd /path/to/SaaS_Bot_LinkedIn && python3 engagement_bot.py >> engagement.log 2>&1

# Stats tous les jours à minuit
0 0 * * * cd /path/to/SaaS_Bot_LinkedIn && python3 stats_collector.py >> stats.log 2>&1
```

---

## 📊 Logs

```bash
# Voir logs en temps réel
tail -f engagement.log
tail -f stats.log

# Historique des actions
cat action_history.json | jq .
```

---

## 🛠️ Troubleshooting

### "Session expirée"
```bash
python login_saver.py --force
```

### "Playwright not found"
```bash
playwright install chromium
playwright install-deps  # Linux uniquement
```

### "LinkedIn détecte le bot"
1. Augmente les délais (voir "Configuration avancée")
2. Réduis le nombre d'actions
3. Force rotation UA
4. Attends 48h avant de relancer

### "Sélecteur CSS introuvable"
LinkedIn change régulièrement son HTML. Met à jour les sélecteurs dans :
- `engagement_bot.py` lignes 119-154 (extraction commentaires)
- `stats_collector.py` lignes 38-74 (extraction stats)

---

## 📈 Performance

### Engagement typique (mode conservateur)

- **4 sessions/jour** (toutes les 4h)
- **~10 commentaires répondus/session**
- **~3 profils visités/session**
- **Total : ~40 actions/jour**

### Collecte stats

- **1 session/jour**
- **~10-20 posts trackés**

---

## ✅ Checklist

- [ ] `requirements.txt` installé
- [ ] Playwright Chromium installé
- [ ] `storage_state.json` généré
- [ ] `targets.json` configuré
- [ ] `posts_to_track.json` configuré
- [ ] API Next.js accessible (`http://localhost:3000`)
- [ ] Cron jobs configurés (optionnel)
- [ ] Logs surveillés

---

## 🆘 Support

En cas de problème :
1. Vérifie les logs
2. Consulte le Troubleshooting
3. Ouvre une issue sur GitHub

**🎉 Bon automation !**
