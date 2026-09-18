'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  AIVisualizationMode,
  NeuralNodeData,
  NeuralConnectionData,
  AIThreatConstellationNode,
  InferenceSimulationStage,
} from '@/types';
import { NeuralNode } from './NeuralNode';
import { NeuralDataFlow } from './NeuralDataFlow';
import { SignalOrbitSystem } from './SignalOrbitSystem';
import { DecisionCore } from './DecisionCore';
import { ThreatConstellation } from './ThreatConstellation';
import { ParticleField } from '@/components/3d/ParticleField';

interface NeuralNetworkSceneProps {
  activeMode: AIVisualizationMode;
  nodes: NeuralNodeData[];
  connections: NeuralConnectionData[];
  selectedNode: NeuralNodeData | null;
  onSelectNode: (node: NeuralNodeData | null) => void;
  selectedThreatId: string | null;
  onSelectThreat: (threat: AIThreatConstellationNode | null) => void;
  threatScore: number;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'PHISHING' | 'ADVERSARIAL' | 'BLOCKED';
  inferenceStage: InferenceSimulationStage;
  isSimulating: boolean;
  cameraResetKey?: number;
}

export const NeuralNetworkScene: React.FC<NeuralNetworkSceneProps> = ({
  activeMode,
  nodes,
  connections,
  selectedNode,
  onSelectNode,
  selectedThreatId,
  onSelectThreat,
  threatScore,
  verdict,
  inferenceStage,
  isSimulating,
  cameraResetKey = 0,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Reset Camera View
  React.useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [cameraResetKey, activeMode]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950 sm:h-[480px] lg:h-[540px]">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.5, 11], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => {
          onSelectNode(null);
          onSelectThreat(null);
        }}
      >
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
        <directionalLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />

        <Suspense fallback={null}>
          {/* Background Ambient Cyber Dust */}
          <ParticleField count={150} />

          {/* Conditional Content by Mode */}
          {activeMode === 'NEURAL_NETWORK' && (
            <group position={[0, 0, 0]}>
              {/* Nodes across Layer 0 to Layer 6 */}
              {nodes.map((node) => (
                <NeuralNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onSelect={onSelectNode}
                />
              ))}

              {/* Animated Connection Streams */}
              <NeuralDataFlow connections={connections} isSimulating={isSimulating} />

              {/* Surrounding Orbital Signal Rings */}
              <SignalOrbitSystem />
            </group>
          )}

          {activeMode === 'PIPELINE' && (
            <group position={[0, 0, 0]}>
              {/* Layer Nodes in horizontal pipeline layout */}
              {nodes.map((node) => (
                <NeuralNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onSelect={onSelectNode}
                />
              ))}
              <NeuralDataFlow connections={connections} isSimulating={isSimulating} />
            </group>
          )}

          {activeMode === 'SIGNAL_FUSION' && (
            <group position={[0, 0, 0]}>
              <DecisionCore
                score={threatScore}
                verdict={verdict}
                isSimulating={isSimulating}
              />
              <SignalOrbitSystem />
            </group>
          )}

          {activeMode === 'THREAT_CONSTELLATION' && (
            <group position={[0, 0, 0]}>
              <ThreatConstellation
                selectedThreatId={selectedThreatId}
                onSelectThreat={onSelectThreat}
              />
            </group>
          )}

          {activeMode === 'EXPLAINABILITY' && (
            <group position={[0, 0, 0]}>
              <DecisionCore
                score={threatScore}
                verdict={verdict}
                isSimulating={isSimulating}
              />
              {/* Feature nodes on outer flank */}
              {nodes
                .filter((n) => n.layerIndex === 1 || n.layerIndex === 5)
                .map((node) => (
                  <NeuralNode
                    key={node.id}
                    node={node}
                    isSelected={selectedNode?.id === node.id}
                    onSelect={onSelectNode}
                  />
                ))}
            </group>
          )}

          {/* Camera Controls with bounded movement */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.08}
            minDistance={4}
            maxDistance={18}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 4}
            autoRotate={!isSimulating && activeMode !== 'PIPELINE'}
            autoRotateSpeed={0.4}
          />
        </Suspense>
      </Canvas>

      {/* Floating 3D HUD Guide Overlay */}
      <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1 font-mono text-[10px] text-slate-400">
        <span className="inline-flex items-center gap-1 text-cyan-400 font-semibold uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          Interactive 3D Scene
        </span>
        <span>Left-click + drag: Rotate | Scroll: Zoom | Right-click: Pan</span>
        <span>Click any node to inspect simulated metadata</span>
      </div>

      {/* Mode Indicator Badge */}
      <div className="pointer-events-none absolute bottom-3 right-3 rounded border border-cyan-500/30 bg-slate-950/80 px-2.5 py-1 font-mono text-[10px] font-semibold text-cyan-300 uppercase shadow-[0_0_10px_rgba(6,182,212,0.2)]">
        Mode: {activeMode.replace('_', ' ')}
      </div>
    </div>
  );
};
