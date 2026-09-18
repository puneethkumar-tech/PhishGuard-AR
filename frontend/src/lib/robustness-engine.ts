// PHASE 6: ADVERSARIAL ROBUSTNESS SIMULATION ENGINE
// 100% FRONTEND DETERMINISTIC SIMULATION ENGINE
// Clearly labeled as DEMO / SIMULATION / SIMULATED MODEL OUTPUT

import {
  RobustnessSimulationConfig,
  RobustnessSimulationResult,
  RobustnessDiffToken,
  AffectedSignalResponse,
  StabilityChartPoint,
  RobustnessMatrixRow,
  RobustnessTimelineEvent,
  SavedRobustnessItem,
  RobustnessAttackType,
} from '@/types';
import {
  UNICODE_CONFUSABLE_MAP,
  ROBUSTNESS_ATTACK_STRATEGIES,
  ROBUSTNESS_DEFENSE_STRATEGIES,
} from './robustness-demo-data';

/**
 * Deterministic text perturbation generator based on attack strategy and configuration
 */
export function generatePerturbation(config: RobustnessSimulationConfig): {
  perturbedText: string;
  diffTokens: RobustnessDiffToken[];
} {
  const text = config.inputText;
  const strengthFactor =
    config.attackStrength === 'HIGH' ? 1.0 : config.attackStrength === 'MEDIUM' ? 0.65 : 0.35;
  const targetMutations = Math.min(
    config.mutationCount,
    Math.max(1, Math.round((config.intensity / 100) * config.mutationCount * (strengthFactor + 0.5)))
  );

  switch (config.attackType) {
    case 'homoglyph': {
      const tokens: RobustnessDiffToken[] = [];
      let mutatedCount = 0;
      let perturbedResult = '';

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const confusable = UNICODE_CONFUSABLE_MAP[char];

        if (confusable && mutatedCount < targetMutations) {
          tokens.push({
            text: confusable.perturbed,
            isModified: true,
            type: 'char',
            charInfo: {
              originalChar: char,
              perturbedChar: confusable.perturbed,
              originalUnicode: confusable.origUnicode,
              perturbedUnicode: confusable.pertUnicode,
              originalScript: confusable.origScript,
              perturbedScript: confusable.pertScript,
              note: confusable.note,
            },
          });
          perturbedResult += confusable.perturbed;
          mutatedCount++;
        } else {
          tokens.push({
            text: char,
            isModified: false,
          });
          perturbedResult += char;
        }
      }

      return {
        perturbedText: perturbedResult,
        diffTokens: tokens,
      };
    }

    case 'url-obfuscation': {
      let perturbed = text;
      const tokens: RobustnessDiffToken[] = [];

      if (!config.preserveUrlStructure) {
        if (text.includes('https://microsoft.com')) {
          perturbed = text.replace(
            'https://microsoft.com',
            'http://micr0soft[.]com-verify.net'
          );
        } else if (text.includes('http://paypal-security')) {
          perturbed = text.replace(
            'http://paypal-security-dispute-auth.net',
            'http://192.168[.]0.1%2Fpay-pal-secure'
          );
        } else if (text.includes('https://corporate-sso')) {
          perturbed = text.replace(
            'https://corporate-sso-auth-gateway.org',
            'https://corporate-sso[.]auth-gatewаy.org'
          );
        } else if (text.includes('http://')) {
          perturbed = text.replace('http://', 'hxxp://');
        } else if (text.includes('https://')) {
          perturbed = text.replace('https://', 'hxxps://');
        }
      } else {
        perturbed = text.replace('.com', '[.]com').replace('.org', '[.]org');
      }

      // Tokenize diff
      const origWords = text.split(' ');
      const pertWords = perturbed.split(' ');

      for (let i = 0; i < pertWords.length; i++) {
        const pWord = pertWords[i];
        const oWord = origWords[i] || '';
        const isMod = pWord !== oWord;
        tokens.push({
          text: pWord + (i < pertWords.length - 1 ? ' ' : ''),
          isModified: isMod,
          type: 'url',
          charInfo: isMod
            ? {
                originalChar: oWord,
                perturbedChar: pWord,
                originalUnicode: 'ASCII',
                perturbedUnicode: 'OBFUSCATED',
                originalScript: 'Standard URI',
                perturbedScript: 'Punctured Delimiter',
                note: 'Structural delimiter mutation to evade static URL regex',
              }
            : undefined,
        });
      }

      return { perturbedText: perturbed, diffTokens: tokens };
    }

    case 'semantic-paraphrase': {
      let perturbed = text;
      const replacements: [string, string][] = [
        ['immediate verification', 'timely administrative validation'],
        ['account suspension', 'profile interruption service status'],
        ['Unauthorized charge', 'Unaccounted financial adjustment'],
        ['cancel payment', 'dispute remittance'],
        ['expire in 2 hours', 'reach concluded operational term shortly'],
        ['prevent network disconnect', 'sustain perimeter connectivity'],
        ['Reembolso de impuestos', 'Compensacion arancelaria fiscal'],
        ['on hold due to incorrect', 'held for routine dispatch resolution'],
      ];

      for (const [orig, repl] of replacements) {
        if (perturbed.includes(orig)) {
          perturbed = perturbed.replace(orig, repl);
          break;
        }
      }

      const words = perturbed.split(' ');
      const diffTokens: RobustnessDiffToken[] = words.map((w, idx) => ({
        text: w + (idx < words.length - 1 ? ' ' : ''),
        isModified: !text.includes(w),
        type: 'phrase',
        charInfo: !text.includes(w)
          ? {
              originalChar: 'Known Phishing Lexicon',
              perturbedChar: w,
              originalUnicode: 'Standard n-gram',
              perturbedUnicode: 'Subword Cluster Shift',
              originalScript: 'Coercive Lexicon',
              perturbedScript: 'Synonym Vector',
              note: 'Semantic embedding shift retaining contextual intent',
            }
          : undefined,
      }));

      return { perturbedText: perturbed, diffTokens };
    }

    case 'urgency-mutation': {
      let perturbed = text;
      const urgencyReplacements: [string, string][] = [
        ['URGENT:', 'Advisory Status Update:'],
        ['requires immediate verification', 'awaits your scheduled verification'],
        ['avoid account suspension', 'ensure continuous system eligibility'],
        ['Immediate payment', 'Standard pending payment'],
        ['expire in 2 hours', 'is approaching scheduled cycle end'],
        ['immediately', 'at your earliest convenience'],
      ];

      for (const [orig, repl] of urgencyReplacements) {
        if (perturbed.includes(orig)) {
          perturbed = perturbed.replace(orig, repl);
        }
      }

      const diffTokens: RobustnessDiffToken[] = perturbed.split(' ').map((w, idx) => ({
        text: w + (idx < perturbed.split(' ').length - 1 ? ' ' : ''),
        isModified: !text.includes(w),
        type: 'phrase',
        charInfo: !text.includes(w)
          ? {
              originalChar: 'High Urgency Token',
              perturbedChar: w,
              originalUnicode: 'Urgency Flag 1.0',
              perturbedUnicode: 'Urgency Flag 0.2',
              originalScript: 'Coercive Sentiment',
              perturbedScript: 'Neutralized Sentiment',
              note: 'Urgency heuristic suppression',
            }
          : undefined,
      }));

      return { perturbedText: perturbed, diffTokens };
    }

    case 'formatting-mutation': {
      let perturbed = '';
      const diffTokens: RobustnessDiffToken[] = [];

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i % 7 === 0 && /[a-zA-Z]/.test(ch) && (i / 7) <= targetMutations) {
          const mutated = ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase();
          perturbed += mutated;
          diffTokens.push({
            text: mutated,
            isModified: true,
            type: 'punctuation',
            charInfo: {
              originalChar: ch,
              perturbedChar: mutated,
              originalUnicode: `U+00${ch.charCodeAt(0).toString(16).toUpperCase()}`,
              perturbedUnicode: `U+00${mutated.charCodeAt(0).toString(16).toUpperCase()}`,
              originalScript: 'Standard Case',
              perturbedScript: 'Case Jitter',
              note: 'Token boundary case permutation',
            },
          });
        } else {
          perturbed += ch;
          diffTokens.push({
            text: ch,
            isModified: false,
          });
        }
      }

      return { perturbedText: perturbed, diffTokens };
    }

    case 'token-insertion': {
      const benignNoise = ' [Confidential & ISO-27001 Verified Corporate Communication]';
      const perturbed = text + benignNoise;
      const diffTokens: RobustnessDiffToken[] = [
        { text, isModified: false },
        {
          text: benignNoise,
          isModified: true,
          type: 'token',
          charInfo: {
            originalChar: '(None)',
            perturbedChar: 'ISO-27001 Verified',
            originalUnicode: 'N/A',
            perturbedUnicode: 'Noise Tokens',
            originalScript: 'Unpadded',
            perturbedScript: 'Benign Noise Dilution',
            note: 'Appended benign tokens to skew distribution density',
          },
        },
      ];

      return { perturbedText: perturbed, diffTokens };
    }

    case 'brand-mutation':
    default: {
      let perturbed = text;
      const brandReplacements: [string, string][] = [
        ['Microsoft', 'Micr0soft'],
        ['PayPal', 'PayPa1'],
        ['Chase', 'Chаse'],
        ['Okta', 'Oktа'],
        ['Amazon', 'Amaz0n'],
        ['Apple', 'App1e'],
      ];

      for (const [orig, repl] of brandReplacements) {
        if (perturbed.includes(orig)) {
          perturbed = perturbed.replace(orig, repl);
          break;
        }
      }

      const diffTokens: RobustnessDiffToken[] = perturbed.split(' ').map((w, idx) => ({
        text: w + (idx < perturbed.split(' ').length - 1 ? ' ' : ''),
        isModified: !text.includes(w),
        type: 'token',
        charInfo: !text.includes(w)
          ? {
              originalChar: 'Trademark Token',
              perturbedChar: w,
              originalUnicode: 'ASCII',
              perturbedUnicode: 'Levenshtein Dist=1',
              originalScript: 'Official Brand',
              perturbedScript: 'Brand Mutation',
              note: 'Levenshtein single-distance brand evasion',
            }
          : undefined,
      }));

      return { perturbedText: perturbed, diffTokens };
    }
  }
}

