# OBS Assessment Tool — Design

**Date:** 2026-06-26
**Owner:** Philippe Parage / Obsidian Corps
**Status:** Approved (proceeding to implementation plan)
**License:** MIT
**Repository:** open-source under the `obsidiancorps` org
**Revision:** v2 — incorporates findings from a three-lens review (technical
feasibility, security-consulting/scoring soundness, open-source/extensibility).

## 1. Purpose

An open-source, template-based security assessment tool for consultants and
cybersecurity agencies. The first template is the **Information Security
Assessment Questionnaire** — a consultant's diagnostic tool mapped to ISO/IEC
27001:2022, ISO/IEC 27002:2022, the NIS2 Directive (EU 2022/2555), and CIS
Controls v8 (38 questions, 8 domains).

The tool is **template-based**: additional questionnaires can be added without
code changes. It produces scoring, a maturity rating, a compliance summary,
severity-ranked recommendations, remediation tracking, and visual graphs, and
supports exporting/importing each assessment.

## 2. Core constraints

1. **Zero build step.** Launchable by double-clicking the HTML (`file://`),
   no bundler, no server, no install. `index.html` is the landing/home page;
   `app.html` is the assessment tool (double-click `app.html` for local use, or
   open `index.html` and click **Start assessment**). Also hostable as plain
   static files (GitHub Pages) or via Docker/nginx (Dokploy, §14).
2. **Plain HTML + vanilla JS.** Third-party libraries are **vendored locally**
   in `assets/js/vendor/` and loaded from there by default, so the app works
   fully offline and deterministically. CDN is an optional, documented swap —
   **not** used at runtime by default. (This resolves CDN-timeout hangs,
   CDN/local version drift, and offline breakage in one decision.)
3. **Export / import is a first-class feature.** Each assessment exports to a
   JSON file and re-imports later, with validation and a version-mismatch
   strategy (§10).
4. **No backend, no database, no accounts.** All state is local
   (localStorage when available + exported JSON files).
5. **Data-driven i18n.** v1 ships **English (`en`)** and **Albanian (`sq`)**.
   Adding a further language is a drop-in translation set, no code changes.
6. **MIT license**, intended for wide adoption by private companies and
   cybersecurity agencies.
7. **Accessibility:** target **WCAG 2.1 AA** — keyboard-navigable controls,
   ARIA labels/roles, visible focus, colour contrast ≥ 4.5:1.

### `file://` consequences (designed around)

- **No `fetch()` of local files** and **no ES modules** under `file://`
  (both are CORS-blocked). Therefore: templates/translations are **embedded as
  JavaScript** loaded via plain `<script>` tags that populate global registries
  (`window.OBS_TEMPLATES`, `window.OBS_I18N`); app code is plain scripts
  attaching to a small `window.OBS` namespace — **no `import`/`export`**.
- **localStorage may be blocked** (notably Safari under `file://`). The app
  detects availability on startup; if blocked, it runs in memory and shows a
  persistent banner: *"Auto-save unavailable — export your assessment to avoid
  losing work."*
- **PDF generation does not use html2canvas** (it taints the canvas under
  `file://` and yields blank/corrupt output). Charts are exported via Chart.js's
  own `canvas.toDataURL()` and placed into the PDF by jsPDF directly (§6).

## 3. Architecture

Static client-side single-page app. No backend.

```
obs-assessment-tool/
├─ index.html                 ← landing/home page (what it does + Start button)
├─ app.html                   ← the assessment tool (double-click to run locally)
├─ assets/
│  ├─ css/styles.css
│  ├─ js/
│  │  ├─ app.js               ← bootstrap, tabs, render orchestration
│  │  ├─ i18n.js              ← language registry + lookup, fallback to en
│  │  ├─ scoring.js           ← scoring, maturity, compliance summary, recs (pure)
│  │  ├─ storage.js           ← localStorage autosave + JSON export/import + validate
│  │  ├─ exporters.js         ← PDF (jsPDF) + CSV gap/SoA export
│  │  ├─ report.js            ← charts (Chart.js) + dashboard rendering
│  │  ├─ landing.js           ← minimal home-page interactions (year, links)
│  │  └─ vendor/              ← local copies of Chart.js, jsPDF (loaded by default)
├─ templates/
│  ├─ registry.js             ← window.OBS_TEMPLATES = {}
│  ├─ schema.json             ← JSON Schema describing a valid template
│  └─ infosec-iso27001.js     ← the 38-question template (en + sq)
├─ tests/
│  ├─ runner.html             ← no-build browser test runner
│  └─ *.test.js               ← unit tests (scoring, storage, i18n, schema)
├─ docs/
│  ├─ specs/                  ← this design
│  ├─ PRIVACY.md              ← client-confidential data handling
│  ├─ SCORING.md              ← worked scoring example + sample assessment JSON
│  └─ examples/assessment.json
├─ .github/workflows/         ← CI: run tests + validate templates on PR
├─ deploy/
│  ├─ Dockerfile              ← nginx serving the static files
│  ├─ docker-compose.yml      ← Dokploy service definition
│  └─ nginx.conf              ← static config (caching, SPA-ish, security headers)
├─ CONTRIBUTING.md            ← add a template, add a language, vendoring, PR flow
├─ LICENSE                    ← MIT
└─ README.md                  ← intro, quick start, browser matrix, a11y, demo link
```

