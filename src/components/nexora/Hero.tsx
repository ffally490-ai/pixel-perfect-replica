import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion, useInView, animate } from "framer-motion";
import { MessageCircle, ArrowRight, Wifi } from "lucide-react";
import { ClientOnly, Magnetic, Reveal, useLowPower } from "./ui";
import { WA_LINK } from "@/lib/nexora";

const HeroScene = lazy(() => import("./three/HeroScene"));

const STEPS = [
  [0, "1. Le message part de l'application WhatsApp"],
  [0.12, "2. Il traverse le système, la carte réseau, le câble"],
  [0.3, "3. Devenu paquet de données, il passe par le routeur"],
  [0.45, "4. Il monte jusqu'à l'émetteur sur pylône"],
  [0.6, "5. Liaison radio : Cambium → NanoStation"],
  [0.78, "6. Les ondes Wi-Fi atteignent l'hôtel"],
  [0.93, "7. Message reçu ✓✓"],
] as const;

function Typing({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), 40);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span>
      {text.slice(0, n)}
      <span className="caret">|</span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  const low = useLowPower();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    let s = 0;
    STEPS.forEach(([t], i) => v >= t && (s = i));
    setStep(s);
  });

  return (
    <div id="accueil" ref={ref} className="relative h-[420vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "var(--gradient-deep)" }}>
        <div className="absolute inset-0">
          <ClientOnly>
            <Suspense fallback={null}>
              <HeroScene progress={progress} low={low} />
            </Suspense>
          </ClientOnly>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/30 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8">
          <motion.div
            style={{ opacity: 1 }}
            animate={{ opacity: step > 1 ? 0.15 : 1, y: step > 1 ? -20 : 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl text-on-deep"
          >
            <p className="eyebrow !text-cyan">Fournisseur d'accès internet · Butembo</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-6xl">
              Nexora : Votre connexion, <span className="text-gradient">sans limites.</span>
            </h1>
            <p className="mt-5 min-h-[3.5rem] text-lg text-on-deep-muted">
              <Typing text="Internet haut débit par antenne, Starlink, hotspot Wi-Fi et solaire pour toute la ville de Butembo." />
            </p>
            <div className="pointer-events-auto mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <a href="#offres" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-on-deep shadow-glow">
                  Voir nos offres <ArrowRight className="h-4 w-4" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={WA_LINK} target="_blank" rel="noreferrer" className="glass-deep inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-on-deep">
                  <MessageCircle className="h-4 w-4 text-whatsapp" /> Parler sur WhatsApp
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 px-4">
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-deep rounded-full px-5 py-2 text-center font-display text-sm text-on-deep">
            {STEPS[step]?.[1]}
          </motion.div>
          {step === 0 && <p className="mt-2 text-center text-xs text-on-deep-muted">Faites défiler pour suivre le voyage du message ↓</p>}
        </div>
      </div>
    </div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v).toLocaleString("fr-FR") + suffix) });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export function Stats() {
  const items = [
    { n: 1200, s: "+", l: "clients connectés" },
    { n: 25, s: "+", l: "points d'accès" },
    { n: 4, s: "", l: "communes couvertes" },
    { n: 7, s: "j/7", l: "support technique" },
  ];
  return (
    <section className="relative mx-auto -mt-2 max-w-7xl px-3 py-10 sm:px-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.l} delay={i * 0.1}>
            <div className="sheet p-6 text-center">
              <p className="font-display text-4xl font-bold text-gradient sm:text-5xl">
                <Counter to={it.n} suffix={it.s} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{it.l}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <a href="#offres" className="bg-brand-animated mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl px-8 py-6 text-on-deep shadow-glow sm:flex-row">
          <span className="flex items-center gap-3 font-display text-xl font-bold sm:text-2xl">
            <Wifi className="h-7 w-7" /> Abonnement internet dès 30 $/mois
          </span>
          <span className="rounded-full bg-on-deep px-5 py-2 text-sm font-semibold text-ink">Je m'abonne →</span>
        </a>
      </Reveal>
    </section>
  );
}
