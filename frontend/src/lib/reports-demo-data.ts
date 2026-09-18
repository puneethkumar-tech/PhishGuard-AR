/**
 * PhishGuard-AR — Phase 9
 * Centralized Security Reports Demo Dataset
 * 
 * 100% Frontend-Only — Deterministic Demonstration Data
 */

import { ReportRecord } from '@/types';

export const DEMO_REPORTS_DATA: ReportRecord[] = [
  {
    id: 'RPT-2026-0891',
    title: 'Executive Threat Briefing: Multi-Modal Credential Harvesting Campaign',
    reportType: 'EXECUTIVE_SUMMARY',
    sourceLabel: 'Scan Record #PHG-0001 (Microsoft 365 Lure)',
    verdict: 'PHISHING',
    severity: 'CRITICAL',
    confidence: 96.4,
    robustnessScore: 92.0,
    createdAt: '2026-09-18 14:45:00',
    status: 'GENERATED',
    executiveSummary:
      'A targeted credential harvesting attempt impersonating Microsoft 365 security notifications was evaluated by the PhishGuard-AR dual-engine. The payload utilizes high-urgency psychological coercion combined with an ephemeral high-entropy external domain (auth-verify892.top). The multi-modal Bayesian fusion layer synthesized 8 independent threat signals to output a calibrated 96.4% phishing confidence verdict.',
    evidence: [
      'Lexical urgency markers ("immediately", "prevent service termination") contributing 22% risk weight.',
      'Target URL resolves to unauthorized domain auth-verify892.top registered < 48 hours ago.',
      'Anchor text mismatch disguising actual destination host.',
      'Brand mimicry of Microsoft enterprise single-sign-on login interface.',
    ],
    modelAnalysis: {
      svmConfidence: 94.2,
      distilbertConfidence: 96.1,
      fusionScore: 96.4,
      concordanceIndex: '98.2% High Concordance',
    },
    attackContext: {
      tactic: 'TA0001 Initial Access',
      technique: 'T1566.002 Spearphishing Link',
      cveId: 'N/A (Social Engineering)',
      notes: 'Attack simulates adversary attempting to bypass 2FA via credential forwarding proxy.',
    },
    robustnessAssessment: {
      baselineAccuracy: 94.2,
      underAttackAccuracy: 68.4,
      hardenedAccuracy: 92.0,
      resilienceRating: 'HIGH',
    },
    defenseInterpretation:
      'PhishGuard-AR Phase 6 hardening filters neutralized zero-width space noise and homoglyphs, maintaining high detection confidence despite adversary perturbation.',
    recommendations: [
      'Perimeter firewall block on domain auth-verify892.top.',
      'Enforce FIDO2 WebAuthn hardware security keys to prevent proxy relay theft.',
      'Issue automated security awareness briefing to targeted department users.',
    ],
    timeline: [
      { time: '00:00.12', stage: 'Ingestion', description: 'UTF-8 stream decoded and normalized.' },
      { time: '00:00.48', stage: 'Feature Extraction', description: 'N-grams and Shannon entropy measured.' },
      { time: '00:01.35', stage: 'Transformer Evaluation', description: 'Multilingual DistilBERT attention focused on coercion intent.' },
      { time: '00:02.32', stage: 'Signal Fusion', description: 'Bayesian weighting synthesized 8 threat signals.' },
      { time: '00:02.75', stage: 'Verdict Generation', description: 'Calibrated 96.4% Phishing decision reached.' },
    ],
  },
  {
    id: 'RPT-2026-0890',
    title: 'Adversarial Robustness Assessment: Homoglyph & Unicode Evasion Analysis',
    reportType: 'ROBUSTNESS_ASSESSMENT',
    sourceLabel: 'Scan Record #PHG-0003 (PayPal Cyrillic Attack)',
    verdict: 'ADVERSARIAL',
    severity: 'CRITICAL',
    confidence: 96.8,
    robustnessScore: 95.0,
    createdAt: '2026-09-18 11:32:00',
    status: 'GENERATED',
    executiveSummary:
      'Detailed forensic evaluation of an adversarial evasion attack embedding 14 Cyrillic confusable characters within Latin text. While standard unhardened baseline classifiers experienced a 25.8% accuracy drop, the PhishGuard-AR Adversarial Robustness Engine successfully canonicalized Unicode scripts and preserved a 95.0% resilience score.',
    evidence: [
      '14 Cyrillic homoglyph character substitutions (e.g. Cyrillic "а" [U+0430] vs Latin "a" [U+0061]).',
      'Target domain pаypаl-sесurе-lоgin.соm uses mixed-script punycode encoding.',
      'Preservation of semantic threat intent despite visual obfuscation.',
    ],
    modelAnalysis: {
      svmConfidence: 71.4,
      distilbertConfidence: 96.8,
      fusionScore: 96.8,
      concordanceIndex: '94.6% Robust Concordance',
    },
    attackContext: {
      tactic: 'TA0005 Defense Evasion',
      technique: 'T1036.005 Masquerading: Match Legitimate Name',
      cveId: 'Unicode Confusable TR39',
      notes: 'Demonstrates vulnerability of legacy regex and ASCII-only security appliances.',
    },
    robustnessAssessment: {
      baselineAccuracy: 94.2,
      underAttackAccuracy: 68.4,
      hardenedAccuracy: 95.0,
      resilienceRating: 'OPTIMAL',
    },
    defenseInterpretation:
      'Phase 6 gradient regularization and Unicode normalization pipelines effectively mapped confusable characters back to canonical Latin forms prior to semantic classification.',
    recommendations: [
      'Implement strict Unicode script boundary filtering on incoming email gateway.',
      'Reject mixed-script domain registrations across DNS firewall rules.',
      'Deploy PhishGuard-AR hardened inference layer across all edge inspection nodes.',
    ],
    timeline: [
      { time: '00:00.10', stage: 'Raw Payload Ingest', description: 'Ingested raw UTF-8 byte stream with mixed scripts.' },
      { time: '00:00.45', stage: 'Homoglyph Detection', description: 'Cataloged 14 Cyrillic script confusables.' },
      { time: '00:01.20', stage: 'Canonicalization', description: 'Normalized characters to standard ASCII baseline.' },
      { time: '00:02.10', stage: 'Robustness Defense', description: 'Applied gradient invariance bounds.' },
      { time: '00:02.80', stage: 'Hardened Output', description: 'Confirmed malicious evasion verdict.' },
    ],
  },
  {
    id: 'RPT-2026-0889',
    title: 'Forensic Deep-Dive: Multi-Hop URL Cloaking & Shortener Traversal',
    reportType: 'FORENSIC_ANALYSIS',
    sourceLabel: 'Scan Record #PHG-0007 (Bitly Redirect Chain)',
    verdict: 'BLOCKED',
    severity: 'CRITICAL',
    confidence: 98.1,
    robustnessScore: 91.0,
    createdAt: '2026-09-17 13:00:00',
    status: 'GENERATED',
    executiveSummary:
      'Investigation into a multi-hop HTTP redirect chain using shortened links to mask raw IP address infrastructure. Recursive headless unfurling traced 3 redirect hops leading to a fraudulent corporate single-sign-on login collector.',
    evidence: [
      'Initial Bitly short link redirects through intermediate tracking host.',
      'Terminal destination resolves to raw IPv4 address rather than registered corporate domain.',
      'HTML DOM contains password harvesting form matching enterprise portal styling.',
    ],
    modelAnalysis: {
      svmConfidence: 97.5,
      distilbertConfidence: 98.4,
      fusionScore: 98.1,
      concordanceIndex: '99.1% High Concordance',
    },
    attackContext: {
      tactic: 'TA0005 Defense Evasion',
      technique: 'T1027 Obfuscated / Encoded Files or Information',
      notes: 'Shorteners deployed to evade automated web scrapers and reputation filters.',
    },
    robustnessAssessment: {
      baselineAccuracy: 93.0,
      underAttackAccuracy: 72.0,
      hardenedAccuracy: 91.0,
      resilienceRating: 'HIGH',
    },
    defenseInterpretation:
      'Recursive URL graph traversal dynamically unfurls redirection hops before feature extraction.',
    recommendations: [
      'Block unverified public URL shorteners across enterprise messaging channels.',
      'Enforce zero-trust link sandboxing on external hyperlinks.',
    ],
    timeline: [
      { time: '00:00.15', stage: 'Link Ingestion', description: 'Detected shortened URL format.' },
      { time: '00:00.80', stage: 'Recursive Traversal', description: 'Unfurled 3 HTTP 302 hops to terminal IP.' },
      { time: '00:01.90', stage: 'DOM Inspection', description: 'Detected password input field.' },
      { time: '00:02.60', stage: 'Final Verdict', description: 'Blocked payload with 98.1% confidence.' },
    ],
  },
  {
    id: 'RPT-2026-0888',
    title: 'Multilingual Cross-Border Phishing Threat Briefing',
    reportType: 'THREAT_ANALYSIS',
    sourceLabel: 'Scan Record #PHG-0005 (German Banking Campaign)',
    verdict: 'PHISHING',
    severity: 'CRITICAL',
    confidence: 94.6,
    robustnessScore: 94.0,
    createdAt: '2026-09-17 19:00:00',
    status: 'GENERATED',
    executiveSummary:
      'Analysis of a non-English phishing campaign targeting European banking customers. Evaluated via Multilingual DistilBERT semantic representation, verifying language-invariant classification capability across German, French, and Spanish variants.',
    evidence: [
      'German credential request keywords ("Zugangsdaten", "Sicherheitszertifikat").',
      'Public cloud storage endpoint hosting unauthorized form.',
      'Artificial deadline pressure framing.',
    ],
    modelAnalysis: {
      svmConfidence: 91.2,
      distilbertConfidence: 95.8,
      fusionScore: 94.6,
      concordanceIndex: '97.0% High Concordance',
    },
    attackContext: {
      tactic: 'TA0001 Initial Access',
      technique: 'T1566.002 Spearphishing Link',
      notes: 'Cross-lingual phishing leverages non-English lures to bypass English-centric rules.',
    },
    robustnessAssessment: {
      baselineAccuracy: 92.5,
      underAttackAccuracy: 75.0,
      hardenedAccuracy: 94.0,
      resilienceRating: 'HIGH',
    },
    defenseInterpretation:
      'Multilingual transformer embeddings preserve semantic threat intent across 100+ languages without manual translation rules.',
    recommendations: [
      'Deploy language-agnostic deep learning filters on international email queues.',
      'Alert regional fraud operations teams regarding Deutsche Bank domain spoofs.',
    ],
    timeline: [
      { time: '00:00.10', stage: 'Ingestion', description: 'Ingested German-language text payload.' },
      { time: '00:00.60', stage: 'Subword Tokenization', description: 'Generated WordPiece token vectors.' },
      { time: '00:01.50', stage: 'Cross-Lingual Projection', description: 'Mapped tokens into universal semantic space.' },
      { time: '00:02.50', stage: 'Verdict Generated', description: 'Classified as 94.6% Phishing threat.' },
    ],
  },
  {
    id: 'RPT-2026-0887',
    title: 'Comprehensive Security Baseline & Clean Traffic Audit',
    reportType: 'FULL_SECURITY_ANALYSIS',
    sourceLabel: 'Scan Record #PHG-0006 (Internal Meeting Notice)',
    verdict: 'SAFE',
    severity: 'SAFE',
    confidence: 3.2,
    robustnessScore: 97.0,
    createdAt: '2026-09-17 15:30:00',
    status: 'ARCHIVED',
    executiveSummary:
      'Control baseline verification of legitimate corporate communication. Confirmed zero false-positive triggering across lexical, structural, and transformer analysis layers.',
    evidence: [
      'Cryptographic SPF/DKIM verification passed.',
      'Low lexical entropy (1.82 bits) and neutral collaborative framing.',
      'Zero external form targets or payment requests.',
    ],
    modelAnalysis: {
      svmConfidence: 2.8,
      distilbertConfidence: 3.5,
      fusionScore: 3.2,
      concordanceIndex: '99.5% High Concordance',
    },
    attackContext: {
      tactic: 'None (Legitimate Traffic)',
      technique: 'N/A',
      notes: 'Verified internal corporate calendar sync communication.',
    },
    robustnessAssessment: {
      baselineAccuracy: 99.0,
      underAttackAccuracy: 96.0,
      hardenedAccuracy: 97.0,
      resilienceRating: 'OPTIMAL',
    },
    defenseInterpretation:
      'Clean baseline samples pass through without suppression, maintaining ultra-low false positive rate.',
    recommendations: [
      'Maintain standard zero-trust cryptographic signature validation.',
    ],
    timeline: [
      { time: '00:00.10', stage: 'Ingestion', description: 'Ingested corporate meeting request.' },
      { time: '00:00.40', stage: 'Signature Check', description: 'Verified DKIM/SPF headers.' },
      { time: '00:01.10', stage: 'Model Analysis', description: 'Confirmed neutral tone.' },
      { time: '00:02.00', stage: 'Clean Verdict', description: 'Safe (3.2% confidence).' },
    ],
  },
];