### Module responsibilities (each independently testable)

- **i18n.js** — best-string lookup: requested language → English fallback →
  empty. Exposes available languages for the switcher. No content knowledge.
- **scoring.js** — pure functions, no DOM/storage. Input: template + answer
  state. Output: per-question contribution, per-domain score, overall score,
  maturity level, **compliance summary** (counts + critical gaps), and a
  **severity-ranked recommendation list**. The highest-logic unit; unit-tested
  thoroughly. Written as a plain script that attaches to `window.OBS.scoring`
  and is also `require`-able via a tiny shim used only by tests (no build).
- **storage.js** — autosave/load to localStorage (with availability detection);
  serialize to / parse from export JSON; **validate** imported files against the
  schema and run the version-mismatch strategy (§10).
- **exporters.js** — generate the downloadable **PDF** (jsPDF + chart
  `toDataURL()`) and the **CSV gap/SoA** file.
- **report.js** — render charts and the dashboard.
- **app.js** — wire everything to the DOM: template/language selection, domain
  navigation, question rendering, answer capture, live progress/completeness,
  remediation fields, domain narrative, dashboard.

### Library strategy (vendored-local default)

- **Charts:** Chart.js (radar + doughnut + gauge-style).
- **PDF:** jsPDF (no html2canvas).
- Both vendored in `assets/js/vendor/` at pinned versions. `CONTRIBUTING.md`
  documents the exact versions and the manual refresh process. CDN usage, if a
  deployer wants it, is documented as an optional `<script src>` swap.

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
  translationStatus: { sq: "machine-draft" },   // surfaced in UI + PDF
  maturityLevels: [ { level, label:{en,sq}, min, max } ],
  domains: [
    {
      id: "governance",
      title: { en, sq },
      questions: [
        {
          id: "Q1",
          kind: "standard" | "new" | "custom",
          threatIndicator: 1..5,
          weight: number,                 // tunable; seeded per §5
          critical: true|false,           // flags critical controls for summary
          text: { en, sq },
          goodPractice: { en: [..], sq: [..] },
          followUp: { en, sq },
          references: { iso27001, iso27002, nis2, cis, other? }
        }
      ],
      customSlots: 2
    }
  ]
}
```

A `templates/schema.json` (JSON Schema) formally describes this structure; a
test validates every registered template against it so authoring errors
(missing language key, malformed references, bad ids) fail in CI, not at runtime.

### Assessment (per assessment — saved / exported)

```js
Assessment = {
  schemaVersion: 1,
  templateId: "infosec-iso27001",
  templateVersion: "1.0.0",
  meta: { clientName, assessorName, date, notes },
  language: "en",
  answers: {
    "Q1": {
      status: "compliant|partial|non-compliant|na|unanswered",
      partialPercent: 50,              // used only when status === "partial"
      naReason: "",                    // required-ish when status === "na" (SoA)
      evidence: "free text",
      remediation: { owner: "", targetDate: "", status: "planned|in-progress|remediated|none" }
    }
  },
  domainNarratives: { "governance": "" },   // assessor findings per domain (PDF)
  customQuestions: {
    "governance": [
      { text:"", references:"", status:"...", partialPercent, naReason, evidence:"",
        remediation:{...} }
    ]
  }
}
```

Answer state is separate from templates so templates stay pristine, export files
stay small, and each assessment records the template version it was taken
against (for the migration strategy in §9).

## 5. Scoring, maturity & compliance summary

All tunable numbers live in template data, not code.

1. **Status → value:** Compliant `1.0` · Partial `partialPercent/100`
   (default 0.5) · Non-compliant `0.0` · N/A excluded · Unanswered excluded from
   the math **but** counted toward completeness and flagged.
2. **Per-question weight:** `weight × threatIndicator`. Weights are seeded from
   the questionnaire's threat indicators and editable in template data; domain-
   informed tuning is supported (a higher-criticality control can carry more
   weight) without code changes.
3. **Per-domain score** (0–100%) = `Σ(value × weight × threat) / Σ(weight ×
   threat)` over *scored* questions in the domain.
4. **Overall score** = same formula across all scored questions.
5. **Maturity level (1–5)** from the overall score via `maturityLevels` bands
   (Initial → Optimized), labels translatable.
6. **Compliance summary** (always shown beside maturity, because auditors speak
   ISO/NIS2 not CMMI): counts of Compliant / Partial / Non-compliant / N/A /
   Unanswered, and a list of **critical gaps** (questions flagged `critical`
   that are Non-compliant or Partial).
7. **Completeness is always surfaced.** The headline never shows a bare score:
   it always pairs it with "X of N answered" and the unanswered count, so a
   partial assessment cannot read as a finished one.
8. **Severity-ranked recommendations:** every Partial/Non-compliant item →
   a recommendation sorted by `threatIndicator` then `weight`, each citing its
   ISO 27001 / ISO 27002 / NIS2 / CIS reference and including its remediation
   owner/date/status if set.

## 6. Visuals & output

- **Radar chart** of the 8 domain scores.
- **Doughnut chart** of status breakdown.
- **Maturity gauge/badge** (level 1–5) shown with the compliance summary.
- **PDF export** (jsPDF; charts via `toDataURL()`, no html2canvas): metadata,
  charts, per-domain scores, maturity + compliance summary, domain narratives,
  and the severity-ranked recommendation/remediation table. When a machine-draft
  language (e.g. `sq`) is active, the PDF header carries a translation
  disclaimer.
- **CSV gap / SoA export:** one row per question — Control reference, Applicable
  (Y/N from N/A), Status, Partial %, Justification/Reason, Evidence, Threat,
  Remediation owner/date/status — so findings drop straight into a Statement of
  Applicability or a NIS2 Art. 21 evidence file.
- **JSON export/import:** download the `Assessment`; re-import via
  `<input type="file">` + `FileReader` (works under `file://`), validated on
  import (§10).

