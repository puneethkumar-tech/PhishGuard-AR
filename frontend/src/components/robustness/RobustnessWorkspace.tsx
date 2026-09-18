'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  RobustnessAttackType,
  RobustnessAttackStrength,
  RobustnessDefenseType,
  RobustnessDemoScenario,
  RobustnessSimulationConfig,
  RobustnessSimulationResult,
  RobotState,
} from '@/types';
import {
  ROBUSTNESS_DEMO_SCENARIOS,
  ROBUSTNESS_ATTACK_STRATEGIES,
  ROBUSTNESS_DEFENSE_STRATEGIES,
} from '@/lib/robustness-demo-data';
import {
  runRobustnessSimulation,
  saveSimulationToLocalHistory,
} from '@/lib/robustness-engine';

// Robustness Subcomponents
import { RobustnessLabHeader } from './RobustnessLabHeader';
import { RobustnessInputPanel } from './RobustnessInputPanel';
import { AttackTechniqueGrid } from './AttackTechniqueGrid';
import { PerturbationControls } from './PerturbationControls';
import { RobustnessSimulationProgress } from './RobustnessSimulationProgress';
import { RobustnessComparison } from './RobustnessComparison';
import { RobustnessScoreCard } from './RobustnessScoreCard';
import { ConfidenceStabilityChart } from './ConfidenceStabilityChart';
import { PerturbationDiffViewer } from './PerturbationDiffViewer';
import { FeatureImpactPanel } from './FeatureImpactPanel';
import { DefenseStrategyGrid } from './DefenseStrategyGrid';
import { HardeningSimulation } from './HardeningSimulation';
import { RobustnessMatrix } from './RobustnessMatrix';
import { RobustnessTimeline } from './RobustnessTimeline';
import { RobustnessExplanation } from './RobustnessExplanation';
import { RobustnessVerdict } from './RobustnessVerdict';
import { RobustnessExportModal } from './RobustnessExportModal';
import { AttackChainVisualization } from './AttackChainVisualization';
import { RobotFallback2D } from '@/components/ai/RobotFallback2D';

// Dynamically load 3D Robot to avoid SSR canvas issues
const RobotSceneContainer = dynamic(
  () =>
    import('@/components/ai/RobotSceneContainer').then(
      (mod) => mod.RobotSceneContainer
    ),
  {
    ssr: false,
    loading: () => <RobotFallback2D state="LAB_READY" />,
  }
);

