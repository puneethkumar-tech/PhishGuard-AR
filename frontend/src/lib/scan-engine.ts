import { DEMO_SAMPLE_MESSAGES } from './demo-data';
import {
  ScanResult,
  ScanEvidenceToken,
  AIExplanationPoint,
  ThreatLevel,
  ThreatSeverity,
  ModelSignalContribution,
  MitreAttackContext,
  AttackChainStep,
  UrlForensicData,
  CharacterForensicData,
  RobustnessSnapshotData,
  ThreatMetadataInfo,
} from '@/types';

const STORAGE_KEY = 'phishguard_demo_scan_history';

export function analyzeDemoThreat(input: string, mode: 'text' | 'email' | 'url' | 'upload' = 'text'): ScanResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // 1. Check for specific demo presets
  if (lower.includes('microsoft 365') || lower.includes('login-microsoft') || lower.includes('suspicious sign-in')) {
    return createCredentialHarvestingResult(trimmed, mode);
  } else if (lower.includes('wire $24,800') || lower.includes('european supplier') || lower.includes('supplier escrow')) {
    return createBecResult(trimmed, mode);
  } else if (lower.includes('invoice #inv-89104') || (lower.includes('overdue') && lower.includes('1,420.00'))) {
    return createUrgentPaymentResult(trimmed, mode);
  } else if (lower.includes('sso password') || lower.includes('accounts-security-verify.org') || lower.includes('password expires')) {
    return createPasswordResetResult(trimmed, mode);
  } else if (lower.includes('pаypаl') || lower.includes('dispute?token=') || /[\u0400-\u04FF]/.test(trimmed)) {
    return createHomoglyphResult(trimmed, mode);
  } else if (lower.includes('engineering architecture synchronization') || lower.includes('jira before the call') || lower.includes('conference room b')) {
    return createLegitimateResult(trimmed, mode);
  }

  // 2. Generic heuristic simulation for custom user input
  return createGenericSimulatedResult(trimmed, mode);
}

