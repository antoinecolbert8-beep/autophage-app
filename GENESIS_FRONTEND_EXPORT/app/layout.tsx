import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "@/components/client-layout-wrapper";

export const metadata: Metadata = {
  title: "ELA - API d'Intelligence Artificielle pour Entreprises | Powered by Genesis",
  description: "ELA est votre API de transmission IA. Propulsée par Genesis, notre IA propriétaire entraînée en interne. +12 000 entreprises nous font confiance.",
  keywords: [
    "agents IA",
    "automatisation marketing",
    "intelligence artificielle entreprise",
    "génération contenu IA",
    "chatbot IA",
    "prospection LinkedIn automatique",
    "génération vidéos IA",
    "carrousels Instagram automatiques",
    "agent téléphonique IA",
    "rédaction SEO IA"
  ],
  authors: [{ name: "ELA Team" }],
  creator: "ELA",
  publisher: "ELA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://genesis-ai.com",
    title: "ELA - API Transmission Layer powered by Genesis AI",
    description: "ELA est votre API de transmission IA, propulsée par Genesis (notre IA propriétaire entraînée en interne).",
    siteName: "ELA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ELA - API Transmission Layer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELA - API d'Intelligence Artificielle",
    description: "ELA est votre API de transmission IA, propulsée par Genesis (notre IA propriétaire).",
    images: ["/twitter-image.png"],
    creator: "@genesis_ai",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "https://genesis-ai.com",
    languages: {
      'fr-FR': 'https://genesis-ai.com/fr',
      'en-US': 'https://genesis-ai.com/en',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
