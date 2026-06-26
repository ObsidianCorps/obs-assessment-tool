# Privacy Notice

## What data the tool handles

The OBS Assessment Tool is designed for use by consultants conducting information security assessments. The data you enter may include:

- Your client's name, industry, and contact details
- Your name, agency, and contact details
- Answers to security-posture questions, which may reveal sensitive information about your client's security controls, vulnerabilities, and risk profile
- Free-text notes, narratives, and remediation plans

This is client-confidential information. Treat exported files accordingly.

---

## Where data is stored

**All data stays on your device.** The tool has no backend, no user accounts, no analytics, and makes no network requests at runtime. The vendored libraries (Chart.js, jsPDF) are loaded from your local disk, not from a CDN.

Data is held in two places:

| Location | When | Format |
|---|---|---|
| Browser `localStorage` | While a session is in progress (auto-save draft) | Unencrypted JSON |
| Exported `.json` file | When you use the Export button | Unencrypted JSON |

---

## Risks to be aware of

- **localStorage is unencrypted.** Anyone with access to your browser profile — including other users of a shared workstation — can read the stored draft.
- **Exported JSON files are unencrypted.** Treat them like any other confidential document: restrict access, do not share over unencrypted channels, and store them according to your organisation's data handling policy.
- **PDF and CSV exports are also unencrypted.** Apply the same handling rules.

---

## How to delete your data

| What to delete | How |
|---|---|
| Draft in the browser | Clear `localStorage` for the tool's origin in your browser's privacy or developer settings, or use the **Clear** button inside the app |
| Exported files | Delete the `.json`, `.pdf`, or `.csv` files from your file system and empty your trash |

---

## Retention guidance

- Do not store assessment files on a shared drive or collaboration platform unless access is restricted to authorised personnel.
- Delete drafts from the browser after completing each engagement.
- Retain exported files only for as long as required by your contractual obligations or applicable retention rules.
- Apply the same retention schedule to PDF and CSV exports.

---

## GDPR note

If your assessment includes personal data (names, job titles, contact details of your client's staff), you — the consultant — are the **data controller** for that personal data.

Responsibilities this creates:

- Ensure you have a lawful basis for processing the personal data you enter (typically a contractual or legitimate-interest basis tied to the engagement).
- Inform the individuals whose data you process, in line with GDPR Articles 13/14.
- Do not retain personal data beyond the purpose for which it was collected.
- Apply appropriate technical and organisational measures to protect the data (see the risk notes above).

The tool itself is a data-processing tool; Obsidian Corps does not process any data you enter into it.

---

## Questions

For questions about this notice, contact [philippe.parage@obsidiancorps.com](mailto:philippe.parage@obsidiancorps.com).
