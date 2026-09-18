'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CyberGlobe } from './CyberGlobe';
import { CyberHudOverlay } from './CyberHudOverlay';
import { ADVANCED_THREAT_NODES, ThreatNode3D, DefenseState } from './CyberDefenseState';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GlowButton } from '@/components/ui/GlowButton';

function SceneLoadingFallback() {
  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[480px] flex flex-col items-center justify-center rounded-3xl bg-surface/40 border border-border/40 backdrop-blur-md relative overflow-hidden p-6 text-center">
      <div className="relative flex items-center justify-center mb-5">
        <div className="w-24 h-24 rounded-full border border-cyber-cyan/30 flex items-center justify-center animate-pulse">
          <Shield className="w-10 h-10 text-primary-bright cyber-shield-glow" />
        </div>
        <Loader2 className="w-28 h-28 text-cyber-cyan/40 animate-spin absolute" />
      </div>
      <div className="space-y-1 z-10">
        <p className="text-xs font-mono text-cyber-cyan font-bold uppercase tracking-widest">
          INITIALIZING CYBER DEFENSE GRID
        </p>
        <p className="text-[11px] text-text-muted">
          Generating holographic threat surface & orbital telemetry
        </p>
      </div>
      {/* Ambient background blur */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

function WebGLUnavailableFallback() {
  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[480px] flex flex-col items-center justify-center rounded-3xl bg-surface/60 border border-border/60 backdrop-blur-md p-6 text-center">
      <div className="p-4 rounded-2xl bg-cyber-warning/10 border border-cyber-warning/30 text-cyber-warning mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h4 className="text-sm font-bold text-text mb-1">
        3D Interactive Canvas Unavailable
      </h4>
      <p className="text-xs text-text-muted max-w-sm mb-4 leading-relaxed">
        WebGL acceleration is not supported or currently disabled on this device. The rest of the command center remains fully operational.
      </p>
      <Badge variant="outline" size="sm">2D SAFE MODE ACTIVE</Badge>
    </div>
  );
}

function SceneCanvas() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [defenseState, setDefenseState] = useState<DefenseState>('IDLE');
  const [activeThreatId, setActiveThreatId] = useState<string | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<ThreatNode3D | null>(null);
  const [interceptedCount, setInterceptedCount] = useState(9);

  // Check WebGL availability on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Trigger manual simulation sequence
  const handleSimulateThreat = useCallback(() => {
    if (defenseState === 'DEFENDING') return;

    // Pick a random threat node to simulate
    const randomNode = ADVANCED_THREAT_NODES[Math.floor(Math.random() * (ADVANCED_THREAT_NODES.length - 1))];
    setActiveThreatId(randomNode.id);
    setDefenseState('THREAT_DETECTED');

    // Stage 1: Threat Detected -> Stage 2: Defending / Intercepting
    const defendTimer = setTimeout(() => {
      setDefenseState('DEFENDING');
    }, 900);

    // Stage 3: Protected / Neutralized
    const protectTimer = setTimeout(() => {
      setDefenseState('PROTECTED');
      setInterceptedCount((prev) => prev + 1);
    }, 2400);

    // Stage 4: Reset back to Idle
    const resetTimer = setTimeout(() => {
      setDefenseState('IDLE');
      setActiveThreatId(null);
    }, 3800);

    return () => {
      clearTimeout(defendTimer);
      clearTimeout(protectTimer);
      clearTimeout(resetTimer);
    };
  }, [defenseState]);

  // Automated background simulated threat events (every 16 seconds when idle)
  useEffect(() => {
    const autoInterval = setInterval(() => {
      if (defenseState === 'IDLE') {
        const randomNode = ADVANCED_THREAT_NODES[Math.floor(Math.random() * ADVANCED_THREAT_NODES.length)];
        setActiveThreatId(randomNode.id);
        setDefenseState('SCANNING');

        setTimeout(() => {
          setDefenseState('IDLE');
          setActiveThreatId(null);
        }, 3000);
      }
    }, 16000);

    return () => clearInterval(autoInterval);
  }, [defenseState]);

  if (!hasWebGL) {
    return <WebGLUnavailableFallback />;
  }

  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[480px] relative rounded-3xl overflow-hidden bg-surface/30 border border-border/40 backdrop-blur-sm">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <CyberGlobe
            defenseState={defenseState}
            activeThreatId={activeThreatId}
            onSelectThreat={(node) => setSelectedThreat(node)}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.55}
            minPolarAngle={Math.PI / 2.65}
          />
        </Suspense>
      </Canvas>

      {/* Interactive 3D HUD & Simulation Controls */}
      <CyberHudOverlay
        defenseState={defenseState}
        onSimulateThreat={handleSimulateThreat}
        selectedThreat={selectedThreat}
        onCloseThreatModal={() => setSelectedThreat(null)}
        interceptedCount={interceptedCount}
        activeThreatCount={ADVANCED_THREAT_NODES.filter((n) => n.status === 'ACTIVE').length}
        totalSignalsCount={ADVANCED_THREAT_NODES.length * 2}
      />
    </div>
  );
}

export const SceneContainer = dynamic(() => Promise.resolve(SceneCanvas), {
  ssr: false,
  loading: () => <SceneLoadingFallback />,
});
