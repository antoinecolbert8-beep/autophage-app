import { generateLandingCopy } from "@/lib/ai-brain";
// On imagine que tu as un dossier components avec ces éléments
import HeroSection from "@/components/HeroSection"; 

export default async function HomePage() {
  // 1. On demande à l'IA de générer le contenu (Style agressif/marketing par défaut)
  const data = await generateLandingCopy("agressif");

  if (!data) return <div>Chargement du génie...</div>;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 2. On injecte les données de l'IA directement dans le design */}
      <HeroSection 
        title={data.heroTitle} 
        subtitle={data.heroSubtitle} 
        cta={data.ctaText} 
      />
      
      {/* Section de secours si tu n'as pas encore de composants */}
      {!HeroSection && (
        <div className="p-20 text-center">
          <h1 className="text-6xl font-bold mb-4">{data.heroTitle}</h1>
          <p className="text-xl text-gray-400 mb-8">{data.heroSubtitle}</p>
          <button className="bg-green-500 px-8 py-3 rounded-full font-bold">
            {data.ctaText}
          </button>
        </div>
      )}
    </main>
  );
}