// Preset 1: Credential Harvesting
function createCredentialHarvestingResult(input: string, mode: any): ScanResult {
  return {
    id: `SCAN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    input,
    mode,
    verdict: 'PHISHING DETECTED',
    verdictDescription: 'High-confidence credential harvesting lure targeting enterprise Microsoft 365 tokens.',
    severity: 'high',
    threatLevel: 'phishing',
    confidence: 98.4,
    confidenceText: '98.4% DEMO',
    confidenceInterpretation: 'The simulated dual-model output indicates a high-confidence phishing classification driven by extreme urgency and lookalike login redirection.',
    metadata: {
      threatType: 'PHISHING',
      subcategory: 'Credential Harvesting',
      vector: 'Deceptive Redirect URL',
      language: 'English (EN)',
      status: 'SIMULATION ENVIRONMENT',
      mode: 'DEMO FORENSIC ANALYSIS',
      actionSeverity: 'IMMEDIATE ACTION',
    },
    tokens: [
      { text: 'URGENT SECURITY ALERT:', isThreat: true, category: 'urgency', contributionLevel: 'HIGH', explanation: 'High-pressure urgency intimidation marker.' },
      { text: ' Your Microsoft 365 cloud credentials have been ', isThreat: false },
      { text: 'blocked', isThreat: true, category: 'urgency', contributionLevel: 'HIGH', explanation: 'Fabricated account lock status coercion.' },
      { text: ' due to suspicious sign-in from Moscow, RU. Click ', isThreat: false },
      { text: 'https://login-microsoft-secure-verify.net/reset?auth=9812', isThreat: true, category: 'url', contributionLevel: 'HIGH', explanation: 'Deceptive lookalike domain mimicking authentic Microsoft Single Sign-On.' },
      { text: ' to restore immediate access.', isThreat: false },
    ],
    signals: [
      { signal: 'Deceptive Redirect Domain', description: 'Domain login-microsoft-secure-verify.net registered < 48 hours ago', contribution: 'HIGH' },
      { signal: 'Urgency & Psychological Coercion', description: "High-pressure urgency markers ('URGENT', 'blocked')", contribution: 'HIGH' },
      { signal: 'Brand Impersonation Vector', description: 'Unauthorized use of Microsoft 365 cloud identity', contribution: 'MEDIUM' },
      { signal: 'Unverified Sender Envelope', description: 'DKIM/SPF spoofing mismatch (envelope vs from headers)', contribution: 'MEDIUM' },
    ],
    contributions: [
      { id: 'c1', name: 'Credential Harvesting Language', weight: 94, contributionLevel: 'HIGH', category: 'Lexical Intent', description: 'Strong semantic association with login theft and token harvesting.' },
      { id: 'c2', name: 'Deceptive URL Architecture', weight: 89, contributionLevel: 'HIGH', category: 'Domain Structure', description: 'Typosquatting and suspicious newly observed domain pattern.' },
      { id: 'c3', name: 'Artificial Urgency Framing', weight: 82, contributionLevel: 'HIGH', category: 'Psychological Coercion', description: 'Coercive urgency inducing panic to bypass verification checks.' },
      { id: 'c4', name: 'Brand Impersonation Alignment', weight: 78, contributionLevel: 'MEDIUM', category: 'Identity Spoofing', description: 'Misuse of corporate Microsoft 365 trademark markers.' },
      { id: 'c5', name: 'Anomalous Structural Formatting', weight: 45, contributionLevel: 'LOW', category: 'Syntactic Layout', description: 'Non-standard email footer and missing corporate sign-off.' },
    ],
    explanations: [
      { id: 'e1', stepNumber: '01', title: 'Artificial Urgency & Coercion', explanation: 'The message constructs an immediate crisis requiring action within minutes.', whyItMatters: 'Urgency bypasses critical thinking and prompts impulsive credential submission.', severity: 'high', category: 'Social Engineering' },
      { id: 'e2', stepNumber: '02', title: 'Brand Impersonation Domain', explanation: "Domain 'login-microsoft-secure-verify.net' is not registered by Microsoft Corporation.", whyItMatters: 'Attacker controls the destination server and records entered passwords.', severity: 'high', category: 'Domain Spoofing' },
      { id: 'e3', stepNumber: '03', title: 'Credential Extraction Payload', explanation: 'Directs the victim to an unauthenticated external portal to harvest enterprise tokens.', whyItMatters: 'Compromised credentials permit lateral enterprise network traversal.', severity: 'high', category: 'Attack Vector' },
    ],
    mitreContext: {
      techniqueId: 'T1566.002',
      techniqueName: 'Phishing: Spearphishing Link',
      tactic: 'Initial Access',
      tacticCategory: 'Initial Access',
      description: 'Adversaries send spearphishing messages with a malicious link to lure targets into providing credentials.',
    },
    attackChain: [
      { step: 1, phase: 'Initial Lure', title: 'Deceptive Email Delivery', description: 'Message arrives spoofing cloud security notification.', status: 'simulated' },
      { step: 2, phase: 'Coercion', title: 'Panic Induction', description: "Fabricated Moscow sign-in warning prompts user to click reset link.", status: 'simulated' },
      { step: 3, phase: 'Credential Capture', title: 'Lookalike Harvest Portal', description: "Victim enters corporate credentials on attacker-hosted mirror.", status: 'contained' },
      { step: 4, phase: 'Compromise', title: 'Session Hijacking', description: "PhishGuard-AR intercept prevented token extraction.", status: 'prevented' },
    ],
    urlForensics: {
      fullUrl: 'https://login-microsoft-secure-verify.net/reset?auth=9812',
      protocol: 'https://',
      domain: 'login-microsoft-secure-verify.net',
      subdomain: 'login',
      path: '/reset',
      params: '?auth=9812',
      isSpoofed: true,
      riskLevel: 'HIGH',
      flags: ['Newly Registered Domain (<48h)', 'Brand Typosquatting', 'Unverified SSL Issuer'],
    },
    robustnessSnapshot: {
      baselineConfidence: 98.4,
      perturbedConfidence: 74.2,
      hardenedConfidence: 96.8,
      attackType: 'Character & Keyword Mutation',
      defenseStrategy: 'NFKC Normalization + DistilBERT Attention',
      stabilityScore: '98.3% Stability',
    },
    recommendation: 'Do NOT click the link or provide credentials. Block sender domain at enterprise mail gateway and revoke any active user session tokens.',
    isHomoglyph: false,
  };
}

// Preset 2: Business Email Compromise (BEC)
function createBecResult(input: string, mode: any): ScanResult {
  return {
    id: `SCAN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    input,
    mode,
    verdict: 'FINANCIAL FRAUD / BEC',
    verdictDescription: 'Executive impersonation attempt requesting unauthorized expedited wire transfer.',
    severity: 'high',
    threatLevel: 'phishing',
    confidence: 96.9,
    confidenceText: '96.9% DEMO',
    confidenceInterpretation: 'The simulated dual model identified financial coercion combined with executive secrecy tactics.',
    metadata: {
      threatType: 'BUSINESS EMAIL COMPROMISE',
      subcategory: 'CEO / Supplier Wire Fraud',
      vector: 'Direct Message / Wire Lure',
      language: 'English (EN)',
      status: 'SIMULATION ENVIRONMENT',
      mode: 'DEMO FORENSIC ANALYSIS',
      actionSeverity: 'IMMEDIATE ACTION',
    },
    tokens: [
      { text: 'CONFIDENTIAL:', isThreat: true, category: 'impersonation', contributionLevel: 'HIGH', explanation: 'Social engineering secrecy tactic.' },
      { text: ' Hi Mark, please ', isThreat: false },
      { text: 'immediately wire $24,800', isThreat: true, category: 'payment', contributionLevel: 'HIGH', explanation: 'Urgent monetary disbursement instruction.' },
      { text: ' to our newly updated European supplier escrow account ', isThreat: false },
      { text: '#GB82-9910-2391', isThreat: true, category: 'payment', contributionLevel: 'HIGH', explanation: 'Unverified third-party account number.' },
      { text: ' to clear the server hardware shipment before 5 PM EST today.', isThreat: false },
    ],
    signals: [
      { signal: 'Executive Secrecy / Isolation Tactic', description: "Marked 'CONFIDENTIAL' to prevent consultation with finance team", contribution: 'HIGH' },
      { signal: 'Unscheduled Wire Routing Request', description: 'Urgent demand to disburse $24,800 to newly modified escrow account', contribution: 'HIGH' },
      { signal: 'Tight Artificial Deadline', description: 'Mandates action before 5 PM EST to bypass procurement validation', contribution: 'MEDIUM' },
    ],
    contributions: [
      { id: 'c1', name: 'Wire Payment Instruction', weight: 96, contributionLevel: 'HIGH', category: 'Financial Extraction', description: 'Direct monetary wire extraction pattern.' },
      { id: 'c2', name: 'Isolation / Secrecy Language', weight: 88, contributionLevel: 'HIGH', category: 'Social Engineering', description: 'Psychological tactic discouraging target from seeking internal verification.' },
      { id: 'c3', name: 'Urgency Deadline Framing', weight: 81, contributionLevel: 'HIGH', category: 'Time Pressure', description: 'Forced same-day completion deadline.' },
      { id: 'c4', name: 'Supplier Identity Mimicry', weight: 70, contributionLevel: 'MEDIUM', category: 'Impersonation', description: 'Plausible context around server hardware procurement.' },
    ],
    explanations: [
      { id: 'e1', stepNumber: '01', title: 'Social Engineering Isolation', explanation: 'The attacker marks the request confidential to discourage peer consultation.', whyItMatters: 'Prevents target from running dual-authorization accounting controls.', severity: 'high', category: 'Social Engineering' },
      { id: 'e2', stepNumber: '02', title: 'Unscheduled Banking Redirection', explanation: 'Changes supplier routing number to an unverified third-party escrow account.', whyItMatters: 'Transferred funds are instantly laundered through multi-hop accounts.', severity: 'high', category: 'Financial Fraud' },
    ],
    mitreContext: {
      techniqueId: 'T1566.001',
      techniqueName: 'Phishing: Spearphishing Attachment / BEC',
      tactic: 'Social Engineering',
      tacticCategory: 'Social Engineering',
      description: 'Adversaries impersonate executives or trusted suppliers to fraudulently redirect wire payments.',
    },
    attackChain: [
      { step: 1, phase: 'Impersonation', title: 'Executive Spoofing', description: 'Display name spoofed to match executive officer.', status: 'simulated' },
      { step: 2, phase: 'Financial Lure', title: 'Urgent Wire Demand', description: 'Demands expedited $24,800 transfer to supplier.', status: 'simulated' },
      { step: 3, phase: 'Interception', title: 'AI Flag Triggered', description: 'PhishGuard-AR identified CEO fraud semantics.', status: 'contained' },
      { step: 4, phase: 'Protection', title: 'Disbursement Blocked', description: 'Recommended out-of-band phone verification.', status: 'prevented' },
    ],
    robustnessSnapshot: {
      baselineConfidence: 96.9,
      perturbedConfidence: 81.5,
      hardenedConfidence: 95.2,
      attackType: 'Synonym & Urgency Substitution',
      defenseStrategy: 'DistilBERT Semantic Attention Layer',
      stabilityScore: '98.2% Stability',
    },
    recommendation: 'Halt all wire disbursements immediately. Validate request through out-of-band phone confirmation with executive and procurement director.',
    isHomoglyph: false,
  };
}

