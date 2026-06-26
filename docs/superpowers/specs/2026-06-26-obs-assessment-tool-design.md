# OBS Assessment Tool — Design

**Date:** 2026-06-26
**Owner:** Philippe Parage / Obsidian Corps
**Status:** Approved (proceeding to implementation plan)
**License:** MIT
**Repository:** open-source under the `obsidiancorps` org

## 1. Purpose

An open-source, template-based security assessment tool for consultants and
cybersecurity agencies. The first template is the **Information Security
Assessment Questionnaire** — a consultant's diagnostic tool mapped to ISO/IEC
27001:2022, ISO/IEC 27002:2022, the NIS2 Directive (EU 2022/2555), and CIS
Controls v8 (38 questions, 8 domains).

The tool is **template-based**: additional questionnaires can be added without
code changes. It produces scoring, a maturity rating, severity-ranked
recommendations, and visual graphs, and supports exporting/importing each
assessment.

## 2. Core constraints (from brainstorming)

1. **Zero build step.** The app must be launchable by double-clicking
   `index.html` (`file://`), with no bundler, no server, no install. It must
   *also* be hostable as plain static files (e.g. GitHub Pages).
2. **Plain HTML + vanilla JS.** Libraries are allowed via CDN (and may include
   jQuery and others), but **must be vendored locally as a fallback** so the app
   works fully offline.
3. **Export / import is a first-class feature.** Each assessment can be exported
   to a JSON file and re-imported later.
4. **No backend, no database, no accounts.** All state is local
   (localStorage + exported JSON files).
5. **Data-driven i18n.** v1 ships **English (`en`)** and **Albanian (`sq`)**.
   Adding any further language (French, German, …) is a drop-in translation set
   with no code changes.
6. **MIT license**, intended for wide adoption by private companies and
   cybersecurity agencies.

### `file://` consequence — templates embedded as JS

Browsers block `fetch()` of local files under `file://`. Therefore the
questionnaire templates and translations are **embedded as JavaScript** (loaded
via `<script>` tags that populate a global registry), **not** fetched as JSON.
This keeps the app truly double-click-launchable with no CORS issues.

## 3. Architecture

Static client-side single-page app. No backend.

```
obs-assessment-tool/
├─ index.html                 ← the app (double-click to run)
├─ assets/
│  ├─ css/styles.css
│  ├─ js/app.js               ← bootstrap, routing/tabs, render orchestration
│  ├─ js/i18n.js              ← language registry + switching, fallback to en
│  ├─ js/scoring.js           ← scoring + maturity + recommendations (pure)
│  ├─ js/storage.js           ← localStorage autosave + JSON export/import
│  ├─ js/report.js            ← charts + PDF generation
│  └─ vendor/                 ← local fallback copies of CDN libraries
├─ templates/
│  ├─ registry.js             ← window.OBS_TEMPLATES = {}
│  └─ infosec-iso27001.js     ← the 38-question template (en + sq)
├─ docs/
├─ LICENSE                    ← MIT
└─ README.md
```

### Module responsibilities (each independently testable)

- **i18n.js** — given a language code and a `{lang: value}` object, returns the
  best string (requested language → English fallback → empty). Exposes the list
  of available languages for the switcher. No DOM knowledge of questionnaire
  content.
- **scoring.js** — pure functions. Input: a template + an answer-state object.
  Output: per-question contribution, per-domain score (0–100%), overall score,
  maturity level (1–5), and a severity-ranked recommendation list. No DOM, no
  storage. This is the unit with the most logic and must be unit-tested in
  isolation.
- **storage.js** — autosave/load the current assessment to localStorage;
  serialize to / parse from an export JSON file (download + file picker). Owns
  the on-disk schema and its `schemaVersion`.
- **report.js** — renders charts (radar, doughnut, gauge) and builds the
  downloadable PDF from the dashboard view.
- **app.js** — wires the above to the DOM: template/language selection, domain
  navigation, question rendering, answer capture, live progress, dashboard.

### Library choices (CDN + vendored fallback)

- **Charts:** Chart.js (radar + doughnut + gauge-style).
- **PDF:** jsPDF + html2canvas (generate a real downloadable PDF file).
- **DOM helpers:** vanilla JS is sufficient; jQuery may be included if it
  simplifies code, but is not required.

A small loader prefers the CDN copy and falls back to `assets/js/vendor/` if the
CDN is unreachable (offline use).

## 4. Data model

### Template (pristine content — never mutated at runtime)

```js
Template = {
  id: "infosec-iso27001",
  version: "1.0.0",
  title: { en, sq },
  description: { en, sq },
  frameworks: ["ISO/IEC 27001:2022", "ISO/IEC 27002:2022",
               "NIS2 (EU 2022/2555)", "CIS Controls v8"],
  languages: ["en", "sq"],
  maturityLevels: [ { level, label:{en,sq}, min, max } ],   // score→level bands
  domains: [
    {
      id: "governance",
      title: { en, sq },
      questions: [
        {
          id: "Q1",
          kind: "standard" | "new" | "custom",   // "new" = added in this upgrade
          threatIndicator: 1..5,                  // business impact if absent
          weight: number,                         // relative weight within scoring
          text: { en, sq },
          goodPractice: { en: [..bullets], sq: [..bullets] },
          followUp: { en, sq },
          references: {
            iso27001: "A.5.1",
            iso27002: "5.1 Policies for information security",
            nis2: "Art. 21(2)(a); Art. 20",
            cis: "CIS 14.1",
            other: "GDPR Art. 5, 6, 30"            // optional
          }
        }
      ],
      customSlots: 2          // number of blank "Add your own" slots per domain
    }
  ]
}
```

