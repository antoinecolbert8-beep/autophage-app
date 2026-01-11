"use client";

/**
 * 🎯 GENESIS - COPIE EXACTE LIMOVA.AI
 * Design identique pixel par pixel
 */

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [selectedAgent, setSelectedAgent] = useState("Tom");

  const agents = [
    { id: "Tom", name: "Tom", role: "Agent Téléphonie & relation client" },
    { id: "John", name: "John", role: "Agent Marketing" },
    { id: "Lou", name: "Lou", role: "Agent SEO" },
    { id: "Charly+", name: "Charly+", role: "Agent Général" },
    { id: "Elio", name: "Elio", role: "Agent Commercial" },
    { id: "Manue", name: "Manue", role: "Agent Comptable" },
    { id: "Julia", name: "Julia", role: "Agent Juridique" },
    { id: "Rony", name: "Rony", role: "Agent Recrutement" },
  ];

  return (
    <div className="min-h-screen bg-[rgb(6,4,3)] text-white">
      {/* Navigation - EXACT LIMOVA */}
      <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded"></div>
              <span className="text-xl font-semibold">Genesis</span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/legend" className="text-sm font-medium hover:opacity-80">
                Legend
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/agents-ia" className="text-sm font-medium hover:opacity-80">
                  Agents IA
                </Link>
                <Link href="/agents/charly" className="text-sm font-medium hover:opacity-80">
                  Charly+
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                <Link href="/pricing" className="text-sm font-medium hover:opacity-80">
                  Nos Offres
                </Link>
                <Link href="/#faq" className="text-sm font-medium hover:opacity-80">
                  F.A.Q
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                <Link href="/#process" className="text-sm font-medium hover:opacity-80">
                  Processus
                </Link>
                <Link href="/integrations" className="text-sm font-medium hover:opacity-80">
                  Intégrations
                </Link>
              </div>
              <Link href="/login" className="text-sm font-medium hover:opacity-80">
                Se connecter
              </Link>
            </div>

            {/* CTA Button - EXACT LIMOVA STYLE */}
            <Link
              href="/contact"
              className="btn-limova letter-spaced"
            >
              R e s e r v e r u n e d é m o
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - EXACT LIMOVA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[rgba(255,255,255,0.02)] rounded-[15px] mb-6 text-sm">
              9 agents
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold mb-8 leading-tight">
              Des agents IA autonomes au<br />
              service de votre entreprise
            </h1>

            <div className="flex items-center justify-center space-x-2 mb-8">
              <span className="text-sm">Excellent</span>
              <span className="text-sm font-semibold">4.9 sur 5</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/signup"
                className="btn-limova letter-spaced"
              >
                E s s a y e z 7 j o u r s g r a t u i t e m e n t
              </Link>
              <Link
                href="/contact"
                className="btn-limova letter-spaced"
              >
                R é s e r v e r u n e d é m o
              </Link>
            </div>

            {/* Logos médias */}
            <div className="mb-12">
              <p className="text-sm text-[rgba(255,255,255,0.7)] mb-4">Ils parlent de nous</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
                {["TechCrunch", "Forbes", "Les Échos", "BFM", "Le Monde", "L'Usine", "Capital"].map((media, i) => (
                  <div key={i} className="text-sm">{media}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Focus - EXACT LIMOVA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-[rgba(255,255,255,0.7)] mb-4">
              "Disponible 24h/24, 7j/7 : votre équipe IA ne dort jamais."
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold mb-8">
              Concentrez-vous sur ce<br />
              qui compte vraiment.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-limova letter-spaced">
                E s s a y e r g r a t u i t e m e n t
              </Link>
              <Link href="/contact" className="btn-limova letter-spaced">
                R é s e r v e r u n e d é m o
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Agents - EXACT LIMOVA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Liste agents */}
            <div className="space-y-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`w-full text-left p-4 rounded-[15px] transition-all ${
                    selectedAgent === agent.id
                      ? "bg-[rgba(255,255,255,0.05)]"
                      : "bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)]"
                  }`}
                >
                  <div className="font-semibold">{agent.name}</div>
                  <div className="text-sm text-[rgba(255,255,255,0.7)]">{agent.role}</div>
                </button>
              ))}
            </div>

            {/* Détails agent sélectionné */}
            <div className="bg-[rgba(255,255,255,0.02)] rounded-[15px] p-8">
              <h3 className="text-2xl font-semibold mb-4">Découvrez {selectedAgent}</h3>
              <p className="text-[rgba(255,255,255,0.7)] mb-6 leading-relaxed">
                {selectedAgent === "Tom" && (
                  <>
                    Offrez à vos clients une expérience téléphonique ultra réactive, fluide et 100% automatisée. 
                    {selectedAgent}, notre agent IA téléphonique, répond, qualifie, oriente et transmet les appels 
                    importants à votre équipe instantanément.
                  </>
                )}
                {selectedAgent !== "Tom" && (
                  <>
                    {selectedAgent} est un agent IA spécialisé qui automatise vos tâches quotidiennes. 
                    Connecté à tous vos outils, il travaille 24/7 pour vous faire gagner du temps.
                  </>
                )}
              </p>
              <Link href={`/agents/${selectedAgent.toLowerCase()}`} className="btn-limova letter-spaced inline-flex">
                V o i r p l u s d e d é t a i l s
              </Link>

              {/* Features agent */}
              <div className="mt-8 space-y-4">
                {selectedAgent === "Tom" && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[rgba(255,255,255,0.1)] rounded"></div>
                      <span className="text-sm">Compte-rendu instantané</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[rgba(255,255,255,0.1)] rounded"></div>
                      <span className="text-sm">Prise de rendez-vous par téléphone</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[rgba(255,255,255,0.1)] rounded"></div>
                      <span className="text-sm">Qualification intelligente</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[rgba(255,255,255,0.1)] rounded"></div>
                      <span className="text-sm">Réception d'appels 24/7</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[rgba(255,255,255,0.1)] rounded"></div>
                      <span className="text-sm">Transfert d'appel vers un humain</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section WhatsApp/Charly - EXACT LIMOVA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-semibold mb-6">
              Pilotez votre entreprise sur WhatsApp avec
            </h2>
            <p className="text-lg text-[rgba(255,255,255,0.7)] mb-8 max-w-3xl mx-auto">
              Connecté à tous vos outils du quotidien, et à la plateforme Genesis, elle exécute vos missions depuis un simple message sur WhatsApp.
            </p>
            <Link href="/signup" className="btn-limova letter-spaced">
              E s s a y e r g r a t u i t e m e n t
            </Link>
          </div>
        </div>
      </section>

      {/* Section Intégrations - EXACT LIMOVA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-semibold mb-8">
              Vos agents IA intégrés à<br />
              tous vos outils
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-limova letter-spaced">
                E s s a y e r g r a t u i t e m e n t
              </Link>
              <Link href="/integrations" className="btn-limova letter-spaced">
                V o i r t o u t e s l e s i n t é g r a t i o n s
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-[rgba(255,255,255,0.7)] mb-4">+12 automatisations disponibles</p>
            <Link href="/integrations" className="btn-limova letter-spaced inline-flex">
              V o i r t o u t e s l e s i n t é g r a t i o n s
            </Link>
          </div>

          {/* Liste intégrations */}
          <div className="space-y-4">
            {[
              { name: "Instagram", desc: "Genesis automatise la gestion de vos messages, commentaires et publications sur Instagram, tout en maintenant une interaction humaine et personnalisée grâce à ses agents IA." },
              { name: "LinkedIn", desc: "Genesis connecte ses agents IA à LinkedIn pour automatiser l'engagement, la réponse et la relance de vos contacts, tout en personnalisant les échanges pour développer votre réseau." },
              { name: "Facebook", desc: "Grâce à l'intégration avec Facebook, Genesis permet à ses agents IA de gérer automatiquement les messages, commentaires et publications sur votre page, veillant ainsi sur votre réputation en ligne." },
            ].map((integration, i) => (
              <Link
                key={i}
                href={`/integrations/${integration.name.toLowerCase()}`}
                className="block bg-[rgba(255,255,255,0.02)] rounded-[15px] p-6 hover:bg-[rgba(255,255,255,0.03)] transition-all"
              >
                <div className="font-semibold mb-2">Intégration {integration.name}</div>
                <p className="text-sm text-[rgba(255,255,255,0.7)] mb-4">{integration.desc}</p>
                <span className="btn-limova letter-spaced text-xs inline-flex">
                  V o i r l e s d é t a i l s
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Processus - EXACT LIMOVA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-semibold mb-6">
              Commencez à utiliser Genesis en 3 étapes
            </h2>
            <p className="text-lg text-[rgba(255,255,255,0.7)] mb-8 max-w-3xl mx-auto">
              Notre équipe (bien humaine !) vous accompagne pas à pas pour vous aider à prendre en main la plateforme de manière simple et efficace.
            </p>
            <Link href="/signup" className="btn-limova letter-spaced">
              E s s a y e r g r a t u i t e m e n t
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "étape 1", title: "Onboarding en 1:1 sur la plateforme", desc: "Notre équipe vous guide pas à pas pour prendre en main la plateforme, en direct et à votre rythme." },
              { step: "étape 2", title: "Entraînement et mémoire", desc: "Vos agents IA accèdent en temps réel à votre base de données intelligente, pour comprendre vos process et répondre avec précision à chaque situation." },
              { step: "étape 3", title: "Commencez à automatiser", desc: "Automatisez vos tâches récurrentes ou chronophages — vos agents passent à l'action à votre place." },
            ].map((item, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.02)] rounded-[15px] p-8">
                <div className="text-sm text-[rgba(255,255,255,0.7)] mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-sm text-[rgba(255,255,255,0.7)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages - EXACT LIMOVA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-sm">Excellent</span>
              <span className="text-sm font-semibold">4.9 sur 5</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-semibold mb-8">
              +3000 entreprises<br />
              utilisent déjà Genesis
            </h2>
            <Link href="/signup" className="btn-limova letter-spaced">
              E s s a y e r g r a t u i t e m e n t
            </Link>
          </div>

          {/* Témoignages */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: "Depuis qu'on utilise Tom, on ne rate plus un seul appel. Même quand l'équipe est en déplacement, nos clients sont pris en charge et les rendez-vous se placent tout seuls. C'est simple et super efficace.", author: "Claire M.", role: "Directrice d'une Agence Immobilière" },
              { text: "Mickael a changé notre relation client. Avant, on manquait des messages le soir ou le week-end. Maintenant, tout est géré automatiquement, et nos clients sont bluffés par la réactivité.", author: "Karim L.", role: "Dirigeant d'une PME" },
              { text: "C'est pro, rapide. Julia m'a permis de créer tous mes documents juridiques sans passer par un avocat. Je suis sûr de rester dans les clous.", author: "Alexis C.", role: "Dirigeant d'une TPE" },
            ].map((testimonial, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.02)] rounded-[15px] p-6">
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-[rgba(255,255,255,0.7)] mb-4 leading-relaxed">{testimonial.text}</p>
                <div className="text-sm font-semibold">{testimonial.author}</div>
                <div className="text-xs text-[rgba(255,255,255,0.7)]">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - EXACT LIMOVA */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-semibold mb-6">
              Les questions<br />
              fréquentes
            </h2>
            <p className="text-lg text-[rgba(255,255,255,0.7)] mb-8">
              Vous n'êtes jamais seul : chez Genesis, l'accompagnement personnalisé est au cœur de notre mission.
            </p>
            <Link href="/signup" className="btn-limova letter-spaced">
              E s s a y e r g r a t u i t e m e n t
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { q: "Où se trouve le siège de Genesis ?", a: "Genesis est une start-up Made In France, avec une équipe basée à Nice. Nous accompagnons des entreprises partout dans le monde !" },
              { q: "Combien ça coûte ?", a: "Nos tarifs sont transparents et adaptés à chaque profil. Consultez nos formules ici. Vous y trouverez des offres mensuelles et annuelles et des solutions sur mesure pour les entreprises avec des besoins spécifiques." },
              { q: "Genesis convient-il à mon activité ?", a: "Que vous soyez entrepreneur, freelance, startup, PME ou même une grande entreprise, Genesis s'adapte à vos besoins. Nous avons aussi des offres spécifiques pour les étudiants ou structures en forte croissance." },
              { q: "Faut-il des compétences techniques pour utiliser Genesis ?", a: "Absolument pas ! Genesis a été conçu pour être accessible à tous : aucune ligne de code à écrire, aucune configuration complexe. Vous interagissez simplement avec vos assistants IA par messages ou via une interface claire." },
            ].map((faq, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.02)] rounded-[15px] p-6">
                <h3 className="font-semibold mb-3">{faq.q}</h3>
                <p className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - EXACT LIMOVA */}
      <footer className="py-20 px-6 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-white rounded"></div>
                <span className="text-xl font-semibold">Genesis</span>
              </div>
              <div className="space-y-2 text-sm text-[rgba(255,255,255,0.7)]">
                <a href="mailto:contact@genesis.ai" className="block hover:opacity-80">contact@genesis.ai</a>
                <a href="tel:+33423450192" className="block hover:opacity-80">+33 4 23 45 01 92</a>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Entreprise</div>
              <div className="space-y-2 text-sm">
                <Link href="/legend" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Ils parlent de nous</Link>
                <Link href="/#faq" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Faq</Link>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Navigation</div>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Accueil</Link>
                <Link href="/agents-ia" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Agents IA</Link>
                <Link href="/integrations" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Intégrations</Link>
                <Link href="/pricing" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Nos offres</Link>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Informations légales</div>
              <div className="space-y-2 text-sm">
                <Link href="/legal/politique-de-traitement-des-donnees" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Politique de Confidentialité</Link>
                <Link href="/legal/cgv" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Conditions Générales de Vente</Link>
                <Link href="/legal/mentions-legales-cookies" className="block text-[rgba(255,255,255,0.7)] hover:opacity-80">Mentions légales & Cookies</Link>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-[rgba(255,255,255,0.7)]">
            © 2026 Genesis AI, all rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
