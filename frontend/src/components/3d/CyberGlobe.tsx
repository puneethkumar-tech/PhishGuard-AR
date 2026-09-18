'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CyberShield } from './CyberShield';
import { ParticleField } from './ParticleField';
import { ThreatNodes } from './ThreatNodes';
import { DataStreams } from './DataStreams';
import { Atmosphere } from './Atmosphere';
import { OrbitalRings } from './OrbitalRings';
import { CyberGrid } from './CyberGrid';
import { ThreatNode3D, DefenseState } from './CyberDefenseState';

interface CyberGlobeProps {
  defenseState?: DefenseState;
  activeThreatId?: string | null;
  onSelectThreat?: (node: ThreatNode3D) => void;
}

export const CyberGlobe: React.FC<CyberGlobeProps> = ({
  defenseState = 'IDLE',
  activeThreatId,
  onSelectThreat,
}) => {
  const globeGroupRef = useRef<THREE.Group>(null);
  const latRingsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 0.25;
    const mouseY = state.pointer.y * 0.18;

    if (globeGroupRef.current) {
      // Smooth cinematic rotation + gentle mouse parallax
      globeGroupRef.current.rotation.y = t * 0.1 + mouseX;
      globeGroupRef.current.rotation.x = Math.sin(t * 0.06) * 0.08 - mouseY;
    }

    if (latRingsRef.current) {
      latRingsRef.current.rotation.y = -t * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Cinematic Environmental Lighting */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 7, 5]} intensity={1.8} color="#4D8DFF" />
      <pointLight position={[-5, -4, -3]} intensity={1.4} color="#7C3AED" />
      <pointLight position={[0, 5, 4]} intensity={2.0} color="#00D9FF" />

      {/* 2. Rotating Globe & Surface Features */}
      <group ref={globeGroupRef}>
        {/* Inner Solid Dark Core Sphere */}
        <mesh>
          <sphereGeometry args={[1.5, 48, 48]} />
          <meshStandardMaterial
            color="#071426"
            roughness={0.65}
            metalness={0.5}
            emissive="#0B1B32"
            emissiveIntensity={0.65}
          />
        </mesh>

        {/* Outer Hex/Grid Wireframe Sphere */}
        <mesh>
          <sphereGeometry args={[1.51, 32, 32]} />
          <meshBasicMaterial
            color="#2563FF"
            wireframe
            transparent
            opacity={0.28}
          />
        </mesh>

        {/* Outer Dot Matrix Grid Sphere */}
        <mesh>
          <sphereGeometry args={[1.52, 44, 44]} />
          <pointsMaterial
            color="#00D9FF"
            size={0.035}
            transparent
            opacity={0.45}
          />
        </mesh>

        {/* Latitude and Longitude Reference Rings */}
        <group ref={latRingsRef}>
          {[-0.6, 0, 0.6].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[Math.sqrt(Math.max(0.1, 1.51 ** 2 - y ** 2)) - 0.01, Math.sqrt(Math.max(0.1, 1.51 ** 2 - y ** 2)), 48]} />
              <meshBasicMaterial
                color="#00D9FF"
                side={THREE.DoubleSide}
                transparent
                opacity={0.2}
              />
            </mesh>
          ))}
        </group>

        {/* Interactive Threat Nodes on Globe Surface */}
        <ThreatNodes
          activeThreatId={activeThreatId}
          onSelectThreat={onSelectThreat}
        />

        {/* Dynamic Curved Data Communication Streams */}
        <DataStreams defenseState={defenseState} />
      </group>

      {/* 3. Holographic Atmospheric Shell */}
      <Atmosphere />

      {/* 4. Multi-Radius Orbital Rings */}
      <OrbitalRings />

      {/* 5. Holographic AR Shield */}
      <CyberShield defenseState={defenseState} />

      {/* 6. Background Network Particles */}
      <ParticleField count={260} />

      {/* 7. Perspective Cyber Grid Floor */}
      <CyberGrid />
    </group>
  );
};
