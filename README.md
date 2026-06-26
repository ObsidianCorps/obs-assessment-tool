# OBS Assessment Tool

A zero-install, zero-dependency information security assessment tool for consultants. Open a single HTML file in any modern browser and start evaluating a client's security posture against ISO/IEC 27001:2022, ISO/IEC 27002:2022, NIS2, and CIS Controls v8 — with no server, no account, and no network connection required.

**Free and open source — [MIT License](LICENSE)**
Repository: <https://github.com/ObsidianCorps/obs-assessment-tool>
Live demo: <https://assessment.obsidiancorps.com>

---

## Quick start

### Double-click (offline, zero install)

1. Download or clone the repository.
2. Open `app.html` directly in your browser (or open `index.html` for the landing page first).
3. There is no build step and no `npm install` — the tool works from `file://` on Windows, macOS, and Linux.

> **Safari + file://** — Safari may block `localStorage` under the `file://` protocol. The app detects this and warns you; use the export button to save your work as JSON and re-import it in a later session.

### Self-hosted (static files)

Copy the repository root to any web server or CDN. Every asset is static; there is no server-side logic.

### Docker / Dokploy

```bash
docker compose -f deploy/docker-compose.yml up
```

The container serves the tool over HTTP via nginx. Adjust the port in `deploy/docker-compose.yml` as needed. For Dokploy deployments see `deploy/nginx.conf` for the full server block.

---

## Features

- **58 questions across 8 domains** — Governance, People, Third-party, Physical, Identity & access, Network, Data protection, Incident response
- **Multi-framework alignment** — ISO/IEC 27001:2022, ISO/IEC 27002:2022, NIS2 Directive (EU 2022/2555), CIS Controls v8
- **Weighted scoring** — per-question threat indicator × weight; N/A answers are excluded from the denominator
- **Maturity bands** — Initial → Developing → Defined → Managed → Optimized (five levels, score 0–100)
- **Severity-ranked recommendations** — gaps sorted by threat × weight
- **Domain narratives** — free-text commentary per domain
- **Custom questions** — add up to 2 per domain
- **Optional draft encryption** — protect the browser-saved draft with a password (PBKDF2 + AES-GCM 256-bit); off by default
- **PDF export** — branded report with logo, assessor name, and agency
- **JSON save/import** — resume any assessment later; portable between devices
- **CSV export** — gap analysis and Statement of Applicability (includes custom questions)
- **Multilingual** — English (en) + Albanian (sq, machine-draft); additional languages can be added (see [CONTRIBUTING.md](CONTRIBUTING.md))
- **Fully offline** — Chart.js 4.5.1 and jsPDF 4.2.1 are vendored; no CDN call at runtime

---

## Browser support

| Browser        | Minimum version | Notes                                                   |
|----------------|-----------------|---------------------------------------------------------|
| Chrome         | 90+             | Full support                                            |
| Edge           | 90+             | Full support                                            |
| Firefox        | 88+             | Full support                                            |
| Safari         | 14+             | `localStorage` blocked under `file://`; app warns and falls back to export |

---

## Accessibility

The tool targets **WCAG 2.1 Level AA** compliance. Keyboard navigation, ARIA landmarks, labelled form controls, and sufficient colour contrast are applied throughout. If you encounter an accessibility issue, please open an issue on GitHub.

---

## Privacy

Assessment files may contain client-confidential data. The tool has **no backend, no analytics, and makes no network requests at runtime** — everything stays on your device.

- By default the draft is stored unencrypted in browser `localStorage` while a session is in progress. You can optionally enable **draft encryption** (a password-derived AES-GCM key) so the saved draft is encrypted at rest — if you forget the password the draft is unrecoverable.
- Exported JSON, CSV and PDF files are unencrypted regardless of the draft-encryption setting; handle them as confidential documents.
- Deleting your data means clearing browser storage and deleting any exported files.

See [docs/PRIVACY.md](docs/PRIVACY.md) for full details and GDPR guidance.

---

## Scoring

Scores are computed as a weighted average: `Σ(value × weight × threatIndicator) / Σ(weight × threatIndicator) × 100`, where `N/A` answers are excluded from both numerator and denominator.

See [docs/SCORING.md](docs/SCORING.md) for a worked example.

---

## Running tests

```bash
node tests/run.js
```

Validate all registered templates:

```bash
node templates/validate-cli.js
```

Both commands exit non-zero on failure. Run them before every pull request.

---

## Repository layout

```
app.html                   # Assessment tool (entry point)
index.html                 # Landing page
assets/
  js/
    app.js                 # Main application logic
    scoring.js             # Scoring and maturity engine
    storage.js             # localStorage + JSON import/export
    i18n.js                # Internationalisation helpers
    validate.js            # Template schema validator
    vendor/
      chart.umd.min.js     # Chart.js 4.5.1 (vendored)
      jspdf.umd.min.js     # jsPDF 4.2.1 (vendored)
      README.md            # Vendor refresh instructions
templates/
  infosec-iso27001.js      # Default template
  registry.js              # Template registration
  schema.json              # Template JSON schema
  validate-cli.js          # CLI validator for templates
tests/
  run.js                   # Test suite
deploy/
  Dockerfile
  nginx.conf
  docker-compose.yml
docs/
  PRIVACY.md
  SCORING.md
  examples/
    assessment.json        # Example exported assessment
```

---

## License

[MIT](LICENSE) — © Obsidian Corps
