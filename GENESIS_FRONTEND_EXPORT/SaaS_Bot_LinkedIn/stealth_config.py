"""
🥷 Stealth Configuration - Configuration anti-détection maximale pour Playwright
Masque les traces d'automatisation et simule un comportement humain.
"""

from playwright.sync_api import Page, BrowserContext
from random import uniform, randint
import time

class StealthConfig:
    """Configuration anti-détection pour Playwright"""
    
    @staticmethod
    def inject_stealth_scripts(page: Page):
        """Injecte des scripts JavaScript pour masquer l'automatisation"""
        page.add_init_script("""
            // Supprime les marqueurs d'automatisation
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            
            // Masque Playwright
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5]
            });
            
            Object.defineProperty(navigator, 'languages', {
                get: () => ['fr-FR', 'fr', 'en-US', 'en']
            });
            
            // Chrome runtime
            window.chrome = {
                runtime: {}
            };
            
            // Permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
        """)
    
    @staticmethod
    def configure_context(context: BrowserContext):
        """Configure le contexte du navigateur pour plus de discrétion"""
        # Headers HTTP réalistes
        context.set_extra_http_headers({
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        })
    
    @staticmethod
    def human_delay(min_ms=500, max_ms=2000):
        """Délai aléatoire simulant un comportement humain"""
        delay = uniform(min_ms / 1000, max_ms / 1000)
        time.sleep(delay)
        return delay
    
    @staticmethod
    def human_type(page: Page, selector: str, text: str):
        """Tape du texte avec des délais réalistes entre chaque caractère"""
        page.click(selector)
        for char in text:
            page.keyboard.press(char)
            time.sleep(uniform(0.05, 0.15))  # 50-150ms entre chaque caractère
    
    @staticmethod
    def random_mouse_movement(page: Page):
        """Simule un mouvement de souris aléatoire (optionnel)"""
        viewport = page.viewport_size
        if viewport:
            x = randint(0, viewport['width'])
            y = randint(0, viewport['height'])
            page.mouse.move(x, y)
    
    @staticmethod
    def random_scroll(page: Page):
        """Scroll aléatoire pour simuler la lecture"""
        scroll_amount = randint(200, 600)
        page.evaluate(f"window.scrollBy(0, {scroll_amount})")
        StealthConfig.human_delay(300, 800)


def apply_full_stealth(context: BrowserContext, page: Page):
    """Applique toutes les mesures de discrétion en une seule fonction"""
    StealthConfig.configure_context(context)
    StealthConfig.inject_stealth_scripts(page)
    return page





