"""
🤖 Engagement Bot - Système d'écoute et réponse intelligente
Détecte les commentaires, filtre les leads, et répond avec délai humain
"""

from playwright.sync_api import sync_playwright, Page
from login_saver import build_context
from stealth_config import StealthConfig
import json
from pathlib import Path
from datetime import datetime
import time
import random
import requests

# Configuration
TARGETS_FILE = Path("targets.json")  # Liste des posts à surveiller
ACTION_LOG = Path("action_history.json")
RAG_ENDPOINT = "http://localhost:3000/api/rag/query"  # Endpoint RAG pour réponses

class CommentClassifier:
    """Classifie les commentaires : Lead / Troll / Spam"""
    
    TROLL_KEYWORDS = ["arnaque", "scam", "fake", "bullshit", "merde", "nul"]
    SPAM_KEYWORDS = ["crypto", "forex", "investment opportunity", "click here"]
    LEAD_KEYWORDS = ["intéressé", "comment", "plus d'infos", "contact", "lien", "?"]
    
    @staticmethod
    def classify(comment_text: str) -> str:
        """Retourne: LEAD | TROLL | SPAM | NEUTRAL"""
        text_lower = comment_text.lower()
        
        # Détection spam
        if any(keyword in text_lower for keyword in CommentClassifier.SPAM_KEYWORDS):
            return "SPAM"
        
        # Détection troll
        if any(keyword in text_lower for keyword in CommentClassifier.TROLL_KEYWORDS):
            return "TROLL"
        
        # Détection lead
        if any(keyword in text_lower for keyword in CommentClassifier.LEAD_KEYWORDS):
            return "LEAD"
        
        # Émojis positifs = lead potentiel
        if any(emoji in comment_text for emoji in ["🔥", "💯", "👍", "✅", "🚀"]):
            return "LEAD"
        
        return "NEUTRAL"


class ActionLogger:
    """Log les actions pour éviter les doublons"""
    
    def __init__(self):
        self.log = self._load_log()
    
    def _load_log(self):
        if ACTION_LOG.exists():
            with open(ACTION_LOG, "r", encoding="utf-8") as f:
                return json.load(f)
        return []
    
    def _save_log(self):
        with open(ACTION_LOG, "w", encoding="utf-8") as f:
            json.dump(self.log, f, indent=2, ensure_ascii=False)
    
    def has_acted(self, action_type: str, target_id: str) -> bool:
        """Vérifie si une action a déjà été faite sur cette cible"""
        return any(
            log["action"] == action_type and log["target_id"] == target_id
            for log in self.log
        )
    
    def add_action(self, action_type: str, target_id: str, context: dict = None):
        """Enregistre une action"""
        self.log.append({
            "action": action_type,
            "target_id": target_id,
            "timestamp": datetime.now().isoformat(),
            "context": context or {}
        })
        self._save_log()


