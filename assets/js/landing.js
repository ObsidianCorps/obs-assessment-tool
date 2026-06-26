(function () {
  'use strict';

  /* ── Bilingual string table ──────────────────────────────────── */
  /* Each value is an object consumed by OBS.i18n.pick(field, lang) */
  var LANDING_STRINGS = {
    langEn: { en: 'EN', sq: 'EN' },
    langSq: { en: 'SQ', sq: 'SQ' },

    heroEyebrow:  { en: 'Security Assessment', sq: 'Vlerësim i Sigurisë' },
    heroTitle:    { en: 'OBS Security Assessment Tool', sq: 'Mjeti i Vlerësimit të Sigurisë OBS' },
    heroDesc: {
      en: 'Free, open-source assessments for ISO 27001/27002, NIS2, and CIS Controls v8. All data stays in your browser — no account, no tracking.',
      sq: 'Vlerësime falas, me burim të hapur për ISO 27001/27002, NIS2 dhe CIS Controls v8. Të gjitha të dhënat ruhen në shfletuesin tuaj — pa llogari, pa gjurmim.'
    },
    heroCta:       { en: 'Start assessment',  sq: 'Filloni vlerësimin' },
    heroLearnMore: { en: 'Learn more',         sq: 'Mësoni më shumë' },

    whatLabel:     { en: 'Capabilities',    sq: 'Aftësi' },
    whatTitle:     { en: 'What it does',    sq: 'Çfarë bën' },
    whatDesc: {
      en: 'A guided questionnaire that maps your security controls against internationally recognised frameworks. Work through each domain, record your implementation status, and get an instant gap analysis — all without signing up or sending data anywhere.',
      sq: 'Një pyetësor i udhëzuar që harton kontrollet tuaja të sigurisë kundrejt kornizave të njohura ndërkombëtarisht. Kaloni nëpër çdo fushë, regjistroni statusin e zbatimit dhe merrni menjëherë analizën e boshllëqeve — pa u regjistruar apo dërguar të dhëna askund.'
    },
    whatCard1Title: { en: 'ISO 27001 / 27002', sq: 'ISO 27001 / 27002' },
    whatCard1Desc: {
      en: 'Assess your ISMS controls against Annex A and the full ISO 27002 implementation guidance.',
      sq: 'Vlerësoni kontrollet tuaja ISMS kundrejt Aneksit A dhe udhëzimeve të plota të zbatimit ISO 27002.'
    },
    whatCard2Title: { en: 'NIS2 Directive', sq: 'Direktiva NIS2' },
    whatCard2Desc: {
      en: 'Evaluate compliance with the EU NIS2 Directive requirements for network and information security.',
      sq: 'Vlerësoni pajtueshmërinë me kërkesat e Direktivës NIS2 të BE-së për sigurinë e rrjetit dhe informacionit.'
    },
    whatCard3Title: { en: 'CIS Controls v8', sq: 'CIS Controls v8' },
    whatCard3Desc: {
      en: 'Measure your maturity against the CIS Critical Security Controls, organised into Implementation Groups.',
      sq: 'Matni pjekurinë tuaj kundrejt Kontrolleve Kritike të Sigurisë CIS, të organizuara në Grupe Zbatimi.'
    },

    howLabel:    { en: 'Process',                          sq: 'Procesi' },
    howTitle:    { en: 'How it works',                     sq: 'Si funksionon' },
    howSubDesc:  { en: 'Three steps from start to actionable results.', sq: 'Tre hapa nga fillimi deri te rezultate të zbatueshme.' },
    howStep1Title: { en: 'Choose a template',              sq: 'Zgjidhni një model' },
    howStep1Desc: {
      en: 'Select a built-in framework template or import a custom JSON template to match your scope and objectives.',
      sq: 'Zgjidhni një model kornize të integruar ose importoni një model JSON të personalizuar për të përshtatur fushën dhe objektivat tuaja.'
    },
    howStep2Title: { en: 'Complete the assessment',        sq: 'Plotësoni vlerësimin' },
    howStep2Desc: {
      en: 'Answer each question at your own pace. Progress is saved automatically so you can resume at any time.',
      sq: 'Përgjigjuni çdo pyetjeje me ritmin tuaj. Progresi ruhet automatikisht, kështu që mund të vazhdoni në çdo kohë.'
    },
    howStep3Title: { en: 'Review your results',            sq: 'Rishikoni rezultatet tuaja' },
    howStep3Desc: {
      en: 'See per-domain scores, identify gaps, and export a summary report for stakeholders or auditors.',
      sq: 'Shihni rezultatet sipas fushës, identifikoni boshllëqet dhe eksportoni një raport përmbledhës për palët e interesuara ose auditorët.'
    },

    ossLabel: { en: 'Open source',     sq: 'Burim i hapur' },
    ossTitle: { en: 'Free & open source', sq: 'Falas dhe me burim të hapur' },
    ossDesc: {
      en: 'Licensed under MIT. No sign-up, no telemetry, no data ever leaves your device. Inspect the source, run it locally, fork it, or contribute — it belongs to the community.',
      sq: 'Licencuar nën MIT. Pa regjistrim, pa telemetri, të dhënat tuaja nuk largohen kurrë nga pajisja juaj. Inspektoni kodin burimor, ekzekutojeni lokalisht, ndajeni ose kontribuoni — i përket komunitetit.'
    },
    ossGitHub: { en: 'View on GitHub', sq: 'Shiko në GitHub' },

    changelogLabel: { en: 'Releases',    sq: 'Versione' },
    changelogTitle: { en: "What's new",  sq: 'Çfarë ka të re' },

    footerRepo:      { en: 'obs-assessment-tool', sq: 'obs-assessment-tool' },
    footerMit:       { en: 'Free & open source (MIT)', sq: 'Falas dhe me burim të hapur (MIT)' },
    footerCopyright: { en: '©', sq: '©' },
    footerMadeBy:    { en: 'Made by', sq: 'Krijuar nga' }
  };

  /* ── Storage helpers ─────────────────────────────────────────── */
  var STORAGE_KEY = 'obs-lang';

  function storeLang(lang) {
    /* OBS.storage is NOT loaded on the landing page — guard before use */
    if (typeof OBS !== 'undefined' && OBS.storage &&
        OBS.storage.available && OBS.storage.available()) {
      OBS.storage.set(STORAGE_KEY, lang);
    } else {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage blocked */ }
    }
  }

  function loadLang() {
    if (typeof OBS !== 'undefined' && OBS.storage &&
        OBS.storage.available && OBS.storage.available()) {
      return OBS.storage.get(STORAGE_KEY) || null;
    }
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  /* ── Apply a language to the page ───────────────────────────── */
  function applyLang(lang) {
    /* 1. Reflect on <html> */
    document.documentElement.lang = lang;

    /* 2. Update every translatable element */
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (LANDING_STRINGS[key] != null) {
        el.textContent = OBS.i18n.pick(LANDING_STRINGS[key], lang);
      }
    }

    /* 3. Sync aria-pressed on lang toggle buttons */
    var btns = document.querySelectorAll('[data-lang]');
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute('aria-pressed',
        btns[j].getAttribute('data-lang') === lang ? 'true' : 'false');
    }

    /* 4. Footer year */
    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ── Changelog renderer ──────────────────────────────────────── */
  function renderChangelog() {
    var container = document.getElementById('changelog-list');
    if (!container || !window.OBS_CHANGELOG) { return; }

    for (var i = 0; i < window.OBS_CHANGELOG.length; i++) {
      var entry = window.OBS_CHANGELOG[i];

      var article = document.createElement('div');
      article.className = 'changelog-release';

      /* Header: version badge + date */
      var header = document.createElement('div');
      header.className = 'changelog-release__header';

      var versionEl = document.createElement('span');
      versionEl.className = 'changelog-release__version';
      versionEl.textContent = 'v' + entry.version;

      var dateEl = document.createElement('span');
      dateEl.className = 'changelog-release__date';
      dateEl.textContent = entry.date;

      header.appendChild(versionEl);
      header.appendChild(dateEl);
      article.appendChild(header);

      /* Changes list */
      var ul = document.createElement('ul');
      ul.className = 'changelog-release__changes';

      for (var j = 0; j < entry.changes.length; j++) {
        var li = document.createElement('li');
        li.textContent = entry.changes[j];
        ul.appendChild(li);
      }

      article.appendChild(ul);
      container.appendChild(article);
    }
  }

  /* ── Bootstrap ───────────────────────────────────────────────── */
  function init() {
    /* Determine starting language: stored preference → browser hint → 'en' */
    var stored   = loadLang();
    var browserHint = (navigator.language || '').slice(0, 2).toLowerCase();
    var supported = { en: true, sq: true };
    var lang = (stored && supported[stored]) ? stored
             : (supported[browserHint] ? browserHint : 'en');

    applyLang(lang);
    renderChangelog();

    /* Wire up toggle buttons */
    var btns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var chosen = this.getAttribute('data-lang');
        storeLang(chosen);
        applyLang(chosen);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
