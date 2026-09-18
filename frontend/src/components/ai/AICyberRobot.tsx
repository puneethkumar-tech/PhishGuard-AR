'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RobotState } from '@/types';

interface AICyberRobotProps {
  state: RobotState;
}

export const AICyberRobot: React.FC<AICyberRobotProps> = ({ state }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const scanPlaneRef = useRef<THREE.Mesh>(null);
  const shieldAuraRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Target colors based on RobotState
  const stateColor = useMemo(() => {
    switch (state) {
      case 'THREAT_DETECTED':
      case 'PERTURBING':
        return new THREE.Color('#ef4444'); // Crimson / Red alert
      case 'PROTECTED':
      case 'RECOVERING':
        return new THREE.Color('#10b981'); // Emerald / Green defense
      case 'ANALYZING':
      case 'ROBUSTNESS_CHECK':
      case 'DEFENDING':
        return new THREE.Color('#8b5cf6'); // Violet computation
      case 'SCANNING':
      case 'ATTACK_CONFIGURING':
        return new THREE.Color('#38bdf8'); // Sky blue focus
      case 'LAB_READY':
      case 'EXPLAINING':
      case 'IDLE':
      default:
        return new THREE.Color('#06b6d4'); // Cyan baseline
    }
  }, [state]);

  // Particle positions for data stream surrounding the robot
  const particleData = useMemo(() => {
    const count = 75;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.2 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.5;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return positions;
  }, []);

  useFrame((clockState, delta) => {
    const time = clockState.clock.getElapsedTime();

    // 1. Root gentle floating & breathing motion
    if (groupRef.current) {
      const isAlert = state === 'THREAT_DETECTED' || state === 'PERTURBING';
      const isFast = state === 'SCANNING' || state === 'ANALYZING' || state === 'DEFENDING';
      const floatAmp = isAlert ? 0.08 : 0.05;
      const floatSpeed = isFast ? 2.5 : 1.5;
      groupRef.current.position.y = Math.sin(time * floatSpeed) * floatAmp;

      if (isAlert) {
        // Minor alert tension vibration
        groupRef.current.position.x = Math.sin(time * 25) * 0.015;
      } else {
        groupRef.current.position.x = 0;
      }
    }

    // 2. Head subtle tracking & reaction
    if (headRef.current) {
      if (state === 'SCANNING') {
        headRef.current.rotation.y = Math.sin(time * 3) * 0.2;
        headRef.current.rotation.x = Math.sin(time * 1.5) * 0.08 + 0.05;
      } else if (state === 'ANALYZING') {
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.12;
        headRef.current.rotation.z = Math.sin(time * 2) * 0.05;
      } else if (state === 'THREAT_DETECTED') {
        headRef.current.rotation.x = -0.08;
        headRef.current.rotation.y = Math.sin(time * 8) * 0.05;
      } else {
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
        headRef.current.rotation.x = Math.sin(time * 0.5) * 0.04;
      }
    }

    // 3. Glowing Visor pulse & color transition
    if (visorRef.current) {
      const mat = visorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissive.lerp(stateColor, delta * 8);
      const pulseRate = state === 'THREAT_DETECTED' ? 12 : state === 'SCANNING' ? 8 : 2;
      mat.emissiveIntensity = 1.2 + Math.sin(time * pulseRate) * 0.6;
    }

    // 4. Chest Core reactor rotation
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissive.lerp(stateColor, delta * 8);
      coreRef.current.rotation.z += delta * (state === 'ANALYZING' ? 6 : 2);
    }

    // 5. Laser Scanning Plane Sweep
    if (scanPlaneRef.current) {
      if (state === 'SCANNING') {
        scanPlaneRef.current.visible = true;
        scanPlaneRef.current.position.y = Math.sin(time * 4) * 1.4;
        const scanMat = scanPlaneRef.current.material as THREE.MeshBasicMaterial;
        scanMat.opacity = 0.45 + Math.sin(time * 8) * 0.2;
      } else {
        scanPlaneRef.current.visible = false;
      }
    }

    // 6. Shield Protection Aura
    if (shieldAuraRef.current) {
      if (state === 'PROTECTED') {
        shieldAuraRef.current.visible = true;
        shieldAuraRef.current.rotation.y += delta * 0.8;
        shieldAuraRef.current.rotation.x += delta * 0.4;
        const shieldMat = shieldAuraRef.current.material as THREE.MeshStandardMaterial;
        shieldMat.opacity = 0.35 + Math.sin(time * 3) * 0.15;
      } else {
        shieldAuraRef.current.visible = false;
      }
    }

    // 7. Data stream particles orbiting
    if (particlesRef.current) {
      const rotSpeed = state === 'ANALYZING' ? 1.2 : state === 'SCANNING' ? 0.8 : 0.25;
      particlesRef.current.rotation.y += delta * rotSpeed;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* ===================== HEAD ASSEMBLY ===================== */}
      <group ref={headRef} position={[0, 0.95, 0]}>
        {/* Cyber Helmet Cranium */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.5, 0.55]} />
          <meshStandardMaterial
            color="#0b1329"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Angular Helmet Brow / Forehead Plate */}
        <mesh position={[0, 0.16, 0.18]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.52, 0.18, 0.25]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Cyber Visor (Glowing Eye Strip) */}
        <mesh ref={visorRef} position={[0, 0.05, 0.26]}>
          <boxGeometry args={[0.46, 0.14, 0.08]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={stateColor}
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>

        {/* Ear Telemetry / Antenna Nodes */}
        <mesh position={[0.3, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[-0.3, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Chin / Jaw Section */}
        <mesh position={[0, -0.2, 0.12]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.36, 0.12, 0.32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* ===================== NECK & COLLAR ===================== */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.18, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* ===================== TORSO & CHEST ARMOR ===================== */}
      <group position={[0, 0.2, 0]}>
        {/* Main Chest Plate */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.85, 0.75, 0.45]} />
          <meshStandardMaterial
            color="#0b1329"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Angular Pectoral Overlays */}
        <mesh position={[0.22, 0.22, 0.16]} rotation={[0.1, -0.1, -0.05]}>
          <boxGeometry args={[0.32, 0.28, 0.16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[-0.22, 0.22, 0.16]} rotation={[0.1, 0.1, 0.05]}>
          <boxGeometry args={[0.32, 0.28, 0.16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Central Glowing AI Reactor Core */}
        <mesh ref={coreRef} position={[0, 0.15, 0.24]}>
          <torusGeometry args={[0.1, 0.025, 16, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={stateColor}
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>

        {/* Core Crystal Center */}
        <mesh position={[0, 0.15, 0.24]}>
          <octahedronGeometry args={[0.06]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={stateColor}
            emissiveIntensity={2.5}
          />
        </mesh>

        {/* Abdominal / Spine Segment */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.26, 0.24, 0.25, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.4} />
        </mesh>
      </group>

      {/* ===================== SHOULDERS & ARMS ===================== */}
      {/* Right Shoulder */}
      <group position={[0.56, 0.38, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Upper Arm */}
        <mesh position={[0.08, -0.25, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.09, 0.08, 0.35, 12]} />
          <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.14, -0.58, 0.06]} rotation={[0.3, 0, -0.2]}>
          <boxGeometry args={[0.12, 0.35, 0.14]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* Left Shoulder */}
      <group position={[-0.56, 0.38, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Upper Arm */}
        <mesh position={[-0.08, -0.25, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.09, 0.08, 0.35, 12]} />
          <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.14, -0.58, 0.06]} rotation={[0.3, 0, 0.2]}>
          <boxGeometry args={[0.12, 0.35, 0.14]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* ===================== HOLOGRAPHIC SCAN LASER PLANE ===================== */}
      <mesh
        ref={scanPlaneRef}
        position={[0, 0, 0.4]}
        rotation={[Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>

      {/* ===================== PROTECTIVE SHIELD AURA ===================== */}
      <mesh ref={shieldAuraRef} position={[0, 0.2, 0]} visible={false}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.6}
          transparent
          opacity={0.35}
          wireframe
        />
      </mesh>

      {/* ===================== AMBIENT DATA PARTICLES ===================== */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.length / 3}
            array={particleData}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={stateColor}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
