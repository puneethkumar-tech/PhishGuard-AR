'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DefenseState } from './CyberDefenseState';

interface CyberShieldProps {
  defenseState?: DefenseState;
}

export const CyberShield: React.FC<CyberShieldProps> = ({ defenseState = 'IDLE' }) => {
  const shieldGroupRef = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const verticalScanlineRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Procedural 3D Shield Shape
  const shieldGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Start at top-center
    shape.moveTo(0, 0.95);
    // Top right curve
    shape.quadraticCurveTo(0.7, 0.9, 0.75, 0.42);
    // Right down to bottom tip
    shape.quadraticCurveTo(0.65, -0.45, 0, -0.95);
    // Bottom tip up left
    shape.quadraticCurveTo(-0.65, -0.45, -0.75, 0.42);
    // Top left curve to top-center
    shape.quadraticCurveTo(-0.7, 0.9, 0, 0.95);

    const extrudeSettings = {
      depth: 0.09,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (shieldGroupRef.current) {
      const floatSpeed = defenseState === 'DEFENDING' ? 3.5 : 1.5;
      const floatAmp = defenseState === 'DEFENDING' ? 0.25 : 0.12;

      shieldGroupRef.current.position.y = Math.sin(t * floatSpeed) * floatAmp;
      shieldGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.22;
      shieldGroupRef.current.rotation.z = Math.cos(t * 1.1) * 0.04;
    }

    // Laser Horizontal Scan Ring
    if (scanRingRef.current) {
      const scanSpeed = defenseState === 'SCANNING' ? 4 : 2;
      scanRingRef.current.position.y = Math.sin(t * scanSpeed) * 0.75;
      scanRingRef.current.rotation.x = Math.PI / 2;
    }

    // Vertical Laser Scan Bar
    if (verticalScanlineRef.current) {
      verticalScanlineRef.current.position.y = Math.sin(t * 2.5) * 0.85;
    }

    // Defense Shockwave Expansion
    if (shockwaveRef.current) {
      if (defenseState === 'DEFENDING') {
        const shockProgress = (t * 2.5) % 1;
        const scale = 1.0 + shockProgress * 2.5;
        shockwaveRef.current.scale.set(scale, scale, scale);
        if (shockwaveRef.current.material instanceof THREE.MeshBasicMaterial) {
          shockwaveRef.current.material.opacity = (1 - shockProgress) * 0.8;
        }
      } else {
        shockwaveRef.current.scale.set(1, 1, 1);
        if (shockwaveRef.current.material instanceof THREE.MeshBasicMaterial) {
          shockwaveRef.current.material.opacity = 0;
        }
      }
    }

    // Core Octahedron Rotation
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 1.5;
      coreRef.current.rotation.x = t * 0.8;
    }
  });

  const getShieldColors = () => {
    switch (defenseState) {
      case 'THREAT_DETECTED':
        return {
          body: '#FF3B4F',
          emissive: '#FF3B4F',
          wireframe: '#FF3B4F',
          core: '#F59E0B',
        };
      case 'DEFENDING':
        return {
          body: '#7C3AED',
          emissive: '#00D9FF',
          wireframe: '#00D9FF',
          core: '#00D9FF',
        };
      case 'PROTECTED':
        return {
          body: '#00E5A8',
          emissive: '#00E5A8',
          wireframe: '#00D9FF',
          core: '#00E5A8',
        };
      case 'SCANNING':
        return {
          body: '#2563FF',
          emissive: '#00D9FF',
          wireframe: '#00D9FF',
          core: '#00D9FF',
        };
      default:
        return {
          body: '#2563FF',
          emissive: '#00D9FF',
          wireframe: '#00D9FF',
          core: '#00D9FF',
        };
    }
  };

  const colors = getShieldColors();

  return (
    <group ref={shieldGroupRef} position={[0, 0, 1.85]} scale={[0.88, 0.88, 0.88]}>
      {/* Holographic Solid Body */}
      <mesh geometry={shieldGeometry}>
        <meshPhysicalMaterial
          color={colors.body}
          emissive={colors.emissive}
          emissiveIntensity={defenseState === 'DEFENDING' ? 0.9 : 0.45}
          roughness={0.1}
          metalness={0.85}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.65}
          opacity={0.8}
          transparent
        />
      </mesh>

      {/* Holographic Wireframe Outline */}
      <mesh geometry={shieldGeometry} scale={[1.025, 1.025, 1.025]}>
        <meshBasicMaterial
          color={colors.wireframe}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Center Core (Octahedron Matrix) */}
      <mesh ref={coreRef} position={[0, 0.08, 0.07]}>
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color={colors.core}
          emissive={colors.core}
          emissiveIntensity={0.9}
          roughness={0.2}
          wireframe
        />
      </mesh>

      {/* Scanning Laser Ring */}
      <mesh ref={scanRingRef}>
        <ringGeometry args={[0.02, 0.72, 36]} />
        <meshBasicMaterial
          color={colors.wireframe}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical Laser Scan Bar */}
      <mesh ref={verticalScanlineRef} position={[0, 0, 0.08]}>
        <planeGeometry args={[1.3, 0.03]} />
        <meshBasicMaterial
          color={colors.wireframe}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dynamic Deflection Shockwave Ring */}
      <mesh ref={shockwaveRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.86, 48]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
