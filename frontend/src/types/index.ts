export type ThreatLevel = 'safe' | 'suspicious' | 'phishing' | 'adversarial' | 'blocked';

export type RobotState =
  | 'IDLE'
  | 'SCANNING'
  | 'ANALYZING'
  | 'THREAT_DETECTED'
  | 'EXPLAINING'
  | 'PROTECTED';

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

// Phase 4: AI Threat Scan & Robot Types
export interface ScanEvidenceToken {
  text: string;
  isThreat: boolean;
  category?: 'urgency' | 'credential' | 'url' | 'payment' | 'impersonation' | 'homoglyph';
  explanation?: string;
}

export interface AIExplanationPoint {
  id: string;
  title: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  input: string;
  mode: 'text' | 'email' | 'url' | 'upload';
  verdict: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'safe';
  threatLevel: ThreatLevel;
  confidence: number;
  confidenceText: string;
  tokens: ScanEvidenceToken[];
  signals: string[];
  explanations: AIExplanationPoint[];
  recommendation: string;
  language: string;
  urlRisk: string;
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
