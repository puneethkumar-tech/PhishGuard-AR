export type ThreatLevel = 'safe' | 'suspicious' | 'phishing' | 'adversarial' | 'blocked';

export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical' | 'safe';

export type RobotState =
  | 'IDLE'
  | 'SCANNING'
  | 'ANALYZING'
  | 'THREAT_DETECTED'
  | 'EXPLAINING'
  | 'PROTECTED'
  | 'LAB_READY'
  | 'ATTACK_CONFIGURING'
  | 'PERTURBING'
  | 'ROBUSTNESS_CHECK'
  | 'DEFENDING'
  | 'RECOVERING';

export interface ThreatNodeData {
  id: string;
  position: [number, number, number];
  lat: number;
  lng: number;
  label: string;
  type: string;
  threatLevel: ThreatLevel;
  timestamp: string;
  intensity: number;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description: string;
  iconName: string;
  tag: 'DEMO';
}

export interface ScanPipelineStep {
  id: number;
  label: string;
  sublabel: string;
  status: 'idle' | 'processing' | 'completed';
}

export interface ActivityDataPoint {
  time: string;
  scanned: number;
  threats: number;
}

export interface NavItem {
  name: string;
  href: string;
  icon: string;
  description: string;
  badge?: string;
  section?: 'COMMAND CENTER' | 'AI SECURITY' | 'INTELLIGENCE' | 'SYSTEM';
}

export interface SearchItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Threat Vector' | 'Security Report' | 'Model Architecture';
  description: string;
  href: string;
  badge?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'threat' | 'system' | 'report' | 'model';
  isRead: boolean;
  threatLevel?: ThreatLevel;
}

export interface DetailedScanLog {
  id: string;
  timestamp: string;
  target: string;
  preview: string;
  type: 'Text Content' | 'Email Header & Body' | 'File Attachment' | 'URL Link';
  verdict: 'SAFE' | 'SUSPICIOUS' | 'PHISHING' | 'ADVERSARIAL HOMOGLYPH' | 'BLOCKED';
  confidence: string;
  threatLevel: ThreatLevel;
  indicators: string[];
  recommendation: string;
}

export interface ReportDossier {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  format: string;
  threatScore: string;
  samplesAnalyzed: number;
  status: 'VERIFIED' | 'FORENSIC AUDIT' | 'ACTIVE BENCHMARK';
  keyFindings: string[];
}

export interface RobustnessCase {
  id: string;
  name: string;
  category: string;
  originalText: string;
  attackedText: string;
  attackType: string;
  baselineVerdict: string;
  baselineConfidence: string;
  attackVerdict: string;
  attackConfidence: string;
  confidenceDrop: string;
  hardenedVerdict: string;
  hardenedConfidence: string;
  defenseMechanism: string;
}

export interface UserSettings {
  theme: 'dark' | 'cyber';
  density: 'compact' | 'comfortable';
  animations: boolean;
  reducedMotion: boolean;
  protectionMode: 'standard' | 'high-sensitivity' | 'adversarial-hardened';
  threatThreshold: number;
  autoScan: boolean;
  notificationsEnabled: boolean;
  securityAlerts: boolean;
  dailySummary: boolean;
  compactNav: boolean;
}

// Phase 4 & Phase 5: Forensic & XAI Types
export type EvidenceCategory =
  | 'urgency'
  | 'credential'
  | 'url'
  | 'payment'
  | 'impersonation'
  | 'homoglyph'
  | 'language'
  | 'structure';

