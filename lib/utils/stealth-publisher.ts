/**
 * Empêche la détection d'empreinte (footprint) par les algorithmes sociaux
 */
export const applyStealthJitter = async (baseDelayMinutes: number) => {
    // Ajoute entre 1 et 12 minutes de délai aléatoire
    const jitter = Math.floor(Math.random() * 12 * 60 * 1000);
    await new Promise(resolve => setTimeout(resolve, jitter));
};

export const rotateUserAgent = () => {
    const agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36..."
    ];
    return agents[Math.floor(Math.random() * agents.length)];
};

// Injection de variations sémantiques (Spintax)
export const injectMicroVariations = (text: string) => {
    const variations = [
        { search: "Je suis", replace: ["Je me trouve", "Me voici", "Je suis actuellement"] },
        { search: "incroyable", replace: ["sidérant", "fou", "majestueux"] }
    ];

    let newText = text;
    // Logique de remplacement aléatoire pour que chaque post soit unique
    variations.forEach(variation => {
        if (newText.includes(variation.search)) {
            const randomReplacement = variation.replace[Math.floor(Math.random() * variation.replace.length)];
            newText = newText.replace(new RegExp(variation.search, 'gi'), randomReplacement);
        }
    });

    return newText;
};
