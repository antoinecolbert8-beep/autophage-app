"""
📊 Stats Collector - Collecte les statistiques de posts LinkedIn
Envoie les données à l'API Next.js pour l'auto-amélioration
"""

from playwright.sync_api import sync_playwright
from login_saver import build_context
import json
from pathlib import Path
import requests

POSTS_FILE = Path("posts_to_track.json")  # Liste des posts à suivre
API_ENDPOINT = "http://localhost:3000/api/content-stats"

def extract_number(text: str) -> int:
    """Extrait un nombre depuis un texte (ex: '1,234 vues' -> 1234)"""
    if not text:
        return 0
    
    # Retire tout sauf les chiffres
    cleaned = ''.join(c for c in text if c.isdigit())
    return int(cleaned) if cleaned else 0


def collect_post_stats(page, post_url: str) -> dict:
    """Récupère les stats d'un post LinkedIn"""
    print(f"📊 Collecte stats pour: {post_url}")
    
    try:
        page.goto(post_url, timeout=60000)
        page.wait_for_timeout(3000)
        
        # Récupère les métriques (les sélecteurs peuvent varier)
        stats = {
            "postId": post_url.split("/")[-1],
            "platform": "LINKEDIN",
            "views": 0,
            "likes": 0,
            "comments": 0,
            "shares": 0,
        }
        
        # Vues (impressions)
        try:
            views_element = page.query_selector("span.social-details-social-activity__social-proof-text")
            if views_element:
                views_text = views_element.inner_text()
                stats["views"] = extract_number(views_text)
        except:
            pass
        
        # Likes
        try:
            likes_element = page.query_selector("button[aria-label*='J\\'aime'] span.social-details-social-counts__reactions-count")
            if likes_element:
                likes_text = likes_element.inner_text()
                stats["likes"] = extract_number(likes_text)
        except:
            pass
        
        # Commentaires
        try:
            comments_element = page.query_selector("button[aria-label*='commentaire'] span")
            if comments_element:
                comments_text = comments_element.inner_text()
                stats["comments"] = extract_number(comments_text)
        except:
            pass
        
        # Partages (republications)
        try:
            shares_element = page.query_selector("button[aria-label*='republication'] span")
            if shares_element:
                shares_text = shares_element.inner_text()
                stats["shares"] = extract_number(shares_text)
        except:
            pass
        
        print(f"✅ Stats collectées: {stats['views']} vues, {stats['likes']} likes, {stats['comments']} commentaires, {stats['shares']} partages")
        return stats
        
    except Exception as e:
        print(f"❌ Erreur collecte stats: {e}")
        return None


def send_to_api(stats: dict):
    """Envoie les stats à l'API Next.js"""
    try:
        response = requests.post(API_ENDPOINT, json=stats, timeout=10)
        
        if response.status_code == 200:
            print(f"✅ Stats envoyées à l'API")
        else:
            print(f"⚠️ Erreur API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur envoi API: {e}")


def main():
    """Boucle principale de collecte"""
    print("📊 Démarrage du collecteur de stats LinkedIn...\n")
    
    if not POSTS_FILE.exists():
        print("❌ Fichier posts_to_track.json manquant. Crée-le avec:")
        print(json.dumps({"posts": ["url1", "url2"]}, indent=2))
        return
    
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    posts = data.get("posts", [])
    
    if not posts:
        print("⚠️ Aucun post à tracker dans posts_to_track.json")
        return
    
    with sync_playwright() as p:
        browser, context, ua = build_context(p)
        page = context.new_page()
        
        for post_url in posts:
            stats = collect_post_stats(page, post_url)
            
            if stats:
                send_to_api(stats)
            
            # Pause entre chaque post
            page.wait_for_timeout(5000)
        
        browser.close()
    
    print("\n✅ Collecte terminée")


if __name__ == "__main__":
    main()





