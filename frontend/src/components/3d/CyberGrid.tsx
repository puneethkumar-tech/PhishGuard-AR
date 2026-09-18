'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CyberGrid: React.FC = () => {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = -1.5 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={gridRef} position={[0, -2.4, -1.5]} rotation={[-Math.PI / 2.2, 0, 0]}>
      {/* 3D Wireframe Cyber Floor Grid */}
      <gridHelper args={[16, 24, '#2563FF', '#0B1B32']} />
    </group>
  );
};
