import { createFileRoute } from "@tanstack/react-router";
import { Preloader, GlowCursor } from "@/components/nexora/ui";
import { Hero, Stats } from "@/components/nexora/Hero";
import { Network, Equipment } from "@/components/nexora/Network";
import { Nav, About, Ceo, Services, Offers, HowItWorks, Coverage, Simulator } from "@/components/nexora/SectionsA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexora — Internet haut débit à Butembo" },
      { name: "description", content: "Nexora, fournisseur d'accès internet à Butembo : abonnement dès 30 $/mois, hotspot, Starlink, solaire." },
      { property: "og:title", content: "Nexora — Votre connexion, sans limites" },
      { property: "og:description", content: "Internet par antenne dès 30 $/mois à Butembo, Nord-Kivu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen" style={{ background: "var(--gradient-deep)" }}>
      <Preloader />
      <GlowCursor />
      <Nav />
      <Hero />
      <Stats />
      <Network />
      <Equipment />
      <About />
      <Ceo />
      <Services />
      <Offers />
      <HowItWorks />
      <Coverage />
      <Simulator />
      <p className="py-8 text-center text-xs text-on-deep-muted">© 2026 Nexora · Maquette illustrative – contenu fictif</p>
    </main>
  );
}
