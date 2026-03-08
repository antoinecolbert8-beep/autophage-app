from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse
from user_agent_rotator import get_current_user_agent
from stealth_config import apply_full_stealth


STORAGE_FILE = Path("storage_state.json")

# Pool d'user-agents avec rotation intelligente (desktop + mobile)
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
]


def build_context(playwright, force_login: bool = False, headless: bool = True):
    """Crée un contexte Playwright en chargeant un état existant si présent."""
    browser = playwright.chromium.launch(
        headless=headless,
        args=["--disable-blink-features=AutomationControlled"],
    )

    # Utilise le système de rotation intelligent
    user_agent = get_current_user_agent()

    if STORAGE_FILE.exists() and not force_login:
        print(f"📂 Reprise de session existante depuis {STORAGE_FILE}")
        context = browser.new_context(
            viewport={"width": 1280, "height": 720},
            user_agent=user_agent,
            storage_state=str(STORAGE_FILE),
        )
    else:
        print("🆕 Aucune session valide détectée, démarrage login manuel.")
        context = browser.new_context(
            viewport={"width": 1280, "height": 720},
            user_agent=user_agent,
        )
    return browser, context, user_agent


def save_session(force_login: bool = False):
    print("🔑 Lancement du processus d'authentification...")
    print("ℹ️ Le bot va utiliser votre connexion internet actuelle (iPhone).")

    with sync_playwright() as p:
        browser, context, user_agent = build_context(p, force_login, headless=False)
        print(f"🎭 User-Agent appliqué : {user_agent}")

        page = context.new_page()
        
        # Applique la configuration anti-détection
        apply_full_stealth(context, page)

        print("🌍 Direction LinkedIn...")
        try:
            page.goto("https://www.linkedin.com/login", timeout=60000)
        except Exception as e:
            print(f"❌ Erreur de connexion : {e}")
            browser.close()
            return

        if STORAGE_FILE.exists() and not force_login:
            print("✅ Session déjà prête, aucune connexion manuelle requise.")
        else:
            print("\n" + "=" * 50)
            print("🛑 CONNECTEZ-VOUS MANUELLEMENT MAINTENANT DANS LA FENÊTRE CHROME !")
            print("👉 Entrez Email + Mot de passe + Code SMS si besoin.")
            print("👉 Une fois que vous voyez le fil d'actualité, REVENEZ ICI.")
            input("👉 APPUYEZ SUR [ENTRÉE] DANS CE TERMINAL POUR SAUVEGARDER...")
            print("=" * 50 + "\n")

            context.storage_state(path=str(STORAGE_FILE))
            print(f"✅ SUCCÈS ! Fichier '{STORAGE_FILE.name}' créé avec succès.")

        browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sauvegarde/Reprise session LinkedIn.")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force une nouvelle connexion manuelle (ignore le storage_state existant).",
    )
    args = parser.parse_args()
    save_session(force_login=args.force)
    