// PHASE 6: ADVERSARIAL ROBUSTNESS LAB — DEMO DATA & SCENARIOS
// 100% Deterministic simulated datasets for model robustness evaluation.

import {
  RobustnessAttackStrategy,
  RobustnessDefenseStrategy,
  RobustnessDemoScenario,
} from '@/types';

export const ROBUSTNESS_DEMO_SCENARIOS: RobustnessDemoScenario[] = [
  {
    id: 'demo-cred-harvest',
    title: 'Credential Harvesting',
    category: 'Account Takeover Evasion',
    defaultAttack: 'homoglyph',
    sampleInput:
      'Your Microsoft account requires immediate verification. Please sign in to avoid account suspension: https://microsoft.com/verify-identity-login',
    description:
      'Simulates targeted account takeover lures using lookalike login destinations and urgent credential verification demands.',
    tag: 'DEMO',
  },
  {
    id: 'demo-banking-alert',
    title: 'Fake Banking Alert',
    category: 'Financial Phishing',
    defaultAttack: 'url-obfuscation',
    sampleInput:
      'URGENT: Unauthorized charge of $849.50 detected on your Chase / PayPal account. Review activity and cancel payment: http://paypal-security-dispute-auth.net/dispute?tx=84920',
    description:
      'Financial fraud notification designed to trigger panicked clicks through payment dispute lures.',
    tag: 'DEMO',
  },
  {
    id: 'demo-corporate-notice',
    title: 'Corporate Account Notice',
    category: 'Enterprise SSO Spoof',
    defaultAttack: 'urgency-mutation',
    sampleInput:
      'IT Support Notice: Your corporate Okta SSO authentication token will expire in 2 hours. Validate your corporate credentials now to prevent network disconnect: https://corporate-sso-auth-gateway.org/renew',
    description:
      'Internal enterprise IT notice leveraging mandatory authentication deadlines.',
    tag: 'DEMO',
  },
  {
    id: 'demo-multilingual',
    title: 'Multilingual Phishing',
    category: 'Cross-Lingual Evasion',
    defaultAttack: 'semantic-paraphrase',
    sampleInput:
      'Official Tax Advisory: Reembolso de impuestos pendiente de aprobacion por $620.00 USD. Confirme sus datos fiscales para recibir el pago directo: http://tax-refund-portal-gov.com/confirm',
    description:
      'Multilingual social engineering combining localized tax authority terminology with cross-border payment links.',
    tag: 'DEMO',
  },
  {
    id: 'demo-brand-impersonation',
    title: 'Brand Impersonation',
    category: 'E-Commerce Delivery Scam',
    defaultAttack: 'formatting-mutation',
    sampleInput:
      'Amazon Prime Notice: Your order #AMZ-88219 is on hold due to incorrect billing zip code. Update your payment method immediately to release shipment: https://amazon-prime-delivery-tracking.co/update',
    description:
      'E-commerce order fulfillment notice impersonating high-trust retail logistics.',
    tag: 'DEMO',
  },
  {
    id: 'demo-benign-mail',
    title: 'Legitimate Corporate Mail',
    category: 'Benign Baseline Control',
    defaultAttack: 'token-insertion',
    sampleInput:
      'Hi team, please find the quarterly engineering architecture review agenda attached for tomorrows 10:00 AM sync in Room 4B. Please review Jira board prior to meeting.',
    description:
      'Benign baseline control message to verify false-positive stability during perturbation testing.',
    tag: 'DEMO',
  },
];

export const ROBUSTNESS_ATTACK_STRATEGIES: RobustnessAttackStrategy[] = [
  {
    id: 'homoglyph',
    name: 'Homoglyph Injection',
    tag: 'UNICODE CONFUSABLE',
    description:
      'Replaces visually similar Latin characters (e.g., o, a, e, c, p) with Cyrillic or Greek confusable codepoints to deceive exact token matchers.',
    simulatedStrength: 'MEDIUM',
    expectedEffect:
      'Reduces lexical keyword confidence while keeping visual representation identical to human observers.',
    riskLevel: 'HIGH',
    icon: 'Type',
  },
  {
    id: 'url-obfuscation',
    name: 'URL Obfuscation',
    tag: 'DOMAIN MANIPULATION',
    description:
      'Mutates URL structures using bracket puncturing, hexadecimal IP notation, or lookalike subdomains.',
    simulatedStrength: 'HIGH',
    expectedEffect:
      'Bypasses basic static URL regex patterns while maintaining malicious redirection capability.',
    riskLevel: 'CRITICAL',
    icon: 'Globe',
  },
  {
    id: 'semantic-paraphrase',
    name: 'Semantic Paraphrasing',
    tag: 'SYNONYM SUBSTITUTION',
    description:
      'Replaces high-risk coercive phrases with contextually equivalent low-frequency synonyms to disrupt n-gram classifiers.',
    simulatedStrength: 'HIGH',
    expectedEffect:
      'Shifts semantic embedding distance away from known phishing clusters while preserving user urgency.',
    riskLevel: 'HIGH',
    icon: 'RefreshCw',
  },
  {
    id: 'urgency-mutation',
    name: 'Urgency Mutation',
    tag: 'SENTIMENT MODULATION',
    description:
      'Softens coercive keywords (e.g., changing "IMMEDIATE SUSPENSION" to "administrative review pending") to evade urgency heuristic detectors.',
    simulatedStrength: 'MEDIUM',
    expectedEffect:
      'Lowers urgency detection score while maintaining subtle coercive pressure on the victim.',
    riskLevel: 'MEDIUM',
    icon: 'AlertTriangle',
  },
  {
    id: 'formatting-mutation',
    name: 'Formatting Mutation',
    tag: 'STRUCTURAL NOISE',
    description:
      'Injects random capitalization jitter, redundant whitespaces, and punctuation delimiters across critical token boundaries.',
    simulatedStrength: 'LOW',
    expectedEffect:
      'Fragments tokenized subwords into unexpected subword byte-pair sequences.',
    riskLevel: 'LOW',
    icon: 'Sliders',
  },
  {
    id: 'token-insertion',
    name: 'Token Insertion',
    tag: 'BENIGN NOISE INJECTION',
    description:
      'Appends high-confidence benign corporate tokens (e.g., "Confidentiality Notice", "ISO-27001 Certified", "Sent from Outlook") to dilute malicious density.',
    simulatedStrength: 'MEDIUM',
    expectedEffect:
      'Artificially skews vocabulary distribution toward benign training distribution.',
    riskLevel: 'MEDIUM',
    icon: 'PlusCircle',
  },
  {
    id: 'brand-mutation',
    name: 'Brand Impersonation Mutation',
    tag: 'LEXICAL LEVENSHTEIN',
    description:
      'Injects single-character phonetic or visual substitutions into well-known enterprise brand names (e.g., Micr0soft, PayPa1).',
    simulatedStrength: 'HIGH',
    expectedEffect:
      'Evades trademark keyword blacklists while remaining instantly recognizable to the target.',
    riskLevel: 'HIGH',
    icon: 'ShieldAlert',
  },
];