def generate_smart_response(comment_text: str, context: str = "") -> str:
    """
    Génère une réponse intelligente via RAG (Pinecone)
    Fallback sur réponses prédéfinies si API indisponible
    """
    try:
        response = requests.post(
            RAG_ENDPOINT,
            json={"query": f"Comment répondre à ce commentaire : {comment_text}. Context: {context}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("response", "Merci pour ton commentaire ! 🙌")
        
    except Exception as e:
        print(f"⚠️ Erreur RAG: {e}, utilisation fallback")
    
    # Réponses fallback selon classification
    classification = CommentClassifier.classify(comment_text)
    
    if classification == "LEAD":
        return random.choice([
            "Super question ! Je t'ai envoyé un MP avec plus de détails 📬",
            "Excellente remarque ! Check tes DM pour la réponse complète 🚀",
            "Content que ça t'intéresse ! Je t'explique tout en privé 💬",
        ])
    elif classification == "TROLL":
        return None  # Ne répond pas aux trolls
    else:
        return random.choice([
            "Merci pour ton retour ! 🙏",
            "Content que ça t'ait plu ! 🔥",
            "Merci d'avoir pris le temps de commenter ! ✨",
        ])


def listen_for_comments(page: Page, post_url: str, action_logger: ActionLogger) -> list:
    """
    Écoute les nouveaux commentaires sur un post LinkedIn
    Retourne la liste des commentaires non traités
    """
    page.goto(post_url, timeout=60000)
    StealthConfig.human_delay(2000, 4000)
    
    # Scroll pour charger tous les commentaires
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    StealthConfig.human_delay(1000, 2000)
    
    # Récupère les commentaires
    comments = page.query_selector_all(".comments-comment-item")
    
    new_comments = []
    for comment in comments:
        try:
            author = comment.query_selector(".comments-post-meta__name-text")
            text = comment.query_selector(".comments-comment-item__main-content")
            
            if not author or not text:
                continue
            
            author_name = author.inner_text().strip()
            comment_text = text.inner_text().strip()
            comment_id = f"{post_url}-{author_name}-{hash(comment_text)}"
            
            # Vérifie si déjà traité
            if action_logger.has_acted("COMMENT_REPLY", comment_id):
                continue
            
            new_comments.append({
                "id": comment_id,
                "author": author_name,
                "text": comment_text,
                "classification": CommentClassifier.classify(comment_text),
                "element": comment
            })
        except Exception as e:
            print(f"⚠️ Erreur parsing commentaire: {e}")
            continue
    
    return new_comments


def reply_to_comment(page: Page, comment: dict, action_logger: ActionLogger):
    """Répond à un commentaire avec délai humain"""
    
    # Filtre : ignore spam et trolls
    if comment["classification"] in ["SPAM", "TROLL"]:
        print(f"🚫 Ignoré ({comment['classification']}): {comment['author']}")
        return
    
    # Génère la réponse
    response_text = generate_smart_response(comment["text"])
    
    if not response_text:
        print(f"⏭️ Pas de réponse pour: {comment['author']}")
        return
    
    # Délai aléatoire (5-45 min simulé ici en secondes pour démo)
    delay_sec = random.randint(10, 60)  # En prod: (300, 2700)
    print(f"⏳ Attente {delay_sec}s avant de répondre à {comment['author']}...")
    time.sleep(delay_sec)
    
    try:
        # Clique sur "Répondre"
        reply_button = comment["element"].query_selector("button[aria-label*='épondre']")
        if reply_button:
            reply_button.click()
            StealthConfig.human_delay(500, 1500)
            
            # Tape la réponse
            text_area = page.query_selector("div.ql-editor[contenteditable='true']")
            if text_area:
                StealthConfig.human_type(page, "div.ql-editor[contenteditable='true']", response_text)
                StealthConfig.human_delay(1000, 2000)
                
                # Envoie
                send_button = page.query_selector("button[aria-label*='Publier']")
                if send_button:
                    send_button.click()
                    print(f"✅ Réponse envoyée à {comment['author']}: {response_text[:50]}...")
                    
                    # Log l'action
                    action_logger.add_action("COMMENT_REPLY", comment["id"], {
                        "author": comment["author"],
                        "response": response_text
                    })
    except Exception as e:
        print(f"❌ Erreur lors de la réponse: {e}")


def sniper_outbound(page: Page, profile_url: str, action_logger: ActionLogger):
    """
    Visite un profil cible et like un post ancien pour attirer l'attention
    """
    if action_logger.has_acted("PROFILE_VISIT", profile_url):
        print(f"⏭️ Profil déjà visité: {profile_url}")
        return
    
    print(f"🎯 Sniper: Visite de {profile_url}...")
    page.goto(profile_url, timeout=60000)
    StealthConfig.human_delay(3000, 6000)
    
    # Scroll pour simuler la lecture
    StealthConfig.random_scroll(page)
    StealthConfig.human_delay(2000, 4000)
    
    # Trouve un post récent (pas le dernier, le 2e ou 3e)
    posts = page.query_selector_all(".feed-shared-update-v2")
    
    if len(posts) >= 2:
        target_post = posts[random.randint(1, min(3, len(posts) - 1))]
        like_button = target_post.query_selector("button[aria-label*='J\\'aime']")
        
        if like_button and "true" not in (like_button.get_attribute("aria-pressed") or ""):
            like_button.click()
            print(f"❤️ Like posé sur un post de {profile_url}")
            
            action_logger.add_action("PROFILE_VISIT", profile_url, {"liked": True})
            StealthConfig.human_delay(2000, 5000)
    else:
        print(f"⚠️ Pas assez de posts trouvés sur {profile_url}")


def main():
    """Boucle principale du bot d'engagement"""
    print("🤖 Démarrage du Bot d'Engagement LinkedIn...\n")
    
    action_logger = ActionLogger()
    
    with sync_playwright() as p:
        browser, context, ua = build_context(p)
        page = context.new_page()
        StealthConfig.inject_stealth_scripts(page)
        
        # Charge les cibles (posts à surveiller + profils à visiter)
        if not TARGETS_FILE.exists():
            print("❌ Fichier targets.json manquant. Crée-le avec la structure:")
            print(json.dumps({"posts": ["url1", "url2"], "profiles": ["url1", "url2"]}, indent=2))
            browser.close()
            return
        
        with open(TARGETS_FILE, "r", encoding="utf-8") as f:
            targets = json.load(f)
        
        # Écoute les commentaires
        for post_url in targets.get("posts", []):
            print(f"\n👂 Écoute des commentaires sur: {post_url}")
            comments = listen_for_comments(page, post_url, action_logger)
            
            print(f"📊 {len(comments)} nouveaux commentaires détectés")
            
            for comment in comments:
                reply_to_comment(page, comment, action_logger)
        
        # Sniper outbound
        for profile_url in targets.get("profiles", [])[:3]:  # Limite 3 profils par session
            sniper_outbound(page, profile_url, action_logger)
            StealthConfig.human_delay(10000, 20000)  # Pause entre chaque profil
        
        browser.close()
        print("\n✅ Cycle d'engagement terminé")


if __name__ == "__main__":
    main()





