/**
 * 🖼️ Stock Images - Récupération d'images/vidéos stock pour les vidéos
 * Peut utiliser Pexels, Unsplash, ou un pool local
 */

export type StockImageQuery = {
  keyword: string;
  count?: number;
  orientation?: "portrait" | "landscape" | "square";
};

/**
 * Récupère des images depuis Pexels (gratuit avec API key)
 */
export async function fetchPexelsImages(query: StockImageQuery): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ PEXELS_API_KEY manquante, utilisation d'images placeholder");
    return generatePlaceholderImages(query.count ?? 5);
  }

  try {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query.keyword);
    url.searchParams.set("per_page", String(query.count ?? 5));
    url.searchParams.set("orientation", query.orientation ?? "portrait");

    const response = await fetch(url.toString(), {
      headers: { Authorization: apiKey },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    return data.photos.map((photo: any) => photo.src.large);
  } catch (error) {
    console.error("Erreur Pexels:", error);
    return generatePlaceholderImages(query.count ?? 5);
  }
}

/**
 * Récupère des images depuis Unsplash (alternative gratuite)
 */
export async function fetchUnsplashImages(query: StockImageQuery): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    console.warn("⚠️ UNSPLASH_ACCESS_KEY manquante, utilisation d'images placeholder");
    return generatePlaceholderImages(query.count ?? 5);
  }

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query.keyword);
    url.searchParams.set("per_page", String(query.count ?? 5));
    url.searchParams.set("orientation", query.orientation ?? "portrait");

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results.map((result: any) => result.urls.regular);
  } catch (error) {
    console.error("Erreur Unsplash:", error);
    return generatePlaceholderImages(query.count ?? 5);
  }
}

/**
 * Génère des images placeholder (fallback)
 */
function generatePlaceholderImages(count: number): string[] {
  const colors = ["3498db", "e74c3c", "2ecc71", "f39c12", "9b59b6", "1abc9c"];
  return Array.from({ length: count }, (_, i) => {
    const color = colors[i % colors.length];
    return `https://via.placeholder.com/1080x1920/${color}/ffffff?text=Scene+${i + 1}`;
  });
}

/**
 * Fonction principale qui essaie Pexels puis Unsplash
 */
export async function getStockImages(query: StockImageQuery): Promise<string[]> {
  // Essaie Pexels en premier
  let images = await fetchPexelsImages(query);
  
  // Si échec, essaie Unsplash
  if (images.length === 0 || images[0].includes("placeholder")) {
    images = await fetchUnsplashImages(query);
  }
  
  return images;
}





