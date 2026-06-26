# Scoring

This document explains how the OBS Assessment Tool calculates question values, domain scores, the overall score, and maturity bands. The source of truth is `assets/js/scoring.js`.

---

## Answer values

Each answered question is mapped to a numeric value:

| Status          | Value                                          |
|-----------------|------------------------------------------------|
| `compliant`     | `1.0`                                          |
| `partial`       | `partialPercent / 100` (default `0.5` if omitted) |
| `non-compliant` | `0.0`                                          |
| `na`            | Excluded — not counted in numerator or denominator |
| `unanswered`    | Excluded — not counted in numerator or denominator |

---

## Per-question weight

Every question carries two parameters:

- `weight` — relative importance of the question within a domain (e.g. `1.0`, `1.2`, `1.5`)
- `threatIndicator` — severity multiplier (integer 1–5)

These are combined into a single effective weight:

```
effectiveWeight = weight × threatIndicator
```

---

## Domain score

```
domainScore = Σ(answerValue × effectiveWeight) / Σ(effectiveWeight) × 100
```

Only answered, non-`na` questions contribute. The result is a percentage in the range 0–100, or `null` if no questions in the domain have been scored.

---

## Overall score

The overall score is calculated the same way, but across **all** domains simultaneously (not as an average of domain scores):

```
overallScore = Σ(answerValue × effectiveWeight) / Σ(effectiveWeight) × 100
```

This means domains with more questions or higher-weight questions have a proportionally larger influence on the overall score.

---

## Maturity bands

| Level | Label      | Score range |
|-------|------------|-------------|
| 1     | Initial    | 0 – 20      |
| 2     | Developing | 21 – 40     |
| 3     | Defined    | 41 – 60     |
| 4     | Managed    | 61 – 80     |
| 5     | Optimized  | 81 – 100    |

Bands are evaluated as lower-bound thresholds: a score maps to the highest band
whose minimum it reaches. Fractional scores that fall in the integer gap between
two bands (e.g. `20.5`, `60.5`) therefore resolve to the lower band rather than
to no band at all.

---

## Recommendations

Gaps (questions with status `partial` or `non-compliant`) are sorted by:

1. `threatIndicator` descending
2. `effectiveWeight` descending
3. Question ID ascending (tie-break)

Any `remediation` object attached to an answer is surfaced alongside the gap.

---

## Worked example

Consider three questions from the Governance domain of the `infosec-iso27001` template:

| Question | Status            | partialPercent | weight | threatIndicator |
|----------|-------------------|----------------|--------|-----------------|
| Q1       | `compliant`       | —              | 1.5    | 5               |
| Q2       | `partial`         | 60             | 1.2    | 4               |
| Q3       | `non-compliant`   | —              | 1.0    | 3               |

**Step 1 — answer values**

```
Q1 value = 1.0
Q2 value = 60 / 100 = 0.6
Q3 value = 0.0
```

**Step 2 — effective weights**

```
Q1 effectiveWeight = 1.5 × 5 = 7.5
Q2 effectiveWeight = 1.2 × 4 = 4.8
Q3 effectiveWeight = 1.0 × 3 = 3.0
```

**Step 3 — weighted numerator and denominator**

```
numerator   = (1.0 × 7.5) + (0.6 × 4.8) + (0.0 × 3.0)
            = 7.5 + 2.88 + 0
            = 10.38

denominator = 7.5 + 4.8 + 3.0
            = 15.3
```

**Step 4 — score**

```
score = (10.38 / 15.3) × 100 ≈ 67.8
```

**Step 5 — maturity band**

67.8 falls in the 61–80 range → **Level 4: Managed**

---

## Example assessment file

See [`docs/examples/assessment.json`](examples/assessment.json) for a minimal valid exported assessment that demonstrates partial answers, N/A answers with reasons, and a remediation record. You can import this file into the tool to explore the interface.