### Answer state (per assessment — the thing that is saved/exported)

```js
Assessment = {
  schemaVersion: 1,
  templateId: "infosec-iso27001",
  templateVersion: "1.0.0",
  meta: { clientName, assessorName, date, notes },
  language: "en",                        // last-used UI language (not binding)
  answers: {
    "Q1": { status: "compliant|partial|non-compliant|na|unanswered",
            evidence: "free text" }
  },
  customQuestions: {
    "governance": [
      { text: "", references: "", status: "...", evidence: "" }
    ]
  }
}
```

Keeping answer state separate from templates means: templates stay pristine,
export files stay small, and a saved assessment records which template
version it was taken against (for future migration).

## 5. Scoring & maturity model (transparent, tunable)

All tunable numbers (`weight`, `threatIndicator`, maturity bands) live in the
template data, not in code.

1. **Status → completion value**
   - Compliant → `1.0`
   - Partial → `0.5`
   - Non-compliant → `0.0`
   - N/A → excluded from scoring (removed from numerator and denominator)
   - Unanswered → excluded from the score, but counted as "incomplete" for the
     progress indicator and flagged in the report.

2. **Per-question weight** = `weight × threatIndicator`.

3. **Per-domain score** =
   `Σ(value × weight × threat) / Σ(weight × threat)` over scored questions,
   expressed as 0–100%. Custom questions with a status participate in their
   domain's score using a default weight (1) and a default threat (3) unless the
   consultant sets them.

4. **Overall score** = weighted aggregate of all scored questions across
   domains (same formula over the whole set).

5. **Maturity level (1–5)** from the overall score via `maturityLevels` bands,
   e.g. `1 Initial (0–20) · 2 Developing (21–40) · 3 Defined (41–60) ·
   4 Managed (61–80) · 5 Optimized (81–100)`. Labels are translatable.

6. **Severity-ranked recommendations** — every Partial or Non-compliant item
   becomes a recommendation, sorted by `threatIndicator` (then weight)
   descending. Each recommendation shows: domain, question, current status, the
   "what good practice looks like" guidance, and the ISO 27001 / ISO 27002 /
   NIS2 / CIS reference codes so findings map directly to a Statement of
   Applicability or a NIS2 Art. 21 evidence file.

## 6. Visuals & output

- **Radar chart** of the 8 domain scores (0–100%).
- **Doughnut chart** of status breakdown (Compliant / Partial / Non-compliant /
  N/A / Unanswered).
- **Maturity gauge / badge** showing the overall level 1–5.
- **PDF export** (jsPDF + html2canvas): a generated, downloadable report file
  containing assessment metadata, the charts, per-domain scores, the overall
  maturity rating, and the severity-ranked recommendations/gap table with
  reference codes.
- **JSON export/import**: download the `Assessment` object; re-import via a file
  picker (`<input type="file">`, read with `FileReader` — works under `file://`).

## 7. UI flow

1. **Start:** choose a template (registry-driven; v1 has one) and enter
   assessment metadata (client, assessor, date).
2. **Language toggle:** EN / SQ, switchable live at any time; reflects whichever
   languages the active template provides.
3. **Questionnaire:** sidebar lists the 8 domains with live progress; main panel
   renders each question — headline text, "what good practice looks like"
   checklist, follow-up prompt, an evidence text box, and status radios
   (Compliant / Partial / Non-compliant / N/A). Each domain shows its 2
   "Add your own" custom slots (editable text + references + status).
4. **Dashboard:** charts + overall maturity + severity-ranked recommendations.
5. **Export:** download JSON and/or generate PDF. Autosave to localStorage
   happens continuously so a refresh never loses work.

## 8. Albanian content

v1 Albanian (`sq`) questionnaire content is **machine-drafted and clearly
flagged as needing professional review** (a visible banner when `sq` is active
and a `translationStatus: "machine-draft"` marker in the template). Missing
translations fall back to English so nothing ever renders blank.

## 9. Out of scope for v1 (YAGNI)

- Backend, accounts, multi-user, server-side storage.
- Build tooling / bundler / npm install to run the app.
- Additional templates beyond the InfoSec questionnaire (the registry supports
  them; none are authored in v1).
- Professional FR/DE/SQ translation (structure supports them; only EN is
  authoritative and SQ is a flagged machine draft).

## 10. Testing approach

- **scoring.js** is pure and gets unit tests (status mapping, N/A exclusion,
  domain/overall aggregation, maturity banding, recommendation ordering). Tests
  run in a tiny no-build HTML test runner or via a lightweight `node --test`
  on the pure module (module written to work in both browser and node).
- **storage.js** round-trip test: export → import yields an equal object;
  schemaVersion is preserved.
- **i18n.js** fallback test: requested language missing → English; both missing
  → empty string.
- Manual smoke checklist: open `index.html` from `file://`, complete a few
  questions, switch language, view dashboard, export JSON, re-import, generate
  PDF, and confirm offline (CDN blocked) still works via vendored fallback.

## 11. Open / deferred decisions

- Exact machine-drafted Albanian wording will be reviewed by a human later.
- Default weights/threat indicators: seeded from the questionnaire's threat
  indicators (1–5) with weight 1 by default; tunable in template data. (The
  original 32-question scoring numbers were not available; values are chosen to
  be sensible and adjustable.)
