'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { AICyberRobot } from './AICyberRobot';
import { RobotHologramPanels } from './RobotHologramPanels';
import { RobotFallback2D } from './RobotFallback2D';
import { RobotState } from '@/types';

interface RobotSceneContainerProps {
  state?: RobotState;
  className?: string;
}

function WebGLAvailabilityCheck() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const RobotSceneContainer: React.FC<RobotSceneContainerProps> = ({
  state = 'IDLE',
  className = '',
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!WebGLAvailabilityCheck()) {
      setHasWebGL(false);
    }
  }, []);

  if (!isMounted) {
    return <div className={`w-full h-full min-h-[320px] bg-surface-2/40 animate-pulse rounded-2xl ${className}`} />;
  }

  if (!hasWebGL) {
    return <RobotFallback2D state={state} />;
  }

  return (
    <div className={`relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden bg-gradient-to-b from-surface/90 via-surface-2/60 to-surface/90 border border-primary-bright/20 shadow-2xl ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.4, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, 2, 2]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[0, -2, 2]} intensity={0.5} color="#8b5cf6" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <AICyberRobot state={state} />
          </Float>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.5}
          maxAzimuthAngle={Math.PI / 6}
          minAzimuthAngle={-Math.PI / 6}
        />
      </Canvas>

      {/* Floating 2D Hologram Overlays */}
      <RobotHologramPanels state={state} />

      {/* Cyber Corner Grid Accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan/50 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan/50 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan/50 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan/50 pointer-events-none" />
    </div>
  );
};
