/**
 * Hook React pour le système de wording polymorphique
 */

import { useEffect, useState } from "react";
import { Niche, translate, detectNiche } from "@/lib/wording-dictionary";

export function useWording(userId?: string) {
  const [niche, setNiche] = useState<Niche>("DEFAULT");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Charge les préférences utilisateur
    fetch(`/api/preferences?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.preferences?.wording?.niche) {
          setNiche(data.preferences.wording.niche);
        } else {
          // Détecte automatiquement depuis les keywords
          const keywords = data.brand?.keywords ?? [];
          const detectedNiche = detectNiche(keywords);
          setNiche(detectedNiche);
        }
      })
      .catch((err) => console.error("Erreur chargement wording:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const t = (term: string): string => {
    return translate(term, niche);
  };

  return { t, niche, loading };
}





