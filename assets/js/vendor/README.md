# Vendored libraries

These libraries are bundled locally (not loaded from a CDN at runtime) so the
tool works fully offline and deterministically, including when opened directly
from `file://`. Versions are pinned; update them deliberately.

| Library  | Version | File                  | Source                                                              |
|----------|---------|-----------------------|--------------------------------------------------------------------|
| Chart.js | 4.5.1   | `chart.umd.min.js`    | https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js   |
| jsPDF    | 4.2.1   | `jspdf.umd.min.js`    | https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js      |
| jspdf-autotable | 5.0.8 | `jspdf.plugin.autotable.min.js` | https://cdn.jsdelivr.net/npm/jspdf-autotable@5.0.8/dist/jspdf.plugin.autotable.min.js |

These are the latest releases as of June 2026.

## Integrity (SHA-256)

Verify these hashes after any download/refresh (`sha256sum <file>`) to detect
tampering. Update them deliberately whenever you bump a pinned version.

| File                              | SHA-256                                                            |
|-----------------------------------|-------------------------------------------------------------------|
| `chart.umd.min.js`                | `48444a82d4edcb5bec0f1965faacdde18d9c17db3063d042abada2f705c9f54a` |
| `jspdf.umd.min.js`                | `e6551fcdc32f09d6853b2c5126d18d01d9447e0da618a41a11ebeee0f6c20d54` |
| `jspdf.plugin.autotable.min.js`   | `a65dff2c6a8296b16aff24e69f7683cd7dbaed4a4ec26b507d6840ee27d54649` |

- **Chart.js** ships as the all-in-one UMD bundle, which auto-registers every
  controller/element — use `new Chart(ctx, config)` directly (no `Chart.register`).
- **jsPDF** UMD exposes the constructor as `window.jspdf.jsPDF`.

## Refresh / update

Re-download the pinned versions (bump the version in the URL to upgrade, then
update the table above):

```bash
curl -L -o chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js
curl -L -o jspdf.umd.min.js https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js
curl -L -o jspdf.plugin.autotable.min.js https://cdn.jsdelivr.net/npm/jspdf-autotable@5.0.8/dist/jspdf.plugin.autotable.min.js
```
