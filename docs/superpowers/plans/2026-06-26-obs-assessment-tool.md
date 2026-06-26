# OBS Assessment Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-build, open-source security-assessment web tool: a marketing landing page plus a double-click-launchable questionnaire app (ISO 27001/27002, NIS2, CIS v8) with scoring, maturity, recommendations, remediation tracking, EN/SQ i18n, and JSON/PDF/CSV export — hostable via Docker/Dokploy.

**Architecture:** Static client-side app. Plain HTML + vanilla JS, no bundler. Pure-logic modules (`i18n`, `scoring`, `storage`, `validate`, `exporters`) are written as UMD-style files that attach to a `window.OBS` namespace in the browser **and** `module.exports` in Node, so the same files run the app under `file://` and run unit tests under Node with zero build. Questionnaire content and translations are embedded as JS globals (`window.OBS_TEMPLATES`) — never `fetch()`ed — so `file://` works with no CORS. Third-party libs (Chart.js, jsPDF) are vendored locally; no runtime CDN.

**Tech Stack:** HTML5, CSS3, vanilla ES5/ES2015-compatible JS (no modules syntax in shipped files), Chart.js (vendored), jsPDF (vendored), Node (test/CI only, no deps), nginx + Docker (hosting).

## Global Constraints

- **Zero build step.** App runs by opening `app.html` / `index.html` from `file://`. No bundler, no transpile, no `npm install` to run the app.
- **No ES module syntax** (`import`/`export`) in shipped browser files. Use the UMD footer pattern (defined in Task 1). No `fetch()` of local files.
- **No runtime CDN.** Chart.js and jsPDF are vendored under `assets/js/vendor/`. CSP is `default-src 'self'`.
- **No PDF via html2canvas.** Charts go into the PDF via Chart.js `canvas.toDataURL()` + jsPDF only.
- **localStorage may be unavailable** under `file://` (Safari). Always feature-detect; never assume it works.
- **i18n is data-driven.** Languages shipped: `en`, `sq`. Missing translation falls back to `en`, then `""`. `sq` is machine-draft and must be flagged in UI + PDF.
- **License:** MIT. Every doc/footer states the tool is **free and open source (MIT)** and links the GitHub repo.
- **Accessibility target:** WCAG 2.1 AA (keyboard nav, ARIA labels/roles, visible focus, contrast ≥ 4.5:1).
- **No AI attribution** anywhere (commits, docs, comments).
- Node test command for every task: `node tests/run.js`. Commit after every task.

## Module Interface Contract (locked — all tasks must match these names/types)

All pure modules use this footer so they work in browser + Node:

```js
(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.<name> = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  // ... module body returns the public object ...
  return { /* public API */ };
});
```

- **`OBS.i18n`**
  - `pick(field, lang)` → string. `field` is `{en, sq, ...}` or a plain string. Returns `field[lang]` → `field.en` → `""`. A plain string returns itself.
  - `langs(template)` → `string[]` (the template's `languages`).
- **`OBS.validate`**
  - `validateTemplate(t)` → `{ ok: boolean, errors: string[] }`.
- **`OBS.scoring`**
  - `answerValue(ans)` → `number|null` (1 / 0 / partialPercent÷100 / null for na+unanswered+missing).
  - `weight(q)` → `number` = `(q.weight ?? 1) * (q.threatIndicator ?? 3)`.
  - `domainScore(domain, assessment)` → `{ score: number|null, answered: number, total: number, scored: number }` (score is 0–100 or null when nothing scored).
  - `overallScore(template, assessment)` → `number|null` (0–100).
  - `completeness(template, assessment)` → `{ answered: number, total: number, percent: number }`.
  - `maturity(score, maturityLevels)` → `{ level: number, label: {en,sq} }|null`.
  - `complianceSummary(template, assessment)` → `{ compliant, partial, nonCompliant, na, unanswered, criticalGaps: Array<{qid, domainId, text}> }`.
  - `recommendations(template, assessment)` → sorted `Array<{ qid, domainId, status, threat, weight, references, text, goodPractice, remediation }>` (threat desc, then weight desc, then qid asc).
- **`OBS.storage`**
  - `serialize(assessment)` → string (pretty JSON).
  - `parseAssessment(text)` → `{ ok, assessment?, error? }` (JSON + shape validation only).
  - `reconcile(assessment, template)` → `{ assessment, notices: string[], orphaned: object }` (version-mismatch strategy).
  - `available()` → boolean (localStorage feature-detect; browser only, returns false in Node).
  - `saveDraft(assessment)` / `loadDraft()` — thin localStorage wrappers (browser; no-op-safe).
- **`OBS.exporters`**
  - `assessmentToCsv(template, assessment, lang)` → string (CSV text).
  - `buildPdf(template, assessment, lang, chartImages)` → jsPDF doc (browser; `chartImages` = `{radar, doughnut}` dataURLs).

---

## File Structure

- `index.html` — landing page. `app.html` — assessment tool.
- `assets/css/styles.css` — shared styles (landing + app + print).
- `assets/js/i18n.js`, `scoring.js`, `validate.js`, `storage.js`, `exporters.js`, `report.js`, `app.js`, `landing.js`.
- `assets/js/vendor/chart.umd.min.js`, `assets/js/vendor/jspdf.umd.min.js`.
- `templates/registry.js`, `templates/schema.json`, `templates/validate-cli.js`, `templates/infosec-iso27001.js`.
- `tests/run.js` (harness), `tests/*.test.js`.
- `deploy/Dockerfile`, `deploy/nginx.conf`, `deploy/docker-compose.yml`.
- `docs/PRIVACY.md`, `docs/SCORING.md`, `docs/examples/assessment.json`.
- `.github/workflows/ci.yml`, `README.md`, `CONTRIBUTING.md`, `LICENSE`, `package.json`.

---

### Task 1: Project scaffolding, MIT license, and zero-dep test harness

**Files:**
- Create: `LICENSE`, `package.json`, `tests/run.js`, `tests/harness.test.js`, `assets/js/.gitkeep`, `templates/.gitkeep`

**Interfaces:**
- Produces: a global test harness in `tests/run.js` exposing `test(name, fn)` and a Node `assert`-based flow; `node tests/run.js` exits non-zero on any failure.

- [ ] **Step 1: Write the harness** `tests/run.js`

```js
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const tests = [];
global.test = function (name, fn) { tests.push({ name, fn }); };
global.assert = assert;

// auto-discover *.test.js next to this file
fs.readdirSync(__dirname)
  .filter((f) => f.endsWith('.test.js'))
  .forEach((f) => require(path.join(__dirname, f)));

let failed = 0;
for (const t of tests) {
  try { t.fn(); console.log('  ok  ' + t.name); }
  catch (e) { failed++; console.error('FAIL  ' + t.name + '\n      ' + e.message); }
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Write a harness self-test** `tests/harness.test.js`

```js
'use strict';
test('harness runs and assert works', function () {
  assert.strictEqual(1 + 1, 2);
});
```

- [ ] **Step 3: Run the harness — expect PASS**

Run: `node tests/run.js`
Expected: `1/1 passed`, exit 0.

- [ ] **Step 4: Create `package.json`** (no dependencies)

```json
{
  "name": "obs-assessment-tool",
  "version": "1.0.0",
  "private": false,
  "license": "MIT",
  "description": "Open-source security assessment questionnaire tool (ISO 27001/27002, NIS2, CIS v8).",
  "scripts": { "test": "node tests/run.js" }
}
```

- [ ] **Step 5: Create `LICENSE`** — standard MIT text, copyright line: `Copyright (c) 2026 Obsidian Corps`.

- [ ] **Step 6: Commit**

```bash
git add LICENSE package.json tests/
git commit -m "chore: scaffold project, MIT license, zero-dep test harness"
```

---

### Task 2: i18n module

**Files:**
- Create: `assets/js/i18n.js`, `tests/i18n.test.js`

**Interfaces:**
- Produces: `OBS.i18n.pick(field, lang)`, `OBS.i18n.langs(template)` (see contract).

- [ ] **Step 1: Write failing tests** `tests/i18n.test.js`

```js
'use strict';
const i18n = require('../assets/js/i18n.js');

test('pick returns requested language', function () {
  assert.strictEqual(i18n.pick({ en: 'Hello', sq: 'Përshëndetje' }, 'sq'), 'Përshëndetje');
});
test('pick falls back to en when language missing', function () {
  assert.strictEqual(i18n.pick({ en: 'Hello' }, 'sq'), 'Hello');
});
test('pick returns empty string when nothing available', function () {
  assert.strictEqual(i18n.pick({}, 'sq'), '');
});
test('pick passes through a plain string', function () {
  assert.strictEqual(i18n.pick('literal', 'sq'), 'literal');
});
test('langs returns template languages', function () {
  assert.deepStrictEqual(i18n.langs({ languages: ['en', 'sq'] }), ['en', 'sq']);
});
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module '../assets/js/i18n.js'`).

Run: `node tests/run.js`

- [ ] **Step 3: Implement** `assets/js/i18n.js`

```js
(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.i18n = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  function pick(field, lang) {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    if (field[lang] != null && field[lang] !== '') return field[lang];
    if (field.en != null) return field.en;
    return '';
  }
  function langs(template) {
    return (template && template.languages) ? template.languages.slice() : ['en'];
  }
  return { pick: pick, langs: langs };
});
```

- [ ] **Step 4: Run — expect PASS** (`node tests/run.js`, all i18n tests ok).

- [ ] **Step 5: Commit**

```bash
git add assets/js/i18n.js tests/i18n.test.js
git commit -m "feat: i18n pick with en fallback and langs helper"
```

---

### Task 3: Template validator + JSON Schema contract

**Files:**
- Create: `assets/js/validate.js`, `templates/schema.json`, `tests/validate.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `OBS.validate.validateTemplate(t)` → `{ ok, errors }`. Rules: requires `id` (string), `version` (string), `languages` (non-empty array), `maturityLevels` (array of `{level,label,min,max}`), `domains` (array); each domain requires `id`, `title`, `questions[]`; each question requires unique `id`, `threatIndicator` in 1..5, a numeric `weight` (or absent → default ok), `text`, `goodPractice`, `references`; every `text`/`goodPractice`/`followUp`/`title` must contain a key for every language in `languages`.