## 7. Landing page (`index.html`)

A simple, self-contained marketing/home page (same vanilla stack, no build):

- **Hero:** name + one-line description (consultant's diagnostic tool mapped to
  ISO/IEC 27001:2022, ISO/IEC 27002:2022, NIS2, CIS Controls v8) and a primary
  **Start assessment** button linking to `app.html`.
- **What it does:** short sections — the 8 domains / 38 questions, multilingual
  (EN/SQ), scoring + maturity + compliance summary, severity-ranked
  recommendations, remediation tracking, and PDF/CSV/JSON export.
- **How it works / privacy:** runs entirely in your browser, no account, no data
  leaves the device; **Save** exports a JSON file you keep, and you can re-import
  it any time to continue.
- **Free & open source:** a prominent statement that the tool is **free and open
  source (MIT)**, with a **GitHub repository link** (and "view source /
  contribute"). The repo link and MIT/free statement also appear in a shared
  **footer** on both the landing page and the app.
- Localised in EN/SQ via the same i18n layer.

## 8. App UI flow (`app.html`)

1. **Start:** choose a template (registry-driven) + enter metadata (client,
   assessor, date).
2. **Language toggle:** EN / SQ, live; machine-draft banner when `sq` is active.
3. **Questionnaire:** sidebar of 8 domains with live progress + completeness;
   each question shows headline text, the "good practice" checklist, the
   follow-up prompt, an evidence box, status radios, a partial-% field (when
   Partial), an N/A reason field (when N/A), and remediation owner/date/status.
   Each domain also has a **narrative box** and its 2 "Add your own" slots.
4. **Dashboard:** charts + maturity + compliance summary + severity-ranked
   recommendations/remediation.
5. **Save / Export:** the primary **Save** button **exports the assessment to a
   JSON file** (the user's durable copy), and **Import** loads one back to
   continue. PDF and CSV exports are also available. In parallel, the app
   autosaves to localStorage when available; if it is blocked, the in-memory
   banner reminds the user that Save (JSON export) is the way to keep work.
6. A shared **footer** shows the GitHub repo link and the "free & open source
   (MIT)" statement.

## 9. Albanian content

v1 Albanian (`sq`) is **machine-drafted, flagged for professional review**:
`translationStatus.sq = "machine-draft"`, a visible in-app banner when `sq` is
active, and a disclaimer in the PDF header. Missing translations fall back to
English so nothing renders blank.

## 10. Import validation & version-mismatch strategy

On import, `storage.js`:

1. Parses JSON; on parse failure shows a clear error and keeps current state.
2. Validates against the `Assessment` shape; rejects clearly malformed files.
3. Compares `templateId`/`templateVersion` to the loaded template:
   - **Match:** load directly.
   - **Same template, different version:** load by **matching question `id`s**;
     answers for ids still present are kept; answers for **removed** ids are
     preserved in an `orphaned` bucket (never silently dropped) and surfaced;
     **new** ids appear as Unanswered. A non-blocking notice explains what
     changed.
   - **Unknown template id:** load read-only if possible, else refuse with a
     clear message — never partial-corrupt the live state.

`schemaVersion` bumps follow the same rule with explicit, documented migrations.

## 11. Testing

- **scoring.js** unit tests: status→value (incl. partial %), N/A exclusion,
  unanswered completeness, domain/overall aggregation, maturity banding,
  compliance-summary counts + critical gaps, recommendation ordering.
- **storage.js**: export→import round-trip equality; version-mismatch handling
  (kept/orphaned/new); malformed-file rejection.
- **i18n.js**: fallback chain (requested → en → empty).
- **schema**: every registered template validates against `schema.json`.
- **Runner:** `tests/runner.html` (no build) plus a tiny `require` shim so the
  same pure modules can run under a no-build node test invocation; **CI**
  (GitHub Actions) runs tests + template validation on every PR. (No
  `node --test`/ES-module dependency — keeps the zero-build guarantee.)
- **Manual smoke checklist:** open `index.html` from `file://`; answer
  questions; switch language; check completeness + compliance summary; export
  JSON; re-import; export PDF and CSV; confirm it all works **offline** (vendored
  libs, no network); verify localStorage-blocked fallback banner on Safari.

## 12. Documentation & open-source essentials (in scope)

- **README:** intro, screenshot, **live demo link
  (https://assessment.obsidiancorps.com)**, quick start (double-click + hosted),
  browser-support matrix, a11y statement, privacy note, "free & open source
  (MIT)" statement, deploy-it-yourself (Docker/Dokploy) pointer.
- **CONTRIBUTING.md:** how to author a new template (with the schema), how to add
  a language, the vendoring/refresh process + pinned versions, PR flow.
- **docs/PRIVACY.md:** assessments may contain client-confidential data; it is
  stored unencrypted in localStorage and exported as unencrypted JSON; no data
  leaves the browser; retention/deletion guidance and GDPR disclaimer.
- **docs/SCORING.md:** worked example + `docs/examples/assessment.json`.
- **Browser support matrix:** Chrome/Edge 90+, Firefox 88+, Safari 14+ (with the
  `file://` localStorage caveat documented).

## 13. Out of scope for v1 (YAGNI / deferred)

- Backend, accounts, multi-user, server-side storage.
- Build tooling / bundler / npm-install-to-run.
- Additional templates beyond the InfoSec questionnaire (registry supports them;
  none authored in v1).
- **Evidence file attachments** (base64 in JSON) — deferred (export bloat).
- **Audit trail / change log** of answer edits — deferred.
- **Control inter-dependency warnings**, **bulk evidence import**, **per-
  assessment weight-tuning UI**, **translation-SaaS (Weblate/Crowdin) workflow**
  — deferred; the data-driven design leaves room for all of them later.
- Professional FR/DE/SQ translation (structure supports them; EN is
  authoritative, SQ is a flagged machine draft).

## 14. Deployment (Dokploy @ assessment.obsidiancorps.com)

The official instance is hosted at **https://assessment.obsidiancorps.com** via
**Dokploy**, but nothing about the app depends on the host — it is the same
static files.

- **`deploy/Dockerfile`:** `nginx:alpine` serving the repository's static files
  from `/usr/share/nginx/html` (copies `index.html`, `app.html`, `assets/`,
  `templates/`). No build stage — files are copied as-is.
- **`deploy/nginx.conf`:** sane static serving — `index.html` as root, long
  cache for `assets/` and `templates/`, no-cache for the HTML entry points, and
  security headers (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, a conservative `Content-Security-Policy` consistent with the
  vendored-local, no-CDN runtime). gzip enabled.
- **`deploy/docker-compose.yml`:** a single `web` service Dokploy can deploy.
  TLS and the `assessment.obsidiancorps.com` subdomain routing are handled by
  **Dokploy's built-in proxy (Traefik)** — documented via labels/host rule, with
  HTTPS/Let's Encrypt termination at the proxy. The container itself just serves
  HTTP on port 80.
- **CSP note:** because there is **no runtime CDN**, the CSP can be strict
  (`default-src 'self'`), which is both a security win and a guarantee the
  offline/`file://` behaviour matches the hosted behaviour.
- README documents the one-command local run (`docker compose -f
  deploy/docker-compose.yml up`) and the Dokploy setup steps for re-deployers.

## 15. Deferred / open decisions

- Exact machine-drafted Albanian wording to be human-reviewed later.
- Default weights: seeded from threat indicators with weight 1; tunable in
  template data. (Original 32-question scoring numbers were unavailable; chosen
  values are sensible and adjustable.)
