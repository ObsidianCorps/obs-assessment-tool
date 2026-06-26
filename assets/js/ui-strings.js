(function (root, factory) {
  'use strict';
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.ui = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  /* ── All UI chrome strings — EN + SQ ──────────────────────────── */
  /* ISO, NIS2, CIS, GDPR, MFA and other standard acronyms preserved. */
  /* sq: machine-draft quality; pending native review.                 */
  var UI_STRINGS = {

    // ── Tab navigation ──────────────────────────────────────────────
    'tab.start':              { en: 'Start',                   sq: 'Fillimi' },
    'tab.questionnaire':      { en: 'Questionnaire',            sq: 'Pyetësor' },
    'tab.dashboard':          { en: 'Dashboard',               sq: 'Paneli' },
    'tab.editor':             { en: 'Template editor',         sq: 'Redaktues shablloni' },

    // ── Toolbar buttons ─────────────────────────────────────────────
    'btn.save':               { en: 'Save (JSON)',         sq: 'Ruaj (JSON)' },
    'btn.import':             { en: 'Import',                   sq: 'Importo' },
    'btn.exportPdf':          { en: 'Export PDF',          sq: 'Eksporto PDF' },
    'btn.exportCsv':          { en: 'Export CSV',          sq: 'Eksporto CSV' },
    'btn.encrypt':            { en: 'Encrypt',                 sq: 'Enkripto' },

    // ── Banners ─────────────────────────────────────────────────────
    'banner.sqDraft':         { en: 'ℹ The Albanian (Shqip) version of this template is a machine-generated draft and may contain inaccuracies. Verify against the English original before use.',
                                sq: 'ℹ Versioni shqip i këtij shablloni është hartuar automatikisht dhe mund të përmbajë pasaktësi. Verifikoni ndaj origjinalit anglisht para përdorimit.' },
    'banner.noStorage':       { en: '⚠ Local storage is unavailable in your browser. Progress cannot be auto-saved. Consider using a different browser or checking your privacy settings.',
                                sq: '⚠ Ruajtja lokale nuk është e disponueshme në shfletuesin tuaj. Progresi nuk mund të ruhet automatikisht. Konsideroni një shfletues tjetër ose kontrolloni cilësimet e privatësisë.' },
    'btn.resume':             { en: 'Resume',                   sq: 'Vazhdo' },
    'btn.startFresh':         { en: 'Start fresh',              sq: 'Fillo nga e para' },

    // ── Start form ──────────────────────────────────────────────────
    'start.h1':               { en: 'New Assessment',           sq: 'Vlerësim i Ri' },
    'start.desc':             { en: 'Fill in the details below, select a template, then click Begin assessment. Progress is saved automatically.',
                                sq: 'Plotësoni detajet më poshtë, zgjidhni një shabllon, pastaj klikoni Fillo vlerësimin. Progresi ruhet automatikisht.' },
    'start.sectionDetails':   { en: 'Assessment details',       sq: 'Detajet e vlerësimit' },
    'start.clientName':       { en: 'Client / Organisation name', sq: 'Emri i klientit / organizatës' },
    'start.assessorName':     { en: 'Assessor name',            sq: 'Emri i vlerësuesit' },
    'start.agency':           { en: 'Agency / organisation',    sq: 'Agjencia / organizata' },
    'start.date':             { en: 'Assessment date',          sq: 'Data e vlerësimit' },
    'start.sectionLogo':      { en: 'Report logo (optional)',   sq: 'Logo e raportit (opsionale)' },
    'start.uploadLogo':       { en: 'Upload logo (PNG or JPEG)', sq: 'Ngarko logo (PNG ose JPEG)' },
    'start.removeLogo':       { en: 'Remove logo',              sq: 'Hiq logon' },
    'start.logoHint':         { en: 'The logo will appear in the header of exported PDF reports.',
                                sq: 'Logo do të shfaqet në krye të raporteve PDF të eksportuara.' },
    'start.accentColor':      { en: 'Report accent colour (optional)', sq: 'Ngjyra theksuese e raportit (opsionale)' },
    'start.useDefault':       { en: 'Use default',              sq: 'Përdor të parazgjedhurën' },
    'start.colorHint':        { en: 'Sets the accent colour in exported PDF reports. Leave as default (navy) if unsure.',
                                sq: 'Cakton ngjyrën theksuese në raportet PDF të eksportuara. Lëjeni si të parazgjedhur (kaltër e errët) nëse nuk jeni i sigurt.' },
    'start.sectionTemplate':  { en: 'Template',                 sq: 'Shabllon' },
    'start.templateLabel':    { en: 'Assessment template',      sq: 'Shabllon vlerësimi' },
    'start.begin':            { en: 'Begin assessment',         sq: 'Fillo vlerësimin' },

    // ── Questionnaire sidebar / placeholders ────────────────────────
    'q.domains':              { en: 'Domains',                  sq: 'Fushat' },
    'q.progress':             { en: 'Progress',                 sq: 'Progresi' },
    'q.placeholder':          { en: 'Select a template and click Begin assessment to start.',
                                sq: 'Zgjidhni një shabllon dhe klikoni Fillo vlerësimin për të filluar.' },

    // ── Dashboard placeholder ───────────────────────────────────────
    'dash.placeholder':       { en: 'Complete the questionnaire to view the dashboard.',
                                sq: 'Plotësoni pyetësorin për të parë panelin.' },

    // ── PDF options dialog ──────────────────────────────────────────
    'pdfopts.title':          { en: 'PDF export options',       sq: 'Opsionet e eksportimit PDF' },
    'pdfopts.summary':        { en: 'Executive summary',        sq: 'Përmbledhje ekzekutive' },
    'pdfopts.charts':         { en: 'Charts',                   sq: 'Grafikë' },
    'pdfopts.recommendations': { en: 'Findings & recommendations', sq: 'Gjetje & rekomandime' },
    'pdfopts.details':        { en: 'Detailed answers & evidence/notes', sq: 'Përgjigje të detajuara & dëshmi/shënime' },
    'pdfopts.narratives':     { en: 'Domain narratives',        sq: 'Narrativat e fushave' },
    'pdfopts.generate':       { en: 'Generate PDF',             sq: 'Gjenero PDF' },
    'pdfopts.cancel':         { en: 'Cancel',                   sq: 'Anulo' },

    // ── Question card (dynamically rendered) ────────────────────────
    'q.critical':             { en: 'Critical',                 sq: 'Kritike' },
    'q.goodPractice':         { en: 'What good practice looks like', sq: 'Si duket praktika e mirë' },
    'q.followUp':             { en: 'Follow-up: ',              sq: 'Vijues: ' },
    'q.partialPct':           { en: 'Partial compliance (%)',   sq: 'Pajtueshmëri e pjesshme (%)' },
    'q.naReason':             { en: 'Reason for N/A',           sq: 'Arsyeja e N/A' },
    'q.evidence':             { en: 'Evidence / notes',         sq: 'Dëshmi / shënime' },
    'q.status':               { en: 'Status',                   sq: 'Statusi' },

    // ── Status labels (shared between questionnaire, dashboard, PDF) ─
    'status.compliant':       { en: 'Compliant',                sq: 'Konform' },
    'status.partial':         { en: 'Partial',                  sq: 'Pjesërisht' },
    'status.nonCompliant':    { en: 'Non-compliant',            sq: 'Jo-konform' },
    'status.na':              { en: 'N/A',                      sq: 'N/A' },
    'status.unanswered':      { en: 'Unanswered',               sq: 'Pa përgjigje' },

    // ── Remediation section ─────────────────────────────────────────
    'rem.heading':            { en: 'Remediation',              sq: 'Korrigjim' },
    'rem.owner':              { en: 'Owner',                    sq: 'Pronari' },
    'rem.targetDate':         { en: 'Target date',              sq: 'Data e synuar' },
    'rem.status':             { en: 'Status',                   sq: 'Statusi' },
    'rem.none':               { en: '— None —',       sq: '— Asnjë —' },
    'rem.planned':            { en: 'Planned',                  sq: 'Planifikuar' },
    'rem.inProgress':         { en: 'In progress',              sq: 'Në progres' },
    'rem.remediated':         { en: 'Remediated',               sq: 'Korrigjuar' },

    // ── Custom question card ────────────────────────────────────────
    'cq.badge':               { en: 'Custom',                   sq: 'Personalizuar' },
    'cq.label':               { en: 'Your question',            sq: 'Pyetja juaj' },
    'cq.remove':              { en: 'Remove',                   sq: 'Hiq' },
    'cq.questionText':        { en: 'Question text',            sq: 'Teksti i pyetjes' },
    'cq.references':          { en: 'References (optional)',    sq: 'Referencat (opsionale)' },
    'cq.questionPlaceholder': { en: 'Enter your question…', sq: 'Shkruani pyetjen tuaj…' },
    'cq.refPlaceholder':      { en: 'e.g. ISO 27001 A.5.1',    sq: 'p.sh. ISO 27001 A.5.1' },
    'cq.addButton':           { en: '+ Add your own question',  sq: '+ Shtoni pyetjen tuaj' },

    // ── Narrative section ───────────────────────────────────────────
    'narr.heading':           { en: 'Assessor findings',        sq: 'Gjetjet e vlerësuesit' },
    'narr.label':             { en: 'Domain narrative (assessor summary)', sq: 'Narrativa e fushës (përmbledhje e vlerësuesit)' },

    // ── Alert / notice messages ─────────────────────────────────────
    'alert.noTemplate':       { en: 'Please select a template first.', sq: 'Ju lutem zgjidhni fillimisht një shabllon.' },
    'alert.noAssessmentSave': { en: 'No active assessment to save. Click “Begin assessment” first.',
                                sq: 'Nuk ka vlerësim aktiv për të ruajtur. Klikoni fillimisht “Fillo vlerësimin”.' },
    'alert.noAssessmentExport': { en: 'No active assessment to export.', sq: 'Nuk ka vlerësim aktiv për të eksportuar.' },
    'alert.noPdf':            { en: 'PDF export is unavailable: the PDF library failed to load.',
                                sq: 'Eksportimi PDF nuk është i disponueshëm: libraria PDF nuk u ngarkua.' },
    'alert.noCsv':            { en: 'CSV export is unavailable.',  sq: 'Eksportimi CSV nuk është i disponueshëm.' },
    'alert.importFailed':     { en: 'Import failed: ',             sq: 'Importimi dështoi: ' },
    'alert.importBadTmpl1':   { en: 'Import failed: template “', sq: 'Importimi dështoi: shablloni “' },
    'alert.importBadTmpl2':   { en: '” is not available in this version of the tool.',
                                sq: '” nuk është i disponueshëm në këtë version të mjetit.' },
    'alert.pdfError':         { en: 'Could not generate the PDF: ', sq: 'Nuk mund të gjenerohet PDF: ' },
    'alert.fileReadError':    { en: 'Could not read the selected file. Please try again.',
                                sq: 'Nuk mund të lexohet skedari i zgjedhur. Ju lutem provoni përsëri.' },

    // ── Draft banner ─────────────────────────────────────────────────
    'draft.bannerWithName':   { en: 'A saved draft for “{name}” was found. Resume where you left off, or start fresh.',
                                sq: 'Një draft i ruajtur për “{name}” u gjet. Vazhdoni nga ku e latë, ose filloni nga e para.' },
    'draft.bannerNoName':     { en: 'A saved draft was found. Resume where you left off, or start fresh.',
                                sq: 'Një draft i ruajtur u gjet. Vazhdoni nga ku e latë, ose filloni nga e para.' },

    // ── Dashboard chrome ────────────────────────────────────────────
    'dash.overview':          { en: 'Security Assessment Overview', sq: 'Pasqyrë e Vlerësimit të Sigurisë' },
    'dash.completenessLabel': { en: 'Completeness: ',             sq: 'Plotësia: ' },
    'dash.questionsAnswered': { en: ' questions answered (',      sq: ' pyetje të përgjigjetura (' },
    'dash.incomplete':        { en: 'Scores may change as more questions are completed.',
                                sq: 'Rezultatet mund të ndryshojnë ndërsa plotësohen pyetje të tjera.' },
    'dash.riskBand':          { en: 'Risk Band',                  sq: 'Brezat e Riskut' },
    'dash.bandHighRisk':      { en: 'High Risk',                  sq: 'Risk i Lartë' },
    'dash.bandModerate':      { en: 'Moderate',                   sq: 'Mesatar' },
    'dash.bandGood':          { en: 'Good',                       sq: 'Mirë' },
    'dash.bandNoData':        { en: 'No data',                    sq: 'Pa të dhëna' },
    'dash.threatRisk':        { en: 'Threat-Weighted Risk',       sq: 'Risk i Ponderuar me Kërcënim' },
    'dash.riskSubtext':       { en: 'weighted exposure — lower is better', sq: 'ekspozim i ponderuar — më i ulët është më mirë' },
    'dash.fwCoverage':        { en: 'Framework Coverage',         sq: 'Mbulimi i Kornizës' },
    'dash.statusBreakdown':   { en: 'Status Breakdown',           sq: 'Shpërndarja e Statusit' },
    'dash.scoreVis':          { en: 'Score Visualisation',        sq: 'Vizualizimi i Rezultateve' },
    'dash.domainScores':      { en: 'Domain Scores',              sq: 'Rezultatet e Fushave' },
    'dash.noScores':          { en: 'Domains with no scored answers shown as 0',
                                sq: 'Fushat pa përgjigje të vlerësuara shfaqen si 0' },
    'dash.noChartJs':         { en: 'Chart.js not available — showing scores as text.',
                                sq: 'Chart.js nuk është i disponueshëm — rezultatet shfaqen si tekst.' },
    'dash.noChartJsDoughnut': { en: 'Chart.js not available — showing counts as text.',
                                sq: 'Chart.js nuk është i disponueshëm — numërimet shfaqen si tekst.' },
    'dash.scoreDataset':      { en: 'Score (%)',                  sq: 'Rezultati (%)' },
    'dash.drillDown':         { en: 'Domain Drill-Down',          sq: 'Analizë e Thelluar e Fushave' },
    'dash.answered':          { en: 'answered',                   sq: 'të përgjigjetura' },
    'dash.gaps':              { en: 'Actionable Gaps — Prioritised Remediation',
                                sq: 'Boshllëqe të Adresueshme — Korrigjim me Prioritet' },
    'dash.noGaps':            { en: 'No gaps to remediate — all answered questions are compliant or N/A.',
                                sq: 'Nuk ka boshllëqe për korrigjim — të gjitha pyetjet e përgjigjetura janë konform ose N/A.' },
    'dash.colNum':            { en: '#',                          sq: '#' },
    'dash.colDomain':         { en: 'Domain',                    sq: 'Fusha' },
    'dash.colQuestion':       { en: 'Question',                  sq: 'Pyetja' },
    'dash.colStatus':         { en: 'Status',                    sq: 'Statusi' },
    'dash.colThreat':         { en: 'Threat',                    sq: 'Kërcënimi' },
    'dash.colRefs':           { en: 'References',                sq: 'Referencat' },
    'dash.colRem':            { en: 'Remediation',               sq: 'Korrigjimi' },
    'dash.criticalNote':      { en: '⚠ Rows highlighted in red have threat level 4–5 (critical) — address these first.',
                                sq: '⚠ Rreshtat e theksuar me të kuqe kanë nivel kërcënimi 4–5 (kritik) — adresojini këto fillimisht.' },

    // ── Editor toolbar & labels ─────────────────────────────────────
    'ed.loadFrom':            { en: 'Load from:',                sq: 'Ngarko nga:' },
    'ed.load':                { en: 'Load',                      sq: 'Ngarko' },
    'ed.validate':            { en: 'Validate',                  sq: 'Valido' },
    'ed.exportJson':          { en: 'Export JSON',               sq: 'Eksporto JSON' },
    'ed.importJson':          { en: 'Import JSON',               sq: 'Importo JSON' },
    'ed.registerUse':         { en: 'Register & use',            sq: 'Regjistro & përdor' },
    'ed.blankTemplate':       { en: '— Blank template —', sq: '— Shabllon bosh —' },
    'ed.valid':               { en: 'Template is valid — all fields and languages look good.',
                                sq: 'Shablloni është i vlefshëm — të gjitha fushat dhe gjuhët duken mirë.' },
    'ed.errorsPrefix':        { en: 'Validation errors (',       sq: 'Gabime validimi (' },
    'ed.metaSection':         { en: 'Template metadata',         sq: 'Metadatat e shabllonit' },
    'ed.templateId':          { en: 'Template ID',               sq: 'ID e shabllonit' },
    'ed.version':             { en: 'Version',                   sq: 'Versioni' },
    'ed.titleEn':             { en: 'Title (EN)',                 sq: 'Titulli (EN)' },
    'ed.titleSq':             { en: 'Title (SQ)',                 sq: 'Titulli (SQ)' },
    'ed.descEn':              { en: 'Description (EN)',           sq: 'Përshkrimi (EN)' },
    'ed.descSq':              { en: 'Description (SQ)',           sq: 'Përshkrimi (SQ)' },
    'ed.domains':             { en: 'Domains',                   sq: 'Fushat' },
    'ed.addDomain':           { en: '+ Add domain',              sq: '+ Shto fushë' },
    'ed.addQuestion':         { en: '+ Add question',            sq: '+ Shto pyetje' },
    'ed.delete':              { en: 'Delete',                    sq: 'Fshi' },
    'ed.moveUp':              { en: 'Move up',                   sq: 'Lëviz lart' },
    'ed.moveDown':            { en: 'Move down',                 sq: 'Lëviz poshtë' },
    'ed.domTitleEn':          { en: 'Domain title (EN)',          sq: 'Titulli i fushës (EN)' },
    'ed.domTitleSq':          { en: 'Domain title (SQ)',          sq: 'Titulli i fushës (SQ)' },
    'ed.questionId':          { en: 'Question ID',               sq: 'ID e pyetjes' },
    'ed.kind':                { en: 'Kind',                      sq: 'Lloji' },
    'ed.standard':            { en: 'Standard',                  sq: 'Standard' },
    'ed.custom':              { en: 'Custom',                    sq: 'Personalizuar' },
    'ed.threatIndicator':     { en: 'Threat indicator (1-5)',    sq: 'Treguesi i kërcënimit (1-5)' },
    'ed.weight':              { en: 'Weight',                    sq: 'Pesha' },
    'ed.critical':            { en: 'Critical',                  sq: 'Kritike' },
    'ed.qTextEn':             { en: 'Question text (EN)',        sq: 'Teksti i pyetjes (EN)' },
    'ed.qTextSq':             { en: 'Question text (SQ)',        sq: 'Teksti i pyetjes (SQ)' },
    'ed.goodPractice':        { en: 'Good practice (one item per line)', sq: 'Praktika e mirë (një artikull për rresht)' },
    'ed.gpEn':                { en: 'Good practice (EN)',        sq: 'Praktika e mirë (EN)' },
    'ed.gpSq':                { en: 'Good practice (SQ)',        sq: 'Praktika e mirë (SQ)' },
    'ed.followupRefs':        { en: 'Follow-up & References',    sq: 'Vijues & Referenca' },
    'ed.fuEn':                { en: 'Follow-up prompt (EN)',     sq: 'Pyetja vijuese (EN)' },
    'ed.fuSq':                { en: 'Follow-up prompt (SQ)',     sq: 'Pyetja vijuese (SQ)' },
    'ed.questionsHeading':    { en: 'Questions (',               sq: 'Pyetje (' },
    'ed.unnamedDomain':       { en: '(unnamed domain)',          sq: '(fushë pa emër)' },
    'ed.noTextYet':           { en: '(no text yet)',             sq: '(ende pa tekst)' },
    'ed.confirmDelDomain1':   { en: 'Delete domain “',      sq: 'Fshi fushën “' },
    'ed.confirmDelDomain2':   { en: '”? All its questions will be lost.',
                                sq: '”? Të gjitha pyetjet e saj do të humbasin.' },
    'ed.confirmDelQuestion1': { en: 'Delete question “',    sq: 'Fshi pyetjen “' },
    'ed.confirmDelQuestion2': { en: '”?',                   sq: '”?' },
    'ed.registeredMsg1':      { en: 'Template “',           sq: 'Shablloni “' },
    'ed.registeredMsg2':      { en: '” registered. Go to the Start tab to begin a new assessment with it.',
                                sq: '” u regjistrua. Shkoni te skeda Fillimi për të filluar një vlerësim të ri me të.' },

    // ── Draft encryption (section, dialogs, dynamic messages) ───────
    'enc.section':            { en: 'Draft security',           sq: 'Siguria e draftit' },
    'enc.optional':           { en: '(optional)',               sq: '(opsionale)' },
    'enc.toggleLabel':        { en: 'Encrypt saved draft',      sq: 'Enkripto draftin e ruajtur' },
    'enc.toggleHint':         { en: 'When enabled, the browser-saved draft is protected with AES-GCM (256-bit) encryption and a password is required on every page load. If you forget your password, the draft is permanently unrecoverable. Exported JSON files are not encrypted by this feature.',
                                sq: 'Kur aktivizohet, drafti i ruajtur në shfletues mbrohet me enkriptim AES-GCM (256-bit) dhe kërkohet një fjalëkalim në çdo hapje të faqes. Nëse harroni fjalëkalimin, drafti është përgjithmonë i parikuperueshëm. Skedarët JSON të eksportuar nuk enkriptohen nga ky funksion.' },
    'enc.unlockTitle':        { en: 'Draft is encrypted',       sq: 'Drafti është i enkriptuar' },
    'enc.unlockDesc':         { en: 'Your saved draft is password-protected. Enter the password you chose when you enabled encryption to unlock it.',
                                sq: 'Drafti juaj i ruajtur është i mbrojtur me fjalëkalim. Shkruani fjalëkalimin që zgjodhët kur aktivizuat enkriptimin për ta zhbllokuar.' },
    'enc.passwordLabel':      { en: 'Password',                 sq: 'Fjalëkalimi' },
    'enc.confirmLabel':       { en: 'Confirm password',         sq: 'Konfirmo fjalëkalimin' },
    'enc.unlockBtn':          { en: 'Unlock',                   sq: 'Zhblloko' },
    'enc.skipBtn':            { en: 'Start without draft',      sq: 'Fillo pa draft' },
    'enc.enableTitle':        { en: 'Enable draft encryption',  sq: 'Aktivizo enkriptimin e draftit' },
    'enc.enableDesc':         { en: 'Your draft will be encrypted with AES-GCM (256-bit). Choose a strong password — it will be required every time you open this tool.',
                                sq: 'Drafti juaj do të enkriptohet me AES-GCM (256-bit). Zgjidhni një fjalëkalim të fortë — do të kërkohet sa herë që hapni këtë mjet.' },
    'enc.importantPrefix':    { en: 'Important:',               sq: 'E rëndësishme:' },
    'enc.warnBody':           { en: 'If you forget your password, your draft is permanently unrecoverable — there is no reset or recovery option. Exported JSON files remain plaintext unless separately protected.',
                                sq: 'Nëse harroni fjalëkalimin, drafti juaj është përgjithmonë i parikuperueshëm — nuk ka opsion rivendosjeje apo rikuperimi. Skedarët JSON të eksportuar mbeten tekst i thjeshtë nëse nuk mbrohen veçmas.' },
    'enc.enableBtn':          { en: 'Enable encryption',        sq: 'Aktivizo enkriptimin' },
    'enc.cancel':             { en: 'Cancel',                   sq: 'Anulo' },
    'enc.enabling':           { en: 'Enabling…',                sq: 'Duke aktivizuar…' },
    'enc.unlocking':          { en: 'Unlocking…',               sq: 'Duke zhbllokuar…' },
    'enc.errEnterPw':         { en: 'Please enter a password.', sq: 'Ju lutem shkruani një fjalëkalim.' },
    'enc.errMismatch':        { en: 'Passwords do not match. Please re-enter.', sq: 'Fjalëkalimet nuk përputhen. Ju lutem rishkruani.' },
    'enc.errTooShort':        { en: 'Password must be at least 8 characters.', sq: 'Fjalëkalimi duhet të jetë të paktën 8 karaktere.' },
    'enc.errEnabling':        { en: 'Error enabling encryption: ', sq: 'Gabim gjatë aktivizimit të enkriptimit: ' },
    'enc.errEnterUnlockPw':   { en: 'Please enter your password.', sq: 'Ju lutem shkruani fjalëkalimin tuaj.' },
    'enc.errIncorrect':       { en: 'Incorrect password. Please try again.', sq: 'Fjalëkalim i pasaktë. Ju lutem provoni përsëri.' },
    'enc.errGeneric':         { en: 'An error occurred. Please try again.', sq: 'Ndodhi një gabim. Ju lutem provoni përsëri.' },
    'enc.errUnlockFirst':     { en: 'Please unlock the draft first before disabling encryption.', sq: 'Ju lutem zhbllokoni fillimisht draftin para se të çaktivizoni enkriptimin.' },
    'enc.lockedNotSaving':    { en: '🔒 Locked — changes are not being saved. Unlock the draft or start fresh.', sq: '🔒 I kyçur — ndryshimet nuk po ruhen. Zhbllokoni draftin ose filloni nga e para.' },

    // ── Autosave status (aria-live) ─────────────────────────────────
    'autosave.saved':         { en: 'All changes saved',        sq: 'Të gjitha ndryshimet u ruajtën' },

    // ── Confirmations ───────────────────────────────────────────────
    'confirm.discardDraft':   { en: 'Discard the saved draft and start fresh? This cannot be undone.', sq: 'Të hidhet drafti i ruajtur dhe të fillohet nga e para? Ky veprim nuk mund të zhbëhet.' },

    // ── Dashboard gaps table (inline labels) ────────────────────────
    'dash.gapOwner':          { en: 'Owner: ',                  sq: 'Pronari: ' },
    'dash.gapBy':             { en: 'By: ',                     sq: 'Deri: ' },

    // ── PDF section headings & column headers ───────────────────────
    'pdf.subheader':          { en: 'Information Security Assessment Report',
                                sq: 'Raport i Vlerësimit të Sigurisë së Informacionit' },
    'pdf.metaClient':         { en: 'Client / organisation',    sq: 'Klienti / organizata' },
    'pdf.metaAssessor':       { en: 'Assessor',                 sq: 'Vlerësuesi' },
    'pdf.metaAgency':         { en: 'Agency',                   sq: 'Agjencia' },
    'pdf.metaDate':           { en: 'Date',                     sq: 'Data' },
    'pdf.translationPrefix':  { en: 'Translation (',            sq: 'Përkthimi (' },
    'pdf.translationSuffix':  { en: ') is machine-drafted and pending professional review.',
                                sq: ') është hartuar automatikisht dhe është në pritje të rishikimit profesional.' },
    'pdf.overallScore':       { en: 'Overall score',            sq: 'Rezultati i përgjithshëm' },
    'pdf.answered':           { en: 'Answered',                 sq: 'Të përgjigjetura' },
    'pdf.criticalGaps':       { en: 'Critical gaps',            sq: 'Boshllëqe kritike' },
    'pdf.maturity':           { en: 'Maturity',                 sq: 'Maturimi' },
    'pdf.scoresByDomain':     { en: 'Scores by domain',         sq: 'Rezultate sipas fushës' },
    'pdf.findingsRecsPrefix': { en: 'Findings & recommendations (', sq: 'Gjetje & rekomandime (' },
    'pdf.colNum':             { en: '#',                        sq: '#' },
    'pdf.colFinding':         { en: 'Finding',                  sq: 'Gjetja' },
    'pdf.colStatus':          { en: 'Status',                   sq: 'Statusi' },
    'pdf.colThreat':          { en: 'Threat',                   sq: 'Kërcënimi' },
    'pdf.colRefs':            { en: 'References',               sq: 'Referencat' },
    'pdf.colRem':             { en: 'Remediation',              sq: 'Korrigjimi' },
    'pdf.detailedAssessment': { en: 'Detailed Assessment',      sq: 'Vlerësim i Detajuar' },
    'pdf.colId':              { en: 'ID',                       sq: 'ID' },
    'pdf.colQuestion':        { en: 'Question',                 sq: 'Pyetja' },
    'pdf.colNaReason':        { en: 'N/A Reason',               sq: 'Arsyeja N/A' },
    'pdf.colEvidence':        { en: 'Evidence',                 sq: 'Dëshmi' },
    'pdf.confidential':       { en: '   ·   Confidential', sq: '   ·   Konfidencial' },
    'pdf.page':               { en: 'Page ',                    sq: 'Faqja ' },
    'pdf.of':                 { en: ' of ',                     sq: ' nga ' }
  };

  /* ── Public API ────────────────────────────────────────────────── */
  /* t(key, lang) — returns the chrome string for the given key and   */
  /* language. Falls back to English, then to the bare key itself.    */
  function t(key, lang) {
    var entry = UI_STRINGS[key];
    if (!entry) return key;
    var l = lang || 'en';
    if (entry[l] != null && entry[l] !== '') return entry[l];
    return entry.en != null ? entry.en : key;
  }

  return { t: t };
});
