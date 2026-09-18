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

