# Smoke and Accessibility Checklist

This checklist verifies core functionality and accessibility across browsers and features.

## Browser & Platform Compatibility

### Chrome (Desktop)
- [ ] Open `app.html` via `file://` — loads without errors
- [ ] Dashboard charts render offline
- [ ] Complete 3+ questions successfully
- [ ] Save to localStorage
- [ ] Import a previously saved assessment
- [ ] Toggle language EN ↔ SQ (SQ machine-draft banner appears when SQ selected)
- [ ] Export to CSV (file opens with reference + remediation columns visible)
- [ ] Export to PDF (file contains charts + recommendations + SQ disclaimer + logo/author/agency)

### Firefox (Desktop)
- [ ] Open `app.html` via `file://` — loads without errors
- [ ] Dashboard charts render offline
- [ ] Complete 3+ questions successfully
- [ ] Save to localStorage
- [ ] Import a previously saved assessment
- [ ] Toggle language EN ↔ SQ (SQ machine-draft banner appears when SQ selected)
- [ ] Export to CSV (file opens with reference + remediation columns visible)
- [ ] Export to PDF (file contains charts + recommendations + SQ disclaimer + logo/author/agency)

### Safari (Desktop)
- [ ] Open `app.html` via `file://` — loads without errors
- [ ] localStorage-blocked banner displays (Safari blocks file:// localStorage)
- [ ] Dashboard charts render offline (fallback if localStorage unavailable)
- [ ] Complete 3+ questions successfully (without persistent save due to localStorage block)
- [ ] Toggle language EN ↔ SQ (SQ machine-draft banner appears when SQ selected)
- [ ] Export to CSV (file opens with reference + remediation columns visible)
- [ ] Export to PDF (file contains charts + recommendations + SQ disclaimer + logo/author/agency)

## Feature Verification

### Question Flow
- [ ] All question categories load
- [ ] Selecting an answer updates the score immediately
- [ ] Switching between domains retains answers

### Bilingual Support (EN/SQ)
- [ ] EN toggle: interface displays in English
- [ ] SQ toggle: interface displays in Albanian (machine translation)
- [ ] SQ banner visible when SQ selected, alerting to machine-drafted status
- [ ] All export files (CSV, PDF) respect language selection

### Save/Import Round-Trip
- [ ] Complete assessment, click Save → localStorage entry created
- [ ] Refresh page → assessment loads from localStorage
- [ ] Export to JSON-like format, close, Import → assessment restored with all answers intact
- [ ] Scoring reflects imported state correctly

### Exports

#### CSV
- [ ] Reference column present (domain/control mappings)
- [ ] Remediation column present (guidance for each answer)
- [ ] File opens in Excel/Sheets without corruption
- [ ] All questions present and in logical order

#### PDF
- [ ] Charts (radar + doughnut) render correctly
- [ ] Recommendations section displays
- [ ] SQ disclaimer visible if SQ language selected
- [ ] Logo/author/agency footer present
- [ ] Document is printable

### Dashboard Charts (Offline Capability)
- [ ] Radar chart renders for domain scores
- [ ] Doughnut chart renders for overall assessment status
- [ ] Charts update immediately on answer changes
- [ ] No network requests required (charts work via `file://`)

## Accessibility

### Keyboard Navigation
- [ ] Tab order is logical (left-to-right, top-to-bottom)
- [ ] All controls (buttons, radio buttons, dropdowns, text inputs) are reachable via Tab/Shift+Tab
- [ ] Language toggle accessible via keyboard
- [ ] Save/Export buttons accessible via keyboard
- [ ] Import file input accessible via keyboard
- [ ] Focus does not trap (can always tab forward/backward out of any section)

### Visible Focus Indicators
- [ ] Keyboard focus shows a visible border or highlight on all interactive elements
- [ ] Focus indicator has sufficient contrast (≥ 4.5:1) against the background
- [ ] Focus state is clearly distinguishable from hover state (if applicable)
- [ ] Focus outline width ≥ 2px or equivalent visibility

### Colour Contrast
- [ ] All text meets WCAG AA minimum 4.5:1 contrast ratio
  - [ ] Body text vs. background
  - [ ] Labels vs. background
  - [ ] Button text vs. button background
  - [ ] Links vs. background
  - [ ] Question text vs. background
- [ ] Chart elements (radar, doughnut) use sufficient colour contrast in exported PDF
- [ ] Warning/error messages (localStorage banner) readable with 4.5:1+ contrast
- [ ] Placeholder text (if any) meets 3:1 minimum for graphics/UI components

### ARIA & Semantics
- [ ] Headings use proper `<h1>`, `<h2>` structure (no skipped levels)
- [ ] Form labels associated with inputs via `for`/`id` or wrapped `<label>` tags
- [ ] Radio button groups have `role="group"` and `aria-label` or `<fieldset>` + `<legend>`
- [ ] Buttons have accessible text (no empty buttons)
- [ ] Language selector properly labeled (aria-label or visible label)
- [ ] Charts have `role="img"` and descriptive `aria-label` (fallback text)
- [ ] Modals/overlays (if any) have `role="dialog"`, `aria-label`, and trap focus
- [ ] localStorage banner dismissible and announced to screen readers

### Screen Reader Support
- [ ] App title/heading announced on page load
- [ ] Questions and answers announced correctly
- [ ] Score/results announced when updated
- [ ] Export options announced and selectable
- [ ] Notifications (success/error) announced to screen readers

## Sign-Off

- **Tester Name:** ________________
- **Date:** ________________
- **Browsers/Versions Tested:** ________________
- **Any Failures or Issues:** ________________
- **All Checks Passed:** [ ] Yes [ ] No

If any check fails, file an issue with the failing item, browser, and steps to reproduce.
