# ⚔️ Person B — Adversarial Security Engineer Assignment

## Mission

Create reproducible attacks against the baseline, measure the damage, and test whether hardening actually improves robustness.

## Your judging-criteria contribution

| Criterion | Your proof |
|---|---|
| Wow Factor | “We attacked our own model” demonstration |
| Build Quality | Deterministic attack functions, evaluation scripts, tests |
| User Love | Original → attacked → hardened comparison |
| Real-World Ready | Normalization, threat mapping, documented attack limitations |
| Pitch Power | Measured robustness chart with no fabricated values |

## Priority order

1. Understand Person A's model input/output contract.
2. Implement deterministic attack functions.
3. Test attacks on short and long messages.
4. Evaluate clean versus attacked performance.
5. Implement one reliable hardening method.
6. Re-evaluate using the exact same test examples.
7. Add MITRE mapping only where the behavior is supported.
8. Attempt paraphrase attacks last.

## Attack modules

```text
src/attacks/
├── synonym.py
├── charswap.py
├── unicode_attack.py
├── structural.py
├── paraphrase.py       # stretch
└── run_all.py
```

Start with:

- Leetspeak substitution
- Homoglyph substitution
- Zero-width character insertion
- Whitespace/HTML comment noise
- Synonym substitution, with careful semantic checks

Every attack should:

- Accept text and a seed/configuration.
- Return transformed text plus metadata.
- Avoid modifying labels.
- Be reproducible when seeded.
- Preserve a copy of the original text.
- Record whether the transformation actually changed the text.

## Required deliverables

```text
results/attack_results.csv
results/hardened_results.csv
results/robustness_chart.png
src/attacks/*.py
src/defense/normalize.py
src/defense/harden.py
src/security/mitre_mapping.py
tests/test_attacks.py
docs/ATTACK_METHODOLOGY.md
```

## Metrics

Report at least:

- Clean accuracy/F1
- Accuracy/F1 under each attack
- Absolute performance drop
- Evasion rate on the defined positive subset
- Number of changed examples
- Attack configuration and random seed

Do not force a target such as “15% drop.” If the measured drop is smaller or larger, report it honestly.

## Hardening options

Start with the most reliable option:

1. Remove invisible Unicode characters.
2. Apply Unicode normalization.
3. Normalize repeated whitespace.
4. Add carefully selected adversarial examples to training.
5. Compare word-only, character-only, and combined models if time permits.

Test normalization carefully. It must not erase meaningful non-English characters or alter the text in a way that makes the result misleading.

## MITRE mapping guardrails

- Use MITRE ATT&CK mappings only for supported behaviors.
- `T1566` relates to Phishing; more specific sub-techniques require evidence.
- Do not label generic spam as a MITRE technique automatically.
- Mark mappings as rule-based and include uncertainty.
- Mapping is contextual support, not proof of attribution.

## Handoffs

| Deliverable | Receiver | Deadline |
|---|---|---|
| Attack module interface | A and C | Hour 5 |
| Attack results | A | Hour 15 |
| Robustness chart | D | Hour 16 |
| Hardened model/artifact | C | Hour 20 |
| MITRE mapper | C and D | Hour 21 |

## Acceptance checklist

- [ ] Each attack has unit tests.
- [ ] Seeds/configurations are recorded.
- [ ] The runner uses a fixed test subset.
- [ ] Clean and attacked examples are paired.
- [ ] No placeholder hardened values remain.
- [ ] The chart is generated from CSV results.
- [ ] Attack success is measured, not assumed.
- [ ] Security claims distinguish demonstrated behavior from speculation.

## Suggested commands

```powershell
python -m src.attacks.run_all
pytest -q tests/test_attacks.py
python results/plot_robustness.py
```
