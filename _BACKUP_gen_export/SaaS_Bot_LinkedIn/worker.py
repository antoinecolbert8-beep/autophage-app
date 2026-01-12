from pathlib import Path
from random import choice, uniform
from time import sleep
from typing import Optional
import json
import os
import urllib.request
from playwright.sync_api import sync_playwright, Page, BrowserContext

STORAGE_FILE = Path("storage_state.json")
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",
]


def build_context(playwright, headless: bool = True) -> tuple[BrowserContext, Page, str]:
    if not STORAGE_FILE.exists():
        raise FileNotFoundError("storage_state.json introuvable. Lance login_saver.py d'abord.")

    browser = playwright.chromium.launch(
        headless=headless,
        args=["--disable-blink-features=AutomationControlled"],
    )
    ua = choice(USER_AGENTS)
    context = browser.new_context(
        storage_state=str(STORAGE_FILE),
        user_agent=ua,
        viewport={"width": 1280, "height": 720},
    )
    page = context.new_page()
    return context, page, ua


def wait_human(min_s=1.2, max_s=3.4):
    sleep(uniform(min_s, max_s))


def visit_profile(page: Page, profile_url: str):
    print(f"🔍 Visite profil: {profile_url}")
    page.goto(profile_url, timeout=60000, wait_until="domcontentloaded")
    wait_human()


def like_first_post(page: Page):
    print("👍 Tentative de like du premier post visible...")
    page.wait_for_selector("button[aria-label*='J’aime'], button[aria-label*='Like']", timeout=15000)
    btns = page.query_selector_all("button[aria-label*='J’aime'], button[aria-label*='Like']")
    if not btns:
        print("⚠️ Aucun bouton Like trouvé.")
        return False
    btns[0].click()
    wait_human()
    print("✅ Like envoyé.")
    return True


def comment_on_post(page: Page, post_url: str, comment: str):
    print(f"💬 Commentaire sur {post_url}")
    page.goto(post_url, timeout=60000, wait_until="domcontentloaded")
    wait_human()
    page.click("button[aria-label*='commenter'], button[aria-label*='Comment']", timeout=15000)
    wait_human()
    textarea = page.query_selector("div[role='textbox']")
    if not textarea:
        print("⚠️ Zone de commentaire introuvable.")
        return False
    textarea.click()
    textarea.fill(comment)
    wait_human()
    page.keyboard.press("Enter")
    print("✅ Commentaire posté.")
    return True


def record_action(user_id: Optional[str], platform: str, action: str, target_id: Optional[str] = None, context: Optional[dict] = None):
    """
    Optionnel : envoie l'action vers l'API Next /api/action-history si APP_API_URL et USER_ID sont définis.
    """
    api_base = os.getenv("APP_API_URL", "http://localhost:3000")
    user = user_id or os.getenv("USER_ID")
    if not api_base or not user:
        return

    payload = {
        "userId": user,
        "platform": platform,
        "action": action,
        "targetId": target_id,
        "context": context or {},
    }
    try:
        req = urllib.request.Request(
            f"{api_base}/api/action-history",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status >= 300:
                print(f"⚠️ Log action échoué: status {resp.status}")
    except Exception as e:
        print(f"⚠️ Impossible de logger l'action: {e}")


def main(action: str, target: Optional[str] = None, comment: Optional[str] = None, headless: bool = True):
    with sync_playwright() as p:
        context, page, ua = build_context(p, headless=headless)
        print(f"🎭 UA: {ua}")

        if action == "visit":
            if not target:
                raise ValueError("target (URL profil) requis pour visit")
            visit_profile(page, target)
            record_action(os.getenv("USER_ID"), "LINKEDIN", "VISIT", target_id=target)
        elif action == "like":
            if not target:
                raise ValueError("target (URL post ou feed) requis pour like")
            page.goto(target, timeout=60000, wait_until="domcontentloaded")
            wait_human()
            if like_first_post(page):
                record_action(os.getenv("USER_ID"), "LINKEDIN", "LIKE", target_id=target)
        elif action == "comment":
            if not target or not comment:
                raise ValueError("target (URL post) et comment requis pour comment")
            if comment_on_post(page, target, comment):
                record_action(os.getenv("USER_ID"), "LINKEDIN", "COMMENT", target_id=target, context={"comment": comment})
        else:
            raise ValueError("action inconnue. Utilise visit | like | comment")

        context.close()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Bot LinkedIn (utilise storage_state.json)")
    parser.add_argument("--action", required=True, choices=["visit", "like", "comment"])
    parser.add_argument("--target", help="URL du profil ou du post")
    parser.add_argument("--comment", help="Texte du commentaire (pour action comment)")
    parser.add_argument("--headless", action="store_true", help="Mode headless (par défaut off)")
    args = parser.parse_args()

    main(
        action=args.action,
        target=args.target,
        comment=args.comment,
        headless=args.headless,
    )