- [ ] **Step 1: Write failing tests** `tests/validate.test.js`

```js
'use strict';
const validate = require('../assets/js/validate.js');

function goodTemplate() {
  return {
    id: 't', version: '1.0.0', languages: ['en', 'sq'],
    title: { en: 'T', sq: 'T' }, description: { en: 'd', sq: 'd' },
    maturityLevels: [{ level: 1, label: { en: 'Initial', sq: 'Fillestar' }, min: 0, max: 100 }],
    domains: [{
      id: 'd1', title: { en: 'D1', sq: 'D1' }, customSlots: 2,
      questions: [{
        id: 'Q1', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
        text: { en: 'q', sq: 'q' }, goodPractice: { en: ['a'], sq: ['a'] },
        followUp: { en: 'f', sq: 'f' },
        references: { iso27001: 'A.5.1', iso27002: '5.1', nis2: 'Art.21', cis: 'CIS 14' }
      }]
    }]
  };
}

test('valid template passes', function () {
  const r = validate.validateTemplate(goodTemplate());
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
test('missing language coverage fails', function () {
  const t = goodTemplate();
  delete t.domains[0].questions[0].text.sq;
  const r = validate.validateTemplate(t);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some((e) => e.indexOf('Q1') >= 0 && e.indexOf('sq') >= 0));
});
test('threatIndicator out of range fails', function () {
  const t = goodTemplate();
  t.domains[0].questions[0].threatIndicator = 9;
  assert.strictEqual(validate.validateTemplate(t).ok, false);
});
test('duplicate question ids fail', function () {
  const t = goodTemplate();
  t.domains[0].questions.push(Object.assign({}, t.domains[0].questions[0]));
  assert.strictEqual(validate.validateTemplate(t).ok, false);
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement** `assets/js/validate.js`

```js
(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.validate = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  function hasAllLangs(field, langs, label, errors) {
    if (field == null) { errors.push(label + ' missing'); return; }
    langs.forEach(function (l) {
      if (field[l] == null || field[l] === '') errors.push(label + ' missing language "' + l + '"');
    });
  }
  function validateTemplate(t) {
    var errors = [];
    if (!t || typeof t !== 'object') return { ok: false, errors: ['template not an object'] };
    if (typeof t.id !== 'string') errors.push('id must be a string');
    if (typeof t.version !== 'string') errors.push('version must be a string');
    var langs = Array.isArray(t.languages) ? t.languages : [];
    if (!langs.length) errors.push('languages must be a non-empty array');
    if (!Array.isArray(t.maturityLevels) || !t.maturityLevels.length) errors.push('maturityLevels required');
    if (!Array.isArray(t.domains) || !t.domains.length) errors.push('domains required');
    var seen = {};
    (t.domains || []).forEach(function (d, di) {
      if (typeof d.id !== 'string') errors.push('domain[' + di + '].id required');
      hasAllLangs(d.title, langs, 'domain "' + d.id + '" title', errors);
      if (!Array.isArray(d.questions)) { errors.push('domain "' + d.id + '" questions required'); return; }
      d.questions.forEach(function (q) {
        if (typeof q.id !== 'string') { errors.push('question id required in domain ' + d.id); return; }
        if (seen[q.id]) errors.push('duplicate question id ' + q.id);
        seen[q.id] = true;
        if (!(q.threatIndicator >= 1 && q.threatIndicator <= 5)) errors.push(q.id + ' threatIndicator must be 1..5');
        if (q.weight != null && typeof q.weight !== 'number') errors.push(q.id + ' weight must be numeric');
        hasAllLangs(q.text, langs, q.id + ' text', errors);
        hasAllLangs(q.goodPractice, langs, q.id + ' goodPractice', errors);
        if (q.references == null || typeof q.references !== 'object') errors.push(q.id + ' references required');
      });
    });
    return { ok: errors.length === 0, errors: errors };
  }
  return { validateTemplate: validateTemplate };
});
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Write `templates/schema.json`** — a JSON Schema (draft-07) documenting the same structure for contributors (human contract; the JS validator is the enforced check). Include `$schema`, `type: object`, `required: [id, version, languages, maturityLevels, domains]`, and nested `domains`/`questions` definitions mirroring the rules above.

- [ ] **Step 6: Commit**

```bash
git add assets/js/validate.js templates/schema.json tests/validate.test.js
git commit -m "feat: template validator with language-coverage and id checks"
```

---

### Task 4: Scoring module

**Files:**
- Create: `assets/js/scoring.js`, `tests/scoring.test.js`

**Interfaces:**
- Consumes: nothing (pure).
- Produces: full `OBS.scoring` API (see contract). Internal helper `effectiveQuestions(domain, assessment)` merges template questions with that domain's custom questions (defaults `weight:1, threatIndicator:3`).

- [ ] **Step 1: Write failing tests** `tests/scoring.test.js`