export interface ScanEvidenceToken {
  text: string;
  isThreat: boolean;
  category?: EvidenceCategory;
  explanation?: string;
  contributionLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AIExplanationPoint {
  id: string;
  stepNumber?: string;
  title: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  whyItMatters?: string;
}

export interface ModelSignalContribution {
  id: string;
  name: string;
  weight: number; // 0 to 100
  contributionLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  description: string;
}

export interface MitreAttackContext {
  techniqueId: string;
  techniqueName: string;
  subTechniqueId?: string;
  tactic: string;
  tacticCategory: 'Initial Access' | 'Social Engineering' | 'Credential Access' | 'Defense Evasion' | 'Execution';
  description: string;
}

export interface AttackChainStep {
  step: number;
  phase: string;
  title: string;
  description: string;
  status: 'simulated' | 'contained' | 'prevented';
}

export interface UrlForensicData {
  fullUrl: string;
  protocol: string;
  domain: string;
  subdomain?: string;
  path: string;
  params: string;
  isSpoofed: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flags: string[];
}

export interface CharacterForensicData {
  character: string;
  unicode: string;
  script: string;
  targetChar: string;
  targetUnicode: string;
  targetScript: string;
  explanation: string;
}

export interface RobustnessSnapshotData {
  baselineConfidence: number; // e.g. 96.8
  perturbedConfidence: number; // e.g. 34.2
  hardenedConfidence: number; // e.g. 95.4
  attackType: string;
  defenseStrategy: string;
  stabilityScore: string;
}

export interface ThreatMetadataInfo {
  threatType: string;
  subcategory: string;
  vector: string;
  language: string;
  status: string;
  mode: string;
  actionSeverity: 'IMMEDIATE ACTION' | 'REVIEW RECOMMENDED' | 'SAFE TO PROCEED';
}

export interface ScanResult {
  id: string;
  timestamp: string;
  input: string;
  mode: 'text' | 'email' | 'url' | 'upload';
  verdict: string;
  verdictDescription: string;
  severity: ThreatSeverity;
  threatLevel: ThreatLevel;
  confidence: number;
  confidenceText: string;
  confidenceInterpretation: string;
  metadata: ThreatMetadataInfo;
  tokens: ScanEvidenceToken[];
  signals: Array<{ signal: string; description: string; contribution: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  contributions: ModelSignalContribution[];
  explanations: AIExplanationPoint[];
  mitreContext?: MitreAttackContext;
  attackChain: AttackChainStep[];
  urlForensics?: UrlForensicData;
  characterForensics?: CharacterForensicData[];
  robustnessSnapshot: RobustnessSnapshotData;
  recommendation: string;
  isHomoglyph?: boolean;
}

export interface DemoScanSample {
  id: string;
  title: string;
  category: string;
  content: string;
  mode: 'text' | 'email' | 'url' | 'upload';
  expectedVerdict: string;
  threatLevel: ThreatLevel;
  confidence: number;
  signals: string[];
  recommendation: string;
  tokens: ScanEvidenceToken[];
  explanations: AIExplanationPoint[];
}

// ==========================================
// PHASE 6: ADVERSARIAL ROBUSTNESS LAB TYPES
// ==========================================

export type RobustnessAttackType =
  | 'homoglyph'
  | 'url-obfuscation'
  | 'semantic-paraphrase'
  | 'urgency-mutation'
  | 'formatting-mutation'
  | 'token-insertion'
  | 'brand-mutation';

export type RobustnessAttackStrength = 'LOW' | 'MEDIUM' | 'HIGH';

export type RobustnessDefenseType =
  | 'char-norm'
  | 'url-canon'
  | 'adv-train'
  | 'ensemble'
  | 'context-reanalysis'
  | 'threshold-adj';

export interface RobustnessAttackStrategy {
  id: RobustnessAttackType;
  name: string;
  tag: string;
  description: string;
  simulatedStrength: RobustnessAttackStrength;
  expectedEffect: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  icon: string;
}

export interface RobustnessDefenseStrategy {
  id: RobustnessDefenseType;
  name: string;
  purpose: string;
  expectedEffect: string;
  status: 'READY' | 'ACTIVE' | 'TESTED';
  icon: string;
}

export interface RobustnessSimulationConfig {
  sampleId: string;
  sampleTitle: string;
  inputText: string;
  attackType: RobustnessAttackType;
  attackStrength: RobustnessAttackStrength;
  intensity: number; // 0 to 100
  mutationCount: number; // 1 to 10
  preserveSemantics: boolean;
  preserveUrlStructure: boolean;
  activeDefense: RobustnessDefenseType;
}

export interface DiffCharacterInfo {
  originalChar: string;
  perturbedChar: string;
  originalUnicode: string;
  perturbedUnicode: string;
  originalScript: string;
  perturbedScript: string;
  note: string;
}

export interface RobustnessDiffToken {
  text: string;
  isModified: boolean;
  charInfo?: DiffCharacterInfo;
  type?: 'char' | 'token' | 'url' | 'phrase' | 'punctuation';
}

export interface AffectedSignalResponse {
  name: string;
  baseline: 'LOW' | 'MEDIUM' | 'HIGH';
  adversarial: 'LOW' | 'MEDIUM' | 'HIGH';
  hardened: 'LOW' | 'MEDIUM' | 'HIGH';
  baselineVal: number; // 0-100
  adversarialVal: number;
  hardenedVal: number;
  delta: string;
  category: string;
}

export interface StabilityChartPoint {
  intensity: number; // 0, 20, 40, 60, 80, 100
  baselineConfidence: number;
  adversarialConfidence: number;
  hardenedConfidence: number;
}

export interface RobustnessMatrixRow {
  attackId: RobustnessAttackType;
  attackName: string;
  original: number;
  perturbed: number;
  hardened: number;
  confidenceDelta: string;
  stability: 'ROBUST' | 'HIGH' | 'MODERATE' | 'LOW';
  defenseStrategy: string;
  techniqueSummary: string;
}

export interface RobustnessTimelineEvent {
  timestamp: string;
  title: string;
  phase: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

export interface RobustnessSimulationResult {
  config: RobustnessSimulationConfig;
  originalInput: string;
  perturbedInput: string;
  diffTokens: RobustnessDiffToken[];
  originalConfidence: number;
  perturbedConfidence: number;
  hardenedConfidence: number;
  originalVerdict: string;
  perturbedVerdict: string;
  hardenedVerdict: string;
  robustnessScore: number; // 0 - 100
  stabilityScore: 'LOW' | 'MODERATE' | 'HIGH' | 'ROBUST';
  attackSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  defenseEffectiveness: 'MODERATE' | 'HIGH' | 'EXCELLENT';
  confidenceRetention: number; // e.g. 86
  signalPreservation: number; // e.g. 78
  recoveryRate: number; // e.g. 91
  recoveryDelta: number; // e.g. +28
  affectedSignals: AffectedSignalResponse[];
  stabilityChartData: StabilityChartPoint[];
  matrixData: RobustnessMatrixRow[];
  timeline: RobustnessTimelineEvent[];
  explanation: string[];
  attackSteps: Array<{ step: number; title: string; description: string; detail: string }>;
  resilienceVerdict: {
    resilience: 'HIGH' | 'MODERATE' | 'LOW';
    recovery: 'STRONG' | 'MODERATE' | 'LOW';
    signalPreservation: 'HIGH' | 'MODERATE' | 'LOW';
    status: string;
    interpretation: string;
  };
}

export interface RobustnessDemoScenario {
  id: string;
  title: string;
  category: string;
  defaultAttack: RobustnessAttackType;
  sampleInput: string;
  description: string;
  tag: 'DEMO';
}

export interface SavedRobustnessItem {
  id: string;
  timestamp: string;
  sampleTitle: string;
  attackType: string;
  robustnessScore: number;
  originalConfidence: number;
  perturbedConfidence: number;
  hardenedConfidence: number;
  defenseStrategy: string;
}

// ==========================================
// PHASE 7: ANALYTICS + SECURITY DASHBOARD TYPES
// ==========================================

export type DashboardTimeRange = '24H' | '7D' | '30D';

export interface DashboardKpiMetric {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  description: string;
  icon: string;
  sparkline: number[];
  tag: 'DEMO' | 'SIMULATION';
}

export interface ThreatActivityTimeseriesPoint {
  timestamp: string;
  timeLabel: string;
  detected: number;
  suspicious: number;
  blocked: number;
  total: number;
}

export interface ThreatSeverityItem {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  count: number;
  percentage: number;
  color: string;
  description: string;
}

export interface ThreatTypeItem {
  id: string;
  name: string;
  count: number;
  percentage: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affectedSignals: string[];
  color: string;
}

export interface DetectionPerformanceData {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  benchmarkModelName: string;
  comparisonModelName: string;
}

export interface ModelComparisonMetricItem {
  attribute: string;
  svmScore: number;
  distilbertScore: number;
  unit?: string;
  description: string;
}

export interface DashboardRobustnessSummary {
  baselineStability: number;
  underAttackStability: number;
  confidenceRetention: number;
  recoveryRate: number;
  signalPreservation: number;
  compositeRobustnessScore: number;
  activeHardeningTechnique: string;
  status: 'ROBUST' | 'HIGH' | 'MODERATE';
}

export interface AttackTechniqueStat {
  id: string;
  name: string;
  attempts: number;
  confidenceDrop: number;
  recoveryRate: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DefenseEffectivenessStat {
  id: string;
  name: string;
  recoveryRate: number;
  signalPreservation: number;
  effectivenessRating: 'EXCELLENT' | 'HIGH' | 'MODERATE';
  status: 'ACTIVE' | 'CALIBRATED';
}

export interface SecurityTrendPoint {
  timeLabel: string;
  threatVolume: number;
  detectionConfidence: number;
  robustness: number;
  defenseRecovery: number;
}

export interface SecurityEventFeedItem {
  id: string;
  timestamp: string;
  eventType: 'PHISHING DETECTED' | 'ROBUSTNESS TEST' | 'DEFENSE SIMULATION' | 'SUSPICIOUS URL' | 'SAFE MESSAGE' | 'BLOCKED PAYLOAD';
  category: string;
  shortDescription: string;
  confidence: number;
  threatLevel: ThreatLevel;
  severity: ThreatSeverity;
  status: 'ANALYZED' | 'CONTAINED' | 'HARDENED' | 'CLEAN' | 'QUARANTINED';
}

export interface TopThreatSignalItem {
  id: string;
  signal: string;
  category: string;
  impactScore: number; // 0 - 100
  frequencyPercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SecurityPostureBreakdownItem {
  axis: string;
  score: number; // 0 - 100
  benchmark: number;
  weight: number;
}

export interface DashboardDataset {
  timeRange: DashboardTimeRange;
  snapshotTimestamp: string;
  postureScore: number;
  postureRating: 'HIGH RESILIENCE' | 'MODERATE RESILIENCE' | 'OPTIMAL RESILIENCE' | 'AT RISK';
  postureSubMetrics: {
    threatDetection: number;
    modelStability: number;
    adversarialResilience: number;
    defenseRecovery: number;
    signalIntegrity: number;
  };
  kpis: DashboardKpiMetric[];
  threatActivity: ThreatActivityTimeseriesPoint[];
  severityDistribution: ThreatSeverityItem[];
  threatTypes: ThreatTypeItem[];
  detectionPerformance: DetectionPerformanceData;
  modelComparison: ModelComparisonMetricItem[];
  robustness: DashboardRobustnessSummary;
  attackAnalytics: AttackTechniqueStat[];
  defenseEffectiveness: DefenseEffectivenessStat[];
  securityTrends: SecurityTrendPoint[];
  events: SecurityEventFeedItem[];
  topSignals: TopThreatSignalItem[];
  aiInsightText: string;
  postureBreakdown: SecurityPostureBreakdownItem[];
}

// ==========================================
// PHASE 8: ADVANCED AI VISUALIZATIONS & NEURAL NETWORK TYPES
// ==========================================

export type AIVisualizationMode =
  | 'PIPELINE'
  | 'NEURAL_NETWORK'
  | 'SIGNAL_FUSION'
  | 'THREAT_CONSTELLATION'
  | 'EXPLAINABILITY'
  | 'pipeline'
  | 'neural'
  | 'fusion'
  | 'constellation'
  | 'explainability';

export type InferenceSpeed = 'slow' | 'normal' | 'fast';

export type InferenceSimulationStage =
  | 'READY'
  | 'INGESTING'
  | 'FEATURE_EXTRACTION'
  | 'SVM_ANALYSIS'
  | 'DISTILBERT_ANALYSIS'
  | 'TRANSFORMER_ANALYSIS'
  | 'SIGNAL_FUSION'
  | 'ROBUSTNESS_CHECK'
  | 'DECISION'
  | 'EXPLANATION'
  | 'COMPLETE';

export interface NeuralLayerInfo {
  id: string;
  index: number;
  name: string;
  shortName: string;
  description: string;
  nodeCount: number;
  color: string;
}

export interface NeuralNodeData {
  id: string;
  layerIndex: number;
  name: string;
  layerName: string;
  role: string;
  signalType: string;
  simulatedActivation: number; // 0 to 1
  contributionLevel: 'High' | 'Medium' | 'Low';
  description: string;
  relatedSignals: string[];
  position: [number, number, number];
  color: string;
  isHighlighted?: boolean;
}

export interface NeuralConnectionData {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
  weight: number;
  isActive: boolean;
  pulseSpeed?: number;
  color?: string;
}

export interface SignalFusionItemData {
  id: string;
  name: string;
  category: string;
  simulatedStrength: number; // 0 to 1
  description: string;
  weight: number;
  status: 'CRITICAL' | 'WARNING' | 'ELEVATED' | 'NOMINAL';
  color: string;
}

export interface AIThreatConstellationNode {
  id: string;
  name: string;
  category: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW';
  simulatedFrequency: string;
  associatedSignals: string[];
  robustnessExposure: string;
  defenseStrategy: string;
  position: [number, number, number];
  connections: string[];
  color: string;
}

export interface AIExplainabilityNodeData {
  id: string;
  label: string;
  category: string;
  simulatedContribution: number;
  description: string;
  parentIds: string[];
  status: 'ACTIVE' | 'CALIBRATED' | 'INACTIVE';
}

export interface TokenAttentionItem {
  token: string;
  weight: number; // 0 to 1
  category: string;
  isPerturbed: boolean;
}

export interface InferenceTimelineStep {
  stepNumber: number;
  timecode: string;
  title: string;
  layer: string;
  description: string;
  simulatedDurationMs: number;
  status: 'READY' | 'ACTIVE' | 'COMPLETED';
}

export interface AIDemoScenarioData {
  id: string;
  name: string;
  category: string;
  sampleInput: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'PHISHING' | 'ADVERSARIAL' | 'BLOCKED';
  confidenceScore: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW' | 'critical' | 'high' | 'medium' | 'low' | ThreatLevel;
  robustnessScore: number;
  explanationSummary: string;
  tokens: TokenAttentionItem[];
  fusionSignals: SignalFusionItemData[];
  primarySignals: string[];
}

export interface AIIntelligenceDataset {
  scenario: AIDemoScenarioData;
  layers: NeuralLayerInfo[];
  nodes: NeuralNodeData[];
  connections: NeuralConnectionData[];
  fusionSignals: SignalFusionItemData[];
  constellationNodes: AIThreatConstellationNode[];
  explainabilityNodes: AIExplainabilityNodeData[];
  tokens: TokenAttentionItem[];
  timeline: InferenceTimelineStep[];
}
