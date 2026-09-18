'use client';

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ADVANCED_THREAT_NODES, ThreatNode3D, SeverityLevel } from './CyberDefenseState';

interface ThreatNodesProps {
  nodes?: ThreatNode3D[];
  activeThreatId?: string | null;
  onSelectThreat?: (node: ThreatNode3D) => void;
}

function SingleThreatNode({
  node,
  isActive,
  onSelect,
}: {
  node: ThreatNode3D;
  isActive: boolean;
  onSelect?: (node: ThreatNode3D) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = node.severity === 'CRITICAL' ? 4 : node.severity === 'HIGH' ? 3 : 2;

    if (pulseRingRef.current) {
      const s = 1 + Math.sin(t * speed + node.intensity * 10) * 0.35;
      pulseRingRef.current.scale.set(s, s, s);
    }

    if (shockwaveRef.current && (node.severity === 'CRITICAL' || isActive)) {
      const shockProgress = (t * 1.5 + node.intensity) % 1;
      const scale = 1 + shockProgress * 2.2;
      shockwaveRef.current.scale.set(scale, scale, scale);
      if (shockwaveRef.current.material instanceof THREE.MeshBasicMaterial) {
        shockwaveRef.current.material.opacity = (1 - shockProgress) * 0.7;
      }
    }
  });

  const getNodeColor = (sev: SeverityLevel) => {
    switch (sev) {
      case 'CRITICAL':
        return '#FF3B4F'; // danger red
      case 'HIGH':
        return '#F59E0B'; // amber warning
      case 'MEDIUM':
        return '#7C3AED'; // cyber violet
      default:
        return '#00E5A8'; // safe green
    }
  };

  const color = getNodeColor(node.severity);
  const isCritical = node.severity === 'CRITICAL';

  return (
    <group position={node.position}>
      {/* Node Core Mesh */}
      <mesh
        ref={meshRef}
        scale={hovered || isActive ? 1.6 : 1}
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
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect) onSelect(node);
        }}
      >
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Pulsing Outer Ring */}
      <mesh ref={pulseRingRef}>
        <ringGeometry args={[0.09, 0.13, 20]} />
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Expanding Shockwave for Critical or Active nodes */}
      {(isCritical || isActive) && (
        <mesh ref={shockwaveRef}>
          <ringGeometry args={[0.11, 0.14, 24]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Holographic Tooltip on Hover */}
      {hovered && (
        <Html distanceFactor={7.5} position={[0, 0.22, 0]} center>
          <div className="bg-surface/95 border border-border px-3.5 py-2.5 rounded-xl shadow-2xl text-left pointer-events-none backdrop-blur-xl whitespace-nowrap min-w-[190px]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-cyber-cyan">
                THREAT SIGNAL
              </span>
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
                style={{
                  backgroundColor: `${color}25`,
                  color: color,
                  border: `1px solid ${color}50`,
                }}
              >
                {node.severity}
              </span>
            </div>

            <p className="text-xs font-bold text-text">{node.label}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{node.type}</p>

            <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-border/50 text-[9px] font-mono text-text-muted">
              <span>{node.region}</span>
              <span className="text-cyber-cyan">SIMULATED</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export const ThreatNodes: React.FC<ThreatNodesProps> = ({
  nodes = ADVANCED_THREAT_NODES,
  activeThreatId,
  onSelectThreat,
}) => {
  return (
    <group>
      {nodes.map((node) => (
        <SingleThreatNode
          key={node.id}
          node={node}
          isActive={activeThreatId === node.id}
          onSelect={onSelectThreat}
        />
      ))}
    </group>
  );
};
