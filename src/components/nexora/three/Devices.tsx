import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DeviceKind } from "@/lib/nexora";

const WHITE = "#eef3fb";
const METAL = "#9aa7bd";

function Led({ position, color = "#4DB8FF", speed = 3, phase = 0 }: { position: [number, number, number]; color?: string; speed?: number; phase?: number }) {
  const m = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (m.current) m.current.emissiveIntensity = 1 + Math.sin(clock.elapsedTime * speed + phase) * 1.5 + 1.5;
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.035, 10, 10]} />
      <meshStandardMaterial ref={m} color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

export function Cambium(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <mesh position={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.05, 0.05, 2.2, 12]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.42, 1.5, 0.14]} />
        <meshStandardMaterial color={WHITE} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0.075]}>
        <planeGeometry args={[0.22, 0.05]} />
        <meshStandardMaterial color="#1E6BFF" emissive="#1E6BFF" emissiveIntensity={1.2} />
      </mesh>
      <Led position={[0.13, -0.62, 0.08]} />
    </group>
  );
}

export function NanoStation(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <mesh position={[0, -0.2, -0.12]}>
        <cylinderGeometry args={[0.035, 0.035, 1.3, 10]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh castShadow>
        <capsuleGeometry args={[0.13, 0.55, 6, 14]} />
        <meshStandardMaterial color={WHITE} roughness={0.35} />
      </mesh>
      <Led position={[0, -0.3, 0.13]} color="#4DB8FF" />
      <Led position={[0, -0.38, 0.12]} color="#4ade80" phase={1} />
    </group>
  );
}

export function LiteBeam(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.3, 0.18, 32, 1, true]} />
        <meshStandardMaterial color={WHITE} side={THREE.DoubleSide} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshStandardMaterial color="#d9e2f0" />
      </mesh>
      <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
      <mesh position={[0, 0, 0.65]}>
        <boxGeometry args={[0.14, 0.14, 0.1]} />
        <meshStandardMaterial color={WHITE} />
      </mesh>
      <mesh position={[0, -0.6, -0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 10]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
      <Led position={[0.05, 0, 0.71]} />
    </group>
  );
}

export function Router(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.22, 0.9]} />
        <meshStandardMaterial color="#121a33" roughness={0.35} metalness={0.4} />
      </mesh>
      {[-0.55, -0.2, 0.2, 0.55].map((x, i) => (
        <mesh key={x} position={[x, 0.45, -0.38]} rotation={[0, 0, (i - 1.5) * 0.12]}>
          <capsuleGeometry args={[0.04, 0.7, 4, 8]} />
          <meshStandardMaterial color="#1b2442" />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Led key={i} position={[-0.4 + i * 0.2, 0.05, 0.46]} color={i === 4 ? "#4ade80" : "#4DB8FF"} speed={4 + i} phase={i} />
      ))}
    </group>
  );
}

export function Starlink(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <mesh position={[0, 0.35, 0]} rotation={[-0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.05, 0.6]} />
        <meshStandardMaterial color={WHITE} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 10]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.06, 20]} />
        <meshStandardMaterial color="#c8d2e2" />
      </mesh>
    </group>
  );
}

export function Device({ kind, ...props }: { kind: DeviceKind } & JSX.IntrinsicElements["group"]) {
  switch (kind) {
    case "cambium":
      return <Cambium {...props} />;
    case "nanostation":
      return <NanoStation {...props} />;
    case "litebeam":
      return <LiteBeam {...props} />;
    case "router":
      return <Router {...props} />;
    default:
      return <Starlink {...props} />;
  }
}

export function Spin({ children, speed = 0.6 }: { children: React.ReactNode; speed?: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g.current) g.current.rotation.y += Math.min(d, 0.05) * speed;
  });
  return <group ref={g}>{children}</group>;
}
