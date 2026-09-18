'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AIThreatConstellationNode } from '@/types';
import { AI_THREAT_CONSTELLATION_NODES } from '@/lib/ai-visualization-demo-data';

interface ThreatConstellationProps {
  selectedThreatId?: string | null;
  onSelectThreat?: (threat: AIThreatConstellationNode) => void;
}

export const ThreatConstellation: React.FC<ThreatConstellationProps> = ({
  selectedThreatId,
  onSelectThreat,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  // Calculate connection lines between constellation nodes
  const connectionLines = useMemo(() => {
    const lines: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];
    const nodeMap = new Map(AI_THREAT_CONSTELLATION_NODES.map((n) => [n.id, n]));

    AI_THREAT_CONSTELLATION_NODES.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = nodeMap.get(targetId);
        if (target) {
          lines.push({
            start: node.position,
            end: target.position,
            color: node.color,
          });
        }
      });
    });

    return lines;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Interconnecting constellation beams */}
      {connectionLines.map((line, idx) => {
        const points = [new THREE.Vector3(...line.start), new THREE.Vector3(...line.end)];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <lineSegments key={`line-${idx}`}>
            <bufferGeometry attach="geometry" {...lineGeom} />
            <lineBasicMaterial
              attach="material"
              color={line.color}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
        );
      })}

      {/* Constellation Nodes */}
      {AI_THREAT_CONSTELLATION_NODES.map((node) => {
        const isSelected = selectedThreatId === node.id;
        const isHovered = hoveredNodeId === node.id;

        return (
          <ConstellationItem
            key={node.id}
            node={node}
            isSelected={isSelected}
            isHovered={isHovered}
            onHover={(hover) => setHoveredNodeId(hover ? node.id : null)}
            onSelect={() => onSelectThreat?.(node)}
          />
        );
      })}
    </group>
  );
};

const ConstellationItem: React.FC<{
  node: AIThreatConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (hover: boolean) => void;
  onSelect: () => void;
}> = ({ node, isSelected, isHovered, onHover, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.4 : isHovered ? 1.25 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 8);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 2.2 : isHovered ? 1.6 : 0.9}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Halo Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.42, 0.48, 16]} />
        <meshBasicMaterial
          color={node.color}
          side={THREE.DoubleSide}
          transparent
          opacity={isSelected ? 0.9 : isHovered ? 0.6 : 0.25}
        />
      </mesh>

      {/* Label Tooltip */}
      <Html position={[0, 0.6, 0]} center distanceFactor={14} className="pointer-events-none select-none">
        <div className="rounded-lg border border-cyan-500/40 bg-slate-950/90 px-2.5 py-1 text-center font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md whitespace-nowrap">
          <div className="text-[10px] font-bold text-slate-100">{node.name}</div>
          <div className="text-[8px] text-cyan-400">
            Freq: {node.simulatedFrequency} • {node.category}
          </div>
        </div>
      </Html>
    </group>
  );
};