```js
'use strict';
const scoring = require('../assets/js/scoring.js');

const template = {
  maturityLevels: [
    { level: 1, label: { en: 'Initial' }, min: 0, max: 20 },
    { level: 3, label: { en: 'Defined' }, min: 41, max: 60 },
    { level: 5, label: { en: 'Optimized' }, min: 81, max: 100 }
  ],
  domains: [{
    id: 'd1', title: { en: 'D1' },
    questions: [
      { id: 'Q1', threatIndicator: 4, weight: 1, critical: true, references: {}, text: { en: 'q1' }, goodPractice: { en: [] } },
      { id: 'Q2', threatIndicator: 2, weight: 1, critical: false, references: {}, text: { en: 'q2' }, goodPractice: { en: [] } }
    ]
  }]
};

test('answerValue maps statuses', function () {
  assert.strictEqual(scoring.answerValue({ status: 'compliant' }), 1);
  assert.strictEqual(scoring.answerValue({ status: 'non-compliant' }), 0);
  assert.strictEqual(scoring.answerValue({ status: 'partial', partialPercent: 40 }), 0.4);
  assert.strictEqual(scoring.answerValue({ status: 'partial' }), 0.5);
  assert.strictEqual(scoring.answerValue({ status: 'na' }), null);
  assert.strictEqual(scoring.answerValue({ status: 'unanswered' }), null);
  assert.strictEqual(scoring.answerValue(undefined), null);
});

test('domainScore weights by weight*threat and excludes na', function () {
  const a = { answers: { Q1: { status: 'compliant' }, Q2: { status: 'na' } }, customQuestions: {} };
  const r = scoring.domainScore(template.domains[0], a);
  assert.strictEqual(r.score, 100); // only Q1 scored
  assert.strictEqual(r.scored, 1);
  assert.strictEqual(r.total, 2);
});

test('domainScore mixes partial correctly', function () {
  // Q1 compliant (w=1*4=4, v=1), Q2 partial 50% (w=1*2=2, v=0.5)
  const a = { answers: { Q1: { status: 'compliant' }, Q2: { status: 'partial', partialPercent: 50 } }, customQuestions: {} };
  const r = scoring.domainScore(template.domains[0], a);
  // (1*4 + 0.5*2) / (4+2) = 5/6 = 83.33
  assert.ok(Math.abs(r.score - 83.333) < 0.01);
});

test('completeness counts decided answers incl na', function () {
  const a = { answers: { Q1: { status: 'compliant' }, Q2: { status: 'na' } }, customQuestions: {} };
  const c = scoring.completeness(template, a);
  assert.deepStrictEqual([c.answered, c.total], [2, 2]);
});

test('maturity bands map score to level', function () {
  assert.strictEqual(scoring.maturity(90, template.maturityLevels).level, 5);
  assert.strictEqual(scoring.maturity(50, template.maturityLevels).level, 3);
});

test('complianceSummary lists critical gaps', function () {
  const a = { answers: { Q1: { status: 'non-compliant' }, Q2: { status: 'compliant' } }, customQuestions: {} };
  const s = scoring.complianceSummary(template, a);
  assert.strictEqual(s.nonCompliant, 1);
  assert.strictEqual(s.criticalGaps.length, 1);
  assert.strictEqual(s.criticalGaps[0].qid, 'Q1');
});

test('recommendations sort by threat desc', function () {
  const a = { answers: { Q1: { status: 'non-compliant' }, Q2: { status: 'partial' } }, customQuestions: {} };
  const recs = scoring.recommendations(template, a);
  assert.strictEqual(recs.length, 2);
  assert.strictEqual(recs[0].qid, 'Q1'); // threat 4 before threat 2
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement** `assets/js/scoring.js`

```js
(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.scoring = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var DECIDED = { compliant: 1, partial: 1, 'non-compliant': 1, na: 1 };

  function clamp01(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }

  function answerValue(ans) {
    if (!ans || !ans.status || ans.status === 'unanswered') return null;
    if (ans.status === 'compliant') return 1;
    if (ans.status === 'non-compliant') return 0;
    if (ans.status === 'na') return null;
    if (ans.status === 'partial') {
      var p = (ans.partialPercent == null) ? 50 : ans.partialPercent;
      return clamp01(p / 100);
    }
    return null;
  }
  function weight(q) { return (q.weight == null ? 1 : q.weight) * (q.threatIndicator == null ? 3 : q.threatIndicator); }

  function effectiveQuestions(domain, assessment) {
    var list = domain.questions.map(function (q) { return { q: q, ans: (assessment.answers || {})[q.id] }; });
    var customs = (assessment.customQuestions || {})[domain.id] || [];
    customs.forEach(function (c) {
      if (c && (c.text || c.status)) list.push({ q: { weight: 1, threatIndicator: 3 }, ans: c });
    });
    return list;
  }

  function domainScore(domain, assessment) {
    var items = effectiveQuestions(domain, assessment);
    var num = 0, den = 0, scored = 0, answered = 0;
    items.forEach(function (it) {
      var st = it.ans && it.ans.status;
      if (st && DECIDED[st]) answered++;
      var v = answerValue(it.ans);
      if (v !== null) { var w = weight(it.q); num += v * w; den += w; scored++; }
    });
    return { score: den > 0 ? (num / den) * 100 : null, answered: answered, total: items.length, scored: scored };
  }

  function overallScore(template, assessment) {
    var num = 0, den = 0;
    template.domains.forEach(function (d) {
      effectiveQuestions(d, assessment).forEach(function (it) {
        var v = answerValue(it.ans);
        if (v !== null) { var w = weight(it.q); num += v * w; den += w; }
      });
    });
    return den > 0 ? (num / den) * 100 : null;
  }

  function completeness(template, assessment) {
    var answered = 0, total = 0;
    template.domains.forEach(function (d) {
      effectiveQuestions(d, assessment).forEach(function (it) {
        total++;
        var st = it.ans && it.ans.status;
        if (st && DECIDED[st]) answered++;
      });
    });
    return { answered: answered, total: total, percent: total ? (answered / total) * 100 : 0 };
  }

  function maturity(score, levels) {
    if (score == null) return null;
    for (var i = 0; i < levels.length; i++) {
      if (score >= levels[i].min && score <= levels[i].max) return { level: levels[i].level, label: levels[i].label };
    }
    return null;
  }

  function complianceSummary(template, assessment) {
    var s = { compliant: 0, partial: 0, nonCompliant: 0, na: 0, unanswered: 0, criticalGaps: [] };
    template.domains.forEach(function (d) {
      d.questions.forEach(function (q) {
        var ans = (assessment.answers || {})[q.id];
        var st = (ans && ans.status) || 'unanswered';
        if (st === 'compliant') s.compliant++;
        else if (st === 'partial') s.partial++;
        else if (st === 'non-compliant') s.nonCompliant++;
        else if (st === 'na') s.na++;
        else s.unanswered++;
        if (q.critical && (st === 'non-compliant' || st === 'partial')) {
          s.criticalGaps.push({ qid: q.id, domainId: d.id, text: q.text });
        }
      });
    });
    return s;
  }

  function recommendations(template, assessment) {
    var out = [];
    template.domains.forEach(function (d) {
      d.questions.forEach(function (q) {
        var ans = (assessment.answers || {})[q.id];
        var st = ans && ans.status;
        if (st === 'partial' || st === 'non-compliant') {
          out.push({
            qid: q.id, domainId: d.id, status: st,
            threat: q.threatIndicator, weight: weight(q),
            references: q.references, text: q.text, goodPractice: q.goodPractice,
            remediation: ans.remediation || null
          });
        }
      });
    });
    out.sort(function (a, b) {
      return (b.threat - a.threat) || (b.weight - a.weight) || (a.qid < b.qid ? -1 : a.qid > b.qid ? 1 : 0);
    });
    return out;
  }

  return {
    answerValue: answerValue, weight: weight, domainScore: domainScore, overallScore: overallScore,
    completeness: completeness, maturity: maturity, complianceSummary: complianceSummary,
    recommendations: recommendations
  };
});
```

- [ ] **Step 4: Run — expect PASS** (all scoring tests ok).

- [ ] **Step 5: Commit**

```bash
git add assets/js/scoring.js tests/scoring.test.js
git commit -m "feat: scoring, maturity, compliance summary and recommendations"
```

---

### Task 5: Storage module (serialize, validate, reconcile, localStorage detect)

**Files:**
- Create: `assets/js/storage.js`, `tests/storage.test.js`

**Interfaces:**
- Consumes: nothing pure (browser wrappers use `window.localStorage`).
- Produces: `OBS.storage.serialize`, `parseAssessment`, `reconcile`, `available`, `saveDraft`, `loadDraft` (see contract). `reconcile`: keeps answers whose ids exist in the template; moves answers for ids not in the template into `orphaned`; leaves new template ids absent (treated as unanswered). Adds a notice per category when non-empty.

- [ ] **Step 1: Write failing tests** `tests/storage.test.js`

```js
'use strict';
const storage = require('../assets/js/storage.js');