// Preset 3: Urgent Payment Scam
function createUrgentPaymentResult(input: string, mode: any): ScanResult {
  return {
    id: `SCAN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    input,
    mode,
    verdict: 'PAYMENT PHISHING DETECTED',
    verdictDescription: 'Invoice scam utilizing legal threats to extract fraudulent settlement fees.',
    severity: 'high',
    threatLevel: 'phishing',
    confidence: 95.7,
    confidenceText: '95.7% DEMO',
    confidenceInterpretation: 'High probability malicious invoice fraud leveraging intimidation tactics.',
    metadata: {
      threatType: 'PAYMENT SCAM',
      subcategory: 'Overdue Invoice Phishing',
      vector: 'Fake Payment Gateway Link',
      language: 'English (EN)',
      status: 'SIMULATION ENVIRONMENT',
      mode: 'DEMO FORENSIC ANALYSIS',
      actionSeverity: 'IMMEDIATE ACTION',
    },
    tokens: [
      { text: 'FINAL NOTICE:', isThreat: true, category: 'urgency', contributionLevel: 'HIGH', explanation: 'Intimidation urgency header.' },
      { text: ' Invoice #INV-89104 is 30 days overdue. ', isThreat: false },
      { text: 'Immediate payment of $1,420.00 is required today to avoid legal collection fees', isThreat: true, category: 'payment', contributionLevel: 'HIGH', explanation: 'Legal threat payment demand.' },
      { text: ' and credit termination. Pay via: ', isThreat: false },
      { text: 'https://quick-invoice-gateway.co/pay?id=89104', isThreat: true, category: 'url', contributionLevel: 'HIGH', explanation: 'Unregistered third-party gateway portal.' },
    ],
    signals: [
      { signal: 'Legal Action Intimidation', description: 'Threatens collection fees and credit termination', contribution: 'HIGH' },
      { signal: 'Unverified Invoice Gateway', description: 'Domain quick-invoice-gateway.co has no business registry records', contribution: 'HIGH' },
      { signal: 'Generic Reference ID', description: 'Invoice number does not match internal ERP accounting system', contribution: 'MEDIUM' },
    ],
    contributions: [
      { id: 'c1', name: 'Coercive Payment Demand', weight: 92, contributionLevel: 'HIGH', category: 'Financial Extraction', description: 'Aggressive collection language.' },
      { id: 'c2', name: 'Unregistered Gateway URL', weight: 87, contributionLevel: 'HIGH', category: 'Domain Structure', description: 'Unverified payment portal.' },
      { id: 'c3', name: 'Legal Intimidation Tactics', weight: 79, contributionLevel: 'MEDIUM', category: 'Psychological Pressure', description: 'Credit cancellation intimidation.' },
    ],
    explanations: [
      { id: 'e1', stepNumber: '01', title: 'Fabricated Invoice Debt', explanation: 'Message creates fictitious $1,420 liability to extract immediate payment.', whyItMatters: 'Scammers exploit accounts payable workflows.', severity: 'high', category: 'Financial Scam' },
      { id: 'e2', stepNumber: '02', title: 'Unverified Payment URL', explanation: "URL 'quick-invoice-gateway.co' captures corporate credit card details.", whyItMatters: 'Leads to unauthorized recurring card charges.', severity: 'high', category: 'Card Harvesting' },
    ],
    mitreContext: {
      techniqueId: 'T1566.002',
      techniqueName: 'Phishing: Spearphishing Link',
      tactic: 'Initial Access',
      tacticCategory: 'Initial Access',
      description: 'Lures users to fraudulent payment portals to harvest banking credentials and payment cards.',
    },
    attackChain: [
      { step: 1, phase: 'Lure Delivery', title: 'Overdue Notice', description: 'Attacker sends fake invoice claim.', status: 'simulated' },
      { step: 2, phase: 'Intimidation', title: 'Threat of Legal Action', description: 'Demands immediate settlement.', status: 'simulated' },
      { step: 3, phase: 'Detection', title: 'Model Flagged URL', description: 'Gateway identified as unverified collector.', status: 'contained' },
      { step: 4, phase: 'Mitigation', title: 'Payment Prevented', description: 'ERP cross-check initiated.', status: 'prevented' },
    ],
    urlForensics: {
      fullUrl: 'https://quick-invoice-gateway.co/pay?id=89104',
      protocol: 'https://',
      domain: 'quick-invoice-gateway.co',
      path: '/pay',
      params: '?id=89104',
      isSpoofed: true,
      riskLevel: 'HIGH',
      flags: ['Generic Domain Namespace', 'Unverified Payment Gateway', 'Missing Trust Seals'],
    },
    robustnessSnapshot: {
      baselineConfidence: 95.7,
      perturbedConfidence: 78.9,
      hardenedConfidence: 94.8,
      attackType: 'Word Replacement Evasion',
      defenseStrategy: 'TF-IDF + Linear SVM Dual Ensemble',
      stabilityScore: '99.1% Stability',
    },
    recommendation: 'Do NOT submit payment. Cross-reference invoice reference with the official procurement ledger and report domain to SecOps.',
    isHomoglyph: false,
  };
}

// Preset 4: Password Reset Scam
function createPasswordResetResult(input: string, mode: any): ScanResult {
  return {
    id: `SCAN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    input,
    mode,
    verdict: 'SSO CREDENTIAL HARVESTER',
    verdictDescription: 'Lookalike Single Sign-On portal harvesting corporate passwords.',
    severity: 'high',
    threatLevel: 'phishing',
    confidence: 97.2,
    confidenceText: '97.2% DEMO',
    confidenceInterpretation: 'High-confidence identity theft attempt impersonating internal IT Security.',
    metadata: {
      threatType: 'IDENTITY THEFT',
      subcategory: 'SSO Password Expiry Scam',
      vector: 'Unencrypted HTTP Redirect',
      language: 'English (EN)',
      status: 'SIMULATION ENVIRONMENT',
      mode: 'DEMO FORENSIC ANALYSIS',
      actionSeverity: 'IMMEDIATE ACTION',
    },
    tokens: [
      { text: 'From: Security Team <noreply@accounts-security-verify.org>', isThreat: true, category: 'impersonation', contributionLevel: 'HIGH', explanation: 'External spoofed sender.' },
      { text: '\nSubject: Password Expiry Notification\n\nYour SSO password expires in ', isThreat: false },
      { text: '2 hours.', isThreat: true, category: 'urgency', contributionLevel: 'HIGH', explanation: 'Artificial 2-hour deadline.' },
      { text: ' To maintain access to internal corporate systems, ', isThreat: false },
      { text: 'verify your existing password now:', isThreat: true, category: 'credential', contributionLevel: 'HIGH', explanation: 'Direct password entry demand.' },
      { text: ' ', isThreat: false },
      { text: 'http://auth-portal-sso.org/verify', isThreat: true, category: 'url', contributionLevel: 'HIGH', explanation: 'Insecure lookalike domain.' },
    ],
    signals: [
      { signal: 'Lookalike SSO Domain', description: 'Domain auth-portal-sso.org mimics corporate identity provider', contribution: 'HIGH' },
      { signal: 'Insecure HTTP Transport', description: 'Submits passwords over unencrypted HTTP cleartext channel', contribution: 'HIGH' },
      { signal: 'Artificial Expiry Deadline', description: 'Claims password expires in 2 hours to force bypass of IT validation', contribution: 'MEDIUM' },
    ],
    contributions: [
      { id: 'c1', name: 'SSO Identity Spoofing', weight: 95, contributionLevel: 'HIGH', category: 'Authentication Spoof', description: 'Mimics corporate Single Sign-On.' },
      { id: 'c2', name: 'Direct Password Extraction', weight: 91, contributionLevel: 'HIGH', category: 'Credential Access', description: 'Demands current password entry.' },
      { id: 'c3', name: 'Tight Expiry Deadline', weight: 80, contributionLevel: 'HIGH', category: 'Urgency', description: 'Induces panic over account loss.' },
    ],
    explanations: [
      { id: 'e1', stepNumber: '01', title: 'SSO Brand Impersonation', explanation: 'Spoofs company identity provider to deceive users into credential entry.', whyItMatters: 'Provides attacker with unrestricted Single Sign-On privileges.', severity: 'high', category: 'Identity Spoof' },
      { id: 'e2', stepNumber: '02', title: 'Cleartext Transport Protocol', explanation: "Transports passwords via 'http://' rather than secure 'https://'.", whyItMatters: 'Enables man-in-the-middle cleartext credential sniffing.', severity: 'high', category: 'Protocol Vulnerability' },
    ],
    mitreContext: {
      techniqueId: 'T1566.002',
      techniqueName: 'Phishing: Spearphishing Link',
      tactic: 'Credential Access',
      tacticCategory: 'Credential Access',
      description: 'Adversaries craft fake login pages to capture passwords for subsequent privilege escalation.',
    },
    attackChain: [
      { step: 1, phase: 'Impersonation', title: 'Fake IT Sender', description: 'Attacker sends simulated SSO warning.', status: 'simulated' },
      { step: 2, phase: 'Deadline', title: '2-Hour Pressure', description: 'Target rushed to prevent account expiration.', status: 'simulated' },
      { step: 3, phase: 'Interception', title: 'Insecure Link Flagged', description: 'Cleartext HTTP channel detected.', status: 'contained' },
      { step: 4, phase: 'Quarantine', title: 'Portal Blocked', description: 'Domain blacklisted in local gateway.', status: 'prevented' },
    ],
    urlForensics: {
      fullUrl: 'http://auth-portal-sso.org/verify',
      protocol: 'http:// (INSECURE)',
      domain: 'auth-portal-sso.org',
      path: '/verify',
      params: '',
      isSpoofed: true,
      riskLevel: 'CRITICAL',
      flags: ['Insecure Cleartext Protocol (HTTP)', 'Newly Registered SSO Namespace', 'Untrusted CA'],
    },
    robustnessSnapshot: {
      baselineConfidence: 97.2,
      perturbedConfidence: 79.4,
      hardenedConfidence: 96.1,
      attackType: 'Character Perturbation',
      defenseStrategy: 'Byte-Level Tokenization + Normalizer',
      stabilityScore: '98.9% Stability',
    },
    recommendation: 'Do NOT visit link or input passwords. Legitimate IT security departments never request password confirmations via unencrypted email links.',
    isHomoglyph: false,
  };
}

