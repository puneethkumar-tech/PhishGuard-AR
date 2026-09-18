'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DefenseState } from './CyberDefenseState';

interface DataStreamsProps {
  defenseState?: DefenseState;
}

export const DataStreams: React.FC<DataStreamsProps> = ({ defenseState = 'IDLE' }) => {
  // Generate 5 dynamic cyber communication paths around and into the defense core
  const curves = useMemo(() => {
    const paths: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [
      // San Francisco -> North Defense Orbit -> London
      [
        new THREE.Vector3(1.32, 0.58, 0.76),
        new THREE.Vector3(0.2, 2.2, 0.6),
        new THREE.Vector3(-1.22, 0.82, 0.68),
      ],
      // London -> European Ingestion -> Berlin
      [
        new THREE.Vector3(-1.22, 0.82, 0.68),
        new THREE.Vector3(-0.5, 1.9, -0.4),
        new THREE.Vector3(0.28, 1.38, -0.72),
      ],
      // Singapore -> Equatorial Arc -> Central Shield Core
      [
        new THREE.Vector3(0.78, -0.88, 1.12),
        new THREE.Vector3(0.5, 0.3, 1.9),
        new THREE.Vector3(0, 0, 1.8),
      ],
      // Sydney -> South Pacific Arc -> San Francisco
      [
        new THREE.Vector3(-0.88, -0.62, -1.22),
        new THREE.Vector3(1.6, -0.8, -0.2),
        new THREE.Vector3(1.32, 0.58, 0.76),
      ],
      // Berlin -> Polar Defense Conduit -> Central Shield Core
      [
        new THREE.Vector3(0.28, 1.38, -0.72),
        new THREE.Vector3(0.2, 1.2, 1.5),
        new THREE.Vector3(0, 0, 1.8),
      ],
    ];

    return paths.map(([start, mid, end]) => new THREE.QuadraticBezierCurve3(start, mid, end));
  }, []);

  const lineGeometries = useMemo(() => {
    return curves.map((curve) => {
      const points = curve.getPoints(40);
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, [curves]);

  const packetMeshes = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const speed = defenseState === 'DEFENDING' ? 0.9 : defenseState === 'SCANNING' ? 0.6 : 0.4;
    const t = state.clock.getElapsedTime() * speed;

    packetMeshes.current.forEach((mesh, idx) => {
      if (mesh && curves[idx]) {
        const progress = (t + idx * 0.22) % 1;
        const pos = curves[idx].getPoint(progress);
        mesh.position.copy(pos);
      }
    });
  });

  const getLineColor = (idx: number) => {
    if (idx === 2 || idx === 4) {
      // Threat / Defense targeting stream to shield
      return defenseState === 'DEFENDING' ? '#FF3B4F' : '#00D9FF';
    }
    return idx % 2 === 0 ? '#00D9FF' : '#7C3AED';
  };

  const getPacketColor = (idx: number) => {
    if (defenseState === 'DEFENDING') {
      return idx === 2 || idx === 4 ? '#FF3B4F' : '#00D9FF';
    }
    return idx === 1 ? '#FF3B4F' : idx % 2 === 0 ? '#00D9FF' : '#A78BFA';
  };

  return (
    <group>
      {/* Static Arc Curves */}
      {lineGeometries.map((geom, idx) => (
        <primitive
          key={idx}
          object={
            new THREE.Line(
              geom,
              new THREE.LineBasicMaterial({
                color: getLineColor(idx),
                transparent: true,
                opacity: 0.35,
              })
            )
          }
        />
      ))}

      {/* Animated Traveling Data Packets */}
      <group>
        {curves.map((_, idx) => (
          <mesh
            key={idx}
            ref={(el) => {
              if (el) packetMeshes.current[idx] = el;
            }}
          >
            <sphereGeometry args={[idx === 2 || idx === 4 ? 0.055 : 0.045, 12, 12]} />
            <meshBasicMaterial color={getPacketColor(idx)} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
