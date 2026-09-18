'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const OrbitalRings: React.FC = () => {
  const ring1GroupRef = useRef<THREE.Group>(null);
  const ring2GroupRef = useRef<THREE.Group>(null);
  const ring3GroupRef = useRef<THREE.Group>(null);

  const packet1Ref = useRef<THREE.Mesh>(null);
  const packet2Ref = useRef<THREE.Mesh>(null);
  const packet3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Ring 1: Clockwise rotation
    if (ring1GroupRef.current) {
      ring1GroupRef.current.rotation.z = t * 0.15;
    }
    if (packet1Ref.current) {
      const angle = t * 0.8;
      const r = 2.05;
      packet1Ref.current.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    }

    // Ring 2: Counter-clockwise rotation
    if (ring2GroupRef.current) {
      ring2GroupRef.current.rotation.z = -t * 0.12;
    }
    if (packet2Ref.current) {
      const angle = -t * 0.6;
      const r = 2.25;
      packet2Ref.current.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    }

    // Ring 3: Pulsating tilted ring
    if (ring3GroupRef.current) {
      ring3GroupRef.current.rotation.z = t * 0.08;
      const s = 1.0 + Math.sin(t * 1.8) * 0.02;
      ring3GroupRef.current.scale.set(s, s, s);
    }
    if (packet3Ref.current) {
      const angle = t * 1.1;
      const r = 2.45;
      packet3Ref.current.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    }
  });

  return (
    <group>
      {/* Ring 1: Cyan Orbit (Radius 2.05, 55 deg tilt) */}
      <group ref={ring1GroupRef} rotation={[Math.PI / 3.2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.04, 2.06, 80]} />
          <meshBasicMaterial
            color="#00D9FF"
            side={THREE.DoubleSide}
            transparent
            opacity={0.35}
          />
        </mesh>
        {/* Orbiting packet 1 */}
        <mesh ref={packet1Ref}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#00D9FF" />
        </mesh>
      </group>

      {/* Ring 2: Violet Orbit (Radius 2.25, -45 deg tilt) */}
      <group ref={ring2GroupRef} rotation={[-Math.PI / 4, Math.PI / 5, 0]}>
        <mesh>
          <ringGeometry args={[2.24, 2.26, 80]} />
          <meshBasicMaterial
            color="#7C3AED"
            side={THREE.DoubleSide}
            transparent
            opacity={0.3}
          />
        </mesh>
        {/* Orbiting packet 2 */}
        <mesh ref={packet2Ref}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#A78BFA" />
        </mesh>
      </group>

      {/* Ring 3: Primary Blue Orbit (Radius 2.45, 75 deg tilt) */}
      <group ref={ring3GroupRef} rotation={[Math.PI / 2.3, -Math.PI / 6, 0]}>
        <mesh>
          <ringGeometry args={[2.44, 2.46, 80]} />
          <meshBasicMaterial
            color="#4D8DFF"
            side={THREE.DoubleSide}
            transparent
            opacity={0.25}
          />
        </mesh>
        {/* Orbiting packet 3 */}
        <mesh ref={packet3Ref}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#4D8DFF" />
        </mesh>
      </group>
    </group>
  );
};
