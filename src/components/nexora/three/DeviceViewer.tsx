import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Float } from "@react-three/drei";
import type { DeviceKind } from "@/lib/nexora";
import { Device, Spin } from "./Devices";

export default function DeviceViewer({ kind }: { kind: DeviceKind }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.3, 3], fov: 40 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 3]} intensity={1.6} />
      <pointLight position={[-2, -1, 2]} intensity={6} color="#4DB8FF" />
      <Environment resolution={64}>
        <Lightformer intensity={2} position={[0, 4, 2]} scale={[6, 6, 1]} />
        <Lightformer intensity={1.2} color="#4DB8FF" position={[-4, 0, 0]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
      <Float speed={2} floatIntensity={0.4} rotationIntensity={0.2}>
        <Spin>
          <Device kind={kind} scale={kind === "router" ? 1.1 : 1} />
        </Spin>
      </Float>
    </Canvas>
  );
}