/**
 * Execute the complete deterministic robustness simulation
 */
export function runRobustnessSimulation(
  config: RobustnessSimulationConfig
): RobustnessSimulationResult {
  const text = config.inputText;
  const isBenign = config.sampleId === 'demo-benign-mail';
  const { perturbedText, diffTokens } = generatePerturbation(config);

  // Baseline confidence calculation
  const originalConfidence = isBenign ? 99.2 : 94.8;
  const originalVerdict = isBenign ? 'BENIGN (SAFE)' : 'PHISHING DETECTED';

  // Calculate degradation based on attack parameters
  const strengthMultipliers = {
    LOW: 0.18,
    MEDIUM: 0.38,
    HIGH: 0.58,
  };

  const attackMultipliers: Record<RobustnessAttackType, number> = {
    homoglyph: 0.55,
    'url-obfuscation': 0.48,
    'semantic-paraphrase': 0.42,
    'urgency-mutation': 0.35,
    'formatting-mutation': 0.22,
    'token-insertion': 0.30,
    'brand-mutation': 0.50,
  };

  const intensityFactor = config.intensity / 100;
  const attackMultiplier = attackMultipliers[config.attackType] || 0.4;
  const strengthMultiplier = strengthMultipliers[config.attackStrength];

  // Raw degradation drop
  const dropPoints = isBenign
    ? Math.round(intensityFactor * strengthMultiplier * 15) // Benign only drops slightly
    : Math.round((intensityFactor * 0.6 + strengthMultiplier * 0.4) * attackMultiplier * 70);

  const perturbedConfidence = Math.max(
    18.0,
    Math.min(99.0, Math.round((originalConfidence - dropPoints) * 10) / 10)
  );

  let perturbedVerdict = isBenign ? 'BENIGN (SAFE)' : 'PHISHING DETECTED';
  if (!isBenign) {
    if (perturbedConfidence < 45) {
      perturbedVerdict = 'EVADED (FALSE NEGATIVE / SAFE)';
    } else if (perturbedConfidence < 75) {
      perturbedVerdict = 'SUSPICIOUS (DEGRADED CONFIDENCE)';
    } else {
      perturbedVerdict = 'PHISHING DETECTED (PARTIAL EVASION)';
    }
  }

  // Hardening defense recovery calculation
  const defenseRecoveryMap: Record<string, number> = {
    'char-norm': config.attackType === 'homoglyph' ? 0.94 : 0.72,
    'url-canon': config.attackType === 'url-obfuscation' ? 0.92 : 0.70,
    'adv-train': 0.88,
    ensemble: 0.90,
    'context-reanalysis': 0.85,
    'threshold-adj': 0.82,
  };

  const recoveryFactor = defenseRecoveryMap[config.activeDefense] || 0.85;
  const lostPoints = originalConfidence - perturbedConfidence;
  const recoveredPoints = Math.round(lostPoints * recoveryFactor * 10) / 10;
  const hardenedConfidence = Math.min(
    98.5,
    Math.round((perturbedConfidence + recoveredPoints) * 10) / 10
  );
  const recoveryDelta = Math.round((hardenedConfidence - perturbedConfidence) * 10) / 10;
  const hardenedVerdict = isBenign ? 'BENIGN (SAFE)' : 'PHISHING (HARDENED AR RESISTED)';

  // Robustness score (0-100)
  const confidenceRetention = Math.round((perturbedConfidence / originalConfidence) * 100);
  const signalPreservation = Math.max(
    40,
    Math.min(98, Math.round(100 - dropPoints * 0.9 + (config.preserveSemantics ? 10 : 0)))
  );
  const recoveryRate = Math.min(
    99,
    Math.max(60, Math.round((hardenedConfidence / originalConfidence) * 100))
  );

  const robustnessScore = Math.round(
    confidenceRetention * 0.35 + signalPreservation * 0.25 + recoveryRate * 0.4
  );

  const stabilityScore: 'LOW' | 'MODERATE' | 'HIGH' | 'ROBUST' =
    robustnessScore >= 85
      ? 'ROBUST'
      : robustnessScore >= 70
      ? 'HIGH'
      : robustnessScore >= 50
      ? 'MODERATE'
      : 'LOW';

  const attackSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
    dropPoints > 45 ? 'CRITICAL' : dropPoints > 30 ? 'HIGH' : dropPoints > 15 ? 'MEDIUM' : 'LOW';

  const defenseEffectiveness: 'MODERATE' | 'HIGH' | 'EXCELLENT' =
    recoveryDelta >= 25 ? 'EXCELLENT' : recoveryDelta >= 15 ? 'HIGH' : 'MODERATE';

  // 8 Affected Signals
  const affectedSignals: AffectedSignalResponse[] = [
    {
      name: 'Credential Extraction Language',
      category: 'Lexical Phishing Intent',
      baseline: isBenign ? 'LOW' : 'HIGH',
      adversarial: config.attackType === 'homoglyph' || config.attackType === 'brand-mutation' ? 'LOW' : 'MEDIUM',
      hardened: isBenign ? 'LOW' : 'HIGH',
      baselineVal: isBenign ? 8 : 95,
      adversarialVal: isBenign ? 10 : config.attackType === 'homoglyph' ? 32 : 64,
      hardenedVal: isBenign ? 8 : 92,
      delta: isBenign ? '0%' : '-31% dropped / +28% restored',
    },
    {
      name: 'URL Target & Domain Structure',
      category: 'Routing Integrity',
      baseline: isBenign ? 'LOW' : 'HIGH',
      adversarial: config.attackType === 'url-obfuscation' ? 'LOW' : 'HIGH',
      hardened: isBenign ? 'LOW' : 'HIGH',
      baselineVal: isBenign ? 5 : 92,
      adversarialVal: config.attackType === 'url-obfuscation' ? 24 : isBenign ? 5 : 88,
      hardenedVal: isBenign ? 5 : 90,
      delta: config.attackType === 'url-obfuscation' ? '-68% evaded / +66% restored' : 'Stable',
    },
    {
      name: 'Urgency & Psychological Coercion',
      category: 'Sentiment Modeling',
      baseline: isBenign ? 'LOW' : 'HIGH',
      adversarial: config.attackType === 'urgency-mutation' ? 'LOW' : 'MEDIUM',
      hardened: isBenign ? 'LOW' : 'HIGH',
      baselineVal: isBenign ? 4 : 89,
      adversarialVal: config.attackType === 'urgency-mutation' ? 28 : isBenign ? 4 : 76,
      hardenedVal: isBenign ? 4 : 85,
      delta: config.attackType === 'urgency-mutation' ? '-61% softened / +57% recovered' : 'Mild Shift',
    },
    {
      name: 'Brand & Corporate Impersonation',
      category: 'Trademark Classification',
      baseline: isBenign ? 'LOW' : 'HIGH',
      adversarial: config.attackType === 'brand-mutation' || config.attackType === 'homoglyph' ? 'MEDIUM' : 'HIGH',
      hardened: isBenign ? 'LOW' : 'HIGH',
      baselineVal: isBenign ? 6 : 94,
      adversarialVal: config.attackType === 'brand-mutation' ? 38 : isBenign ? 6 : 78,
      hardenedVal: isBenign ? 6 : 91,
      delta: '-56% dropped / +53% restored',
    },
    {
      name: 'Formatting & Delimiter Consistency',
      category: 'Structural Syntax',
      baseline: 'LOW',
      adversarial: config.attackType === 'formatting-mutation' ? 'HIGH' : 'LOW',
      hardened: 'LOW',
      baselineVal: 12,
      adversarialVal: config.attackType === 'formatting-mutation' ? 84 : 22,
      hardenedVal: 15,
      delta: config.attackType === 'formatting-mutation' ? '+72% noise / normalized' : 'Nominal',
    },
    {
      name: 'Character & Unicode Anomalies',
      category: 'Encoding Inspection',
      baseline: 'LOW',
      adversarial: config.attackType === 'homoglyph' ? 'HIGH' : 'LOW',
      hardened: 'LOW',
      baselineVal: 3,
      adversarialVal: config.attackType === 'homoglyph' ? 96 : 8,
      hardenedVal: 5,
      delta: config.attackType === 'homoglyph' ? '+93% anomaly detected' : 'Normal',
    },
    {
      name: 'Semantic Context Embedding Drift',
      category: 'Transformer Attention',
      baseline: isBenign ? 'LOW' : 'HIGH',
      adversarial: config.attackType === 'semantic-paraphrase' ? 'MEDIUM' : 'HIGH',
      hardened: isBenign ? 'LOW' : 'HIGH',
      baselineVal: isBenign ? 9 : 91,
      adversarialVal: config.attackType === 'semantic-paraphrase' ? 48 : isBenign ? 12 : 82,
      hardenedVal: isBenign ? 9 : 88,
      delta: config.attackType === 'semantic-paraphrase' ? '-43% drift / recovered' : 'Calibrated',
    },
    {
      name: 'Payment & Monetary Extraction Clues',
      category: 'Financial Risk Engine',
      baseline: isBenign ? 'LOW' : 'HIGH',
      adversarial: 'MEDIUM',
      hardened: isBenign ? 'LOW' : 'HIGH',
      baselineVal: isBenign ? 2 : 87,
      adversarialVal: isBenign ? 3 : 58,
      hardenedVal: isBenign ? 2 : 84,
      delta: '-29% drop / +26% restored',
    },
  ];

  // Stability Chart Points (0% to 100% intensity)
  const stabilityChartData: StabilityChartPoint[] = [0, 20, 40, 60, 80, 100].map((intLevel) => {
    const intFactor = intLevel / 100;
    const drop = isBenign
      ? intFactor * 12
      : (intFactor * 0.65 + strengthMultiplier * 0.35) * attackMultiplier * 68;
    const advConf = Math.max(20, Math.round((originalConfidence - drop) * 10) / 10);
    const rec = Math.round((originalConfidence - advConf) * recoveryFactor * 10) / 10;
    const hardConf = Math.min(98.5, Math.round((advConf + rec) * 10) / 10);

    return {
      intensity: intLevel,
      baselineConfidence: originalConfidence,
      adversarialConfidence: advConf,
      hardenedConfidence: hardConf,
    };
  });

  // Robustness Matrix data for all attacks
  const matrixData: RobustnessMatrixRow[] = ROBUSTNESS_ATTACK_STRATEGIES.map((strat) => {
    const stratDrop = Math.round(
      (0.6 * (attackMultipliers[strat.id] || 0.4) + 0.4 * strengthMultiplier) * 65
    );
    const origVal = originalConfidence;
    const pertVal = Math.max(25, Math.round((origVal - stratDrop) * 10) / 10);
    const hardVal = Math.min(98, Math.round((pertVal + (origVal - pertVal) * 0.88) * 10) / 10);
    const delta = `${(pertVal - origVal).toFixed(1)}%`;
    const stab: 'ROBUST' | 'HIGH' | 'MODERATE' | 'LOW' =
      pertVal > 70 ? 'ROBUST' : pertVal > 50 ? 'HIGH' : pertVal > 35 ? 'MODERATE' : 'LOW';

    return {
      attackId: strat.id,
      attackName: strat.name,
      original: origVal,
      perturbed: pertVal,
      hardened: hardVal,
      confidenceDelta: delta,
      stability: stab,
      defenseStrategy:
        strat.id === 'homoglyph'
          ? 'NFKC Normalization + Confusable Map'
          : strat.id === 'url-obfuscation'
          ? 'URL Canonicalization & Punycode Resolver'
          : strat.id === 'semantic-paraphrase'
          ? 'Multilingual Contextual Attention'
          : 'Adversarial Training & Data Augmentation',
      techniqueSummary: strat.description,
    };
  });

  // Timeline events (Simulated)
  const timeline: RobustnessTimelineEvent[] = [
    {
      timestamp: '00:00',
      phase: 'INPUT INGESTION',
      title: 'Target Payload Ingested',
      description: 'Original text payload loaded into simulated forensic evaluation harness.',
      status: 'completed',
    },
    {
      timestamp: '00:01',
      phase: 'BASELINE BENCHMARK',
      title: 'Unperturbed Baseline Analysis',
      description: `Baseline classification established at ${originalConfidence}% confidence (${originalVerdict}).`,
      status: 'completed',
    },
    {
      timestamp: '00:02',
      phase: 'PERTURBATION INJECTION',
      title: `Adversarial Perturbation Applied: ${config.attackType.toUpperCase()}`,
      description: `Injected ${config.mutationCount} simulated mutations with ${config.intensity}% intensity calibration.`,
      status: 'completed',
    },
    {
      timestamp: '00:03',
      phase: 'MODEL RESPONSE SIMULATION',
      title: 'Vulnerable Classifier Response Evaluated',
      description: `Simulated confidence degraded from ${originalConfidence}% to ${perturbedConfidence}% (${perturbedVerdict}).`,
      status: 'completed',
    },
    {
      timestamp: '00:04',
      phase: 'ROBUSTNESS EVALUATION',
      title: 'Signal Degradation & Instability Metrics Computed',
      description: `Confidence retention scored at ${confidenceRetention}%, signal preservation at ${signalPreservation}%.`,
      status: 'completed',
    },
    {
      timestamp: '00:05',
      phase: 'DEFENSE PIPELINE EXECUTION',
      title: `Simulated AR Defense Activated (${config.activeDefense})`,
      description: 'Applied Unicode canonicalization, embedding correction, and attention normalization.',
      status: 'completed',
    },
    {
      timestamp: '00:06',
      phase: 'RESILIENCE ASSESSMENT',
      title: 'Hardened Model Output Verified',
      description: `Recovered confidence to ${hardenedConfidence}% (+${recoveryDelta} points restoration). Robustness verdict: ${stabilityScore}.`,
      status: 'completed',
    },
  ];

  // AI Explanation Points
  const explanation = [
    `1. The simulated perturbation applied ${config.mutationCount} targeted ${config.attackType} transformations, directly altering character and token representations.`,
    `2. Lexical and n-gram similarity dropped, causing vulnerable static keyword filters to suffer a ${Math.abs(
      Math.round(originalConfidence - perturbedConfidence)
    )}% confidence drop.`,
    `3. Core intent signals (credential harvesting and domain routing) remained partially intact despite character-level surface mutations.`,
    `4. The simulated ${config.activeDefense} defense algorithm intercepted the perturbed payload, normalizing character encodings and re-aligning contextual embeddings.`,
    `5. As a result, model confidence successfully rebounded to ${hardenedConfidence}%, demonstrating a ${recoveryRate}% recovery rate under hardened AR defense.`,
  ];

  // Attack Chain Steps
  const attackSteps = [
    {
      step: 1,
      title: 'Input Token Ingestion',
      description: 'Raw string parsed into character codepoints and byte sequences.',
      detail: `${text.length} characters / ${text.split(' ').length} tokens parsed.`,
    },
    {
      step: 2,
      title: 'Feature Extraction & Baseline',
      description: 'Extracted lexical, structural, and semantic threat vectors.',
      detail: `Baseline confidence: ${originalConfidence}%`,
    },
    {
      step: 3,
      title: 'Adversarial Transformation',
      description: `Applied ${config.attackType} perturbation with ${config.intensity}% intensity.`,
      detail: `Degraded confidence: ${perturbedConfidence}%`,
    },
    {
      step: 4,
      title: 'Defense Hardening & Verification',
      description: `Executed ${config.activeDefense} defense algorithm.`,
      detail: `Recovered confidence: ${hardenedConfidence}% (+${recoveryDelta} pts)`,
    },
  ];

  const resilienceVerdict = {
    resilience: robustnessScore >= 75 ? ('HIGH' as const) : robustnessScore >= 50 ? ('MODERATE' as const) : ('LOW' as const),
    recovery: recoveryDelta >= 20 ? ('STRONG' as const) : recoveryDelta >= 10 ? ('MODERATE' as const) : ('LOW' as const),
    signalPreservation: signalPreservation >= 75 ? ('HIGH' as const) : signalPreservation >= 50 ? ('MODERATE' as const) : ('LOW' as const),
    status: 'COMPLETE (SIMULATED AUDIT)',
    interpretation:
      'The simulated model retained a substantial portion of its baseline signal under perturbation and recovered critical detection confidence after the simulated defense stage. No actual model training or live adversarial execution was conducted.',
  };

  return {
    config,
    originalInput: text,
    perturbedInput: perturbedText,
    diffTokens,
    originalConfidence,
    perturbedConfidence,
    hardenedConfidence,
    originalVerdict,
    perturbedVerdict,
    hardenedVerdict,
    robustnessScore,
    stabilityScore,
    attackSeverity,
    defenseEffectiveness,
    confidenceRetention,
    signalPreservation,
    recoveryRate,
    recoveryDelta,
    affectedSignals,
    stabilityChartData,
    matrixData,
    timeline,
    explanation,
    attackSteps,
    resilienceVerdict,
  };
}

// LocalStorage helpers for demo robustness history
const STORAGE_KEY = 'phishguard_demo_robustness_history';

export function saveSimulationToLocalHistory(result: RobustnessSimulationResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    const items: SavedRobustnessItem[] = existingStr ? JSON.parse(existingStr) : [];
    const newItem: SavedRobustnessItem = {
      id: `SIM-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      sampleTitle: result.config.sampleTitle,
      attackType: result.config.attackType,
      robustnessScore: result.robustnessScore,
      originalConfidence: result.originalConfidence,
      perturbedConfidence: result.perturbedConfidence,
      hardenedConfidence: result.hardenedConfidence,
      defenseStrategy: result.config.activeDefense,
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 10)));
  } catch (err) {
    console.error('Failed to save simulation to localStorage', err);
  }
}

export function loadSimulationLocalHistory(): SavedRobustnessItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch (err) {
    console.error('Failed to load simulation history', err);
    return [];
  }
}

export function clearSimulationLocalHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear simulation history', err);
  }
}
