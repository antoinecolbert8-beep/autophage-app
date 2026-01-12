"""
Autopilot LinkedIn (visite/like/comment) avec tempo aléatoire.

Prérequis :
- storage_state.json généré via login_saver.py
- python worker.py (déjà présent) fournit les primitives de navigation

Variables env optionnelles :
- APP_API_URL (ex: http://localhost:3000) pour logger /api/action-history
- USER_ID pour associer les actions à l'utilisateur
"""

import os
import random
import time
from typing import List, Literal, Optional, TypedDict
from worker import (
    build_context,
    visit_profile,
    like_first_post,
    comment_on_post,
    wait_human,
    record_action,
)
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ActionType = Literal["VISIT", "LIKE", "COMMENT"]


class Target(TypedDict, total=False):
    action: ActionType
    url: str
    comment: Optional[str]


def run_sequence(targets: List[Target], headless: bool = True, min_delay: float = 10, max_delay: float = 35):
    """
    Exécute une séquence d'actions en réutilisant la même session.
    Tempo aléatoire entre actions pour mimer un comportement humain.
    """
    with sync_playwright() as p:
        context, page, ua = build_context(p, headless=headless)
        print(f"🎭 UA: {ua}")

        for idx, target in enumerate(targets, start=1):
            action = target["action"]
            url = target["url"]
            comment = target.get("comment")

            print(f"\n➡️ [{idx}/{len(targets)}] {action} -> {url}")

            if action == "VISIT":
                visit_profile(page, url)
                record_action(os.getenv("USER_ID"), "LINKEDIN", "VISIT", target_id=url)
            elif action == "LIKE":
                page.goto(url, timeout=60000, wait_until="domcontentloaded")
                wait_human()
                if like_first_post(page):
                    record_action(os.getenv("USER_ID"), "LINKEDIN", "LIKE", target_id=url)
            elif action == "COMMENT":
                if not comment:
                    print("⚠️ COMMENT sans texte ignoré.")
                else:
                    if comment_on_post(page, url, comment):
                        record_action(os.getenv("USER_ID"), "LINKEDIN", "COMMENT", target_id=url, context={"comment": comment})
            else:
                print(f"⚠️ Action inconnue: {action}")

            # Tempo aléatoire
            delay = random.uniform(min_delay, max_delay)
            print(f"⏳ Pause {delay:.1f}s avant la prochaine action...")
            time.sleep(delay)

        context.close()


def load_targets_from_file(path: Path) -> List[Target]:
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, list):
            return [t for t in data if "action" in t and "url" in t]
    except Exception as e:
        print(f"⚠️ Impossible de lire {path}: {e}")
    return []


if __name__ == "__main__":
    targets_file = Path("targets.json")
    file_targets = load_targets_from_file(targets_file)

    if file_targets:
        chosen_targets = file_targets
        print(f"🗂️ Chargé {len(chosen_targets)} cibles depuis targets.json")
    else:
        # Exemple de séquence (fallback)
        chosen_targets = [
            {"action": "VISIT", "url": "https://www.linkedin.com/in/satyanadella/"},
            {"action": "LIKE", "url": "https://www.linkedin.com/feed/"},
            {"action": "COMMENT", "url": "https://www.linkedin.com/posts/...", "comment": "Super insight, merci pour le partage !"},
        ]
        print("⚠️ targets.json introuvable, utilisation de la démo intégrée.")

    run_sequence(
        chosen_targets,
        headless=False,  # passe à True pour invisibles
        min_delay=12,
        max_delay=28,
    )

