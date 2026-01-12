"""
🎭 User-Agent Rotator - Système de rotation intelligent d'empreintes digitales
Évite la détection en variant subtilement le user-agent tout en gardant la cohérence.
"""

import json
from pathlib import Path
from datetime import datetime, timedelta
from random import choice, randint

ROTATION_STATE_FILE = Path("ua_rotation_state.json")

# Pool stratifié par type (desktop prioritaire pour LinkedIn)
USER_AGENTS = {
    "desktop": [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    ],
    "mobile": [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
    ]
}

class UserAgentRotator:
    def __init__(self, rotation_days=7, mobile_probability=0.2):
        """
        rotation_days: Nombre de jours avant de changer de UA (7 = 1x par semaine)
        mobile_probability: Probabilité d'utiliser mobile vs desktop (20% mobile par défaut)
        """
        self.rotation_days = rotation_days
        self.mobile_probability = mobile_probability
        self.state = self._load_state()
    
    def _load_state(self):
        """Charge l'état de rotation depuis le fichier"""
        if ROTATION_STATE_FILE.exists():
            with open(ROTATION_STATE_FILE, "r") as f:
                return json.load(f)
        return {
            "current_ua": None,
            "last_rotation": None,
            "device_type": "desktop"
        }
    
    def _save_state(self):
        """Sauvegarde l'état actuel"""
        with open(ROTATION_STATE_FILE, "w") as f:
            json.dump(self.state, f, indent=2)
    
    def should_rotate(self):
        """Détermine si une rotation est nécessaire"""
        if not self.state["last_rotation"]:
            return True
        
        last_rotation = datetime.fromisoformat(self.state["last_rotation"])
        days_since_rotation = (datetime.now() - last_rotation).days
        
        return days_since_rotation >= self.rotation_days
    
    def get_user_agent(self):
        """Retourne le UA actuel ou en génère un nouveau si nécessaire"""
        if self.should_rotate():
            # Décision device type (favorise desktop pour LinkedIn)
            device_type = "mobile" if randint(1, 100) <= (self.mobile_probability * 100) else "desktop"
            
            # Sélection aléatoire dans le pool du device type
            ua = choice(USER_AGENTS[device_type])
            
            self.state["current_ua"] = ua
            self.state["last_rotation"] = datetime.now().isoformat()
            self.state["device_type"] = device_type
            self._save_state()
            
            print(f"🔄 Rotation UA effectuée : {device_type} ({ua[:50]}...)")
        
        return self.state["current_ua"]
    
    def force_rotation(self):
        """Force une rotation immédiate (pour test ou après détection suspect)"""
        self.state["last_rotation"] = None
        return self.get_user_agent()


def get_current_user_agent():
    """Helper simple pour récupérer le UA actuel"""
    rotator = UserAgentRotator()
    return rotator.get_user_agent()


if __name__ == "__main__":
    # Test du système
    rotator = UserAgentRotator(rotation_days=7)
    
    print("🎭 Test du système de rotation User-Agent")
    print("=" * 60)
    
    ua = rotator.get_user_agent()
    print(f"✅ User-Agent actuel : {ua}")
    print(f"📅 Dernière rotation : {rotator.state['last_rotation']}")
    print(f"💻 Type d'appareil : {rotator.state['device_type']}")
    
    print("\n🔄 Test de rotation forcée...")
    new_ua = rotator.force_rotation()
    print(f"✅ Nouveau User-Agent : {new_ua}")





