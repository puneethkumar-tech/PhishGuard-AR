/**
 * PhishGuard-AR — Phase 8
 * Deterministic AI Visualization Simulation Engine
 * 
 * 100% Frontend-Only — NO Real ML Model / NO Real API / NO Backend
 * Strictly deterministic mapping of predefined demo states.
 */

import {
  AIDemoScenarioData,
  NeuralLayerInfo,
  NeuralNodeData,
  NeuralConnectionData,
  SignalFusionItemData,
  AIThreatConstellationNode,
  AIExplainabilityNodeData,
  TokenAttentionItem,
  InferenceTimelineStep,
  InferenceSimulationStage,
} from '@/types';
import {
  AI_DEMO_SCENARIOS,
  AI_NEURAL_LAYERS,
  AI_NEURAL_NODES,
  AI_NEURAL_CONNECTIONS,
  AI_SIGNAL_FUSION_ITEMS,
  AI_THREAT_CONSTELLATION_NODES,
  AI_EXPLAINABILITY_NODES,
  AI_INFERENCE_TIMELINE_STEPS,
} from './ai-visualization-demo-data';

export class AIVisualizationEngine {
  /**
   * Fetch a scenario by ID, fallback to the default Credential Harvesting scenario
   */
  public static getScenario(scenarioId?: string): AIDemoScenarioData {
    if (!scenarioId) {
      return AI_DEMO_SCENARIOS[0];
    }
    const found = AI_DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    return found || AI_DEMO_SCENARIOS[0];
  }

  /**
   * List all demo scenarios
   */
  public static getAllScenarios(): AIDemoScenarioData[] {
    return AI_DEMO_SCENARIOS;
  }

  /**
   * Return neural layers metadata
   */
  public static getNeuralLayers(): NeuralLayerInfo[] {
    return AI_NEURAL_LAYERS;
  }

  /**
   * Return neural network nodes adjusted for the current scenario
   */
  public static getNeuralNodes(scenarioId?: string, activeStage?: InferenceSimulationStage): NeuralNodeData[] {
    const scenario = this.getScenario(scenarioId);
    const isBenign = scenario.verdict === 'SAFE';

    return AI_NEURAL_NODES.map((node) => {
      let activation = node.simulatedActivation;

      // Adjust node activations deterministically if scenario is Benign
      if (isBenign) {
        if (node.layerIndex === 6) {
          activation = node.id === 'n-6-0' ? 0.03 : 0.05;
        } else if (node.layerIndex >= 1 && node.layerIndex <= 5) {
          activation = Number(Math.max(0.02, activation * 0.1).toFixed(2));
        }
      }

      // If simulated inference is running, highlight based on current layer
      let isStageActive = false;
      if (activeStage && activeStage !== 'READY' && activeStage !== 'COMPLETE') {
        const stageLayerMap: { [key in InferenceSimulationStage]?: number } = {
          INGESTING: 0,
          FEATURE_EXTRACTION: 1,
          SVM_ANALYSIS: 2,
          DISTILBERT_ANALYSIS: 3,
          TRANSFORMER_ANALYSIS: 3,
          SIGNAL_FUSION: 5,
          ROBUSTNESS_CHECK: 4,
          DECISION: 6,
          EXPLANATION: 6,
        };
        const targetLayer = stageLayerMap[activeStage];
        if (targetLayer !== undefined && node.layerIndex <= targetLayer) {
          isStageActive = true;
        }
      }

      return {
        ...node,
        simulatedActivation: activation,
        isHighlighted: isStageActive,
      };
    });
  }

  /**
   * Return network connections
   */
  public static getNeuralConnections(): NeuralConnectionData[] {
    return AI_NEURAL_CONNECTIONS;
  }

  /**
   * Return signal fusion items adjusted for the active scenario
   */
  public static getSignalFusionItems(scenarioId?: string): SignalFusionItemData[] {
    const scenario = this.getScenario(scenarioId);
    return scenario.fusionSignals || AI_SIGNAL_FUSION_ITEMS;
  }

  /**
   * Return threat constellation taxonomy nodes
   */
  public static getThreatConstellation(): AIThreatConstellationNode[] {
    return AI_THREAT_CONSTELLATION_NODES;
  }

  /**
   * Return simulated explainability graph
   */
  public static getExplainabilityGraph(scenarioId?: string): AIExplainabilityNodeData[] {
    const scenario = this.getScenario(scenarioId);
    if (scenario.verdict === 'SAFE') {
      return [
        {
          id: 'exp-b-1',
          label: 'DKIM & SPF Domain Alignment Valid',
          category: 'Identity Verification',
          simulatedContribution: 0.99,
          description: 'Cryptographic email signatures authenticate legitimate enterprise sender domain.',
          parentIds: [],
          status: 'ACTIVE',
        },
        {
          id: 'exp-b-2',
          label: 'Low Lexical Entropy & Neutral Framing',
          category: 'Input Evidence',
          simulatedContribution: 0.95,
          description: 'Standard workplace scheduling vocabulary; zero psychological urgency or payment demands.',
          parentIds: [],
          status: 'ACTIVE',
        },
        {
          id: 'exp-b-3',
          label: 'Signal Fusion Consensus: SAFE (96.8%)',
          category: 'Simulated Decision',
          simulatedContribution: 0.032,
          description: 'Simulated multi-modal model consensus classifies content as authentic corporate communication.',
          parentIds: ['exp-b-1', 'exp-b-2'],
          status: 'ACTIVE',
        },
      ];
    }
    return AI_EXPLAINABILITY_NODES;
  }

  /**
   * Return token-level attention map
   */
  public static getTokenAttentionMap(scenarioId?: string): TokenAttentionItem[] {
    const scenario = this.getScenario(scenarioId);
    return scenario.tokens;
  }

  /**
   * Return inference timeline steps with dynamic active status
   */
  public static getInferenceTimeline(
    activeStage: InferenceSimulationStage = 'READY'
  ): InferenceTimelineStep[] {
    const stageToStepNumber: { [key in InferenceSimulationStage]: number } = {
      READY: 0,
      INGESTING: 1,
      FEATURE_EXTRACTION: 2,
      SVM_ANALYSIS: 3,
      DISTILBERT_ANALYSIS: 4,
      TRANSFORMER_ANALYSIS: 4,
      SIGNAL_FUSION: 5,
      ROBUSTNESS_CHECK: 6,
      DECISION: 7,
      EXPLANATION: 8,
      COMPLETE: 8,
    };

    const currentStepNumber = stageToStepNumber[activeStage];

    return AI_INFERENCE_TIMELINE_STEPS.map((step) => {
      let status: 'READY' | 'ACTIVE' | 'COMPLETED' = 'READY';
      if (activeStage === 'COMPLETE' || step.stepNumber < currentStepNumber) {
        status = 'COMPLETED';
      } else if (step.stepNumber === currentStepNumber) {
        status = 'ACTIVE';
      }
      return {
        ...step,
        status,
      };
    });
  }

  /**
   * Calculate duration based on speed multiplier
   */
  public static getStepDuration(baseDurationMs: number, speed: 'slow' | 'normal' | 'fast'): number {
    switch (speed) {
      case 'slow':
        return Math.round(baseDurationMs * 1.8);
      case 'fast':
        return Math.round(baseDurationMs * 0.45);
      case 'normal':
      default:
        return baseDurationMs;
    }
  }
}
