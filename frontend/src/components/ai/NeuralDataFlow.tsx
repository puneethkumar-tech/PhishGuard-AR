'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NeuralConnectionData } from '@/types';

interface NeuralDataFlowProps {
  connections: NeuralConnectionData[];
  isSimulating: boolean;
}

export const NeuralDataFlow: React.FC<NeuralDataFlowProps> = ({
  connections,
  isSimulating,
}) => {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Filter connections to render active and significant links
  const activeConnections = useMemo(() => {
    return connections.filter((c) => c.isActive || c.weight > 0.55);
  }, [connections]);

  // Construct LineSegments geometry
  const { linePositions, lineColors } = useMemo(() => {
    const pos = new Float32Array(activeConnections.length * 6);
    const cols = new Float32Array(activeConnections.length * 6);

    activeConnections.forEach((conn, i) => {
      // From
      pos[i * 6] = conn.fromPosition[0];
      pos[i * 6 + 1] = conn.fromPosition[1];
      pos[i * 6 + 2] = conn.fromPosition[2];

      // To
      pos[i * 6 + 3] = conn.toPosition[0];
      pos[i * 6 + 4] = conn.toPosition[1];
      pos[i * 6 + 5] = conn.toPosition[2];

      const color = new THREE.Color(conn.color || '#06b6d4');
      cols[i * 6] = color.r * 0.4;
      cols[i * 6 + 1] = color.g * 0.4;
      cols[i * 6 + 2] = color.b * 0.4;

      cols[i * 6 + 3] = color.r * 0.8;
      cols[i * 6 + 4] = color.g * 0.8;
      cols[i * 6 + 5] = color.b * 0.8;
    });

    return { linePositions: pos, lineColors: cols };
  }, [activeConnections]);

  // Traveling signal pulse particles along the connection lines
  const particleCount = activeConnections.length;
  const particleOffsets = useMemo(() => {
    return new Float32Array(particleCount).map(() => Math.random());
  }, [particleCount]);

  const particleGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const speed = isSimulating ? 1.8 : 0.8;

    for (let i = 0; i < particleCount; i++) {
      const conn = activeConnections[i];
      if (!conn) continue;

      particleOffsets[i] = (particleOffsets[i] + delta * (conn.pulseSpeed || 1) * speed * 0.4) % 1;
      const t = particleOffsets[i];

      // Linear interpolation between fromPosition and toPosition
      positions[i * 3] = conn.fromPosition[0] + (conn.toPosition[0] - conn.fromPosition[0]) * t;
      positions[i * 3 + 1] = conn.fromPosition[1] + (conn.toPosition[1] - conn.fromPosition[1]) * t;
      positions[i * 3 + 2] = conn.fromPosition[2] + (conn.toPosition[2] - conn.fromPosition[2]) * t;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Static / Glowing Connection Beams */}
      <lineSegments ref={lineSegmentsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={isSimulating ? 0.45 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Animated Traveling Pulses */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.12}
          color="#38bdf8"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
