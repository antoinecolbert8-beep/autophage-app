"""
Boucle d'autopilot planifiée (simple) avec intervalle aléatoire entre runs.

Prérequis :
- storage_state.json déjà généré
- targets.json présent (sinon fallback démo)
- autopilot.py dans le même dossier

Env optionnelles :
- RUN_MIN_GAP_MIN (par défaut 45)
- RUN_MAX_GAP_MIN (par défaut 120)
- HEADLESS (true/false, par défaut true)
- APP_API_URL / USER_ID pour logger /api/action-history
"""
import os
import random
import time
from autopilot import run_sequence, load_targets_from_file, Path


def run_loop():
    min_gap = float(os.getenv("RUN_MIN_GAP_MIN", 15))
    max_gap = float(os.getenv("RUN_MAX_GAP_MIN", 45))
    headless = os.getenv("HEADLESS", "true").lower() == "true"

    targets_path = Path("targets.json")
    while True:
        targets = load_targets_from_file(targets_path)
        if not targets:
            print("⚠️ Aucun target dans targets.json, on stoppe la boucle.")
            break

        print(f"\n🚀 Lancement autopilot ({len(targets)} actions) headless={headless}")
        try:
            run_sequence(targets, headless=headless, min_delay=12, max_delay=28)
        except KeyboardInterrupt:
            print("⏹️ Arrêt demandé (CTRL+C)")
            break
        except Exception as e:
            print(f"⚠️ Erreur durant le run: {e}")

        gap_min = random.uniform(min_gap, max_gap)
        print(f"⏳ Prochain run dans ~{gap_min:.1f} minutes...")
        time.sleep(gap_min * 60)


if __name__ == "__main__":
    run_loop()






