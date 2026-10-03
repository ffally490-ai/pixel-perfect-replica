import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { DeviceKind } from "@/lib/nexora";
import { Cambium, NanoStation, LiteBeam, Starlink, Router } from "./Devices";

export type ViewMode = "ensemble" | "pylone" | "client";

const CAMS: Record<ViewMode, { pos: [number, number, number]; look: [number, number, number] }> = {
  ensemble: { pos: [16, 16, 16], look: [0, 0, 0] },
  pylone: { pos: [4, 7, 5], look: [0, 4.5, 0] },
  client: { pos: [-4, 3, 9], look: [-6, 1, 5] },
};

const PYLONS: [number, number][] = [[0, 0], [-7, -5], [7, -4]];
const CLIENTS: { p: [number, number]; kind: "maison" | "hotel" | "ecole" | "galerie" | "boutique"; dev: DeviceKind; from: number }[] = [
  { p: [-6, 5], kind: "maison", dev: "nanostation", from: 0 },
  { p: [-2, 6], kind: "boutique", dev: "nanostation", from: 0 },
  { p: [4, 5], kind: "hotel", dev: "nanostation", from: 0 },
  { p: [-11, -1], kind: "ecole", dev: "nanostation", from: 1 },
  { p: [-4, -9], kind: "maison", dev: "nanostation", from: 1 },
  { p: [11, 1], kind: "galerie", dev: "nanostation", from: 2 },
  { p: [10, -9], kind: "maison", dev: "litebeam", from: 2 },
];
const SIZE = { maison: [1.4, 1, 1.4], boutique: [1.6, 1.1, 1.2], hotel: [2, 4, 2], ecole: [3, 1.4, 1.6], galerie: [2.6, 2, 2] } as const;
const COLOR = { maison: "#d9c7a7", boutique: "#c9d6ea", hotel: "#1a2c63", ecole: "#e6d08e", galerie: "#8fa6cf" } as const;
const LABEL = { maison: "Maison", boutique: "Boutique", hotel: "Hôtel", ecole: "École", galerie: "Galerie commerciale" } as const;

function Beam({ a, b }: { a: THREE.Vector3; b: THREE.Vector3 }) {
  const m = useRef<THREE.MeshBasicMaterial>(null);
  const dot = useRef<THREE.Mesh>(null);
  const { mid, len, quat } = useMemo(() => {
    const d = b.clone().sub(a);
    return { mid: a.clone().add(b).multiplyScalar(0.5), len: d.length(), quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()) };
  }, [a, b]);
  const off = useMemo(() => Math.random(), []);
  useFrame(({ clock }) => {
    if (m.current) m.current.opacity = 0.25 + Math.sin(clock.elapsedTime * 3 + off * 6) * 0.15;
    if (dot.current) dot.current.position.lerpVectors(a, b, (clock.elapsedTime * 0.5 + off) % 1);
  });
  return (
    <>
      <mesh position={mid} quaternion={quat}>
        <cylinderGeometry args={[0.04, 0.04, len, 6, 1, true]} />
        <meshBasicMaterial ref={m} color="#4DB8FF" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  );
}

function Tower({ x, z, onPick }: { x: number; z: number; onPick: (k: DeviceKind) => void }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.25, 5, 4]} />
        <meshStandardMaterial color="#b8c4d8" metalness={0.6} roughness={0.4} wireframe />
      </mesh>
      <group position={[0, 5, 0]} onClick={(e) => (e.stopPropagation(), onPick("cambium"))} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
        <Cambium scale={0.6} />
        <Cambium scale={0.6} rotation={[0, (Math.PI * 2) / 3, 0]} />
        <Cambium scale={0.6} rotation={[0, (-Math.PI * 2) / 3, 0]} />
      </group>
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[5.5, 48]} />
        <meshBasicMaterial color="#1E6BFF" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[5.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#4DB8FF" transparent opacity={0.05} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Rig({ mode }: { mode: ViewMode }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  useFrame((_, d) => {
    const c = CAMS[mode];
    const a = 1 - Math.exp(-3 * Math.min(d, 0.05));
    camera.position.lerp(new THREE.Vector3(...c.pos), a);
    look.current.lerp(new THREE.Vector3(...c.look), a);
    camera.lookAt(look.current);
  });
  return null;
}

export default function NetworkScene({ mode, onPick }: { mode: ViewMode; onPick: (k: DeviceKind) => void }) {
  const hub = useMemo(() => new THREE.Vector3(0, 3, -12), []);
  const tops = useMemo(() => PYLONS.map(([x, z]) => new THREE.Vector3(x, 5, z)), []);
  const hover = { onPointerOver: () => (document.body.style.cursor = "pointer"), onPointerOut: () => (document.body.style.cursor = "") };
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [16, 16, 16], fov: 40 }}>
      <color attach="background" args={["#071435"]} />
      <fog attach="fog" args={["#071435", 25, 60]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} />
      <Environment resolution={64}>
        <Lightformer intensity={1.5} position={[0, 8, 4]} scale={[20, 6, 1]} />
      </Environment>
      <Sparkles count={80} scale={[40, 10, 40]} position={[0, 5, 0]} size={2} color="#4DB8FF" />
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#13306b" roughness={0.95} />
      </mesh>
      <gridHelper args={[60, 30, "#1E6BFF", "#1a3a80"]} position={[0, 0.01, 0]} />
      {/* Central site */}
      <group position={[0, 0, -12]}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[4, 2, 2.5]} />
          <meshStandardMaterial color="#e8eef8" />
        </mesh>
        <group position={[0, 2.4, 0]} onClick={(e) => (e.stopPropagation(), onPick("starlink"))} {...hover}>
          <Starlink scale={0.9} />
        </group>
        <Html position={[0, 4.2, 0]} center distanceFactor={18}>
          <span className="glass-deep whitespace-nowrap rounded-full px-3 py-1 font-display text-xs">Site central Starlink</span>
        </Html>
      </group>
      {tops.map((t, i) => (
        <Beam key={i} a={hub} b={t} />
      ))}
      {PYLONS.map(([x, z], i) => (
        <Tower key={i} x={x} z={z} onPick={onPick} />
      ))}
      {CLIENTS.map((c, i) => {
        const s = SIZE[c.kind];
        const roof = new THREE.Vector3(c.p[0], s[1] + 0.4, c.p[1]);
        return (
          <group key={i}>
            <mesh position={[c.p[0], s[1] / 2, c.p[1]]}>
              <boxGeometry args={s as unknown as [number, number, number]} />
              <meshStandardMaterial color={COLOR[c.kind]} roughness={0.8} />
            </mesh>
            <group position={roof.toArray()} onClick={(e) => (e.stopPropagation(), onPick(c.dev))} {...hover}>
              {c.dev === "litebeam" ? <LiteBeam scale={0.45} /> : <NanoStation scale={0.5} />}
            </group>
            {c.kind === "hotel" && (
              <group position={[c.p[0] + 1.6, 0.5, c.p[1]]} onClick={(e) => (e.stopPropagation(), onPick("router"))} {...hover}>
                <Router scale={0.5} />
              </group>
            )}
            <Beam a={tops[c.from]!} b={roof} />
            <Html position={[c.p[0], s[1] + 1.2, c.p[1]]} center distanceFactor={20}>
              <span className="glass-deep whitespace-nowrap rounded-full px-2 py-0.5 text-[10px]">{LABEL[c.kind]}</span>
            </Html>
          </group>
        );
      })}
      <Rig mode={mode} />
    </Canvas>
  );
}
