import { DEMO_SAMPLE_MESSAGES } from './demo-data';
import { ScanResult, ScanEvidenceToken, AIExplanationPoint, ThreatLevel } from '@/types';

const STORAGE_KEY = 'phishguard_demo_scan_history';

export function analyzeDemoThreat(input: string, mode: 'text' | 'email' | 'url' | 'upload' = 'text'): ScanResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // 1. Check if input closely matches any curated demo samples
  for (const sample of DEMO_SAMPLE_MESSAGES) {
    if (
      trimmed === sample.content ||
      lower.includes(sample.title.toLowerCase()) ||
      sample.content.toLowerCase().includes(lower) ||
      (sample.id === 'sample-homoglyph' && (lower.includes('pаypаl') || lower.includes('dispute?token='))) ||
      (sample.id === 'sample-cred-harvesting' && (lower.includes('microsoft 365') || lower.includes('login-microsoft'))) ||
      (sample.id === 'sample-bec' && (lower.includes('wire $24,800') || lower.includes('supplier escrow')))
    ) {
      return {
        id: `SCAN-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        input: trimmed,
        mode,
        verdict: sample.expectedVerdict,
        severity: sample.threatLevel === 'phishing' ? 'high' : sample.threatLevel === 'adversarial' ? 'critical' : sample.threatLevel === 'suspicious' ? 'medium' : 'safe',
        threatLevel: sample.threatLevel,
        confidence: sample.confidence,
        confidenceText: `${sample.confidence.toFixed(1)}% DEMO`,
        tokens: sample.tokens,
        signals: sample.signals,
        explanations: sample.explanations,
        recommendation: sample.recommendation,
        language: 'EN (Detected)',
        urlRisk: sample.threatLevel === 'safe' ? 'LOW RISK' : 'HIGH RISK / SPOOFED',
        isHomoglyph: sample.id === 'sample-homoglyph' || lower.includes('pаypаl'),
      };
    }
  }

  // 2. Deterministic heuristic simulation for custom user input
  const hasUrgency = /\b(urgent|immediately|action required|final notice|blocked|suspended|expires|within \d+ hours)\b/i.test(trimmed);
  const hasCredentials = /\b(password|credential|login|verify account|sign in|sso|token|auth)\b/i.test(trimmed);
  const hasPayment = /\b(wire|invoice|\$|transfer|payment|banking|escrow|funds)\b/i.test(trimmed);
  const hasSuspiciousUrl = /https?:\/\/[^\s]+|www\.[^\s]+/i.test(trimmed);
  const hasHomoglyphChar = /[\u0400-\u04FF]/.test(trimmed) && /[a-zA-Z]/.test(trimmed); // Cyrillic mixed with Latin

  let threatLevel: ThreatLevel = 'safe';
  let verdict = 'BENIGN / SAFE MESSAGE';
  let severity: 'low' | 'medium' | 'high' | 'critical' | 'safe' = 'safe';
  let confidence = 98.6;
  const signals: string[] = [];
  const explanations: AIExplanationPoint[] = [];
  const tokens: ScanEvidenceToken[] = [];

  if (hasHomoglyphChar) {
    threatLevel = 'adversarial';
    verdict = 'ADVERSARIAL HOMOGLYPH FLAGGED';
    severity = 'critical';
    confidence = 94.8;
    signals.push("Unicode Confusable glyph substitution detected");
    signals.push("Internationalized domain spoofing indicator");
    signals.push("Adversarial normalization applied");
    explanations.push({
      id: 'exp-homo',
      title: 'Homoglyph Character Obfuscation',
      explanation: 'Detected mixed Cyrillic/Latin scripts specifically designed to evade ASCII keyword pattern matching.',
      severity: 'high',
      category: 'Adversarial Evasion'
    });
  } else if ((hasUrgency && hasCredentials) || (hasUrgency && hasPayment) || (hasCredentials && hasSuspiciousUrl)) {
    threatLevel = 'phishing';
    verdict = 'PHISHING THREAT DETECTED';
    severity = 'high';
    confidence = 96.4;
    if (hasUrgency) signals.push("High psychological urgency / coercive timing markers");
    if (hasCredentials) signals.push("Unauthorized credential verification / harvest request");
    if (hasPayment) signals.push("Unscheduled monetary payment or wire routing coercion");
    if (hasSuspiciousUrl) signals.push("Unverified external redirection link");
    
    explanations.push({
      id: 'exp-urg',
      title: 'Urgency & Psychological Coercion',
      explanation: 'Message leverages coercive deadlines to rush recipient into bypassing operational verification procedures.',
      severity: 'high',
      category: 'Social Engineering'
    });
    explanations.push({
      id: 'exp-intent',
      title: 'Credential / Financial Extraction Pattern',
      explanation: 'Semantic vectors indicate high alignment with credential harvesting and BEC wire fraud campaigns.',
      severity: 'high',
      category: 'Threat Intent'
    });
  } else if (hasUrgency || hasPayment || hasSuspiciousUrl) {
    threatLevel = 'suspicious';
    verdict = 'SUSPICIOUS COMMUNICATION';
    severity = 'medium';
    confidence = 88.2;
    signals.push("Elevated urgency or external hyperlink references");
    signals.push("Sender reputation unverified in local directory");
    explanations.push({
      id: 'exp-susp',
      title: 'Unverified Communication Patterns',
      explanation: 'Contains patterns that warrant secondary verification through internal communications channels.',
      severity: 'medium',
      category: 'Heuristic Flag'
    });
  } else {
    threatLevel = 'safe';
    verdict = 'VERIFIED BENIGN COMMUNICATION';
    severity = 'safe';
    confidence = 99.2;
    signals.push("Neutral business vocabulary without coercion");
    signals.push("Zero deceptive URLs or hidden Unicode tokens");
    explanations.push({
      id: 'exp-safe',
      title: 'Neutral Semantic Sentiment',
      explanation: 'No adversarial perturbations, urgency vectors, or credential prompts identified.',
      severity: 'low',
      category: 'Benign Verification'
    });
  }

  // Tokenize words for highlight
  const words = trimmed.split(/(\s+)/);
  for (const word of words) {
    if (!word) continue;
    const isThreatWord =
      /^(urgent|immediately|blocked|credentials?|password|wire|\$[0-9,]+|https?:\/\/[^\s]+)$/i.test(word) ||
      (hasHomoglyphChar && /[\u0400-\u04FF]/.test(word));
    
    tokens.push({
      text: word,
      isThreat: isThreatWord && threatLevel !== 'safe',
      category: isThreatWord ? (word.includes('$') || /wire/i.test(word) ? 'payment' : word.includes('http') ? 'url' : 'urgency') : undefined,
      explanation: isThreatWord ? 'Model evidence signal identified during feature extraction' : undefined,
    });
  }

  const recommendation =
    threatLevel === 'safe'
      ? 'No immediate risk detected. Maintain standard vigilance for attachments.'
      : threatLevel === 'adversarial'
      ? 'Do NOT click links. Adversarial glyph mutation detected. Quarantine message immediately.'
      : threatLevel === 'phishing'
      ? 'Do NOT click link or provide credentials. Block sender domain at enterprise gateway.'
      : 'Exercise caution. Verify authenticity of sender via independent out-of-band channel.';

  return {
    id: `SCAN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    input: trimmed,
    mode,
    verdict,
    severity,
    threatLevel,
    confidence,
    confidenceText: `${confidence.toFixed(1)}% DEMO`,
    tokens,
    signals,
    explanations,
    recommendation,
    language: 'EN (Auto-detected)',
    urlRisk: threatLevel === 'safe' ? 'LOW RISK' : 'HIGH RISK',
    isHomoglyph: hasHomoglyphChar,
  };
}

export function saveScanToLocalHistory(result: ScanResult): void {
  try {
    const existing = getLocalScanHistory();
    const updated = [result, ...existing.filter((item) => item.id !== result.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage safety fallback
  }
}

export function getLocalScanHistory(): ScanResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ScanResult[];
  } catch {
    return [];
  }
}
