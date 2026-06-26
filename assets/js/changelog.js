(function () {
  'use strict';

  window.OBS_CHANGELOG = [
    {
      version: '1.4.0',
      date: '2026-06-26',
      changes: [
        'Security: a locked encrypted draft is never silently overwritten with plaintext; draft encryption now uses 600,000 PBKDF2 iterations and requires an 8+ character password',
        'Security: hardened Content-Security-Policy, added HSTS and Permissions-Policy headers, and recorded integrity hashes for the bundled libraries',
        'Accessibility: chart descriptions for screen readers, full keyboard tab navigation, reduced-motion support, stronger colour contrast, and clearer disabled/focus states',
        'Mobile: domain navigation and all toolbar actions (Import / Export / Encrypt) now stay reachable on small screens',
        'Fixed the maturity rating for scores on a band boundary; CSV export now includes custom questions',
        'The draft-encryption dialogs and all remaining interface text are now fully translated (EN/SQ)'
      ]
    },
    {
      version: '1.3.0',
      date: '2026-06-26',
      changes: [
        'Assessment expanded to 58 questions — broader ISO/IEC 27001:2022 Annex A coverage: change management, secure protocols (TLS), web filtering, high availability, threat intelligence, secure acquisition, software inventory, environmental controls, project security, secured communications, authority liaison, and intrusion detection',
        'Encryption setup is now available directly from the header toolbar'
      ]
    },
    {
      version: '1.2.0',
      date: '2026-06-26',
      changes: [
        'Optional password encryption for the browser-saved draft (AES-GCM)',
        'Changelog added to the home page',
        'Privacy notice page now ships in the deployment'
      ]
    },
    {
      version: '1.1.0',
      date: '2026-06-26',
      changes: [
        'In-app template editor: create, edit, import and export assessment templates',
        'Full interface translation — the EN/SQ toggle now translates the entire UI, not just questions',
        '8 new questions added (46 total): security logging, email security, cloud, data-leakage prevention, identity management, evidence/forensics, management oversight, disciplinary process',
        'Enhanced dashboard: threat-weighted risk, framework coverage, per-domain drill-down, prioritised gaps',
        'Professional PDF report with full per-domain detail, logo, and a choose-what-to-export option',
        'Privacy notice page and a localStorage/privacy banner',
        'Security: CSV export hardened against spreadsheet formula injection'
      ]
    },
    {
      version: '1.0.0',
      date: '2026-06-26',
      changes: [
        'Initial release — Information Security Assessment mapped to ISO/IEC 27001:2022, ISO/IEC 27002:2022, NIS2, and CIS Controls v8',
        'Scoring, maturity rating, compliance summary and severity-ranked recommendations',
        'English and Albanian, JSON / PDF / CSV export, runs entirely in your browser (no account, no backend)'
      ]
    }
  ];
}());
