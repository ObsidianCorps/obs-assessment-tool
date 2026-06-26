# Vendored JavaScript Libraries

This directory contains pinned versions of third-party JavaScript libraries bundled locally for offline availability and deterministic builds.

## Included Libraries

### Chart.js 4.4.1
- **Source URL:** https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
- **Global:** `window.Chart`
- **File:** `chart.umd.min.js`

### jsPDF 2.5.1
- **Source URL:** https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js
- **Global:** `window.jspdf`
- **File:** `jspdf.umd.min.js`

## Refresh Command

To update these libraries to the latest versions (or re-download the current pinned versions), run:

```bash
curl -L -o assets/js/vendor/chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
curl -L -o assets/js/vendor/jspdf.umd.min.js https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js
```

To upgrade to different versions, update the version numbers in both the URLs and this README.
