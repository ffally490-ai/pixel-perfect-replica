import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Wifi, Router as RouterIcon, Satellite, SunMedium, Camera, Cable, Radio, Check, Search, Gauge, Target, Eye, HeartHandshake } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Heading, Logo, Reveal, Sheet, Tilt, Magnetic } from "./ui";
import { NAV, COMMUNES, WA_LINK } from "@/lib/nexora";
import pdg from "@/assets/pdg.jpg";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);
  const toggle = () => {
    document.documentElement.classList.toggle("dark", !dark);
    setDark(!dark);
  };
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <nav className="glass-deep mx-3 flex items-center justify-between rounded-2xl px-4 py-2.5 text-on-deep sm:mx-6">
        <Logo light />
        <ul className="hidden items-center gap-1 xl:flex">
          {NAV.slice(1).map((n) => (
            <li key={n.href}><a href={n.href} className="rounded-full px-3 py-1.5 text-sm text-on-deep-muted transition hover:bg-glass hover:text-on-deep">{n.label}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Changer de thème" className="rounded-full p-2 hover:bg-glass">{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          <a href="#offres" className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold sm:inline-block">S'abonner</a>
          <button onClick={() => setOpen(!open)} className="rounded-full p-2 xl:hidden" aria-label="Menu">{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-deep mx-3 mt-2 grid gap-1 rounded-2xl p-3 text-on-deep sm:mx-6 xl:hidden">
            {NAV.map((n) => (
              <li key={n.href}><a onClick={() => setOpen(false)} href={n.href} className="block rounded-xl px-4 py-3 hover:bg-glass">{n.label}</a></li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}

const TIMELINE = [
  ["2019", "Naissance de l'idée : trois ingénieurs de Butembo veulent un internet fiable pour leur ville."],
  ["2020", "Premier pylône à Bulengera et 50 premiers clients connectés."],
  ["2022", "Arrivée de la liaison Starlink et extension à Kimemi et Mususa."],
  ["2024", "Lancement des hotspots Wi-Fi pour hôtels, écoles et galeries."],
  ["2026", "Plus de 1 200 clients et 25 points d'accès dans les 4 communes."],
];

export function About() {
  const vals = [
    { i: Target, t: "Mission", d: "Rendre internet haut débit accessible à chaque foyer et entreprise de Butembo." },
    { i: Eye, t: "Vision", d: "Faire de Butembo une ville connectée, moteur numérique du Nord-Kivu." },
    { i: HeartHandshake, t: "Valeurs", d: "Fiabilité, proximité, transparence des prix et respect du client." },
  ];
  return (
    <Sheet id="apropos" tilt={-0.5}>
      <Heading eyebrow="À propos" title="Une entreprise de Butembo, pour Butembo" intro="Nexora est née d'une conviction simple : une connexion stable change la vie d'une famille, d'une école et d'un commerce. Nous construisons notre propre réseau radio, pylône après pylône." />
      <div className="grid gap-5 md:grid-cols-3">
        {vals.map((v, i) => (
          <Reveal key={v.t} delay={i * 0.1}>
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <v.i className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-display text-xl font-bold">{v.t}</h3>
              <p className="mt-2 text-muted-foreground">{v.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <ol className="relative mt-14 border-l-2 border-primary/40 pl-8">
        {TIMELINE.map(([y, t], i) => (
          <Reveal key={y} delay={i * 0.08} className="mb-8 last:mb-0">
            <li className="relative">
              <span className="absolute -left-[42px] top-1 h-5 w-5 rounded-full bg-brand shadow-glow" />
              <p className="font-display text-2xl font-bold text-gradient">{y}</p>
              <p className="text-muted-foreground">{t}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Sheet>
  );
}

export function Ceo() {
  return (
    <Sheet id="pdg" tilt={0.5}>
      <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr]">
        <Reveal>
          <div className="sheet rotate-[-2deg] p-3">
            <img src={pdg} alt="Portrait du Directeur Général de Nexora dans son bureau" loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="eyebrow">Mot du PDG</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">« Connecter Butembo, c'est notre fierté. »</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>Chers clients, chers partenaires,</p>
            <p>Lorsque nous avons installé notre premier pylône à Bulengera, nous avions une promesse en tête : offrir à Butembo une connexion à la hauteur de son dynamisme. Aujourd'hui, des familles, des écoles, des hôtels et des commerçants comptent sur Nexora chaque jour, et nous mesurons la responsabilité que cela représente.</p>
            <p>Notre engagement reste le même : une qualité de service constante, des techniciens proches de vous, des prix clairs et une innovation permanente, du satellite Starlink à l'énergie solaire. Chaque nouvelle antenne est un pas de plus vers une ville pleinement connectée.</p>
            <p>Merci pour votre confiance et votre fidélité. C'est grâce à vous que Nexora grandit.</p>
          </div>
          <p className="mt-8 font-hand text-4xl text-primary" style={{ fontFamily: "Caveat, cursive" }}>Le Directeur Général, Nexora</p>
        </Reveal>
      </div>
    </Sheet>
  );
}

const SERVICES = [
  { i: Wifi, t: "Internet par abonnement", d: "Connexion illimitée par antenne, dès 30 $/mois.", tag: "30 $/mois" },
  { i: Radio, t: "Hotspot Wi-Fi haut débit", d: "Pour galeries, hôtels et écoles, avec gestion des accès." },
  { i: Satellite, t: "Kit Starlink", d: "Vente, installation et configuration de kits Starlink." },
  { i: RouterIcon, t: "Routeurs Wi-Fi", d: "Routeurs performants pour couvrir toute la maison." },
  { i: SunMedium, t: "Installation solaire", d: "Panneaux, batteries, onduleurs et câbles : restez connecté sans coupure." },
  { i: Camera, t: "Caméras de sécurité", d: "Vidéosurveillance consultable à distance sur votre téléphone." },
  { i: Cable, t: "Équipements réseaux et électriques", d: "Vente et installation de matériel professionnel." },
];

export function Services() {
  return (
    <Sheet id="services" tilt={-0.5}>
      <Heading eyebrow="Nos services" title="Tout pour vous connecter, et rester connecté" center />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <Reveal key={s.t} delay={(i % 4) * 0.08}>
            <Tilt className="h-full">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:shadow-glow">
                <div className="mb-4 inline-flex rounded-xl bg-brand p-3 text-on-deep"><s.i className="h-6 w-6" /></div>
                <h3 className="font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                {s.tag && <span className="mt-3 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">{s.tag}</span>}
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </Sheet>
  );
}

const PLANS = [
  { n: "Domicile", p: "30 $", u: "/mois", rec: true, f: ["Internet illimité", "Jusqu'à 10 Mbit/s", "Routeur Wi-Fi inclus", "Support 7j/7"] },
  { n: "Business", p: "75 $", u: "/mois", f: ["Débit garanti 20 Mbit/s", "IP fixe", "Intervention prioritaire", "Jusqu'à 30 appareils"] },
  { n: "Hotspot / Entreprise", p: "Sur devis", u: "", f: ["Multi-points d'accès", "Portail de connexion", "Gestion des utilisateurs", "Étude de site gratuite"] },
];

export function Offers() {
  const [plan, setPlan] = useState<string | null>(null);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlan(null);
    toast.success("Demande envoyée ! Un conseiller Nexora vous rappelle sous 24 h.");
  };
  return (
    <Sheet id="offres" tilt={0.5}>
      <Heading eyebrow="Offres et tarifs" title="Des prix clairs, sans surprise" center />
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.1}>
            <Tilt className="h-full">
              <div className={`relative flex h-full flex-col rounded-3xl border p-8 ${p.rec ? "border-primary bg-card shadow-glow" : "border-border bg-card"}`}>
                {p.rec && <span className="bg-brand-animated absolute -top-3 left-1/2 -translate-x-1/2 animate-pulse rounded-full px-4 py-1 text-xs font-bold text-on-deep">Recommandée</span>}
                <h3 className="font-display text-xl font-bold">{p.n}</h3>
                <p className="mt-4"><span className="font-display text-5xl font-bold text-gradient">{p.p}</span><span className="text-muted-foreground">{p.u}</span></p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.f.map((f) => <li key={f} className="flex gap-2 text-sm"><Check className="h-5 w-5 shrink-0 text-success" />{f}</li>)}
                </ul>
                <Magnetic className="mt-8 w-full">
                  <button onClick={() => setPlan(p.n)} className={`w-full rounded-full px-6 py-3 font-semibold ${p.rec ? "bg-brand text-on-deep" : "bg-muted text-foreground hover:bg-accent"}`}>Souscrire</button>
                </Magnetic>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <Dialog open={!!plan} onOpenChange={(o) => !o && setPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Souscrire à l'offre {plan}</DialogTitle>
            <DialogDescription>Laissez vos coordonnées, nous organisons l'étude de votre site.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-3">
            <input required placeholder="Nom complet" className="field" />
            <input required placeholder="Téléphone" type="tel" className="field" />
            <select className="field" defaultValue=""><option value="" disabled>Commune</option>{COMMUNES.map((c) => <option key={c.name}>{c.name}</option>)}</select>
            <input placeholder="Quartier / avenue" className="field" />
            <button className="rounded-full bg-brand px-6 py-3 font-semibold text-on-deep">Envoyer la demande</button>
          </form>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

export function HowItWorks() {
  const steps = [
    ["Demande", "Contactez-nous par WhatsApp, téléphone ou formulaire."],
    ["Étude du site", "Un technicien vérifie la visibilité vers notre pylône le plus proche."],
    ["Installation de l'antenne", "Pose de la NanoStation sur le toit et du routeur chez vous."],
    ["Connexion", "Vous êtes en ligne, en général sous 48 h."],
  ];
  return (
    <Sheet id="comment" tilt={-0.4}>
      <Heading eyebrow="Comment ça marche" title="Connecté en 4 étapes" center />
      <div className="grid gap-6 md:grid-cols-4">
        {steps.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.15}>
            <div className="relative text-center">
              <motion.div whileInView={{ scale: [0.6, 1.1, 1] }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand font-display text-2xl font-bold text-on-deep shadow-glow">{i + 1}</motion.div>
              <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Sheet>
  );
}

const POS: Record<string, [number, number]> = { Bulengera: [120, 110], Kimemi: [300, 90], Mususa: [130, 250], Vulamba: [310, 240] };

export function Coverage() {
  const [active, setActive] = useState("Bulengera");
  const [q, setQ] = useState("");
  const [res, setRes] = useState<null | { ok: boolean; msg: string }>(null);
  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const s = q.trim().toLowerCase();
    if (!s) return;
    const c = COMMUNES.find((c) => c.name.toLowerCase() === s || c.quartiers.some((x) => x.toLowerCase() === s));
    setRes(c ? { ok: true, msg: `Bonne nouvelle ! « ${q} » est couvert (commune ${c.name}).` } : { ok: false, msg: `« ${q} » n'est pas encore couvert. Laissez-nous votre numéro, nous arrivons bientôt !` });
    if (c) setActive(c.name);
  };
  const cur = COMMUNES.find((c) => c.name === active)!;
  return (
    <Sheet id="couverture" tilt={0.4}>
      <Heading eyebrow="Zone de couverture" title="Butembo, commune par commune" />
      <div className="grid gap-8 lg:grid-cols-2">
        <svg viewBox="0 0 430 340" className="w-full rounded-2xl" style={{ background: "var(--gradient-deep)" }} role="img" aria-label="Carte de Butembo">
          {Object.entries(POS).map(([n, [x, y]]) => (
            <g key={n} onClick={() => setActive(n)} className="cursor-pointer">
              <circle cx={x} cy={y} r={75} fill="var(--electric)" opacity={active === n ? 0.35 : 0.12} stroke="var(--cyan)" strokeDasharray="4 4" />
              {[0, 1, 2].map((k) => <circle key={k} cx={x + (k - 1) * 28} cy={y + (k % 2 ? 22 : -10)} r={6} fill="var(--cyan)" className="animate-pulse" />)}
              <text x={x} y={y + 50} textAnchor="middle" fill="var(--on-deep)" fontSize="15" fontWeight="700">{n}</text>
            </g>
          ))}
        </svg>
        <div>
          <h3 className="font-display text-2xl font-bold">Commune {cur.name}</h3>
          <p className="mt-2 text-muted-foreground">Quartiers couverts :</p>
          <div className="mt-3 flex flex-wrap gap-2">{cur.quartiers.map((x) => <span key={x} className="rounded-full bg-primary/15 px-3 py-1 text-sm text-primary">{x}</span>)}</div>
          <form onSubmit={check} className="mt-8">
            <label htmlFor="q" className="font-semibold">Vérifier si mon quartier est couvert</label>
            <div className="mt-2 flex gap-2">
              <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex. Kalemire" className="field flex-1" />
              <button className="rounded-full bg-brand px-5 text-on-deep" aria-label="Vérifier"><Search className="h-5 w-5" /></button>
            </div>
          </form>
          <AnimatePresence mode="wait">
            {res && (
              <motion.p key={res.msg} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`mt-4 rounded-xl p-4 font-medium ${res.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>{res.msg}</motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Sheet>
  );
}

export function Simulator() {
  const [speed, setSpeed] = useState(0);
  const [testing, setTesting] = useState(false);
  const [devices, setDevices] = useState(4);
  const [usage, setUsage] = useState("navigation");
  const run = () => {
    setTesting(true);
    setSpeed(0);
    const target = 8 + Math.random() * 4;
    let t = 0;
    const id = setInterval(() => {
      t += 0.05;
      setSpeed(Math.min(target, target * t + Math.random()));
      if (t >= 1) { clearInterval(id); setSpeed(target); setTesting(false); }
    }, 80);
  };
  const score = devices + (usage === "streaming" ? 6 : usage === "pro" ? 12 : 0);
  const rec = score > 14 ? "Hotspot / Entreprise" : score > 8 ? "Business" : "Domicile";
  const angle = -120 + (Math.min(speed, 20) / 20) * 240;
  return (
    <Sheet id="simulateur" tilt={-0.4}>
      <Heading eyebrow="Simulateur" title="Testez, comparez, choisissez" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <svg viewBox="0 0 200 140" className="mx-auto w-full max-w-xs">
            <path d="M20 120 A80 80 0 1 1 180 120" fill="none" stroke="var(--muted)" strokeWidth="14" strokeLinecap="round" />
            <path d="M20 120 A80 80 0 1 1 180 120" fill="none" stroke="var(--electric)" strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray={`${(Math.min(speed, 20) / 20) * 100} 100`} />
            <line x1="100" y1="100" x2="100" y2="40" stroke="var(--cyan)" strokeWidth="4" strokeLinecap="round" style={{ transform: `rotate(${angle}deg)`, transformOrigin: "100px 100px", transition: "transform .1s" }} />
            <circle cx="100" cy="100" r="7" fill="var(--cyan)" />
          </svg>
          <p className="font-display text-4xl font-bold">{speed.toFixed(1)} <span className="text-base text-muted-foreground">Mbit/s</span></p>
          <button onClick={run} disabled={testing} className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-on-deep disabled:opacity-60"><Gauge className="h-5 w-5" />{testing ? "Test en cours…" : "Lancer le test"}</button>
          <p className="mt-2 text-xs text-muted-foreground">Démonstration : valeurs simulées.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl font-bold">Quelle offre pour moi ?</h3>
          <label className="mt-5 block text-sm font-medium">Nombre d'appareils : {devices}</label>
          <input type="range" min={1} max={30} value={devices} onChange={(e) => setDevices(+e.target.value)} className="w-full accent-[var(--electric)]" />
          <p className="mt-5 text-sm font-medium">Usage principal</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {([["navigation", "Navigation"], ["streaming", "Vidéo"], ["pro", "Professionnel"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setUsage(v)} className={`rounded-xl px-3 py-2 text-sm ${usage === v ? "bg-brand text-on-deep" : "bg-muted"}`}>{l}</button>
            ))}
          </div>
          <motion.div key={rec} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">Nous vous recommandons :</p>
            <p className="font-display text-2xl font-bold text-primary">Offre {rec}</p>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold underline">En parler sur WhatsApp</a>
          </motion.div>
        </div>
      </div>
    </Sheet>
  );
}
