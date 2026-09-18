'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AIVisualizationMode,
  InferenceSimulationStage,
  NeuralNodeData,
  AIThreatConstellationNode,
  TokenAttentionItem,
  RobotState,
} from '@/types';
import { AIVisualizationEngine } from '@/lib/ai-visualization-engine';
import { AIIntelligenceHeader } from './AIIntelligenceHeader';
import { InferenceControlPanel } from './InferenceControlPanel';
import { NeuralNetworkScene } from './NeuralNetworkScene';
import { NeuralNetworkFallback2D } from './NeuralNetworkFallback2D';
import { NeuralNodeInspector } from './NeuralNodeInspector';
import { AIInferencePipeline } from './AIInferencePipeline';
import { ModelArchitecturePanel } from './ModelArchitecturePanel';
import { SignalFusionCore } from './SignalFusionCore';
import { RobustnessNeuralOverlay } from './RobustnessNeuralOverlay';
import { ExplainabilityGraph } from './ExplainabilityGraph';
import { AttentionSignalMap } from './AttentionSignalMap';
import { FeatureInspector } from './FeatureInspector';
import { IntelligenceMap } from './IntelligenceMap';
import { AIInferenceTimeline } from './AIInferenceTimeline';
import { AISystemStatus } from './AISystemStatus';
import { AICyberRobot } from './AICyberRobot';
import { RobotSceneContainer } from './RobotSceneContainer';
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, X, ShieldAlert } from 'lucide-react';

