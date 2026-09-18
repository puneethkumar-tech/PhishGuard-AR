'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Atmosphere: React.FC = () => {
  const innerAuraRef = useRef<THREE.Mesh>(null);
  const outerAuraRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (innerAuraRef.current) {
      const scale = 1.0 + Math.sin(t * 1.5) * 0.015;
      innerAuraRef.current.scale.set(scale, scale, scale);
    }
    if (outerAuraRef.current) {
      const scale = 1.0 + Math.cos(t * 1.2) * 0.02;
      outerAuraRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Inner Atmospheric Glow Aura */}
      <mesh ref={innerAuraRef}>
        <sphereGeometry args={[1.56, 36, 36]} />
        <meshBasicMaterial
          color="#2563FF"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Holographic Cyan Exosphere */}
      <mesh ref={outerAuraRef}>
        <sphereGeometry args={[1.68, 36, 36]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
