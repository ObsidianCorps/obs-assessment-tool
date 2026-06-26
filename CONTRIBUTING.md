# Contributing

## Contents

- [Adding a template](#adding-a-template)
- [Adding a language](#adding-a-language)
- [Updating vendored libraries](#updating-vendored-libraries)
- [Pull request workflow](#pull-request-workflow)

---

## Adding a template

Templates live in `templates/`. The built-in template is `templates/infosec-iso27001.js`; use it as your starting point.

### Step-by-step

1. **Copy** the existing template:

   ```bash
   cp templates/infosec-iso27001.js templates/my-new-template.js
   ```

2. **Edit** the new file. Key fields at the top of the template object:

   | Field             | Required | Notes                                                     |
   |-------------------|----------|-----------------------------------------------------------|
   | `id`              | yes      | Unique snake-case string, e.g. `"my-new-template"`        |
   | `version`         | yes      | Semantic version string, e.g. `"1.0.0"`                   |
   | `title`           | yes      | Object keyed by language code: `{ en: "..." }`            |
   | `description`     | yes      | Object keyed by language code                             |
   | `languages`       | yes      | Array of supported language codes, e.g. `["en"]`          |
   | `frameworks`      | yes      | Array of framework name strings                           |
   | `maturityLevels`  | yes      | Five bands, `min`/`max` covering 0–100                    |
   | `domains`         | yes      | Array of domain objects (see schema)                      |

   Each domain contains a `questions` array. Every question must include `id`, `kind`, `threatIndicator`, `weight`, `critical`, `text`, `goodPractice`, and `references`. Refer to `templates/schema.json` for the full schema definition.

3. **Register** the template. Templates are self-registering: each template file has an IIFE footer (like `infosec-iso27001.js`) that adds itself to `window.OBS_TEMPLATES`. You just need to load it:

   - **For the browser:** Edit `app.html` and add a `<script>` tag right after the existing `<script src="templates/infosec-iso27001.js"></script>` line:
   
     ```html
     <script src="templates/my-new-template.js"></script>
     ```
   
   - **For CI validation:** Edit `templates/validate-cli.js` and add a `require()` line after the existing `require('./infosec-iso27001.js');` line:
   
     ```js
     require('./my-new-template.js');
     ```
   
   - **For test coverage (optional):** Edit `tests/template.test.js` (or create a new test file) and add:
   
     ```js
     require('../templates/my-new-template.js');
     ```

4. **Validate**:

   ```bash
   node templates/validate-cli.js
   ```

   The validator enforces schema coverage, language completeness, and maturity-level range exhaustiveness. Fix all reported errors before proceeding.

5. **Run tests**:

   ```bash
   node tests/run.js
   ```

6. Open a pull request. CI runs both commands above; all checks must pass.

---

## Adding a language

Languages are per-template. To add a new language (e.g. French `fr`) to an existing template:

1. Add the language code to the template's `languages` array:

   ```js
   languages: ['en', 'fr'],
   ```

2. For **every** translatable field in the template — `title`, `description`, `maturityLevels[*].label`, `domains[*].title`, `questions[*].text`, `questions[*].goodPractice`, `questions[*].followUp` — add the new language key alongside the existing ones:

   ```js
   title: { en: 'Information Security Assessment', fr: 'Évaluation de la sécurité de l\'information' },
   ```

3. Run the validator to confirm all fields are covered:

   ```bash
   node templates/validate-cli.js
   ```

   The validator enforces full language coverage — any missing key is reported as an error.

4. Run tests:

   ```bash
   node tests/run.js
   ```

> Machine-translated drafts are acceptable but must be clearly marked as such in the template's `translationStatus` field:
>
> ```js
> translationStatus: { fr: 'machine-draft' },
> ```

---

## Updating vendored libraries

The tool ships Chart.js, jsPDF, and jspdf-autotable locally so it works offline and under `file://`. Versions are pinned in `assets/js/vendor/README.md`.

To refresh to a new version, run the following commands from the `assets/js/vendor/` directory (update the version numbers as appropriate):

```bash
curl -L -o chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js
curl -L -o jspdf.umd.min.js  https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js
curl -L -o jspdf.plugin.autotable.min.js https://cdn.jsdelivr.net/npm/jspdf-autotable@5.0.8/dist/jspdf.plugin.autotable.min.js
```

After updating:

1. Update the version table in `assets/js/vendor/README.md` (the authoritative source for library versions: Chart.js 4.5.1, jsPDF 4.2.1, jspdf-autotable 5.0.8).
2. Smoke-test the full export flow (PDF, CSV, JSON round-trip) in Chrome, Firefox, and Safari.
3. Run `node tests/run.js`.

---

## Pull request workflow

1. Fork the repository and create a feature branch from `main`.
2. Keep each PR focused on a single concern.
3. Ensure both `node templates/validate-cli.js` and `node tests/run.js` pass locally before pushing.
4. CI runs both commands; a failing check will block the merge.
5. Describe what your change does and why in the PR body. Include any test commands you ran.
6. A maintainer will review and merge.

---

## Code style

- Vanilla JavaScript, no build step, no transpiler.
- Follow the existing module pattern (`(function(root, factory){...})(...)`) for any new JS files that need to work both in the browser and under Node.js (for tests).
- HTML and CSS: plain, semantic, no framework.
- No runtime CDN calls — any new library must be vendored.