export const RobustnessWorkspace: React.FC = () => {
  // 1. Core State
  const [selectedScenario, setSelectedScenario] = useState<RobustnessDemoScenario>(
    ROBUSTNESS_DEMO_SCENARIOS[0]
  );
  const [customText, setCustomText] = useState<string>(
    ROBUSTNESS_DEMO_SCENARIOS[0].sampleInput
  );
  const [selectedAttack, setSelectedAttack] = useState<RobustnessAttackType>(
    ROBUSTNESS_DEMO_SCENARIOS[0].defaultAttack
  );
  const [attackStrength, setAttackStrength] = useState<RobustnessAttackStrength>('MEDIUM');
  const [intensity, setIntensity] = useState<number>(65);
  const [mutationCount, setMutationCount] = useState<number>(3);
  const [preserveSemantics, setPreserveSemantics] = useState<boolean>(true);
  const [preserveUrlStructure, setPreserveUrlStructure] = useState<boolean>(false);
  const [activeDefense, setActiveDefense] = useState<RobustnessDefenseType>('char-norm');

  // Simulation lifecycle states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isHardening, setIsHardening] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(1);
  const [simulationResult, setSimulationResult] =
    useState<RobustnessSimulationResult | null>(null);
  const [robotState, setRobotState] = useState<RobotState>('LAB_READY');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // 2. Perform Simulation
  const executeSimulation = useCallback(
    (customConfig?: Partial<RobustnessSimulationConfig>) => {
      setIsSimulating(true);
      setSimStep(1);
      setRobotState('ATTACK_CONFIGURING');

      const config: RobustnessSimulationConfig = {
        sampleId: selectedScenario.id,
        sampleTitle: selectedScenario.title,
        inputText: customText,
        attackType: selectedAttack,
        attackStrength: attackStrength,
        intensity: intensity,
        mutationCount: mutationCount,
        preserveSemantics: preserveSemantics,
        preserveUrlStructure: preserveUrlStructure,
        activeDefense: activeDefense,
        ...customConfig,
      };

      // Simulated step progression
      const timer1 = setTimeout(() => {
        setSimStep(2);
        setRobotState('PERTURBING');
      }, 300);

      const timer2 = setTimeout(() => {
        setSimStep(3);
        setRobotState('ANALYZING');
      }, 600);

      const timer3 = setTimeout(() => {
        setSimStep(4);
        setRobotState('ROBUSTNESS_CHECK');
      }, 900);

      const timer4 = setTimeout(() => {
        setSimStep(5);
        const result = runRobustnessSimulation(config);
        setSimulationResult(result);
        setIsSimulating(false);
        setRobotState('ROBUSTNESS_CHECK');
        saveSimulationToLocalHistory(result);
      }, 1200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    },
    [
      selectedScenario,
      customText,
      selectedAttack,
      attackStrength,
      intensity,
      mutationCount,
      preserveSemantics,
      preserveUrlStructure,
      activeDefense,
    ]
  );

  // Initial mount: load active scan sample from localStorage or run baseline simulation
  useEffect(() => {
    let initialText = selectedScenario.sampleInput;
    let initialAttack = selectedScenario.defaultAttack;

    if (typeof window !== 'undefined') {
      const storedScan = localStorage.getItem('phishguard_active_scan_sample');
      if (storedScan) {
        try {
          const parsed = JSON.parse(storedScan);
          if (parsed && parsed.input) {
            initialText = parsed.input;
            setCustomText(parsed.input);
            if (parsed.isHomoglyph) {
              initialAttack = 'homoglyph';
              setSelectedAttack('homoglyph');
            }
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    // Run initial deterministic simulation
    executeSimulation({
      inputText: initialText,
      attackType: initialAttack,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Scenario Selection Handler
  const handleSelectScenario = (scenario: RobustnessDemoScenario) => {
    setSelectedScenario(scenario);
    setCustomText(scenario.sampleInput);
    setSelectedAttack(scenario.defaultAttack);

    // Contextually choose recommended defense
    if (scenario.defaultAttack === 'homoglyph') {
      setActiveDefense('char-norm');
    } else if (scenario.defaultAttack === 'url-obfuscation') {
      setActiveDefense('url-canon');
    } else if (scenario.defaultAttack === 'semantic-paraphrase') {
      setActiveDefense('adv-train');
    }

    executeSimulation({
      sampleId: scenario.id,
      sampleTitle: scenario.title,
      inputText: scenario.sampleInput,
      attackType: scenario.defaultAttack,
    });
  };

  // 4. Hardening Simulation Trigger
  const handleRunHardening = () => {
    if (!simulationResult) return;
    setIsHardening(true);
    setRobotState('DEFENDING');

    setTimeout(() => {
      setRobotState('RECOVERING');
    }, 600);

    setTimeout(() => {
      const reCalculated = runRobustnessSimulation({
        ...simulationResult.config,
        activeDefense: activeDefense,
      });
      setSimulationResult(reCalculated);
      setIsHardening(false);
      setRobotState('PROTECTED');
    }, 1200);
  };

  // 5. Reset Lab Handler
  const handleReset = () => {
    const defaultScenario = ROBUSTNESS_DEMO_SCENARIOS[0];
    setSelectedScenario(defaultScenario);
    setCustomText(defaultScenario.sampleInput);
    setSelectedAttack('homoglyph');
    setAttackStrength('MEDIUM');
    setIntensity(65);
    setMutationCount(3);
    setPreserveSemantics(true);
    setPreserveUrlStructure(false);
    setActiveDefense('char-norm');
    setRobotState('LAB_READY');

    executeSimulation({
      sampleId: defaultScenario.id,
      sampleTitle: defaultScenario.title,
      inputText: defaultScenario.sampleInput,
      attackType: 'homoglyph',
      attackStrength: 'MEDIUM',
      intensity: 65,
      mutationCount: 3,
      preserveSemantics: true,
      preserveUrlStructure: false,
      activeDefense: 'char-norm',
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <RobustnessLabHeader
        onReset={handleReset}
        onExport={() => setIsExportOpen(true)}
        hasResult={!!simulationResult}
      />

      {/* 2. Top Interactive Section: Input & 3D Robot Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Input & Scenarios */}
        <div className="lg:col-span-8 space-y-6">
          <RobustnessInputPanel
            selectedScenario={selectedScenario}
            onSelectScenario={handleSelectScenario}
            customText={customText}
            onChangeCustomText={setCustomText}
            disabled={isSimulating}
          />
        </div>

        {/* Right 4 Cols: Reactive 3D AI Cyber Robot */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="p-4 rounded-2xl bg-surface/80 border border-border shadow-glass space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-mono font-bold text-text uppercase">
                AI Cyber Robot // Lab Observer
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  robotState === 'THREAT_DETECTED' || robotState === 'PERTURBING'
                    ? 'bg-cyber-danger/20 text-cyber-danger border border-cyber-danger/40'
                    : robotState === 'PROTECTED' || robotState === 'RECOVERING'
                    ? 'bg-cyber-success/20 text-cyber-success border border-cyber-success/40'
                    : 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                }`}
              >
                {robotState}
              </span>
            </div>

            {/* 3D Robot Canvas */}
            <div className="h-[210px] w-full rounded-xl bg-surface-2/90 border border-border overflow-hidden relative">
              <RobotSceneContainer state={robotState} />
            </div>

            <p className="text-[11px] font-mono text-text-muted leading-tight text-center">
              Robot posture and visual aura dynamically reflect simulated adversary stress.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Attack Configuration Grid */}
      <AttackTechniqueGrid
        selectedAttack={selectedAttack}
        onSelectAttack={(type) => {
          setSelectedAttack(type);
          executeSimulation({ attackType: type });
        }}
        disabled={isSimulating}
      />

      {/* 4. Perturbation & Calibration Controls */}
      <PerturbationControls
        attackStrength={attackStrength}
        onChangeStrength={(st) => {
          setAttackStrength(st);
          executeSimulation({ attackStrength: st });
        }}
        intensity={intensity}
        onChangeIntensity={(val) => {
          setIntensity(val);
          executeSimulation({ intensity: val });
        }}
        mutationCount={mutationCount}
        onChangeMutationCount={(val) => {
          setMutationCount(val);
          executeSimulation({ mutationCount: val });
        }}
        preserveSemantics={preserveSemantics}
        onToggleSemantics={() => {
          const next = !preserveSemantics;
          setPreserveSemantics(next);
          executeSimulation({ preserveSemantics: next });
        }}
        preserveUrlStructure={preserveUrlStructure}
        onToggleUrlStructure={() => {
          const next = !preserveUrlStructure;
          setPreserveUrlStructure(next);
          executeSimulation({ preserveUrlStructure: next });
        }}
        onRunSimulation={() => executeSimulation()}
        isSimulating={isSimulating}
      />

      {/* 5. Simulation In Progress Pipeline Tracker */}
      {isSimulating && (
        <RobustnessSimulationProgress currentStep={simStep} />
      )}

      {/* 6. Results Sections */}
      {simulationResult && !isSimulating && (
        <div className="space-y-6">
          {/* Main 3-Panel Visual Centerpiece */}
          <RobustnessComparison result={simulationResult} />

          {/* Robustness Score Card + Attack Stability Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 flex flex-col">
              <RobustnessScoreCard
                robustnessScore={simulationResult.robustnessScore}
                stabilityScore={simulationResult.stabilityScore}
                confidenceRetention={simulationResult.confidenceRetention}
                signalPreservation={simulationResult.signalPreservation}
                recoveryRate={simulationResult.recoveryRate}
              />
            </div>
            <div className="lg:col-span-7 flex flex-col">
              <ConfidenceStabilityChart
                data={simulationResult.stabilityChartData}
              />
            </div>
          </div>

          {/* Perturbation Diff Viewer */}
          <PerturbationDiffViewer
            originalText={simulationResult.originalInput}
            perturbedText={simulationResult.perturbedInput}
            diffTokens={simulationResult.diffTokens}
            attackType={simulationResult.config.attackType}
          />

          {/* Interactive Attack & Defense Chain */}
          <AttackChainVisualization
            attackType={simulationResult.config.attackType}
            defenseType={simulationResult.config.activeDefense}
          />

          {/* Feature Impact Panel (8 Affected Model Signals) */}
          <FeatureImpactPanel signals={simulationResult.affectedSignals} />

          {/* Defensive Hardening Strategies Grid */}
          <DefenseStrategyGrid
            activeDefense={activeDefense}
            onSelectDefense={(def) => {
              setActiveDefense(def);
            }}
            onRunHardening={handleRunHardening}
            isHardening={isHardening}
          />

          {/* Hardening Simulation Workflow (Recovery delta +28 pts) */}
          <HardeningSimulation result={simulationResult} />

          {/* Robustness Matrix (Attack Types x Responses) */}
          <RobustnessMatrix matrixData={simulationResult.matrixData} />

          {/* Timeline + Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <RobustnessTimeline timeline={simulationResult.timeline} />
            </div>
            <div className="lg:col-span-6">
              <RobustnessExplanation explanation={simulationResult.explanation} />
            </div>
          </div>

          {/* Final Robustness Assessment & Verdict */}
          <RobustnessVerdict verdict={simulationResult.resilienceVerdict} />
        </div>
      )}

      {/* Export Modal */}
      <RobustnessExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        result={simulationResult}
      />
    </div>
  );
};