export const AIIntelligenceWorkspace: React.FC = () => {
  // Mode & View states
  const [activeMode, setActiveMode] = useState<AIVisualizationMode>('NEURAL_NETWORK');
  const [is3DView, setIs3DView] = useState<boolean>(true);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-cred');
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // Simulation execution state
  const [inferenceStage, setInferenceStage] = useState<InferenceSimulationStage>('READY');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [cameraResetKey, setCameraResetKey] = useState<number>(0);

  // Inspector & selection states
  const [selectedNode, setSelectedNode] = useState<NeuralNodeData | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<AIThreatConstellationNode | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenAttentionItem | null>(null);

  // Robot State
  const [robotState, setRobotState] = useState<RobotState>('IDLE');

  // Timer reference for deterministic simulation loop
  const simulationTimers = useRef<NodeJS.Timeout[]>([]);
  const elapsedInterval = useRef<NodeJS.Timeout | null>(null);

  // Retrieve current scenario data
  const currentScenario = AIVisualizationEngine.getScenario(selectedScenarioId);
  const layers = AIVisualizationEngine.getNeuralLayers();
  const nodes = AIVisualizationEngine.getNeuralNodes(selectedScenarioId, inferenceStage);
  const connections = AIVisualizationEngine.getNeuralConnections();
  const fusionSignals = AIVisualizationEngine.getSignalFusionItems(selectedScenarioId);
  const explainabilityNodes = AIVisualizationEngine.getExplainabilityGraph(selectedScenarioId);
  const tokenAttention = AIVisualizationEngine.getTokenAttentionMap(selectedScenarioId);
  const timelineSteps = AIVisualizationEngine.getInferenceTimeline(inferenceStage);

  // Clear all active timers
  const clearAllTimers = useCallback(() => {
    simulationTimers.current.forEach((t) => clearTimeout(t));
    simulationTimers.current = [];
    if (elapsedInterval.current) {
      clearInterval(elapsedInterval.current);
      elapsedInterval.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Check if reduced-motion is preferred
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIs3DView(false);
      }
    }
  }, []);

  // Check localStorage for scan / robustness scenario handoff
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedScenario = localStorage.getItem('phishguard_last_scenario');
        if (storedScenario) {
          const valid = AIVisualizationEngine.getAllScenarios().some((s) => s.id === storedScenario);
          if (valid) {
            setSelectedScenarioId(storedScenario);
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, []);

  // Run Simulated Inference Loop
  const handleRunSimulation = () => {
    if (isSimulating) return;

    clearAllTimers();
    setIsSimulating(true);
    setElapsedMs(0);
    setInferenceStage('INGESTING');
    setRobotState('ANALYZING');

    const startTime = Date.now();
    elapsedInterval.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);

    const stages: { stage: InferenceSimulationStage; duration: number; robotState: RobotState }[] = [
      { stage: 'INGESTING', duration: 350, robotState: 'ANALYZING' },
      { stage: 'FEATURE_EXTRACTION', duration: 400, robotState: 'ANALYZING' },
      { stage: 'SVM_ANALYSIS', duration: 450, robotState: 'ANALYZING' },
      { stage: 'DISTILBERT_ANALYSIS', duration: 500, robotState: 'ANALYZING' },
      { stage: 'SIGNAL_FUSION', duration: 400, robotState: 'ROBUSTNESS_CHECK' },
      { stage: 'ROBUSTNESS_CHECK', duration: 450, robotState: 'DEFENDING' },
      { stage: 'DECISION', duration: 350, robotState: 'EXPLAINING' },
      { stage: 'EXPLANATION', duration: 300, robotState: 'EXPLAINING' },
      { stage: 'COMPLETE', duration: 0, robotState: 'PROTECTED' },
    ];

    let accumulatedTime = 0;

    stages.forEach((item, index) => {
      const stepDuration = AIVisualizationEngine.getStepDuration(item.duration, speed);
      accumulatedTime += stepDuration;

      const timer = setTimeout(() => {
        setInferenceStage(item.stage);
        setRobotState(item.robotState);

        if (item.stage === 'COMPLETE') {
          setIsSimulating(false);
          if (elapsedInterval.current) {
            clearInterval(elapsedInterval.current);
            elapsedInterval.current = null;
          }
        }
      }, accumulatedTime);

      simulationTimers.current.push(timer);
    });
  };

  // Reset Everything to Default
  const handleReset = () => {
    clearAllTimers();
    setIsSimulating(false);
    setInferenceStage('READY');
    setElapsedMs(0);
    setSelectedNode(null);
    setSelectedThreat(null);
    setSelectedToken(null);
    setRobotState('IDLE');
    setCameraResetKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Navigation */}
      <AIIntelligenceHeader
        activeMode={activeMode}
        onModeChange={(mode) => {
          setActiveMode(mode);
          setSelectedNode(null);
          setSelectedThreat(null);
        }}
        is3DView={is3DView}
        onToggle3DView={() => setIs3DView((prev) => !prev)}
        inferenceStage={inferenceStage}
        isSimulating={isSimulating}
        onRunSimulation={handleRunSimulation}
        onReset={handleReset}
      />

      {/* 2. Control Panel & Scenario Selector */}
      <InferenceControlPanel
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={(id) => {
          setSelectedScenarioId(id);
          handleReset();
        }}
        speed={speed}
        onSpeedChange={setSpeed}
        inferenceStage={inferenceStage}
        isSimulating={isSimulating}
        elapsedMs={elapsedMs}
      />

      {/* 3. Main Central Visualizer View (3D Scene or 2D Fallback) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Central Visualization Canvas (col-span-8 or col-span-9) */}
        <div className={selectedNode || selectedThreat ? 'lg:col-span-8' : 'lg:col-span-9'}>
          {is3DView ? (
            <NeuralNetworkScene
              activeMode={activeMode}
              nodes={nodes}
              connections={connections}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              selectedThreatId={selectedThreat?.id || null}
              onSelectThreat={setSelectedThreat}
              threatScore={currentScenario.confidenceScore}
              verdict={currentScenario.verdict}
              inferenceStage={inferenceStage}
              isSimulating={isSimulating}
              cameraResetKey={cameraResetKey}
            />
          ) : (
            <NeuralNetworkFallback2D
              layers={layers}
              nodes={nodes}
              connections={connections}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              inferenceStage={inferenceStage}
              isSimulating={isSimulating}
            />
          )}
        </div>

        {/* Sidebar: AI Robot & Inspector / Detail Cards */}
        <div className={selectedNode || selectedThreat ? 'lg:col-span-4 space-y-4' : 'lg:col-span-3 space-y-4'}>
          {/* AI Cyber Robot Companion */}
          <div className="overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/80 p-3 font-mono backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 text-[10px] uppercase text-slate-400">
              <span className="font-bold text-cyan-400">AI Cyber Sentinel</span>
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-cyan-300">
                State: {robotState}
              </span>
            </div>

            <div className="h-44 w-full">
              <RobotSceneContainer state={robotState} />
            </div>

            <div className="mt-2 text-[9px] text-slate-400 text-center">
              {robotState === 'ANALYZING' && '● Decomposing input signals & evaluating attention heads...'}
              {robotState === 'ROBUSTNESS_CHECK' && '● Verifying adversarial gradient invariance bounds...'}
              {robotState === 'DEFENDING' && '● Applying homoglyph normalization defense...'}
              {robotState === 'EXPLAINING' && '● Generating simulated multi-modal attribution trace...'}
              {robotState === 'PROTECTED' && '● Calibrated analysis complete. Threat policy active.'}
              {robotState === 'IDLE' && '● Ready to ingest payload for simulated neural inference.'}
            </div>
          </div>

          {/* Node Inspector Panel */}
          {selectedNode && (
            <NeuralNodeInspector
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}

          {/* Threat Constellation Inspector Panel */}
          {selectedThreat && (
            <div className="rounded-xl border border-cyan-500/30 bg-slate-950/90 p-4 font-mono text-xs shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Threat Category</span>
                  <h4 className="text-sm font-bold text-slate-100">{selectedThreat.name}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedThreat(null)}
                  className="rounded p-1 text-slate-400 hover:text-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Frequency:</span>
                  <span className="ml-1 font-bold text-cyan-400">{selectedThreat.simulatedFrequency}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Robustness Exposure:</span>
                  <p className="text-slate-300 text-[10px] mt-0.5">{selectedThreat.robustnessExposure}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">Defense Strategy:</span>
                  <p className="text-emerald-400 text-[10px] mt-0.5">{selectedThreat.defenseStrategy}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Completion Verdict Banner (when simulated inference completes) */}
      {inferenceStage === 'COMPLETE' && (
        <div className="relative overflow-hidden rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/80 via-slate-950 to-blue-950/80 p-5 font-mono shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Simulated Analysis Complete
                  </span>
                  <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.2 text-[9px] text-cyan-300 uppercase">
                    Calibrated Deterministic Verdict
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-slate-100">
                    {currentScenario.verdict}
                  </span>
                  <span className="text-sm font-semibold text-cyan-400">
                    Confidence: {(currentScenario.confidenceScore * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm font-semibold text-amber-400">
                    Robustness: {(currentScenario.robustnessScore * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300">{currentScenario.explanationSummary}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Primary Signals:</div>
              <div className="flex flex-wrap gap-1.5">
                {currentScenario.primarySignals.map((sig, idx) => (
                  <span
                    key={idx}
                    className="rounded border border-cyan-500/30 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-200"
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Mode-Specific Deep-Dive Sub-Panels */}
      {activeMode === 'PIPELINE' && (
        <div className="space-y-6">
          <AIInferencePipeline
            currentStage={inferenceStage}
            isSimulating={isSimulating}
          />
          <ModelArchitecturePanel />
        </div>
      )}

      {activeMode === 'SIGNAL_FUSION' && (
        <div className="space-y-6">
          <SignalFusionCore
            signals={fusionSignals}
            threatScore={currentScenario.confidenceScore}
            verdict={currentScenario.verdict}
            isSimulating={isSimulating}
          />
          <RobustnessNeuralOverlay
            baselineAccuracy={0.942}
            underAttackAccuracy={0.684}
            hardenedAccuracy={currentScenario.robustnessScore}
            scenarioName={currentScenario.name}
          />
        </div>
      )}

      {activeMode === 'EXPLAINABILITY' && (
        <div className="space-y-6">
          <ExplainabilityGraph
            nodes={explainabilityNodes}
            verdict={currentScenario.verdict}
            confidenceScore={currentScenario.confidenceScore}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <AttentionSignalMap
                tokens={tokenAttention}
                onSelectToken={setSelectedToken}
              />
            </div>
            <div className="lg:col-span-4">
              <FeatureInspector tokenItem={selectedToken} />
            </div>
          </div>
        </div>
      )}

      {activeMode === 'THREAT_CONSTELLATION' && (
        <div className="space-y-6">
          <IntelligenceMap />
        </div>
      )}

      {activeMode === 'NEURAL_NETWORK' && (
        <div className="space-y-6">
          <AIInferencePipeline
            currentStage={inferenceStage}
            isSimulating={isSimulating}
          />
          <ModelArchitecturePanel />
        </div>
      )}

      {/* 6. Execution Timeline & Component Telemetry */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AIInferenceTimeline
          steps={timelineSteps}
          isSimulating={isSimulating}
        />
        <AISystemStatus is3DActive={is3DView} />
      </div>
    </div>
  );
};
