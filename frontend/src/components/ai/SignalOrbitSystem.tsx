'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface SignalOrbitSystemProps {
  onSelectCategory?: (category: string) => void;
}

interface OrbitRingConfig {
  label: string;
  radius: number;
  speed: number;
  tilt: [number, number, number];
  color: string;
}

const ORBITS: OrbitRingConfig[] = [
  { label: 'TEXT SIGNALS', radius: 4.5, speed: 0.25, tilt: [0.3, 0.2, 0], color: '#3b82f6' },
  { label: 'URL FORENSICS', radius: 5.8, speed: -0.2, tilt: [-0.4, 0.3, 0.2], color: '#06b6d4' },
  { label: 'STRUCTURAL', radius: 7.0, speed: 0.18, tilt: [0.2, -0.4, 0.4], color: '#8b5cf6' },
  { label: 'SEMANTIC TRANSFORMER', radius: 8.2, speed: -0.15, tilt: [-0.3, -0.2, -0.2], color: '#ec4899' },
  { label: 'BEHAVIOR & INTENT', radius: 9.4, speed: 0.12, tilt: [0.4, 0.4, -0.3], color: '#10b981' },
  { label: 'ROBUSTNESS BOUNDS', radius: 10.6, speed: -0.1, tilt: [-0.2, 0.5, 0.3], color: '#f59e0b' },
];

export const SignalOrbitSystem: React.FC<SignalOrbitSystemProps> = ({ onSelectCategory }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredOrbit, setHoveredOrbit] = useState<string | null>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {ORBITS.map((orbit) => (
        <OrbitItem
          key={orbit.label}
          config={orbit}
          isHovered={hoveredOrbit === orbit.label}
          onHover={(hover) => setHoveredOrbit(hover ? orbit.label : null)}
          onClick={() => onSelectCategory?.(orbit.label)}
        />
      ))}
    </group>
  );
};

const OrbitItem: React.FC<{
  config: OrbitRingConfig;
  isHovered: boolean;
  onHover: (hover: boolean) => void;
  onClick: () => void;
}> = ({ config, isHovered, onHover, onClick }) => {
  const ringRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * config.speed;
    }
  });

  return (
    <group rotation={config.tilt}>
      {/* Thin Orbit Ring */}
      <mesh
        onPointerOver={() => {
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={onClick}
      >
        <ringGeometry args={[config.radius - 0.02, config.radius + 0.02, 64]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isHovered ? 0.6 : 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting Satellite Node with Label */}
      <group ref={ringRef}>
        <mesh
          ref={satelliteRef}
          position={[config.radius, 0, 0]}
          onPointerOver={() => {
            onHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            onHover(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={onClick}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.color}
            emissiveIntensity={isHovered ? 2.0 : 1.2}
          />

          {isHovered && (
            <Html position={[0, 0.4, 0]} center distanceFactor={14}>
              <div className="pointer-events-none select-none rounded border border-cyan-400/40 bg-slate-950/90 px-2 py-0.5 font-mono text-[9px] font-semibold text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)] whitespace-nowrap">
                {config.label}
              </div>
            </Html>
          )}
        </mesh>
      </group>
    </group>
  );
};
