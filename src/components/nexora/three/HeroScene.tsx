import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Router, Cambium, NanoStation } from "./Devices";

type P = MutableRefObject<number>;

const PATH = new THREE.CatmullRomCurve3(
  [
    [0, 1.6, 2.6],
    [0, 1.6, 1.3],
    [0, 1.6, 0],
    [0, 1.6, -1.3],
    [0, 0.6, -2.4],
    [4, 0.4, -2],
    [9, 1.1, 0],
    [12, 3, 0],
    [16, 7.6, 0],
    [24, 6.6, 0],
    [31, 3.4, 0],
    [36, 3.2, 0],
    [41, 2, 2],
    [42, 1.4, 3.2],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  false,
  "catmullrom",
  0.3,
);

const ease = (t: number) => t * t * (3 - 2 * t);

function Layer({ z, label, color, children }: { z: number; label: string; color: string; children?: ReactNode }) {
  return (
    <group position={[0, 1.6, z]}>
      <RoundedBox args={[3.2, 2, 0.06]} radius={0.05}>
        <meshPhysicalMaterial color={color} transparent opacity={0.35} roughness={0.15} transmission={0.4} thickness={0.2} />
      </RoundedBox>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3.2, 2, 0.06)]} />
        <lineBasicMaterial color="#4DB8FF" />
      </lineSegments>
      {children}
      <Html position={[1.75, 1.05, 0]} center distanceFactor={9}>
        <span className="glass-deep whitespace-nowrap rounded-full px-3 py-1 font-display text-xs">{label}</span>
      </Html>
    </group>
  );
}

function Computer() {
  return (
    <group>
      <Layer z={2.6} label="Écran" color="#1E6BFF">
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[3, 1.8]} />
          <meshStandardMaterial color="#0A1F5C" emissive="#1E6BFF" emissiveIntensity={0.35} />
        </mesh>
      </Layer>
      <Layer z={1.3} label="Application WhatsApp" color="#25D366">
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[0.35, 32]} />
          <meshStandardMaterial color="#25D366" emissive="#25D366" emissiveIntensity={0.8} />
        </mesh>
      </Layer>
      <Layer z={0} label="Système d'exploitation" color="#4DB8FF" />
      <Layer z={-1.3} label="Carte réseau" color="#0f5132">
        {[-1, -0.5, 0, 0.5, 1].map((x) => (
          <mesh key={x} position={[x, -0.5, 0.05]}>
            <boxGeometry args={[0.3, 0.3, 0.08]} />
            <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </Layer>
      {/* Ethernet cable */}
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.6, -1.4), new THREE.Vector3(0, 0.4, -2.4), new THREE.Vector3(4, 0.3, -2), new THREE.Vector3(8.4, 0.8, 0)]), 40, 0.05, 8]} />
        <meshStandardMaterial color="#2a3a66" emissive="#1E6BFF" emissiveIntensity={0.3} />
      </mesh>
      <Html position={[3.2, 0.9, -2.1]} center distanceFactor={9}>
        <span className="glass-deep whitespace-nowrap rounded-full px-3 py-1 font-display text-xs">Câble Ethernet</span>
      </Html>
    </group>
  );
}

