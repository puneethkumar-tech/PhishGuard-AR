'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { NeuralNodeData } from '@/types';

interface NeuralNodeProps {
  node: NeuralNodeData;
  isSelected: boolean;
  onSelect: (node: NeuralNodeData) => void;
}

export const NeuralNode: React.FC<NeuralNodeProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const baseColor = new THREE.Color(node.color || '#06b6d4');
  const highlightColor = new THREE.Color('#38bdf8');

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Subtle floating breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + node.position[0]) * 0.08;
      const targetScale = isSelected ? 1.4 : hovered ? 1.25 : scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.2;
      ringRef.current.rotation.x += delta * 0.8;
    }
  });

  return (
    <group position={node.position}>
      {/* Central Node Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : hovered ? highlightColor : baseColor}
          emissive={baseColor}
          emissiveIntensity={isSelected ? 1.8 : hovered ? 1.4 : node.isHighlighted ? 1.2 : 0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Selected / Active Cyber Ring */}
      {(isSelected || hovered || node.isHighlighted) && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.32, 0.38, 32]} />
          <meshBasicMaterial
            color={baseColor}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.9 : 0.6}
          />
        </mesh>
      )}

      {/* HTML Micro-Tooltip on Hover or Selection */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.45, 0]}
          center
          distanceFactor={12}
          className="pointer-events-none select-none"
        >
          <div className="whitespace-nowrap rounded-md border border-cyan-400/40 bg-slate-950/90 px-2.5 py-1 text-center font-mono shadow-[0_0_15px_rgba(6,182,212,0.4)] backdrop-blur-md">
            <div className="text-[10px] font-bold text-slate-100 uppercase">{node.name}</div>
            <div className="text-[9px] text-cyan-400">
              Activation: {Math.round(node.simulatedActivation * 100)}% • {node.layerName}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
