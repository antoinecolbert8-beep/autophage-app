/**
 * 📖 Wording Dictionary - Système de traduction contextuelle
 * Adapte le vocabulaire de l'interface selon la niche détectée
 */

export type Niche = "COACHING" | "ECOM" | "SAAS" | "AGENCY" | "CREATOR" | "DEFAULT";

export const WORDING_DICTIONARY: Record<Niche, Record<string, string>> = {
  COACHING: {
    fans: "clients",
    content: "formations",
    campaign: "lancement",
    engagement: "transformation",
    leads: "élèves potentiels",
    conversion: "inscription",
    dashboard: "tableau de bord coach",
    revenue: "revenus coaching",
  },
  ECOM: {
    fans: "acheteurs",
    content: "produits",
    campaign: "promo",
    engagement: "interactions",
    leads: "visiteurs",
    conversion: "vente",
    dashboard: "tableau de bord boutique",
    revenue: "chiffre d'affaires",
  },
  SAAS: {
    fans: "utilisateurs",
    content: "features",
    campaign: "campagne",
    engagement: "activité",
    leads: "signups",
    conversion: "abonnement",
    dashboard: "analytics",
    revenue: "MRR",
  },
  AGENCY: {
    fans: "clients",
    content: "projets",
    campaign: "stratégie",
    engagement: "collaboration",
    leads: "prospects",
    conversion: "contrat",
    dashboard: "espace client",
    revenue: "revenus agence",
  },
  CREATOR: {
    fans: "fans",
    content: "contenu",
    campaign: "campagne",
    engagement: "engagement",
    leads: "abonnés potentiels",
    conversion: "abonnement",
    dashboard: "creator studio",
    revenue: "revenus créateur",
  },
  DEFAULT: {
    fans: "utilisateurs",
    content: "contenu",
    campaign: "campagne",
    engagement: "engagement",
    leads: "leads",
    conversion: "conversion",
    dashboard: "tableau de bord",
    revenue: "revenus",
  },
};

/**
 * Détecte la niche depuis les keywords ou le contexte
 */
export function detectNiche(keywords: string[], contextText?: string): Niche {
  const allText = [...keywords, contextText ?? ""].join(" ").toLowerCase();

  if (
    allText.includes("coach") ||
    allText.includes("formation") ||
    allText.includes("mentorat")
  ) {
    return "COACHING";
  }

  if (
    allText.includes("ecommerce") ||
    allText.includes("boutique") ||
    allText.includes("dropshipping") ||
    allText.includes("shopify")
  ) {
    return "ECOM";
  }

  if (
    allText.includes("saas") ||
    allText.includes("software") ||
    allText.includes("app") ||
    allText.includes("platform")
  ) {
    return "SAAS";
  }

  if (
    allText.includes("agency") ||
    allText.includes("agence") ||
    allText.includes("marketing")
  ) {
    return "AGENCY";
  }

  if (
    allText.includes("creator") ||
    allText.includes("influenceur") ||
    allText.includes("youtube") ||
    allText.includes("tiktok")
  ) {
    return "CREATOR";
  }

  return "DEFAULT";
}

/**
 * Traduit un terme selon la niche
 */
export function translate(term: string, niche: Niche): string {
  return WORDING_DICTIONARY[niche][term] ?? term;
}

/**
 * Traduit un objet entier (remplace les valeurs)
 */
export function translateObject<T extends Record<string, any>>(
  obj: T,
  niche: Niche
): T {
  const result = { ...obj };

  Object.keys(result).forEach((key) => {
    if (typeof result[key] === "string") {
      // Remplace les mots-clés connus dans le texte
      Object.keys(WORDING_DICTIONARY[niche]).forEach((term) => {
        const regex = new RegExp(`\\b${term}\\b`, "gi");
        (result as any)[key] = (result as any)[key].replace(regex, WORDING_DICTIONARY[niche][term]);
      });
    }
  });

  return result;
}