const template = { id: 't', version: '2.0.0', domains: [{ id: 'd1', questions: [{ id: 'Q1' }, { id: 'Q2' }] }] };

test('serialize then parseAssessment round-trips', function () {
  const a = { schemaVersion: 1, templateId: 't', templateVersion: '1.0.0', meta: {}, answers: { Q1: { status: 'compliant' } }, customQuestions: {} };
  const round = storage.parseAssessment(storage.serialize(a));
  assert.strictEqual(round.ok, true);
  assert.deepStrictEqual(round.assessment.answers, a.answers);
});
test('parseAssessment rejects malformed json', function () {
  const r = storage.parseAssessment('{not json');
  assert.strictEqual(r.ok, false);
  assert.ok(r.error);
});
test('parseAssessment rejects wrong shape', function () {
  const r = storage.parseAssessment(JSON.stringify({ foo: 1 }));
  assert.strictEqual(r.ok, false);
});
test('reconcile preserves known, orphans unknown', function () {
  const a = { schemaVersion: 1, templateId: 't', templateVersion: '1.0.0', meta: {}, answers: { Q1: { status: 'compliant' }, QX: { status: 'partial' } }, customQuestions: {} };
  const r = storage.reconcile(a, template);
  assert.ok(r.assessment.answers.Q1);
  assert.ok(!r.assessment.answers.QX);
  assert.ok(r.orphaned.QX);
  assert.ok(r.notices.length >= 1);
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement** `assets/js/storage.js`

```js
(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.storage = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var KEY = 'obs-assessment-draft';

  function serialize(a) { return JSON.stringify(a, null, 2); }

  function parseAssessment(text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, error: 'Invalid JSON: ' + e.message }; }
    if (!obj || typeof obj !== 'object' || typeof obj.templateId !== 'string' || typeof obj.answers !== 'object') {
      return { ok: false, error: 'Not a valid assessment file' };
    }
    if (!obj.customQuestions) obj.customQuestions = {};
    if (!obj.meta) obj.meta = {};
    return { ok: true, assessment: obj };
  }

  function reconcile(a, template) {
    var valid = {};
    template.domains.forEach(function (d) { d.questions.forEach(function (q) { valid[q.id] = true; }); });
    var kept = {}, orphaned = {}, notices = [];
    Object.keys(a.answers || {}).forEach(function (id) {
      if (valid[id]) kept[id] = a.answers[id]; else orphaned[id] = a.answers[id];
    });
    if (Object.keys(orphaned).length) notices.push(Object.keys(orphaned).length + ' answer(s) no longer in this template version were set aside.');
    if (a.templateVersion && a.templateVersion !== template.version) {
      notices.push('Assessment was created against template v' + a.templateVersion + '; current is v' + template.version + '.');
    }
    var out = Object.assign({}, a, { answers: kept, templateVersion: template.version });
    return { assessment: out, notices: notices, orphaned: orphaned };
  }

  function available() {
    try {
      var t = '__obs_test__';
      root.localStorage.setItem(t, '1'); root.localStorage.removeItem(t); return true;
    } catch (e) { return false; }
  }
  function saveDraft(a) { try { root.localStorage.setItem(KEY, serialize(a)); return true; } catch (e) { return false; } }
  function loadDraft() { try { var v = root.localStorage.getItem(KEY); return v ? parseAssessment(v) : null; } catch (e) { return null; } }

  return { serialize: serialize, parseAssessment: parseAssessment, reconcile: reconcile, available: available, saveDraft: saveDraft, loadDraft: loadDraft };
});
```

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add assets/js/storage.js tests/storage.test.js
git commit -m "feat: storage serialize/parse/reconcile and localStorage detection"
```

---

### Task 6: InfoSec template content (English)

**Files:**
- Create: `templates/infosec-iso27001.js`, `templates/registry.js`, `templates/validate-cli.js`, `tests/template.test.js`

**Interfaces:**
- Consumes: `OBS.validate`.
- Produces: `window.OBS_TEMPLATES['infosec-iso27001']` (registered), passing `validateTemplate`.

**Source of content:** the 38 questions, 8 domains, "what good practice looks like" bullets, follow-up prompts, and reference codes are transcribed **verbatim** from the approved spec/original questionnaire in `docs/superpowers/specs/2026-06-26-obs-assessment-tool-design.md` and the project brief. Domain order and question numbering (Q1–Q38, including the NEW Q33–Q38) follow the brief exactly.

**Per-question numeric assignments** (threatIndicator from the brief's 1–5 impact scale; `weight` default 1; `critical:true` on the controls a NIS2/ISO auditor treats as foundational). Use this exact table:

| Domain | Q | threat | weight | critical |
|---|---|---|---|---|
| governance | Q1 policy | 5 | 1.5 | true |
| governance | Q2 asset/risk | 4 | 1.2 | true |
| governance | Q3 legal register | 3 | 1 | false |
| governance | Q4 GDPR | 4 | 1 | true |
| governance | Q33 independent review | 3 | 1 | false |
| people | Q5 awareness training | 4 | 1.2 | true |
| people | Q6 joiner/mover/leaver | 4 | 1 | true |
| people | Q7 roles/responsibilities | 3 | 1 | false |
| people | Q8 hardware inventory | 3 | 1 | false |
| people | Q9 remote/hybrid | 4 | 1 | true |
| supplier | Q10 NDA | 3 | 1 | false |
| supplier | Q11 SLA/security reqs | 3 | 1 | false |
| supplier | Q12 cleaning access | 2 | 1 | false |
| supplier | Q13 visitors | 2 | 1 | false |
| supplier | Q34 supplier risk | 4 | 1.2 | true |
| physical | Q14 access grant/segregation | 3 | 1 | false |
| physical | Q15 entry monitoring | 3 | 1 | false |
| physical | Q16 server/archive rooms | 4 | 1 | true |
| physical | Q17 UPS | 3 | 1 | false |
| iam | Q18 logical access | 4 | 1.3 | true |
| iam | Q19 authentication/MFA | 5 | 1.5 | true |
| iam | Q35 privileged accounts | 5 | 1.3 | true |
| network | Q20 LAN segmentation | 4 | 1.2 | true |
| network | Q21 WiFi | 3 | 1 | false |
| network | Q22 remote maintenance | 3 | 1 | false |
| network | Q36 vulnerability mgmt | 4 | 1.2 | true |
| data | Q23 workstations | 4 | 1.2 | true |
| data | Q24 server patching | 4 | 1.2 | true |
| data | Q25 malware | 4 | 1.2 | true |
| data | Q26 backups | 5 | 1.5 | true |
| data | Q27 physical docs/clear desk | 2 | 1 | false |
| data | Q28 BYOD | 3 | 1 | false |
| data | Q29 cryptography | 4 | 1 | true |
| data | Q30 hardware disposal | 3 | 1 | false |
| data | Q37 secure development | 3 | 1 | false |
| incident | Q31 incident management | 5 | 1.5 | true |
| incident | Q32 BC/DR | 5 | 1.5 | true |
| incident | Q38 breach notification | 4 | 1.2 | true |

**maturityLevels** (exact):

```js
maturityLevels: [
  { level: 1, label: { en: 'Initial',    sq: 'Fillestar' }, min: 0,  max: 20 },
  { level: 2, label: { en: 'Developing', sq: 'Në zhvillim' }, min: 21, max: 40 },
  { level: 3, label: { en: 'Defined',    sq: 'I përcaktuar' }, min: 41, max: 60 },
  { level: 4, label: { en: 'Managed',    sq: 'I menaxhuar' }, min: 61, max: 80 },
  { level: 5, label: { en: 'Optimized',  sq: 'I optimizuar' }, min: 81, max: 100 }
]
```

- [ ] **Step 1: Write the failing test** `tests/template.test.js`

```js
'use strict';
const validate = require('../assets/js/validate.js');
global.window = global; global.OBS_TEMPLATES = {};
require('../templates/infosec-iso27001.js');
const t = global.OBS_TEMPLATES['infosec-iso27001'];

test('template registers itself', function () { assert.ok(t, 'template missing'); });
test('template is structurally valid (en first)', function () {
  // validate against en-only coverage at this step (sq added in Task 7)
  const enOnly = JSON.parse(JSON.stringify(t)); enOnly.languages = ['en'];
  const r = validate.validateTemplate(enOnly);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
test('has 8 domains and 38 questions', function () {
  assert.strictEqual(t.domains.length, 8);
  const n = t.domains.reduce((s, d) => s + d.questions.length, 0);
  assert.strictEqual(n, 38);
});
test('every domain has 2 custom slots', function () {
  t.domains.forEach((d) => assert.strictEqual(d.customSlots, 2));
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement `templates/infosec-iso27001.js`.** Structure (showing the registration footer and two representative questions fully; transcribe all 38 in the same shape using the numeric table above and verbatim text from the spec):

```js
(function (root) {
  'use strict';
  var T = {
    id: 'infosec-iso27001', version: '1.0.0',
    title: { en: 'Information Security Assessment Questionnaire' },
    description: { en: 'Consultant diagnostic mapped to ISO/IEC 27001:2022, ISO/IEC 27002:2022, NIS2, and CIS Controls v8.' },
    languages: ['en'], // sq added in Task 7
    translationStatus: {},
    maturityLevels: [ /* exact array above */ ],
    domains: [
      {
        id: 'governance', title: { en: 'Governance, security awareness & compliance' }, customSlots: 2,
        questions: [
          {
            id: 'Q1', kind: 'standard', threatIndicator: 5, weight: 1.5, critical: true,
            text: { en: 'Does a formally approved information security policy exist, and is it actively communicated and enforced?' },
            goodPractice: { en: [
              'A written information security policy approved by top management',
              'A signed user/administrator security charter or acceptable use policy',
              'Documented procedures (not just verbal instructions)',
              'Evidence the policy is communicated to staff and reviewed at planned intervals or after major changes'
            ] },
            followUp: { en: 'Who approved the policy and when was it last reviewed? How is non-compliance handled?' },
            references: { iso27001: 'A.5.1', iso27002: '5.1 Policies for information security', nis2: 'Art. 21(2)(a); Art. 20', cis: 'CIS 14.1' }
          },
          {
            id: 'Q33', kind: 'new', threatIndicator: 3, weight: 1, critical: false,
            text: { en: 'Is the effectiveness of security controls independently reviewed (internal audit, external audit, or penetration test)?' },
            goodPractice: { en: [
              'A schedule of internal audits or independent reviews of the security policy and controls',
              'Periodic technical testing (e.g. vulnerability scans, penetration tests) appropriate to risk',
              'Findings are tracked to closure with owners and deadlines'
            ] },
            followUp: { en: 'When was the last independent review or test performed, and what were the major findings?' },
            references: { iso27001: 'A.5.36, A.5.35', iso27002: '5.35 Independent review; 5.36 Compliance with policies', nis2: 'Art. 21(2)(f)', cis: 'CIS 18' }
          }
          /* ...Q2, Q3, Q4 in this domain... */
        ]
      }
      /* ...domains: people, supplier, physical, iam, network, data, incident... */
    ]
  };
  root.OBS_TEMPLATES = root.OBS_TEMPLATES || {};
  root.OBS_TEMPLATES[T.id] = T;
  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Create `templates/registry.js`** (loaded by the HTML before templates; just initializes the global):

```js
(function (root) { root.OBS_TEMPLATES = root.OBS_TEMPLATES || {}; })(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 5: Create `templates/validate-cli.js`** (used by CI to validate every registered template):

```js
'use strict';
const validate = require('../assets/js/validate.js');
global.window = global; global.OBS_TEMPLATES = {};
require('./infosec-iso27001.js');
let bad = 0;
Object.keys(global.OBS_TEMPLATES).forEach(function (id) {
  const r = validate.validateTemplate(global.OBS_TEMPLATES[id]);
  if (!r.ok) { bad++; console.error('INVALID ' + id + ':\n  ' + r.errors.join('\n  ')); }
  else console.log('valid ' + id);
});
process.exit(bad ? 1 : 0);
```

- [ ] **Step 6: Run tests — expect PASS** (`node tests/run.js`) and `node templates/validate-cli.js` prints `valid infosec-iso27001`.

- [ ] **Step 7: Commit**

```bash
git add templates/ tests/template.test.js
git commit -m "feat: InfoSec questionnaire template (EN), registry and CLI validator"
```

---

### Task 7: Albanian machine-draft translations

**Files:**
- Modify: `templates/infosec-iso27001.js` (add `sq` to every translatable field; set `languages: ['en','sq']` and `translationStatus: { sq: 'machine-draft' }`)
- Modify: `tests/template.test.js` (assert full sq coverage)

**Interfaces:**
- Produces: the template now validates with `languages: ['en','sq']`.

- [ ] **Step 1: Add the coverage test** to `tests/template.test.js`

```js
test('template fully valid with sq', function () {
  const r = validate.validateTemplate(t);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
test('sq flagged as machine-draft', function () {
  assert.strictEqual(t.translationStatus.sq, 'machine-draft');
});
```

- [ ] **Step 2: Run — expect FAIL** (sq missing).

- [ ] **Step 3: Implement** — for every `text`, `goodPractice`, `followUp`, `title`, `description`, add an `sq` key with a machine-drafted Albanian translation of the English value; set `languages: ['en','sq']` and `translationStatus: { sq: 'machine-draft' }`. (Reference codes are framework identifiers — not translated.)

- [ ] **Step 4: Run — expect PASS** (`node tests/run.js` and `node templates/validate-cli.js`).

- [ ] **Step 5: Commit**

```bash
git add templates/infosec-iso27001.js tests/template.test.js
git commit -m "feat: Albanian machine-draft translations (flagged for review)"
```

---

### Task 8: Vendor Chart.js and jsPDF locally

**Files:**
- Create: `assets/js/vendor/chart.umd.min.js`, `assets/js/vendor/jspdf.umd.min.js`, `assets/js/vendor/README.md`

**Interfaces:**
- Produces: `window.Chart` and `window.jspdf` available when the vendored scripts load.

- [ ] **Step 1: Download pinned versions into the vendor folder**

```bash
mkdir -p assets/js/vendor
curl -L -o assets/js/vendor/chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
curl -L -o assets/js/vendor/jspdf.umd.min.js https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js
```

- [ ] **Step 2: Verify the files are real JS** (non-empty, contains expected globals)

```bash
grep -l "Chart" assets/js/vendor/chart.umd.min.js && grep -l "jsPDF" assets/js/vendor/jspdf.umd.min.js && wc -c assets/js/vendor/*.js
```
Expected: both files match and are tens/hundreds of KB.

- [ ] **Step 3: Write `assets/js/vendor/README.md`** documenting exact versions (Chart.js 4.4.1, jsPDF 2.5.1), source URLs, and the refresh command (the two `curl`s) so maintainers can update deterministically.

- [ ] **Step 4: Commit**

```bash
git add assets/js/vendor/
git commit -m "chore: vendor Chart.js 4.4.1 and jsPDF 2.5.1 (offline, no runtime CDN)"
```

---

### Task 9: Landing page (`index.html`) + shared styles + footer

**Files:**
- Create: `index.html`, `assets/css/styles.css`, `assets/js/landing.js`

**Interfaces:**
- Consumes: `OBS.i18n`.
- Produces: a landing page with a `Start assessment` link to `app.html`, content sections, a shared footer partial markup (repo link + "free & open source (MIT)").

- [ ] **Step 1: Write `index.html`** — semantic, accessible landing page. Key required elements (exact ids/classes used by `landing.js`): a `<header>` hero with `<h1>` tool name, a `<p>` one-line description, and `<a class="btn-primary" href="app.html">` Start assessment; sections `#what-it-does`, `#how-it-works`, `#open-source` (states MIT + GitHub link `https://github.com/obsidiancorps/obs-assessment-tool`); a `<footer id="site-footer">` with the repo link and `Free & open source (MIT)`. Language toggle buttons `<button data-lang="en">`/`<button data-lang="sq">` with `aria-pressed`. Load order at end of `<body>`: `assets/js/i18n.js`, `assets/js/landing.js`.

- [ ] **Step 2: Write `assets/css/styles.css`** — shared design system: CSS variables for colours (contrast ≥ 4.5:1), typography, `.btn-primary`, layout for hero/sections/footer, the app's question cards and dashboard (used in later tasks), and an `@media print` block. Visible `:focus-visible` outlines on all interactive elements.

- [ ] **Step 3: Write `assets/js/landing.js`** — define `LANDING_STRINGS = { heroTitle:{en,sq}, heroDesc:{en,sq}, ... }`; on load and on language-button click, set `document.documentElement.lang`, update each `[data-i18n]` element's text via `OBS.i18n.pick(LANDING_STRINGS[key], lang)`, toggle `aria-pressed`, and set the footer year. Persist chosen language to `localStorage` if `OBS.storage?.available()` (guard for absence).

- [ ] **Step 4: Manual verification**

Open `index.html` from `file://` in a browser. Expected: page renders, EN/SQ toggle switches all `[data-i18n]` text, "Start assessment" navigates to `app.html` (404 until Task 10 — acceptable now), footer shows MIT + repo link.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/styles.css assets/js/landing.js
git commit -m "feat: landing page with EN/SQ toggle, shared styles and footer"
```

---

### Task 10: App shell (`app.html`) — start screen, language toggle, tabs, autosave

**Files:**
- Create: `app.html`, `assets/js/app.js`

**Interfaces:**
- Consumes: `OBS.i18n`, `OBS.storage`, `OBS_TEMPLATES`.
- Produces: app bootstrap with a global `OBS.app` state `{ template, assessment, lang }`; functions `newAssessment(templateId)`, `setLang(lang)`, `autosave()`, `showTab(name)`. Tabs: `start`, `questionnaire`, `dashboard`.

- [ ] **Step 1: Write `app.html`** — header with app name, language toggle, a machine-draft banner element `#sq-banner` (hidden unless lang==='sq' and template flags sq), a tab nav (`Start`, `Questionnaire`, `Dashboard`), a `#localstorage-warning` banner (hidden), three `<section>` tab panels (`#tab-start`, `#tab-questionnaire`, `#tab-dashboard`), and the shared footer. Start panel: metadata form (client, assessor, date), template `<select>`, and a `Begin` button. Toolbar buttons (in header): `Save (JSON)`, `Import`, `Export PDF`, `Export CSV`, plus a hidden `<input type="file" id="import-file" accept="application/json">`. Load order at end of body: vendor libs, `i18n.js`, `scoring.js`, `validate.js`, `storage.js`, `exporters.js`, `report.js`, `registry.js`, `templates/infosec-iso27001.js`, `app.js`.

- [ ] **Step 2: Write `assets/js/app.js`** core:

```js
(function () {
  'use strict';
  var app = { template: null, assessment: null, lang: 'en' };
  window.OBS = window.OBS || {}; window.OBS.app = app;

  function emptyAssessment(template) {
    return { schemaVersion: 1, templateId: template.id, templateVersion: template.version,
      meta: { clientName: '', assessorName: '', date: '' }, language: app.lang,
      answers: {}, domainNarratives: {}, customQuestions: {} };
  }
  function newAssessment(templateId) {
    app.template = window.OBS_TEMPLATES[templateId];
    app.assessment = emptyAssessment(app.template);
    autosave();
  }
  function autosave() { if (app.assessment) OBS.storage.saveDraft(app.assessment); }
  function setLang(lang) {
    app.lang = lang; document.documentElement.lang = lang;
    var draft = app.template && app.template.translationStatus;
    document.getElementById('sq-banner').hidden = !(lang === 'sq' && draft && draft.sq);
    render();
  }
  function showTab(name) { /* toggle .active on panels + nav, set aria-selected */ }
  function render() { /* delegate to questionnaire/dashboard renderers from later tasks */ }

  function init() {
    if (!OBS.storage.available()) document.getElementById('localstorage-warning').hidden = false;
    var prior = OBS.storage.loadDraft();
    if (prior && prior.ok) { /* offer to resume: load template + reconcile + render */ }
    // wire start form Begin button -> newAssessment(select.value) -> showTab('questionnaire')
    // wire language buttons -> setLang
    // wire Save/Import/Export buttons (Import: parseAssessment -> reconcile -> show notices)
  }
  document.addEventListener('DOMContentLoaded', init);
  OBS.app.newAssessment = newAssessment; OBS.app.setLang = setLang; OBS.app.autosave = autosave; OBS.app.showTab = showTab;
})();
```

- [ ] **Step 3: Manual verification**

Open `app.html` from `file://`. Expected: start tab shows the metadata form + template dropdown (one option), language toggle works, `Begin` switches to the (empty) questionnaire tab, no console errors, localStorage warning appears only when storage is blocked.

- [ ] **Step 4: Commit**

```bash
git add app.html assets/js/app.js
git commit -m "feat: app shell with tabs, language toggle, autosave and start screen"
```

---

### Task 11: Questionnaire rendering + answer capture

**Files:**
- Modify: `assets/js/app.js` (add `renderQuestionnaire()` and answer handlers)

**Interfaces:**
- Consumes: `OBS.i18n`, `OBS.scoring` (for live progress), `app.template`, `app.assessment`.
- Produces: DOM rendering of domains/questions with status radios, partial-% input (shown only for `partial`), N/A reason input (shown only for `na`), evidence textarea, remediation fields (owner/date/status), per-domain narrative textarea, and 2 custom-question slots per domain; every change writes into `app.assessment` and calls `autosave()` + updates progress.

- [ ] **Step 1: Implement `renderQuestionnaire()`** — build a domain sidebar (`<nav>` with one button per domain showing `answered/total` from `OBS.scoring.domainScore`) and a main panel rendering the active domain's questions. For each question render: number + `OBS.i18n.pick(q.text, lang)`, a collapsible "what good practice looks like" list from `q.goodPractice`, the follow-up prompt, the reference codes, a fieldset of status radios (`compliant/partial/non-compliant/na`), conditional partial-% (`<input type=number min=0 max=100>`) and N/A-reason (`<input type=text>`), an evidence `<textarea>`, and remediation inputs (`owner`, `targetDate type=date`, `status select`). Custom slots render editable `text`, `references`, and the same status/evidence controls.

- [ ] **Step 2: Implement change handlers** — a single delegated `input`/`change` listener on the panel maps `data-qid` + `data-field` to `app.assessment.answers[qid][field]` (creating the answer object on first touch), toggles the conditional inputs' visibility on status change, writes domain narrative to `app.assessment.domainNarratives[domainId]`, writes custom-question fields to `app.assessment.customQuestions[domainId][index]`, then calls `autosave()` and refreshes the sidebar progress counts.

- [ ] **Step 3: Accessibility** — each status group is a `<fieldset>` with a `<legend>`; inputs have associated `<label>`s; conditional fields use `hidden` + `aria-hidden`; sidebar buttons use `aria-current` for the active domain.

- [ ] **Step 4: Manual verification**

Open `app.html` from `file://`, Begin an assessment, answer several questions across domains, switch a status to Partial (percent field appears) and to N/A (reason field appears), add a custom question, type a domain narrative, switch language (text updates, answers persist), refresh the page (draft resumes via autosave). Confirm no console errors.

- [ ] **Step 5: Commit**

```bash
git add assets/js/app.js
git commit -m "feat: questionnaire rendering, answer capture, custom slots and live progress"
```

---

### Task 12: Dashboard — charts, compliance summary, recommendations

**Files:**
- Create: `assets/js/report.js`
- Modify: `assets/js/app.js` (call `OBS.report.renderDashboard()` when the dashboard tab opens)

**Interfaces:**
- Consumes: `OBS.scoring`, `OBS.i18n`, `window.Chart`, `app.template`, `app.assessment`.
- Produces: `OBS.report.renderDashboard(container, template, assessment, lang)` and `OBS.report.chartImages()` → `{ radar, doughnut }` dataURLs (used by the PDF exporter). Holds Chart instances and destroys them before re-render.

- [ ] **Step 1: Implement `renderDashboard`** — compute `overallScore`, `maturity`, `completeness`, `complianceSummary`, per-domain scores. Render: a completeness line (`X of N answered`) shown **before** any score; the maturity badge **with** the compliance summary counts and a critical-gaps list; a radar chart (8 domain scores) and a doughnut (status breakdown) into two `<canvas>` elements; and a recommendations table (from `OBS.scoring.recommendations`) with columns Domain, Question, Status, Threat, Reference codes, Remediation owner/date/status.

- [ ] **Step 2: Implement `chartImages()`** — return `{ radar: radarCanvas.toDataURL('image/png'), doughnut: doughnutCanvas.toDataURL('image/png') }`. (No html2canvas.)

- [ ] **Step 3: Guard Chart absence** — if `window.Chart` is undefined (vendor file missing), render a textual fallback table of domain scores instead of throwing.

- [ ] **Step 4: Manual verification**

Open `app.html` from `file://`, answer a spread of questions, open Dashboard. Expected: completeness shown first, maturity + compliance summary + critical gaps, radar and doughnut render, recommendations sorted by threat. Disconnect network and reload — charts still render (vendored). No console errors.

- [ ] **Step 5: Commit**

```bash
git add assets/js/report.js assets/js/app.js
git commit -m "feat: dashboard with charts, compliance summary and recommendations"
```

---

### Task 13: Exporters — JSON save/import, PDF, CSV

**Files:**
- Create: `assets/js/exporters.js`, `tests/exporters.test.js`
- Modify: `assets/js/app.js` (wire toolbar buttons)

**Interfaces:**
- Consumes: `OBS.i18n`, `OBS.scoring`, `window.jspdf`, `OBS.report.chartImages()`.
- Produces: `OBS.exporters.assessmentToCsv(template, assessment, lang)` (pure, tested) and `OBS.exporters.buildPdf(template, assessment, lang, chartImages)` (browser). App wiring: Save→download JSON via Blob; Import→file read→`parseAssessment`→`reconcile`→load+notices; CSV/PDF→download.

- [ ] **Step 1: Write failing CSV test** `tests/exporters.test.js`

```js
'use strict';
const exporters = require('../assets/js/exporters.js');
const template = { domains: [{ id: 'd1', title: { en: 'D1' }, questions: [
  { id: 'Q1', threatIndicator: 5, critical: true, text: { en: 'Policy?' }, references: { iso27001: 'A.5.1', nis2: 'Art.21' } }
]}]};
const assessment = { answers: { Q1: { status: 'non-compliant', naReason: '', evidence: 'none', remediation: { owner: 'Bob', targetDate: '2026-09-01', status: 'planned' } } }, customQuestions: {} };

test('csv has header and one data row with reference + remediation', function () {
  const csv = exporters.assessmentToCsv(template, assessment, 'en');
  const lines = csv.trim().split('\n');
  assert.ok(lines[0].indexOf('Control') >= 0);
  assert.ok(lines[1].indexOf('A.5.1') >= 0);
  assert.ok(lines[1].indexOf('Bob') >= 0);
});
test('csv escapes commas and quotes', function () {
  const a2 = { answers: { Q1: { status: 'partial', evidence: 'has, comma and "quote"' } }, customQuestions: {} };
  const csv = exporters.assessmentToCsv(template, a2, 'en');
  assert.ok(csv.indexOf('"has, comma and ""quote"""') >= 0);
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement `assets/js/exporters.js`** (CSV pure; PDF browser-only, guarded):

```js
(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.exporters = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var i18n = (typeof require !== 'undefined') ? require('./i18n.js') : (root_OBS().i18n);
  function root_OBS() { return (typeof window !== 'undefined' ? window : globalThis).OBS; }

  function esc(v) {
    v = (v == null) ? '' : String(v);
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function refStr(r) { return [r && r.iso27001, r && r.iso27002, r && r.nis2, r && r.cis, r && r.other].filter(Boolean).join(' | '); }

  function assessmentToCsv(template, assessment, lang) {
    var header = ['Domain', 'Control', 'Question', 'Applicable', 'Status', 'PartialPercent', 'Justification', 'Evidence', 'Threat', 'RemediationOwner', 'RemediationTarget', 'RemediationStatus'];
    var rows = [header.map(esc).join(',')];
    template.domains.forEach(function (d) {
      d.questions.forEach(function (q) {
        var a = (assessment.answers || {})[q.id] || {};
        var rem = a.remediation || {};
        rows.push([
          i18n.pick(d.title, lang), refStr(q.references), i18n.pick(q.text, lang),
          a.status === 'na' ? 'N' : 'Y', a.status || 'unanswered',
          a.status === 'partial' ? (a.partialPercent == null ? 50 : a.partialPercent) : '',
          a.naReason || '', a.evidence || '', q.threatIndicator,
          rem.owner || '', rem.targetDate || '', rem.status || ''
        ].map(esc).join(','));
      });
    });
    return rows.join('\n');
  }

  function buildPdf(template, assessment, lang, chartImages) {
    var jsPDFns = (typeof window !== 'undefined') && window.jspdf;
    if (!jsPDFns) throw new Error('jsPDF not loaded');
    var doc = new jsPDFns.jsPDF({ unit: 'pt', format: 'a4' });
    var I = root_OBS().i18n, S = root_OBS().scoring, y = 40;
    doc.setFontSize(16); doc.text(I.pick(template.title, lang), 40, y); y += 24;
    if (template.translationStatus && template.translationStatus[lang]) {
      doc.setFontSize(9); doc.setTextColor(180, 0, 0);
      doc.text('Machine-translated (' + lang + ') — pending professional review.', 40, y); y += 16; doc.setTextColor(0, 0, 0);
    }
    doc.setFontSize(10);
    var c = S.completeness(template, assessment);
    doc.text('Completeness: ' + c.answered + ' of ' + c.total + ' answered', 40, y); y += 16;
    var overall = S.overallScore(template, assessment);
    var mat = S.maturity(overall, template.maturityLevels);
    doc.text('Overall: ' + (overall == null ? 'n/a' : Math.round(overall) + '%') + (mat ? '  Maturity ' + mat.level + ' (' + I.pick(mat.label, lang) + ')' : ''), 40, y); y += 20;
    if (chartImages && chartImages.radar) { doc.addImage(chartImages.radar, 'PNG', 40, y, 240, 240); }
    if (chartImages && chartImages.doughnut) { doc.addImage(chartImages.doughnut, 'PNG', 300, y, 220, 220); }
    y += 252;
    doc.setFontSize(12); doc.text('Recommendations', 40, y); y += 16; doc.setFontSize(9);
    S.recommendations(template, assessment).forEach(function (r) {
      if (y > 780) { doc.addPage(); y = 40; }
      var line = '[' + r.status + '] ' + I.pick(r.text, lang) + '  (' + refStr(r.references) + ')';
      doc.text(doc.splitTextToSize(line, 515), 40, y); y += 22;
    });
    return doc;
  }
  return { assessmentToCsv: assessmentToCsv, buildPdf: buildPdf };
});
```

- [ ] **Step 4: Run — expect PASS** (CSV tests; PDF not exercised in Node).

- [ ] **Step 5: Wire toolbar in `app.js`** — `download(filename, text, mime)` helper using `Blob` + object URL; Save→`download(client+'.json', OBS.storage.serialize(assessment), 'application/json')`; CSV→`download(client+'.csv', OBS.exporters.assessmentToCsv(...), 'text/csv')`; PDF→`OBS.exporters.buildPdf(template, assessment, lang, OBS.report.chartImages()).save(client+'.pdf')`; Import→read file, `parseAssessment`, on ok `reconcile` against the matching template, load, render, and alert any `notices`; on error show the message.

- [ ] **Step 6: Manual verification**

Open `app.html` from `file://`: complete a few questions → Save downloads JSON → reload → Import the JSON → answers restored, any version notice shown → Export CSV opens in a spreadsheet with reference codes + remediation columns → Export PDF downloads a file containing charts + recommendations + (when sq) the disclaimer.

- [ ] **Step 7: Commit**

```bash
git add assets/js/exporters.js assets/js/app.js tests/exporters.test.js
git commit -m "feat: JSON save/import, CSV gap export and PDF report"
```

---

### Task 14: Deployment — Dockerfile, nginx config, compose

**Files:**
- Create: `deploy/Dockerfile`, `deploy/nginx.conf`, `deploy/docker-compose.yml`

**Interfaces:** none (infra).

- [ ] **Step 1: Write `deploy/nginx.conf`**

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Referrer-Policy "no-referrer" always;
  add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; base-uri 'self'; form-action 'self'" always;
  location ~* \.(?:css|js|png|svg|woff2?)$ { expires 30d; add_header Cache-Control "public, max-age=2592000"; }
  location ~* \.html$ { add_header Cache-Control "no-cache"; }
  location / { try_files $uri $uri/ =404; }
}
```

- [ ] **Step 2: Write `deploy/Dockerfile`**

```dockerfile
FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html app.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY templates /usr/share/nginx/html/templates
EXPOSE 80
```

- [ ] **Step 3: Write `deploy/docker-compose.yml`** (Dokploy/Traefik labels for the subdomain + TLS)

```yaml
services:
  web:
    build:
      context: ..
      dockerfile: deploy/Dockerfile
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.obs-assessment.rule=Host(`assessment.obsidiancorps.com`)"
      - "traefik.http.routers.obs-assessment.entrypoints=websecure"
      - "traefik.http.routers.obs-assessment.tls.certresolver=letsencrypt"
      - "traefik.http.services.obs-assessment.loadbalancer.server.port=80"
```

- [ ] **Step 4: Verify the image builds and serves**

```bash
docker build -f deploy/Dockerfile -t obs-assessment .
docker run --rm -d -p 8088:80 --name obs-test obs-assessment
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8088/index.html   # expect 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8088/app.html      # expect 200
docker rm -f obs-test
```
(If Docker is unavailable in the environment, document the commands in the README and mark this verification as run-on-deploy.)

- [ ] **Step 5: Commit**

```bash
git add deploy/
git commit -m "feat: Docker/nginx deployment for Dokploy (assessment.obsidiancorps.com)"
```

---

### Task 15: Documentation — README, CONTRIBUTING, PRIVACY, SCORING, example

**Files:**
- Create: `README.md`, `CONTRIBUTING.md`, `docs/PRIVACY.md`, `docs/SCORING.md`, `docs/examples/assessment.json`

**Interfaces:** none.

- [ ] **Step 1: Write `README.md`** — intro; **free & open source (MIT)** statement + repo link; live demo `https://assessment.obsidiancorps.com`; quick start (double-click `app.html`, or open `index.html`); hosted/self-host via Docker/Dokploy (`docker compose -f deploy/docker-compose.yml up`); features; browser-support matrix (Chrome/Edge 90+, Firefox 88+, Safari 14+ with the `file://` localStorage caveat); accessibility statement (WCAG 2.1 AA); privacy note (link to `docs/PRIVACY.md`); how to run tests (`node tests/run.js`).

- [ ] **Step 2: Write `CONTRIBUTING.md`** — how to add a template (copy `infosec-iso27001.js`, follow `templates/schema.json`, register in the same file pattern, run `node templates/validate-cli.js` and `node tests/run.js`); how to add a language (add the code to `languages`, fill every translatable field, the validator enforces coverage); the vendoring/refresh process (the two `curl`s from `assets/js/vendor/README.md`, pinned versions); PR flow + that CI must pass.

- [ ] **Step 3: Write `docs/PRIVACY.md`** — assessments may contain client-confidential data; stored unencrypted in browser localStorage and exported as unencrypted JSON; nothing is transmitted (no backend, no analytics, no runtime CDN); deletion = clear browser storage / delete the JSON; retention guidance; GDPR note that the consultant is the controller of any personal data entered.

- [ ] **Step 4: Write `docs/SCORING.md`** — explain the formula, a worked 3-question example matching the `OBS.scoring` math, and the maturity bands; reference `docs/examples/assessment.json`.

- [ ] **Step 5: Write `docs/examples/assessment.json`** — a small valid exported assessment (a handful of answered questions incl. one partial with percent, one N/A with reason, one with remediation) that `OBS.storage.parseAssessment` accepts.

- [ ] **Step 6: Verify the example parses**

```bash
node -e "global.window=global;const s=require('./assets/js/storage.js');const fs=require('fs');const r=s.parseAssessment(fs.readFileSync('docs/examples/assessment.json','utf8'));if(!r.ok){console.error(r.error);process.exit(1)}console.log('example ok')"
```
Expected: `example ok`.

- [ ] **Step 7: Commit**

```bash
git add README.md CONTRIBUTING.md docs/PRIVACY.md docs/SCORING.md docs/examples/
git commit -m "docs: README, CONTRIBUTING, PRIVACY, SCORING and example assessment"
```

---

### Task 16: CI workflow + accessibility & smoke checklist

**Files:**
- Create: `.github/workflows/ci.yml`, `docs/SMOKE-CHECKLIST.md`

**Interfaces:** none.

- [ ] **Step 1: Write `.github/workflows/ci.yml`** — on push/PR: checkout, setup Node 20, run `node tests/run.js`, then `node templates/validate-cli.js`. No `npm install` (no dependencies).

```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: node tests/run.js
      - run: node templates/validate-cli.js
```

- [ ] **Step 2: Write `docs/SMOKE-CHECKLIST.md`** — the manual matrix: open `app.html` from `file://` in Chrome, Firefox, and Safari; verify localStorage-blocked banner on Safari; complete questions; switch EN/SQ (sq banner shows); dashboard charts render offline; Save/Import round-trip; CSV opens with reference + remediation columns; PDF contains charts + recommendations + sq disclaimer; keyboard-only navigation reaches every control with visible focus; check colour contrast ≥ 4.5:1.

- [ ] **Step 3: Run the test suite once more — expect PASS**

Run: `node tests/run.js` then `node templates/validate-cli.js`. Expected: all pass, exit 0.

- [ ] **Step 4: Work the accessibility checklist** against `index.html` and `app.html`, fixing any keyboard/ARIA/contrast issues found (update `styles.css`/markup as needed) and committing those fixes.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml docs/SMOKE-CHECKLIST.md
git commit -m "ci: run tests + template validation; add smoke and a11y checklist"
```

---

## Self-Review

**Spec coverage check (spec §→task):** §2 constraints→Global Constraints+all; §3 architecture/modules→1–13; §4 data model→4,5,6,10,11; §5 scoring→4; §6 visuals/output→8,12,13; §7 landing→9; §8 app flow→10,11; §9 Albanian→7; §10 import/version→5,13; §11 testing→1–7,13,16; §12 docs→15; §13 out-of-scope→(excluded by design); §14 deployment→14; a11y→9,16. No uncovered requirement.

**Type consistency:** `app.assessment` shape (answers/customQuestions/domainNarratives/meta) is identical across Tasks 5, 10, 11, 12, 13; `OBS.scoring`/`OBS.storage`/`OBS.exporters`/`OBS.i18n` signatures match the locked contract block in every consumer; `chartImages()` produced in Task 12 and consumed in Task 13 use the same `{radar, doughnut}` keys.

**Placeholder scan:** the only `/* ... */` markers are in Task 6 (explicitly: "transcribe all 38 in the same shape", with the exact numeric table + verbatim text source given) and Task 10/11 scaffolding comments that are immediately followed by concrete step-by-step instructions — no logic is left undefined.
