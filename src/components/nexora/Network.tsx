import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Radio, MousePointerClick } from "lucide-react";
import { ClientOnly, Heading, Reveal, Sheet, Tilt } from "./ui";
import { DEVICES, type DeviceKind } from "@/lib/nexora";
import type { ViewMode } from "./three/NetworkScene";

const NetworkScene = lazy(() => import("./three/NetworkScene"));
const DeviceViewer = lazy(() => import("./three/DeviceViewer"));

function Viewer({ kind }: { kind: DeviceKind }) {
  return (
    <ClientOnly fallback={<div className="h-full w-full" />}>
      <Suspense fallback={null}>
        <DeviceViewer kind={kind} />
      </Suspense>
    </ClientOnly>
  );
}

export function Network() {
  const [mode, setMode] = useState<ViewMode>("ensemble");
  const [pick, setPick] = useState<DeviceKind | null>(null);
  const modes: [ViewMode, string][] = [["client", "Chez un client"], ["pylone", "Sur un pylône"], ["ensemble", "Vue d'ensemble"]];
  return (
    <Sheet id="reseau" tilt={0.6}>
      <Heading
        eyebrow="Section vedette"
        title={<>Notre réseau à <span className="text-gradient">Butembo</span></>}
        intro="Du site central Starlink jusqu'à votre toit : cliquez sur un équipement pour découvrir son rôle."
      />
      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {modes.map(([m, l]) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === m ? "bg-brand text-on-deep shadow-glow" : "bg-muted text-foreground hover:bg-accent"}`}>
            {l}
          </button>
        ))}
        <span className="ml-auto hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <MousePointerClick className="h-4 w-4" /> Cliquez sur une antenne
        </span>
      </div>
      <div className="relative h-[460px] overflow-hidden rounded-2xl border border-border sm:h-[600px]">
        <ClientOnly fallback={<div className="h-full" style={{ background: "var(--gradient-deep)" }} />}>
          <Suspense fallback={<div className="h-full" style={{ background: "var(--gradient-deep)" }} />}>
            <NetworkScene mode={mode} onPick={setPick} />
          </Suspense>
        </ClientOnly>
        <AnimatePresence>
          {pick && (
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="glass-deep absolute inset-x-3 bottom-3 rounded-2xl p-5 text-on-deep sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-auto sm:w-80">
              <button onClick={() => setPick(null)} className="absolute right-3 top-3" aria-label="Fermer"><X className="h-5 w-5" /></button>
              <div className="h-36"><Viewer kind={pick} /></div>
              <h3 className="font-display text-lg font-bold">{DEVICES[pick].name}</h3>
              <p className="text-sm text-cyan">{DEVICES[pick].role}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-on-deep-muted"><Radio className="h-3 w-3" /> Portée : {DEVICES[pick].range}</p>
              <p className="mt-2 text-sm text-on-deep-muted">{DEVICES[pick].text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Sheet>
  );
}

export function Equipment() {
  const kinds: DeviceKind[] = ["cambium", "nanostation", "litebeam", "router"];
  return (
    <Sheet id="equipements">
      <Heading eyebrow="Nos équipements" title="Le matériel professionnel derrière votre connexion" center />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kinds.map((k, i) => (
          <Reveal key={k} delay={i * 0.1}>
            <Tilt className="h-full">
              <div className="h-full overflow-hidden rounded-2xl border border-border bg-card">
                <div className="h-48" style={{ background: "var(--gradient-deep)" }}><Viewer kind={k} /></div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold">{DEVICES[k].name}</h3>
                  <p className="text-sm font-medium text-primary">{DEVICES[k].role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{DEVICES[k].text}</p>
                  <p className="mt-3 text-xs text-muted-foreground">Portée : {DEVICES[k].range}</p>
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </Sheet>
  );
}
