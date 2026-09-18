'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface DecisionCoreProps {
  score: number;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'PHISHING' | 'ADVERSARIAL' | 'BLOCKED';
  isSimulating: boolean;
}

export const DecisionCore: React.FC<DecisionCoreProps> = ({
  score,
  verdict,
  isSimulating,
}) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRing1Ref = useRef<THREE.Mesh>(null);
  const outerRing2Ref = useRef<THREE.Mesh>(null);
  const outerRing3Ref = useRef<THREE.Mesh>(null);

  const getVerdictColor = () => {
    switch (verdict) {
      case 'SAFE':
        return '#10b981'; // Emerald
      case 'SUSPICIOUS':
        return '#f59e0b'; // Amber
      case 'ADVERSARIAL':
        return '#8b5cf6'; // Violet
      case 'BLOCKED':
      case 'PHISHING':
      default:
        return '#ef4444'; // Red
    }
  };

  const coreColor = new THREE.Color(getVerdictColor());

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * (isSimulating ? 5 : 2)) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (outerRing1Ref.current) {
      outerRing1Ref.current.rotation.x += delta * 0.6;
      outerRing1Ref.current.rotation.y += delta * 0.4;
    }

    if (outerRing2Ref.current) {
      outerRing2Ref.current.rotation.y -= delta * 0.5;
      outerRing2Ref.current.rotation.z += delta * 0.7;
    }

    if (outerRing3Ref.current) {
      outerRing3Ref.current.rotation.x -= delta * 0.3;
      outerRing3Ref.current.rotation.z -= delta * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Glowing Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={isSimulating ? 2.5 : 1.6}
          roughness={0.15}
          metalness={0.85}
          wireframe={isSimulating}
        />
      </mesh>

      {/* Cyber Ring 1 */}
      <mesh ref={outerRing1Ref}>
        <torusGeometry args={[1.35, 0.03, 16, 64]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.65} />
      </mesh>

      {/* Cyber Ring 2 */}
      <mesh ref={outerRing2Ref}>
        <torusGeometry args={[1.6, 0.02, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
      </mesh>

      {/* Cyber Ring 3 */}
      <mesh ref={outerRing3Ref}>
        <torusGeometry args={[1.85, 0.02, 16, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.4} />
      </mesh>

      {/* Central 3D UI Overlay */}
      <Html position={[0, 0, 0]} center distanceFactor={10} className="pointer-events-none select-none">
        <div className="flex flex-col items-center justify-center rounded-xl border border-cyan-500/40 bg-slate-950/90 px-3.5 py-2 text-center font-mono shadow-[0_0_25px_rgba(6,182,212,0.3)] backdrop-blur-md">
          <div className="text-[9px] uppercase tracking-wider text-slate-400">
            {isSimulating ? 'Calibrating...' : 'Threat Score'}
          </div>
          <div className="text-lg font-extrabold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
            {(score * 100).toFixed(1)}%
          </div>
          <div
            className="text-[10px] font-bold tracking-wider uppercase"
            style={{ color: getVerdictColor() }}
          >
            {verdict}
          </div>
          <div className="mt-0.5 text-[8px] text-slate-500 uppercase tracking-widest">
            Simulated AI Decision
          </div>
        </div>
      </Html>
    </group>
  );
};