export const ROBUSTNESS_DEFENSE_STRATEGIES: RobustnessDefenseStrategy[] = [
  {
    id: 'char-norm',
    name: 'Character Normalization (NFKC)',
    purpose:
      'Applies Unicode NFKC normalization and canonical confusable lookup to collapse internationalized spoof glyphs back to ASCII Latin.',
    expectedEffect:
      'Restores token fidelity and restores character-level lexical confidence by up to +35 points.',
    status: 'ACTIVE',
    icon: 'CheckCircle2',
  },
  {
    id: 'url-canon',
    name: 'URL Canonicalization & Punycode Resolver',
    purpose:
      'Decodes Punycode (IDN), strips obfuscating delimiters (e.g. bracket puncturing), and normalizes IP hex formats.',
    expectedEffect:
      'Exposes true destination domains to threat intelligence lookup engines.',
    status: 'ACTIVE',
    icon: 'Globe',
  },
  {
    id: 'adv-train',
    name: 'Adversarial Training & Data Augmentation',
    purpose:
      'Hardens transformer neural weights by fine-tuning on gradient-based adversarial perturbation vectors (FGSM / PGD).',
    expectedEffect:
      'Enhances boundary robustness across token jitter and synonym shifts.',
    status: 'ACTIVE',
    icon: 'Cpu',
  },
  {
    id: 'ensemble',
    name: 'Ensemble Verification (DistilBERT + SVM)',
    purpose:
      'Combines fine-grained contextual transformer embeddings with lexical subword token voting to eliminate single-model blindspots.',
    expectedEffect:
      'Reduces false negatives from semantic drift and token injection attacks.',
    status: 'READY',
    icon: 'ShieldCheck',
  },
  {
    id: 'context-reanalysis',
    name: 'Contextual Semantic Re-Analysis',
    purpose:
      'Performs whole-document intent classification and cross-references requested user actions with sender authority.',
    expectedEffect:
      'Detects concealed financial and credential intent even with soft urgency wording.',
    status: 'READY',
    icon: 'Sparkles',
  },
  {
    id: 'threshold-adj',
    name: 'Adaptive Suspicion Threshold Calibration',
    purpose:
      'Dynamically scales classification decision boundary based on cumulative anomaly signals and sender anomaly scores.',
    expectedEffect:
      'Flags border-line adversarial mutations that sit just below standard threshold.',
    status: 'READY',
    icon: 'Sliders',
  },
];

// Cyrillic and Greek Unicode Confusable Mappings for deterministic demo transformations
export const UNICODE_CONFUSABLE_MAP: Record<
  string,
  {
    perturbed: string;
    origUnicode: string;
    pertUnicode: string;
    origScript: string;
    pertScript: string;
    note: string;
  }
> = {
  o: {
    perturbed: 'о',
    origUnicode: 'U+006F',
    pertUnicode: 'U+043E',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Small Letter O',
  },
  a: {
    perturbed: 'а',
    origUnicode: 'U+0061',
    pertUnicode: 'U+0430',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Small Letter A',
  },
  e: {
    perturbed: 'е',
    origUnicode: 'U+0065',
    pertUnicode: 'U+0435',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Small Letter Ie',
  },
  c: {
    perturbed: 'с',
    origUnicode: 'U+0063',
    pertUnicode: 'U+0441',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Small Letter Es',
  },
  p: {
    perturbed: 'р',
    origUnicode: 'U+0070',
    pertUnicode: 'U+0440',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Small Letter Er',
  },
  i: {
    perturbed: 'і',
    origUnicode: 'U+0069',
    pertUnicode: 'U+0456',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Small Letter Byelorussian-Ukrainian I',
  },
  s: {
    perturbed: 'ѕ',
    origUnicode: 'U+0073',
    pertUnicode: 'U+0455',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Small Letter Dze',
  },
  O: {
    perturbed: 'О',
    origUnicode: 'U+004F',
    pertUnicode: 'U+041E',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Capital Letter O',
  },
  A: {
    perturbed: 'А',
    origUnicode: 'U+0041',
    pertUnicode: 'U+0410',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Capital Letter A',
  },
  E: {
    perturbed: 'Е',
    origUnicode: 'U+0045',
    pertUnicode: 'U+0415',
    origScript: 'Latin',
    pertScript: 'Cyrillic',
    note: 'Cyrillic Capital Letter Ie',
  },
};
