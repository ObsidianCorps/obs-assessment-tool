# Vendored libraries

These libraries are bundled locally (not loaded from a CDN at runtime) so the
tool works fully offline and deterministically, including when opened directly
from `file://`. Versions are pinned; update them deliberately.

| Library  | Version | File                  | Source                                                              |
|----------|---------|-----------------------|--------------------------------------------------------------------|
| Chart.js | 4.5.1   | `chart.umd.min.js`    | https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js   |
| jsPDF    | 4.2.1   | `jspdf.umd.min.js`    | https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js      |
| jspdf-autotable | 5.0.8 | `jspdf.plugin.autotable.min.js` | https://cdn.jsdelivr.net/npm/jspdf-autotable@5.0.8/dist/jspdf.plugin.autotable.min.js |

Both are the latest releases as of June 2026.

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