// Preset 5: Adversarial Homoglyph Evasion
function createHomoglyphResult(input: string, mode: any): ScanResult {
  return {
    id: `SCAN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    input,
    mode,
    verdict: 'ADVERSARIAL HOMOGLYPH FLAGGED',
    verdictDescription: 'Unicode confusable character evasion attempting to disguise phishing lure as authentic PayPal domain.',
    severity: 'critical',
    threatLevel: 'adversarial',
    confidence: 94.2,
    confidenceText: '94.2% DEMO',
    confidenceInterpretation: 'Adversarial evasion detected: The sender substituted Cyrillic glyphs to bypass ASCII keyword filters. Hardened normalizer successfully exposed the underlying lure.',
    metadata: {
      threatType: 'ADVERSARIAL EVASION',
      subcategory: 'Cyrillic Homoglyph Attack',
      vector: 'Internationalized Domain (IDN) Spoof',
      language: 'English + Cyrillic Mixed',
      status: 'SIMULATION ENVIRONMENT',
      mode: 'DEMO FORENSIC ANALYSIS',
      actionSeverity: 'IMMEDIATE ACTION',
    },
    tokens: [
      { text: 'Notice: An unauthorized transaction of $499.00 was authorized on your account. Review details and dispute here: ', isThreat: false },
      { text: 'http://pаypаl-security-verification.com/dispute?token=92819', isThreat: true, category: 'homoglyph', contributionLevel: 'HIGH', explanation: "Homoglyph detected: 'а' characters are Cyrillic (U+0430), mimicking Latin 'a'." },
    ],
    signals: [
      { signal: 'Unicode Confusable Substitution', description: "Cyrillic Small Letter 'а' (U+0430) substituted for Latin 'a' (U+0061)", contribution: 'HIGH' },
      { signal: 'Punycode Normalization Recovery', description: 'Recovered punycode representation xn--pypal-security-verification-q2b.com', contribution: 'HIGH' },
      { signal: 'Consumer Payment Brand Spoof', description: 'Impersonates PayPal customer dispute resolution center', contribution: 'MEDIUM' },
    ],
    contributions: [
      { id: 'c1', name: 'Homoglyph Glyph Obfuscation', weight: 98, contributionLevel: 'HIGH', category: 'Adversarial Evasion', description: 'Cross-script Unicode confusable substitution.' },
      { id: 'c2', name: 'Domain Typosquatting', weight: 91, contributionLevel: 'HIGH', category: 'Deceptive URL', description: 'Deceptive dispute resolution namespace.' },
      { id: 'c3', name: 'Unauthorized Charge Lure', weight: 84, contributionLevel: 'HIGH', category: 'Social Engineering', description: 'Fabricated $499 transaction inducing panic.' },
    ],
    explanations: [
      { id: 'e1', stepNumber: '01', title: 'Adversarial Character Mutation', explanation: "Visual spoofing replaces Latin 'a' with Cyrillic 'а' to defeat standard regex keyword detectors.", whyItMatters: 'Un-hardened classifiers mistake the domain for safe text due to vocabulary mismatch.', severity: 'high', category: 'Evasion Technique' },
      { id: 'e2', stepNumber: '02', title: 'Adversarial Defense Hardening', explanation: 'PhishGuard-AR Unicode confusable engine normalized punycode representation back to canonical ASCII.', whyItMatters: 'Allows downstream DistilBERT transformer to properly classify threat intent.', severity: 'high', category: 'Robustness Mechanism' },
    ],
    mitreContext: {
      techniqueId: 'T1036.007',
      techniqueName: 'Masquerading: Double Extension / Homoglyph',
      tactic: 'Defense Evasion',
      tacticCategory: 'Defense Evasion',
      description: 'Adversaries manipulate character encodings and Unicode confusables to disguise malicious domains and bypass security inspection filters.',
    },
    attackChain: [
      { step: 1, phase: 'Mutation', title: 'Homoglyph Generation', description: "Attacker swaps Latin 'a' with Cyrillic 'а'.", status: 'simulated' },
      { step: 2, phase: 'Evasion', title: 'Filter Bypass Attempt', description: 'Traditional ASCII filters fail to flag keyword.', status: 'simulated' },
      { step: 3, phase: 'Recovery', title: 'NFKC Normalization', description: 'PhishGuard-AR decodes Unicode confusable.', status: 'contained' },
      { step: 4, phase: 'Defense', title: 'Hardened Verdict', description: 'Adversarial resistance maintained at 94.2%.', status: 'prevented' },
    ],
    urlForensics: {
      fullUrl: 'http://pаypаl-security-verification.com/dispute?token=92819',
      protocol: 'http://',
      domain: 'pаypаl-security-verification.com',
      path: '/dispute',
      params: '?token=92819',
      isSpoofed: true,
      riskLevel: 'CRITICAL',
      flags: ['Homoglyph Unicode Confusable Detected', 'Punycode: xn--pypal-0kb.com', 'Deceptive Brand Identity'],
    },
    characterForensics: [
      { character: 'а', unicode: 'U+0430', script: 'Cyrillic Small Letter A', targetChar: 'a', targetUnicode: 'U+0061', targetScript: 'Latin Small Letter A', explanation: 'Visually indistinguishable on screen but recognized as a distinct code point by standard parsers.' },
      { character: 'а', unicode: 'U+0430', script: 'Cyrillic Small Letter A', targetChar: 'a', targetUnicode: 'U+0061', targetScript: 'Latin Small Letter A', explanation: 'Second occurrence in domain name used to split token in vocabulary embeddings.' },
    ],
    robustnessSnapshot: {
      baselineConfidence: 97.4,
      perturbedConfidence: 32.1,
      hardenedConfidence: 94.2,
      attackType: 'Cyrillic Homoglyph Replacement',
      defenseStrategy: 'Unicode NFKC + Confusable Map',
      stabilityScore: '96.8% Hardened Recovery',
    },
    recommendation: 'Quarantine message immediately. Domain employs internationalized homoglyphs to deceive users into submitting wallet credentials.',
    isHomoglyph: true,
  };
}

// Preset 6: Legitimate Corporate Mail
function createLegitimateResult(input: string, mode: any): ScanResult {
  return {
    id: `SCAN-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    input,
    mode,
    verdict: 'BENIGN / SAFE MESSAGE',
    verdictDescription: 'Authentic internal communication matching routine enterprise operational vocabulary.',
    severity: 'safe',
    threatLevel: 'safe',
    confidence: 99.5,
    confidenceText: '99.5% DEMO',
    confidenceInterpretation: 'The simulated dual-model analysis found zero threat indicators, neutral semantic tone, and full alignment with normal business operations.',
    metadata: {
      threatType: 'BENIGN COMMUNICATION',
      subcategory: 'Internal Engineering Sync',
      vector: 'Internal Exchange Relay',
      language: 'English (EN)',
      status: 'SIMULATION ENVIRONMENT',
      mode: 'DEMO FORENSIC ANALYSIS',
      actionSeverity: 'SAFE TO PROCEED',
    },
    tokens: [
      { text: input, isThreat: false },
    ],
    signals: [
      { signal: 'Neutral Business Tone', description: 'Vocabulary matches standard corporate scheduling and engineering coordination', contribution: 'LOW' },
      { signal: 'Zero Obfuscated Glyphs', description: 'Clean UTF-8 ASCII encoding without hidden zero-width tokens', contribution: 'LOW' },
      { signal: 'No Exfiltration Payloads', description: 'Zero external links, credential prompts, or monetary demands', contribution: 'LOW' },
    ],
    contributions: [
      { id: 'c1', name: 'Corporate Operational Context', weight: 98, contributionLevel: 'LOW', category: 'Semantic Tone', description: 'Neutral engineering synchronization phrasing.' },
      { id: 'c2', name: 'Clean Character Encoding', weight: 99, contributionLevel: 'LOW', category: 'Encoding Verification', description: 'Zero adversarial perturbations detected.' },
    ],
    explanations: [
      { id: 'e1', stepNumber: '01', title: 'Authentic Operational Phrasing', explanation: 'Phrasing aligns with standard Jira/meeting workflows without manipulative coercive cues.', whyItMatters: 'Indicates legitimate internal business routine.', severity: 'low', category: 'Benign Context' },
      { id: 'e2', stepNumber: '02', title: 'Absence of Threat Vectors', explanation: 'No external credential portals, spoofed headers, or urgency timers identified.', whyItMatters: 'Maintains verified safe score across all ensemble models.', severity: 'low', category: 'Integrity Check' },
    ],
    mitreContext: {
      techniqueId: 'N/A',
      techniqueName: 'No Adversarial Technique Detected',
      tactic: 'Benign Normal Traffic',
      tacticCategory: 'Initial Access',
      description: 'Communication matches benign organizational standards and contains no malicious techniques.',
    },
    attackChain: [
      { step: 1, phase: 'Transmission', title: 'Internal Message Ingestion', description: 'Message processed by security scanner.', status: 'simulated' },
      { step: 2, phase: 'Ensemble Pass', title: 'Dual Model Evaluation', description: 'TF-IDF and DistilBERT confirm safe intent.', status: 'simulated' },
      { step: 3, phase: 'Integrity Check', title: 'Zero Perturbations', description: 'No anomalous token vectors found.', status: 'simulated' },
      { step: 4, phase: 'Verification', title: 'Safe Classification', description: 'Message approved for standard delivery.', status: 'prevented' },
    ],
    robustnessSnapshot: {
      baselineConfidence: 99.5,
      perturbedConfidence: 99.2,
      hardenedConfidence: 99.5,
      attackType: 'None (Benign Baseline)',
      defenseStrategy: 'Dual Model Consistency Check',
      stabilityScore: '100% Stability',
    },
    recommendation: 'No security intervention required. Message is verified safe for standard internal handling.',
    isHomoglyph: false,
  };
}

// Generic fallback for custom text
function createGenericSimulatedResult(input: string, mode: any): ScanResult {
  const hasUrgency = /\b(urgent|immediately|action required|final notice|blocked|suspended|expires|within \d+ hours)\b/i.test(input);
  const hasCredentials = /\b(password|credential|login|verify account|sign in|sso|token|auth)\b/i.test(input);
  const hasPayment = /\b(wire|invoice|\$|transfer|payment|banking|escrow|funds)\b/i.test(input);
  const hasUrl = /https?:\/\/[^\s]+|www\.[^\s]+/i.test(input);
  const hasHomoglyphChar = /[\u0400-\u04FF]/.test(input) && /[a-zA-Z]/.test(input);

  if (hasHomoglyphChar) {
    return createHomoglyphResult(input, mode);
  }

  if ((hasUrgency && hasCredentials) || (hasUrgency && hasPayment) || (hasCredentials && hasUrl)) {
    return createCredentialHarvestingResult(input, mode);
  }

  if (hasUrgency || hasPayment || hasUrl) {
    return createUrgentPaymentResult(input, mode);
  }

  return createLegitimateResult(input, mode);
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