function Pylon({ position, height = 8 }: { position: [number, number, number]; height?: number }) {
  const legs: [number, number][] = [
    [-0.6, -0.6],
    [0.6, -0.6],
    [0.6, 0.6],
    [-0.6, 0.6],
  ];
  return (
    <group position={position}>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x / 2, height / 2, z / 2]} rotation={[z * 0.08, 0, -x * 0.08]}>
          <cylinderGeometry args={[0.04, 0.06, height, 6]} />
          <meshStandardMaterial color="#b8c4d8" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      {Array.from({ length: Math.floor(height / 1.2) }).map((_, i) => {
        const y = 0.8 + i * 1.2;
        const w = 0.6 - (y / height) * 0.35;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[w * 1.6, 0.03, 0.03]} />
              <meshStandardMaterial color="#9aa7bd" />
            </mesh>
            <mesh rotation={[Math.PI / 4, Math.PI / 2, 0]}>
              <boxGeometry args={[w * 1.6, 0.03, 0.03]} />
              <meshStandardMaterial color="#9aa7bd" />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, height + 0.3, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#ff4d4d" emissive="#ff4d4d" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function Beam({ from, to, active }: { from: THREE.Vector3; to: THREE.Vector3; active: (p: number) => number; }) {
  const m = useRef<THREE.MeshBasicMaterial>(null);
  const { mid, len, quat } = useMemo(() => {
    const dir = to.clone().sub(from);
    return {
      mid: from.clone().add(to).multiplyScalar(0.5),
      len: dir.length(),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()),
    };
  }, [from, to]);
  useFrame(({ clock }) => {
    if (m.current) m.current.opacity = 0.15 + active(0) * (0.55 + Math.sin(clock.elapsedTime * 8) * 0.2);
  });
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.07, 0.07, len, 10, 1, true]} />
      <meshBasicMaterial ref={m} color="#4DB8FF" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function WifiRings({ origin, progress }: { origin: [number, number, number]; progress: P }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const on = progress.current > 0.76 ? 1 : 0.25;
    g.children.forEach((c, i) => {
      const t = (clock.elapsedTime * 0.6 + i / 4) % 1;
      c.scale.setScalar(0.3 + t * 5);
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.7 * on;
    });
  });
  return (
    <group ref={group} position={origin} rotation={[0, Math.PI / 2, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i}>
          <torusGeometry args={[0.5, 0.025, 8, 48, Math.PI * 0.9]} />
          <meshBasicMaterial color="#4DB8FF" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Hotel({ progress }: { progress: P }) {
  const windows = useMemo(() => {
    const w: [number, number, number][] = [];
    for (let y = 0; y < 9; y++) for (let x = 0; x < 5; x++) w.push([-1.4 + x * 0.7, 0.8 + y * 0.75, 1.51]);
    return w;
  }, []);
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const [msgOn, setMsg] = [useRef(false), () => {}];
  useFrame(() => {
    const on = progress.current > 0.93;
    msgOn.current = on;
    if (screen.current) screen.current.emissiveIntensity = THREE.MathUtils.lerp(screen.current.emissiveIntensity, on ? 1.6 : 0.05, 0.08);
  });
  void setMsg;
  return (
    <group position={[44, 0, 0]}>
      <mesh position={[0, 3.6, 0]} castShadow>
        <boxGeometry args={[4, 7.2, 3]} />
        <meshStandardMaterial color="#1a2c63" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 7.35, 0]}>
        <boxGeometry args={[4.3, 0.3, 3.3]} />
        <meshStandardMaterial color="#e8eef8" />
      </mesh>
      {windows.map((p, i) => (
        <mesh key={i} position={p}>
          <planeGeometry args={[0.45, 0.5]} />
          <meshStandardMaterial color="#ffd98a" emissive="#ffc861" emissiveIntensity={(i * 37) % 5 === 0 ? 0.1 : 1.2} />
        </mesh>
      ))}
      <Html position={[0, 7.9, 0]} center distanceFactor={14}>
        <span className="glass-deep whitespace-nowrap rounded-full px-3 py-1 font-display text-xs tracking-widest">HÔTEL</span>
      </Html>
      {/* Second PC in front of hotel */}
      <group position={[-2, 0.8, 3.4]} rotation={[0, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[1.6, 1, 0.06]} />
          <meshStandardMaterial color="#0d1530" />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[1.5, 0.9]} />
          <meshStandardMaterial ref={screen} color="#0A1F5C" emissive="#4DB8FF" emissiveIntensity={0.05} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#9aa7bd" />
        </mesh>
      </group>
    </group>
  );
}

function Packet({ progress }: { progress: P }) {
  const g = useRef<THREE.Group>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const core = useRef<THREE.Mesh>(null);
  const box = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const p = progress.current;
    const t = Math.min(0.999, Math.max(0, p / 0.95));
    const pos = PATH.getPointAt(ease(t));
    g.current?.position.copy(pos);
    const asPacket = p > 0.22;
    if (box.current) {
      box.current.visible = asPacket;
      box.current.rotation.y = clock.elapsedTime;
      box.current.rotation.x = clock.elapsedTime * 0.6;
    }
    if (core.current) core.current.scale.setScalar(asPacket ? 1 + Math.sin(clock.elapsedTime * 6) * 0.15 : 0.6);
    if (bubble.current) {
      const show = p < 0.22 || p > 0.95;
      bubble.current.style.opacity = show ? "1" : "0";
      bubble.current.textContent = p > 0.95 ? "Salut ! 👋  ✓✓" : "Salut ! 👋";
    }
  });
  return (
    <group ref={g}>
      <mesh ref={core}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#4DB8FF" emissiveIntensity={4} />
      </mesh>
      <mesh ref={box}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshPhysicalMaterial color="#9fd8ff" transparent opacity={0.25} roughness={0} transmission={0.6} />
      </mesh>
      <pointLight color="#4DB8FF" intensity={8} distance={5} />
      <Html position={[0, 0.65, 0]} center distanceFactor={8} zIndexRange={[20, 0]}>
        <div ref={bubble} className="whitespace-nowrap rounded-2xl rounded-bl-sm bg-whatsapp px-3 py-1.5 text-sm font-semibold text-ink shadow-glow transition-opacity duration-300">
          Salut ! 👋
        </div>
      </Html>
    </group>
  );
}

