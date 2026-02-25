import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/client-layout-wrapper";
import Script from "next/script";

// Configure Fonts (Binary Rhythm)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ela-revolution.com"),
  title: "ELA - API d'Intelligence Artificielle pour Entreprises",
  description: "ELA est votre API de transmission IA. Une infrastructure souveraine entraînée pour la performance. +12 000 entreprises nous font confiance.",
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
    url: "https://ela-revolution.com",
    title: "ELA - API Transmission Layer",
    description: "ELA est votre API de transmission IA, une infrastructure propriétaire entraînée en interne.",
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
    description: "ELA est votre API de transmission IA, une infrastructure propriétaire souveraine.",
    images: ["/twitter-image.png"],
    creator: "@ela_revolution",
  },
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
    canonical: "https://ela-revolution.com",
    languages: {
      'fr-FR': 'https://ela-revolution.com/fr',
      'en-US': 'https://ela-revolution.com/en',
    },
  },
};


import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-[#0b0c10] font-sans antialiased text-[#c5c6c7] selection:bg-[#66fcf1]/30 selection:text-white">
        <div className="loading-bar-precision" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QJSJ2KCMEC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QJSJ2KCMEC');
          `}
        </Script>
        <GlobalErrorBoundary>
          <Providers>
            <ClientLayoutWrapper>
              <div className="fixed inset-0 bg-[#0b0c10] -z-50" />
              {children}
            </ClientLayoutWrapper>
          </Providers>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
