import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <a href="#accueil" className={cn("group inline-flex items-center gap-2", className)} aria-label="Nexora, accueil">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
        <defs>
          <linearGradient id="nx-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1E6BFF" />
            <stop offset="1" stopColor="#4DB8FF" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#nx-g)" />
        <g className="logo-wave" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
          <path d="M11 20a12 12 0 0 1 18 0" opacity=".55" />
          <path d="M14.5 23.5a7 7 0 0 1 11 0" opacity=".8" />
          <path d="M18 27a2.6 2.6 0 0 1 4 0" />
        </g>
        <circle cx="20" cy="30" r="1.6" fill="#fff" />
      </svg>
      <span className={cn("font-display text-xl font-bold tracking-[0.14em]", light ? "text-on-deep" : "")}>
        NEX<span className="text-gradient">ORA</span>
      </span>
    </a>
  );
}

export function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    const t2 = setTimeout(() => setGone(true), 2600);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);
  if (gone) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 transition-opacity duration-700",
        done ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{ background: "var(--gradient-deep)" }}
    >
      <Logo light className="scale-150" />
      <div className="flex h-10 items-end gap-1.5" aria-label="Chargement">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="w-2.5 rounded-sm bg-brand"
            initial={{ height: 4, opacity: 0.3 }}
            animate={{ height: 8 + i * 8, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.3, duration: 0.35 }}
          />
        ))}
      </div>
      <p className="font-display text-xs tracking-[0.3em] text-on-deep-muted">CONNEXION AU RÉSEAU…</p>
    </div>
  );
}

export function GlowCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[400px] w-[400px] rounded-full opacity-40 mix-blend-screen transition-transform duration-150 ease-out"
      style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--cyan) 45%, transparent), transparent 65%)" }}
    />
  );
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => ref.current && (ref.current.style.transform = "")}
      className={cn("inline-block transition-transform duration-200 ease-out", className)}
    >
      {children}
    </div>
  );
}

export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(0)`;
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => ref.current && (ref.current.style.transform = "")}
      className={cn("transition-transform duration-300 ease-out [transform-style:preserve-3d]", className)}
    >
      {children}
    </div>
  );
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A thick bristol sheet that lifts slightly with scroll parallax */
export function Sheet({ id, children, className, tilt = 0 }: { id?: string; children: ReactNode; className?: string; tilt?: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const rot = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [tilt, 0, -tilt]);
  return (
    <section id={id} ref={ref} className="relative mx-auto w-full max-w-7xl scroll-mt-24 px-3 py-6 sm:px-6 sm:py-10">
      <motion.div style={{ y, rotate: rot }} className={cn("sheet px-5 py-12 sm:px-10 sm:py-16 lg:px-16", className)}>
        {children}
      </motion.div>
    </section>
  );
}

export function Heading({ eyebrow, title, intro, center }: { eyebrow: string; title: ReactNode; intro?: string; center?: boolean }) {
  return (
    <Reveal className={cn("mb-10 max-w-3xl", center && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{intro}</p>}
    </Reveal>
  );
}

export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return <>{m ? children : fallback}</>;
}

export function useLowPower() {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLow(reduce || (nav.deviceMemory ?? 8) < 4 || (navigator.hardwareConcurrency ?? 8) < 4);
  }, []);
  return low;
}