function CameraRig({ progress }: { progress: P }) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  useFrame((_, d) => {
    const p = progress.current;
    const t = Math.min(0.999, Math.max(0, p / 0.95));
    const pos = PATH.getPointAt(ease(t));
    const narrow = size.width < 700 ? 1.5 : 1;
    // Early: angled side view of exploded PC, later: travelling side view
    const k = THREE.MathUtils.smoothstep(p, 0, 0.25);
    const off = new THREE.Vector3(THREE.MathUtils.lerp(7, 1.5, k), THREE.MathUtils.lerp(2.5, 2.2, k), THREE.MathUtils.lerp(6, 10, k)).multiplyScalar(narrow);
    if (p > 0.85) off.lerp(new THREE.Vector3(-3, 1.5, 6).multiplyScalar(narrow), THREE.MathUtils.smoothstep(p, 0.85, 1));
    target.current.copy(pos).add(off);
    const a = 1 - Math.exp(-4 * Math.min(d, 0.05));
    camera.position.lerp(target.current, a);
    look.current.lerp(pos, a);
    camera.lookAt(look.current);
  });
  return null;
}

export default function HeroScene({ progress, low }: { progress: P; low?: boolean }) {
  const cambium = useMemo(() => new THREE.Vector3(16, 8, 0.2), []);
  const relay = useMemo(() => new THREE.Vector3(24, 6.5, 0.2), []);
  const nano = useMemo(() => new THREE.Vector3(31, 3.4, 0.2), []);
  return (
    <Canvas dpr={low ? 1 : [1, 1.75]} camera={{ position: [7, 3, 8], fov: 50 }} gl={{ antialias: !low }}>
      <color attach="background" args={["#060f2e"]} />
      <fog attach="fog" args={["#060f2e", 14, 42]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 8]} intensity={1.4} />
      <Environment resolution={64}>
        <Lightformer intensity={1.5} position={[0, 6, 4]} scale={[20, 6, 1]} />
        <Lightformer intensity={1} color="#4DB8FF" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
      </Environment>
      <Sparkles count={low ? 80 : 220} scale={[70, 20, 20]} position={[22, 4, 0]} size={2} speed={0.3} color="#4DB8FF" />
      <mesh rotation-x={-Math.PI / 2} position={[22, -0.6, 0]}>
        <planeGeometry args={[90, 40]} />
        <meshStandardMaterial color="#081536" roughness={0.9} />
      </mesh>
      <gridHelper args={[90, 90, "#1E6BFF", "#0e2156"]} position={[22, -0.59, 0]} />

      <Computer />
      <Router position={[9, 0.8, 0]} />
      <Html position={[9, 2.1, 0]} center distanceFactor={10}>
        <span className="glass-deep whitespace-nowrap rounded-full px-3 py-1 font-display text-xs">Routeur</span>
      </Html>
      <Pylon position={[16, -0.6, 0]} height={8.2} />
      <Cambium position={[16, 7.2, 0.25]} rotation={[0, Math.PI / 2, 0]} scale={0.8} />
      <Html position={[16, 9.4, 0]} center distanceFactor={12}>
        <span className="glass-deep whitespace-nowrap rounded-full px-3 py-1 font-display text-xs">Émetteur sur pylône</span>
      </Html>
      <Pylon position={[24, -0.6, 0]} height={6.8} />
      <Cambium position={[24, 6.2, 0.25]} rotation={[0, -Math.PI / 2, 0]} scale={0.7} />
      <Html position={[24, 7.8, 0]} center distanceFactor={12}>
        <span className="glass-deep whitespace-nowrap rounded-full px-3 py-1 font-display text-xs">Antenne Cambium</span>
      </Html>
      <Beam from={cambium} to={relay} active={() => (progress.current > 0.55 ? 1 : 0)} />
      <Beam from={relay} to={nano} active={() => (progress.current > 0.66 ? 1 : 0)} />
      <mesh position={[31, 1.2, 0]}>
        <boxGeometry args={[2.4, 3.6, 2.4]} />
        <meshStandardMaterial color="#14224d" />
      </mesh>
      <NanoStation position={[31, 3.6, 0.2]} rotation={[0, -Math.PI / 2, 0]} scale={0.9} />
      <Html position={[31, 4.8, 0]} center distanceFactor={12}>
        <span className="glass-deep whitespace-nowrap rounded-full px-3 py-1 font-display text-xs">NanoStation</span>
      </Html>
      <WifiRings origin={[33, 3.3, 0]} progress={progress} />
      <Hotel progress={progress} />
      <Packet progress={progress} />
      <CameraRig progress={progress} />
    </Canvas>
  );
}
