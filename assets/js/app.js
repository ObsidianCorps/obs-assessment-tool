(function () {
  'use strict';

  window.OBS = window.OBS || {};

  var app = { template: null, assessment: null, lang: 'en' };
  window.OBS.app = app;

  // Caches the logo data URL chosen before Begin (null = none / removed)
  var pendingLogo = null;
  // Caches the brand colour chosen before Begin ('' = use default)
  var pendingBrandColor = '';
  // Active domain in the questionnaire panel (module-local)
  var activeDomainId = null;

  /* ── Core state helpers ──────────────────────────────────── */

  function emptyAssessment(template) {
    return {
      schemaVersion: 1,
      templateId: template.id,
      templateVersion: template.version,
      meta: { clientName: '', assessorName: '', assessorOrg: '', date: '', logo: null, brandColor: '' },
      language: app.lang,
      answers: {},
      domainNarratives: {},
      customQuestions: {}
    };
  }

  function newAssessment(templateId) {
    app.template = window.OBS_TEMPLATES[templateId];
    app.assessment = emptyAssessment(app.template);
    buildLangToggle(app.template);
    autosave();
  }

  function autosave() {
    if (app.assessment) {
      OBS.storage.saveDraft(app.assessment);
    }
  }

  /* ── Language toggle ─────────────────────────────────────── */

  /* Apply translated strings to all [data-i18n] elements in the DOM */
  function applyChrome(lang) {
    if (!OBS.ui || typeof OBS.ui.t !== 'function') return;
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = OBS.ui.t(els[i].getAttribute('data-i18n'), lang);
    }
  }

  function setLang(lang) {
    app.lang = lang;
    document.documentElement.lang = lang;

    // Update aria-pressed on all lang buttons
    var buttons = document.querySelectorAll('#lang-toggle [data-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed',
        buttons[i].getAttribute('data-lang') === lang ? 'true' : 'false');
    }

    // Show/hide machine-draft banner
    var sqBanner = document.getElementById('sq-banner');
    if (sqBanner) {
      var ts = app.template && app.template.translationStatus;
      sqBanner.hidden = !(lang === 'sq' && ts && ts.sq);
    }

    // Persist language on active assessment
    if (app.assessment) {
      app.assessment.language = lang;
      autosave();
    }

    // Translate all static chrome elements to the new language
    applyChrome(lang);

    render();
  }

  function buildLangToggle(template) {
    var container = document.getElementById('lang-toggle');
    if (!container) return;
    var langs = OBS.i18n.langs(template);
    container.innerHTML = '';
    for (var i = 0; i < langs.length; i++) {
      (function (l) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-lang', l);
        btn.textContent = l.toUpperCase();
        btn.setAttribute('aria-pressed', l === app.lang ? 'true' : 'false');
        btn.addEventListener('click', function () { setLang(l); });
        container.appendChild(btn);
      })(langs[i]);
    }
  }

  /* ── Tab management ──────────────────────────────────────── */

  function showTab(name) {
    var panels = document.querySelectorAll('[role="tabpanel"]');
    for (var i = 0; i < panels.length; i++) {
      panels[i].hidden = panels[i].id !== 'tab-' + name;
    }
    var tabs = document.querySelectorAll('[role="tab"]');
    for (var j = 0; j < tabs.length; j++) {
      var isActive = tabs[j].getAttribute('data-tab') === name;
      tabs[j].setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        tabs[j].classList.add('is-active');
      } else {
        tabs[j].classList.remove('is-active');
      }
    }
  }

  /* ── Render ──────────────────────────────────────────────── */

  function render() {
    // Update lang toggle pressed state (in case called without setLang)
    var buttons = document.querySelectorAll('#lang-toggle [data-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed',
        buttons[i].getAttribute('data-lang') === app.lang ? 'true' : 'false');
    }
    // Delegate to later-task renderers if present
    if (typeof OBS.app.renderQuestionnaire === 'function') {
      OBS.app.renderQuestionnaire();
    }
    if (typeof OBS.report !== 'undefined' &&
        typeof OBS.report.renderDashboard === 'function' &&
        app.assessment) {
      var dashPanel = document.getElementById('dashboard-main');
      if (dashPanel) {
        OBS.report.renderDashboard(dashPanel, app.template, app.assessment, app.lang);
      }
    }
  }

  /* ── DOM helpers ─────────────────────────────────────────── */

  function populateTemplateSelect() {
    var sel = document.getElementById('template-select');
    if (!sel || !window.OBS_TEMPLATES) return;
    sel.innerHTML = '';
    var ids = Object.keys(OBS_TEMPLATES);
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var t = OBS_TEMPLATES[id];
      var opt = document.createElement('option');
      opt.value = id;
      opt.textContent = OBS.i18n.pick(t.title, app.lang);
      sel.appendChild(opt);
    }
    // Build lang toggle for initial template
    if (sel.value && OBS_TEMPLATES[sel.value]) {
      buildLangToggle(OBS_TEMPLATES[sel.value]);
    }
    // Rebuild lang toggle when template selection changes
    sel.addEventListener('change', function () {
      var t = OBS_TEMPLATES[sel.value];
      if (!t) return;
      buildLangToggle(t);
      // If current lang not in new template, switch to first available
      var langs = OBS.i18n.langs(t);
      var found = false;
      for (var j = 0; j < langs.length; j++) {
        if (langs[j] === app.lang) { found = true; break; }
      }
      if (!found && langs.length) {
        setLang(langs[0]);
      }
    });
  }

  function showNotices(notices) {
    if (!notices || !notices.length) return;
    var wrapper = document.getElementById('reconcile-notices');
    var inner = document.getElementById('reconcile-notices-inner');
    if (!wrapper || !inner) return;
    // Use DOM construction (textContent) — never innerHTML with external strings
    while (inner.firstChild) inner.removeChild(inner.firstChild);
    var ul = document.createElement('ul');
    for (var i = 0; i < notices.length; i++) {
      var li = document.createElement('li');
      li.textContent = notices[i];
      ul.appendChild(li);
    }
    inner.appendChild(ul);
    wrapper.hidden = false;
  }

  function downloadBlob(content, filename, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 200);
  }

  function restoreFormMeta(meta) {
    if (!meta) return;
    var cl = document.getElementById('client-name');
    var as = document.getElementById('assessor-name');
    var og = document.getElementById('meta-org');
    var dt = document.getElementById('assessment-date');
    var lp = document.getElementById('logo-preview');
    var bc = document.getElementById('meta-brand-color');
    if (cl) cl.value = meta.clientName || '';
    if (as) as.value = meta.assessorName || '';
    if (og) og.value = meta.assessorOrg || '';
    if (dt) dt.value = meta.date || '';
    // Restore brand colour picker and sync pending state
    if (bc) bc.value = meta.brandColor || '#0f213d';
    pendingBrandColor = meta.brandColor || '';
    // Restore logo preview and sync pending state
    if (lp) {
      if (meta.logo) {
        lp.src = meta.logo;
        lp.hidden = false;
        pendingLogo = meta.logo;
      } else {
        lp.src = '';
        lp.hidden = true;
        pendingLogo = null;
      }
    }
  }

  function readMetaFromForm() {
    return {
      clientName: (document.getElementById('client-name') || { value: '' }).value || '',
      assessorName: (document.getElementById('assessor-name') || { value: '' }).value || '',
      assessorOrg: (document.getElementById('meta-org') || { value: '' }).value || '',
      date: (document.getElementById('assessment-date') || { value: '' }).value || '',
      // pendingLogo is null when no logo has been selected/removed this session;
      // fall back to the existing assessment logo (after resume/import).
      logo: pendingLogo !== null ? pendingLogo
            : (app.assessment ? (app.assessment.meta && app.assessment.meta.logo) : null),
      brandColor: pendingBrandColor
    };
  }

  function safeFilename(str) {
    return (str || 'assessment')
      .replace(/[^a-z0-9_\-]/gi, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'assessment';
  }

  /* ── Questionnaire rendering ────────────────────────────────── */

  function getStatusCardClass(status) {
    if (status === 'compliant')     return ' is-answered';
    if (status === 'partial')       return ' is-partial';
    if (status === 'non-compliant') return ' is-non-compliant';
    if (status === 'na')            return ' is-na';
    return '';
  }

  function renderQuestionnaire() {
    if (!app.template || !app.assessment) return;
    var domains = app.template.domains;
    if (!domains || !domains.length) return;
    // Ensure activeDomainId is a valid domain
    var found = false;
    for (var i = 0; i < domains.length; i++) {
      if (domains[i].id === activeDomainId) { found = true; break; }
    }
    if (!found) activeDomainId = domains[0].id;
    renderSidebar(domains);
    renderDomainMain(activeDomainId);
  }

  function renderSidebar(domains) {
    var list = document.getElementById('sidebar-domain-list');
    if (!list) return;
    while (list.firstChild) list.removeChild(list.firstChild);
    var totalAnswered = 0, totalTotal = 0;
    for (var i = 0; i < domains.length; i++) {
      var d = domains[i];
      var sc = OBS.scoring.domainScore(d, app.assessment);
      totalAnswered += sc.answered;
      totalTotal += sc.total;
      var li = document.createElement('li');
      li.className = 'sidebar-nav__item';
      var btn = document.createElement('button');
      btn.type = 'button';
      var isActive = d.id === activeDomainId;
      btn.className = 'sidebar-nav__link' + (isActive ? ' is-active' : '');
      if (isActive) btn.setAttribute('aria-current', 'page');
      var titleSpan = document.createElement('span');
      titleSpan.className = 'sidebar-domain-title';
      titleSpan.textContent = OBS.i18n.pick(d.title, app.lang);
      var progSpan = document.createElement('span');
      progSpan.className = 'sidebar-domain-prog';
      progSpan.textContent = sc.answered + '/' + sc.total;
      btn.appendChild(titleSpan);
      btn.appendChild(progSpan);
      (function (did) {
        btn.addEventListener('click', function () {
          activeDomainId = did;
          renderQuestionnaire();
        });
      })(d.id);
      li.appendChild(btn);
      list.appendChild(li);
    }
    var pct = totalTotal > 0 ? Math.round((totalAnswered / totalTotal) * 100) : 0;
    var pctEl = document.getElementById('sidebar-progress-pct');
    var fillEl = document.getElementById('sidebar-progress-fill');
    if (pctEl) pctEl.textContent = pct + '%';
    if (fillEl) fillEl.style.width = pct + '%';
  }

  function renderDomainMain(domainId) {
    var main = document.getElementById('questionnaire-main');
    if (!main) return;
    var domain = null;
    for (var i = 0; i < app.template.domains.length; i++) {
      if (app.template.domains[i].id === domainId) { domain = app.template.domains[i]; break; }
    }
    if (!domain) return;
    while (main.firstChild) main.removeChild(main.firstChild);
    var panel = document.createElement('div');
    panel.className = 'domain-panel';
    var h2 = document.createElement('h2');
    h2.className = 'domain-title';
    h2.textContent = OBS.i18n.pick(domain.title, app.lang);
    panel.appendChild(h2);
    var questions = domain.questions || [];
    for (var qi = 0; qi < questions.length; qi++) {
      panel.appendChild(buildQuestionCard(questions[qi], qi + 1));
    }
    var customData = (app.assessment.customQuestions || {})[domainId] || [];
    for (var ci = 0; ci < customData.length; ci++) {
      panel.appendChild(buildCustomCard(domainId, ci, customData[ci] || {}));
    }
    panel.appendChild(buildAddCustomButton(domainId));
    panel.appendChild(buildNarrativeSection(domainId));
    main.appendChild(panel);
  }

  function buildQuestionCard(q, num) {
    var qid = q.id;
    var ans = (app.assessment.answers || {})[qid] || {};
    var status = ans.status || 'unanswered';
    var rem = ans.remediation || {};
    var card = document.createElement('div');
    card.className = 'question-card' + getStatusCardClass(status);
    // Meta row
    var meta = document.createElement('div');
    meta.className = 'question-card__meta';
    var numSpan = document.createElement('span');
    numSpan.className = 'question-card__number';
    numSpan.textContent = num + '.';
    meta.appendChild(numSpan);
    var idBadge = document.createElement('span');
    idBadge.className = 'question-card__id';
    idBadge.textContent = qid;
    meta.appendChild(idBadge);
    if (q.critical) {
      var crit = document.createElement('span');
      crit.className = 'question-card__critical';
      crit.textContent = OBS.ui.t('q.critical', app.lang);
      meta.appendChild(crit);
    }
    card.appendChild(meta);
    // Question text
    var textEl = document.createElement('p');
    textEl.className = 'question-card__text';
    textEl.textContent = OBS.i18n.pick(q.text, app.lang);
    card.appendChild(textEl);
    // Good practice collapsible
    var gp = OBS.i18n.pick(q.goodPractice, app.lang);
    if (Array.isArray(gp) && gp.length) {
      var details = document.createElement('details');
      details.className = 'good-practice';
      var summary = document.createElement('summary');
      summary.className = 'good-practice__summary';
      summary.textContent = OBS.ui.t('q.goodPractice', app.lang);
      details.appendChild(summary);
      var gpUl = document.createElement('ul');
      gpUl.className = 'good-practice__list';
      for (var gi = 0; gi < gp.length; gi++) {
        var gpLi = document.createElement('li');
        gpLi.textContent = gp[gi];
        gpUl.appendChild(gpLi);
      }
      details.appendChild(gpUl);
      card.appendChild(details);
    }
    // Follow-up prompt
    var fu = OBS.i18n.pick(q.followUp, app.lang);
    if (fu) {
      var fuEl = document.createElement('p');
      fuEl.className = 'question-card__followup';
      var fuStrong = document.createElement('strong');
      fuStrong.textContent = OBS.ui.t('q.followUp', app.lang);
      fuEl.appendChild(fuStrong);
      fuEl.appendChild(document.createTextNode(fu));
      card.appendChild(fuEl);
    }
    // Reference tags
    appendRefTags(card, q.references);
    // Status fieldset
    card.appendChild(buildStatusFieldset(qid, status, { 'data-qid': qid }));
    // Partial percent — conditional, shown only when status === 'partial'
    var ppGrp = document.createElement('div');
    ppGrp.className = 'form-group conditional-field';
    if (status !== 'partial') ppGrp.setAttribute('hidden', '');
    var ppLbl = document.createElement('label');
    ppLbl.setAttribute('for', qid + '-pp');
    ppLbl.textContent = OBS.ui.t('q.partialPct', app.lang);
    ppGrp.appendChild(ppLbl);
    var ppInp = document.createElement('input');
    ppInp.type = 'number'; ppInp.min = '0'; ppInp.max = '100';
    ppInp.id = qid + '-pp';
    ppInp.value = ans.partialPercent != null ? ans.partialPercent : '';
    ppInp.setAttribute('data-qid', qid);
    ppInp.setAttribute('data-field', 'partialPercent');
    ppGrp.appendChild(ppInp);
    card.appendChild(ppGrp);
    // N/A reason — conditional, shown only when status === 'na'
    var naGrp = document.createElement('div');
    naGrp.className = 'form-group conditional-field';
    if (status !== 'na') naGrp.setAttribute('hidden', '');
    var naLbl = document.createElement('label');
    naLbl.setAttribute('for', qid + '-na');
    naLbl.textContent = OBS.ui.t('q.naReason', app.lang);
    naGrp.appendChild(naLbl);
    var naInp = document.createElement('input');
    naInp.type = 'text';
    naInp.id = qid + '-na';
    naInp.value = ans.naReason || '';
    naInp.setAttribute('data-qid', qid);
    naInp.setAttribute('data-field', 'naReason');
    naGrp.appendChild(naInp);
    card.appendChild(naGrp);
    // Evidence textarea
    var evGrp = document.createElement('div');
    evGrp.className = 'form-group';
    var evLbl = document.createElement('label');
    evLbl.setAttribute('for', qid + '-ev');
    evLbl.textContent = OBS.ui.t('q.evidence', app.lang);
    evGrp.appendChild(evLbl);
    var evTa = document.createElement('textarea');
    evTa.id = qid + '-ev';
    evTa.rows = 3;
    evTa.value = ans.evidence || '';
    evTa.setAttribute('data-qid', qid);
    evTa.setAttribute('data-field', 'evidence');
    evGrp.appendChild(evTa);
    card.appendChild(evGrp);
    // Remediation
    card.appendChild(buildRemSection(qid, rem, false, null, null));
    return card;
  }

  function buildCustomCard(domainId, index, customQ) {
    var status = customQ.status || 'unanswered';
    var rem = customQ.remediation || {};
    var pfx = 'cq-' + domainId + '-' + index;
    var card = document.createElement('div');
    card.className = 'question-card question-card--custom' + getStatusCardClass(status);
    // Meta row
    var meta = document.createElement('div');
    meta.className = 'question-card__meta';
    var custBadge = document.createElement('span');
    custBadge.className = 'question-card__id';
    custBadge.textContent = OBS.ui.t('cq.badge', app.lang);
    meta.appendChild(custBadge);
    var custLbl = document.createElement('span');
    custLbl.className = 'question-card__custom-label';
    custLbl.textContent = OBS.ui.t('cq.label', app.lang) + ' (' + (index + 1) + ')';
    meta.appendChild(custLbl);
    // Remove button
    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-sm custom-question-remove-btn';
    removeBtn.textContent = OBS.ui.t('cq.remove', app.lang);
    (function (did, idx) {
      removeBtn.addEventListener('click', function () {
        if (!app.assessment || !app.assessment.customQuestions) return;
        var arr = app.assessment.customQuestions[did];
        if (!arr) return;
        arr.splice(idx, 1);
        autosave();
        renderDomainMain(did);
        refreshSidebar();
      });
    })(domainId, index);
    meta.appendChild(removeBtn);
    card.appendChild(meta);
    // Question text input
    var textGrp = document.createElement('div');
    textGrp.className = 'form-group';
    var textLbl = document.createElement('label');
    textLbl.setAttribute('for', pfx + '-text');
    textLbl.textContent = OBS.ui.t('cq.questionText', app.lang);
    textGrp.appendChild(textLbl);
    var textInp = document.createElement('input');
    textInp.type = 'text';
    textInp.id = pfx + '-text';
    textInp.value = customQ.text || '';
    textInp.placeholder = OBS.ui.t('cq.questionPlaceholder', app.lang);
    textInp.setAttribute('data-custom-domain', domainId);
    textInp.setAttribute('data-custom-idx', String(index));
    textInp.setAttribute('data-field', 'text');
    textGrp.appendChild(textInp);
    card.appendChild(textGrp);
    // References input
    var refGrp = document.createElement('div');
    refGrp.className = 'form-group';
    var refLbl = document.createElement('label');
    refLbl.setAttribute('for', pfx + '-refs');
    refLbl.textContent = OBS.ui.t('cq.references', app.lang);
    refGrp.appendChild(refLbl);
    var refInp = document.createElement('input');
    refInp.type = 'text';
    refInp.id = pfx + '-refs';
    refInp.value = typeof customQ.references === 'string' ? customQ.references : '';
    refInp.placeholder = OBS.ui.t('cq.refPlaceholder', app.lang);
    refInp.setAttribute('data-custom-domain', domainId);
    refInp.setAttribute('data-custom-idx', String(index));
    refInp.setAttribute('data-field', 'references');
    refGrp.appendChild(refInp);
    card.appendChild(refGrp);
    // Status fieldset
    card.appendChild(buildStatusFieldset(pfx, status, {
      'data-custom-domain': domainId,
      'data-custom-idx': String(index)
    }));
    // Partial percent (conditional)
    var ppGrp = document.createElement('div');
    ppGrp.className = 'form-group conditional-field';
    if (status !== 'partial') ppGrp.setAttribute('hidden', '');
    var ppLbl = document.createElement('label');
    ppLbl.setAttribute('for', pfx + '-pp');
    ppLbl.textContent = OBS.ui.t('q.partialPct', app.lang);
    ppGrp.appendChild(ppLbl);
    var ppInp = document.createElement('input');
    ppInp.type = 'number'; ppInp.min = '0'; ppInp.max = '100';
    ppInp.id = pfx + '-pp';
    ppInp.value = customQ.partialPercent != null ? customQ.partialPercent : '';
    ppInp.setAttribute('data-custom-domain', domainId);
    ppInp.setAttribute('data-custom-idx', String(index));
    ppInp.setAttribute('data-field', 'partialPercent');
    ppGrp.appendChild(ppInp);
    card.appendChild(ppGrp);
    // N/A reason (conditional)
    var naGrp = document.createElement('div');
    naGrp.className = 'form-group conditional-field';
    if (status !== 'na') naGrp.setAttribute('hidden', '');
    var naLbl = document.createElement('label');
    naLbl.setAttribute('for', pfx + '-na');
    naLbl.textContent = OBS.ui.t('q.naReason', app.lang);
    naGrp.appendChild(naLbl);
    var naInp = document.createElement('input');
    naInp.type = 'text';
    naInp.id = pfx + '-na';
    naInp.value = customQ.naReason || '';
    naInp.setAttribute('data-custom-domain', domainId);
    naInp.setAttribute('data-custom-idx', String(index));
    naInp.setAttribute('data-field', 'naReason');
    naGrp.appendChild(naInp);
    card.appendChild(naGrp);
    // Evidence textarea
    var evGrp = document.createElement('div');
    evGrp.className = 'form-group';
    var evLbl = document.createElement('label');
    evLbl.setAttribute('for', pfx + '-ev');
    evLbl.textContent = OBS.ui.t('q.evidence', app.lang);
    evGrp.appendChild(evLbl);
    var evTa = document.createElement('textarea');
    evTa.id = pfx + '-ev';
    evTa.rows = 3;
    evTa.value = customQ.evidence || '';
    evTa.setAttribute('data-custom-domain', domainId);
    evTa.setAttribute('data-custom-idx', String(index));
    evTa.setAttribute('data-field', 'evidence');
    evGrp.appendChild(evTa);
    card.appendChild(evGrp);
    // Remediation
    card.appendChild(buildRemSection(pfx, rem, true, domainId, index));
    return card;
  }

  function buildStatusFieldset(namePrefix, currentStatus, extraDataAttrs) {
    var fieldset = document.createElement('fieldset');
    fieldset.className = 'status-fieldset';
    var legend = document.createElement('legend');
    legend.textContent = OBS.ui.t('q.status', app.lang);
    fieldset.appendChild(legend);
    var div = document.createElement('div');
    div.className = 'status-radios';
    var statuses = [
      { val: 'compliant',     label: OBS.ui.t('status.compliant', app.lang) },
      { val: 'partial',       label: OBS.ui.t('status.partial', app.lang) },
      { val: 'non-compliant', label: OBS.ui.t('status.nonCompliant', app.lang) },
      { val: 'na',            label: OBS.ui.t('status.na', app.lang) }
    ];
    for (var i = 0; i < statuses.length; i++) {
      var s = statuses[i];
      var wrapper = document.createElement('div');
      wrapper.className = 'status-radio status-radio--' + s.val;
      var radioId = namePrefix + '-status-' + s.val;
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.id = radioId;
      radio.name = namePrefix + '-status';
      radio.value = s.val;
      radio.checked = (currentStatus === s.val);
      radio.setAttribute('data-field', 'status');
      if (extraDataAttrs) {
        var ks = Object.keys(extraDataAttrs);
        for (var k = 0; k < ks.length; k++) {
          radio.setAttribute(ks[k], extraDataAttrs[ks[k]]);
        }
      }
      var lbl = document.createElement('label');
      lbl.setAttribute('for', radioId);
      lbl.textContent = s.label;
      wrapper.appendChild(radio);
      wrapper.appendChild(lbl);
      div.appendChild(wrapper);
    }
    fieldset.appendChild(div);
    return fieldset;
  }

  function buildRemSection(idPrefix, rem, isCustom, domainId, custIdx) {
    var section = document.createElement('div');
    section.className = 'remediation-group';
    var heading = document.createElement('p');
    heading.className = 'remediation-group__label';
    heading.textContent = OBS.ui.t('rem.heading', app.lang);
    section.appendChild(heading);
    var row = document.createElement('div');
    row.className = 'remediation-row';
    // Helper to set routing attrs on an element
    function setRouting(el, field) {
      el.setAttribute('data-field', field);
      if (isCustom) {
        el.setAttribute('data-custom-domain', domainId);
        el.setAttribute('data-custom-idx', String(custIdx));
      } else {
        el.setAttribute('data-qid', idPrefix);
      }
    }
    // Owner
    var ownerGrp = document.createElement('div');
    ownerGrp.className = 'form-group form-group--inline';
    var ownerLbl = document.createElement('label');
    ownerLbl.setAttribute('for', idPrefix + '-rem-owner');
    ownerLbl.textContent = OBS.ui.t('rem.owner', app.lang);
    ownerGrp.appendChild(ownerLbl);
    var ownerInp = document.createElement('input');
    ownerInp.type = 'text';
    ownerInp.id = idPrefix + '-rem-owner';
    ownerInp.value = rem.owner || '';
    setRouting(ownerInp, 'rem-owner');
    ownerGrp.appendChild(ownerInp);
    row.appendChild(ownerGrp);
    // Target date
    var dateGrp = document.createElement('div');
    dateGrp.className = 'form-group form-group--inline';
    var dateLbl = document.createElement('label');
    dateLbl.setAttribute('for', idPrefix + '-rem-date');
    dateLbl.textContent = OBS.ui.t('rem.targetDate', app.lang);
    dateGrp.appendChild(dateLbl);
    var dateInp = document.createElement('input');
    dateInp.type = 'date';
    dateInp.id = idPrefix + '-rem-date';
    dateInp.value = rem.targetDate || '';
    setRouting(dateInp, 'rem-date');
    dateGrp.appendChild(dateInp);
    row.appendChild(dateGrp);
    // Status select
    var statusGrp = document.createElement('div');
    statusGrp.className = 'form-group form-group--inline';
    var statusLbl = document.createElement('label');
    statusLbl.setAttribute('for', idPrefix + '-rem-status');
    statusLbl.textContent = OBS.ui.t('rem.status', app.lang);
    statusGrp.appendChild(statusLbl);
    var statusSel = document.createElement('select');
    statusSel.id = idPrefix + '-rem-status';
    setRouting(statusSel, 'rem-status');
    var remOpts = [
      { val: 'none',        label: OBS.ui.t('rem.none', app.lang) },
      { val: 'planned',     label: OBS.ui.t('rem.planned', app.lang) },
      { val: 'in-progress', label: OBS.ui.t('rem.inProgress', app.lang) },
      { val: 'remediated',  label: OBS.ui.t('rem.remediated', app.lang) }
    ];
    for (var ri = 0; ri < remOpts.length; ri++) {
      var opt = document.createElement('option');
      opt.value = remOpts[ri].val;
      opt.textContent = remOpts[ri].label;
      if ((rem.status || 'none') === remOpts[ri].val) opt.selected = true;
      statusSel.appendChild(opt);
    }
    statusGrp.appendChild(statusSel);
    row.appendChild(statusGrp);
    section.appendChild(row);
    return section;
  }

  function appendRefTags(card, refs) {
    if (!refs) return;
    var keys = ['iso27001', 'iso27002', 'nis2', 'cis', 'other'];
    var hasAny = false;
    for (var i = 0; i < keys.length; i++) {
      if (refs[keys[i]]) { hasAny = true; break; }
    }
    if (!hasAny) return;
    var refsDiv = document.createElement('div');
    refsDiv.className = 'question-card__refs';
    for (var j = 0; j < keys.length; j++) {
      var rk = keys[j];
      if (refs[rk]) {
        var tag = document.createElement('span');
        tag.className = 'ref-tag';
        tag.textContent = rk.toUpperCase() + ': ' + refs[rk];
        refsDiv.appendChild(tag);
      }
    }
    card.appendChild(refsDiv);
  }

  function buildAddCustomButton(domainId) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-secondary add-custom-question-btn';
    btn.textContent = OBS.ui.t('cq.addButton', app.lang);
    btn.addEventListener('click', function () {
      if (!app.assessment) return;
      if (!app.assessment.customQuestions) app.assessment.customQuestions = {};
      if (!app.assessment.customQuestions[domainId]) {
        app.assessment.customQuestions[domainId] = [];
      }
      app.assessment.customQuestions[domainId].push({});
      autosave();
      renderDomainMain(domainId);
      refreshSidebar();
    });
    return btn;
  }

  function buildNarrativeSection(domainId) {
    var narrative = (app.assessment.domainNarratives || {})[domainId] || '';
    var section = document.createElement('div');
    section.className = 'narrative-section';
    var h3 = document.createElement('h3');
    h3.className = 'narrative-section__title';
    h3.textContent = OBS.ui.t('narr.heading', app.lang);
    section.appendChild(h3);
    var narrId = 'narr-' + domainId;
    var lbl = document.createElement('label');
    lbl.setAttribute('for', narrId);
    lbl.className = 'narrative-section__label';
    lbl.textContent = OBS.ui.t('narr.label', app.lang);
    section.appendChild(lbl);
    var ta = document.createElement('textarea');
    ta.id = narrId;
    ta.className = 'narrative-textarea';
    ta.rows = 5;
    ta.value = narrative;
    ta.setAttribute('data-narrative-domain', domainId);
    section.appendChild(ta);
    return section;
  }

  /* ── Questionnaire change handling ─────────────────────────── */

  function attachQuestionnaireListeners() {
    var main = document.getElementById('questionnaire-main');
    if (!main) return;
    // 'change' handles radios, selects, and text inputs on blur
    main.addEventListener('change', function (e) {
      handleQChange(e.target);
    });
    // 'input' handles text/textarea as user types (skip radio/select — handled by change)
    main.addEventListener('input', function (e) {
      var t = e.target;
      var type = (t.type || '').toLowerCase();
      if (type === 'radio' || t.tagName.toLowerCase() === 'select') return;
      handleQChange(t);
    });
  }

  function handleQChange(target) {
    if (!app.assessment) return;
    var field          = target.getAttribute('data-field');
    var qid            = target.getAttribute('data-qid');
    var customDomain   = target.getAttribute('data-custom-domain');
    var customIdx      = target.getAttribute('data-custom-idx');
    var narrativeDomain = target.getAttribute('data-narrative-domain');
    if (qid && field) {
      handleStandardChange(qid, field, target);
    } else if (customDomain !== null && customIdx !== null && field) {
      handleCustomChange(customDomain, parseInt(customIdx, 10), field, target);
    } else if (narrativeDomain !== null) {
      if (!app.assessment.domainNarratives) app.assessment.domainNarratives = {};
      app.assessment.domainNarratives[narrativeDomain] = target.value;
      autosave();
    }
  }

  function handleStandardChange(qid, field, target) {
    if (!app.assessment.answers[qid]) {
      app.assessment.answers[qid] = {
        status: 'unanswered', partialPercent: null,
        naReason: '', evidence: '',
        remediation: { owner: '', targetDate: '', status: 'none' }
      };
    }
    var ans = app.assessment.answers[qid];
    if (field === 'status') {
      ans.status = target.value;
      var card = findAncestorByClass(target, 'question-card');
      if (card) {
        toggleConditionalField(card, 'partialPercent', target.value === 'partial');
        toggleConditionalField(card, 'naReason', target.value === 'na');
        updateCardStatusClass(card, target.value);
      }
      refreshSidebar();
    } else if (field === 'partialPercent') {
      ans.partialPercent = target.value !== '' ? Number(target.value) : null;
    } else if (field === 'naReason') {
      ans.naReason = target.value;
    } else if (field === 'evidence') {
      ans.evidence = target.value;
    } else if (field === 'rem-owner') {
      if (!ans.remediation) ans.remediation = {};
      ans.remediation.owner = target.value;
    } else if (field === 'rem-date') {
      if (!ans.remediation) ans.remediation = {};
      ans.remediation.targetDate = target.value;
    } else if (field === 'rem-status') {
      if (!ans.remediation) ans.remediation = {};
      ans.remediation.status = target.value;
    }
    autosave();
  }

  function handleCustomChange(domainId, index, field, target) {
    if (!app.assessment.customQuestions) app.assessment.customQuestions = {};
    if (!app.assessment.customQuestions[domainId]) {
      app.assessment.customQuestions[domainId] = [];
    }
    while (app.assessment.customQuestions[domainId].length <= index) {
      app.assessment.customQuestions[domainId].push({});
    }
    var cq = app.assessment.customQuestions[domainId][index];
    if (!cq) { cq = {}; app.assessment.customQuestions[domainId][index] = cq; }
    if (field === 'text') {
      cq.text = target.value;
    } else if (field === 'references') {
      cq.references = target.value;
    } else if (field === 'status') {
      cq.status = target.value;
      var card = findAncestorByClass(target, 'question-card');
      if (card) {
        toggleConditionalField(card, 'partialPercent', target.value === 'partial');
        toggleConditionalField(card, 'naReason', target.value === 'na');
        updateCardStatusClass(card, target.value);
      }
      refreshSidebar();
    } else if (field === 'partialPercent') {
      cq.partialPercent = target.value !== '' ? Number(target.value) : null;
    } else if (field === 'naReason') {
      cq.naReason = target.value;
    } else if (field === 'evidence') {
      cq.evidence = target.value;
    } else if (field === 'rem-owner') {
      if (!cq.remediation) cq.remediation = {};
      cq.remediation.owner = target.value;
    } else if (field === 'rem-date') {
      if (!cq.remediation) cq.remediation = {};
      cq.remediation.targetDate = target.value;
    } else if (field === 'rem-status') {
      if (!cq.remediation) cq.remediation = {};
      cq.remediation.status = target.value;
    }
    autosave();
  }

  function toggleConditionalField(card, dataField, show) {
    var inputs = card.querySelectorAll('[data-field="' + dataField + '"]');
    for (var i = 0; i < inputs.length; i++) {
      var group = findAncestorByClass(inputs[i], 'conditional-field');
      if (group) {
        if (show) { group.removeAttribute('hidden'); }
        else       { group.setAttribute('hidden', ''); }
      }
    }
  }

  function updateCardStatusClass(card, newStatus) {
    card.className = card.className
      .replace(/\bis-answered\b|\bis-partial\b|\bis-non-compliant\b|\bis-na\b/g, '')
      .trim();
    var sc = getStatusCardClass(newStatus);
    if (sc) card.className += sc;
  }

  function findAncestorByClass(el, cls) {
    var node = el.parentElement;
    while (node && node !== document.body) {
      if (node.classList && node.classList.contains(cls)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function refreshSidebar() {
    if (app.template && app.assessment) renderSidebar(app.template.domains);
  }

  /* ── Encryption UI ───────────────────────────────────────── */

  // Update checkbox + lock indicator to reflect current crypto state.
  function updateEncryptionUI() {
    var enc      = OBS.storage.isEncrypted();
    var unlocked = OBS.storage.isUnlocked();
    var checkbox  = document.getElementById('enc-enable-checkbox');
    var indicator = document.getElementById('enc-lock-indicator');
    if (checkbox) {
      checkbox.checked  = enc;
      // Prevent toggling when encrypted-but-locked (no key to decrypt with)
      checkbox.disabled = enc && !unlocked;
    }
    if (indicator) indicator.hidden = !enc;
  }

  // Load the decrypted draft into the app exactly like the resume-draft flow.
  function resumeEncryptedDraft(assessment) {
    var draftTemplate = window.OBS_TEMPLATES && window.OBS_TEMPLATES[assessment.templateId];
    if (!draftTemplate) return;
    var result = OBS.storage.reconcile(assessment, draftTemplate);
    app.template   = draftTemplate;
    app.assessment = result.assessment;
    app.lang       = app.assessment.language || 'en';
    document.documentElement.lang = app.lang;
    buildLangToggle(draftTemplate);
    var sel = document.getElementById('template-select');
    if (sel) sel.value = draftTemplate.id;
    restoreFormMeta(app.assessment.meta);
    if (result.notices.length) showNotices(result.notices);
    autosave();
    showTab('questionnaire');
    render();
  }

  // Wire all encryption-related event handlers. Call this once in init().
  function initEncryptionUI() {
    var checkbox     = document.getElementById('enc-enable-checkbox');
    var enableDialog = document.getElementById('enc-enable-dialog');
    var enableSubmit = document.getElementById('enc-enable-submit');
    var enableCancel = document.getElementById('enc-enable-cancel');
    var enableError  = document.getElementById('enc-enable-error');
    var unlockDialog = document.getElementById('enc-unlock-dialog');
    var unlockSubmit = document.getElementById('enc-unlock-submit');
    var unlockSkip   = document.getElementById('enc-unlock-skip');
    var unlockError  = document.getElementById('enc-unlock-error');
    var unlockPwEl   = document.getElementById('enc-unlock-password');
    var pw1El        = document.getElementById('enc-password-1');
    var pw2El        = document.getElementById('enc-password-2');

    // ── Encryption toggle checkbox ──────────────────────────
    if (checkbox) {
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          // User wants to enable: revert until confirmed in the dialog
          checkbox.checked = false;
          if (!enableDialog) return;
          if (enableError) enableError.hidden = true;
          if (pw1El) pw1El.value = '';
          if (pw2El) pw2El.value = '';
          enableDialog.showModal();
          if (pw1El) pw1El.focus();
        } else {
          // User wants to disable
          if (!OBS.storage.isUnlocked()) {
            checkbox.checked = true; // revert
            alert('Please unlock the draft first before disabling encryption.');
            return;
          }
          checkbox.disabled = true;
          OBS.storage.setEncryption(false, '').then(function () {
            checkbox.disabled = false;
            updateEncryptionUI();
          }).catch(function () {
            checkbox.disabled = false;
            checkbox.checked  = OBS.storage.isEncrypted();
          });
        }
      });
    }

    // ── Enable dialog: submit ──────────────────────────────
    if (enableSubmit) {
      enableSubmit.addEventListener('click', function () {
        var pw1 = pw1El ? pw1El.value : '';
        var pw2 = pw2El ? pw2El.value : '';
        if (!pw1) {
          if (enableError) { enableError.textContent = 'Please enter a password.'; enableError.hidden = false; }
          return;
        }
        if (pw1 !== pw2) {
          if (enableError) { enableError.textContent = 'Passwords do not match. Please re-enter.'; enableError.hidden = false; }
          return;
        }
        if (enableError) enableError.hidden = true;
        enableSubmit.disabled = true;
        enableSubmit.textContent = 'Enabling…';
        OBS.storage.setEncryption(true, pw1).then(function () {
          if (enableDialog) enableDialog.close();
          enableSubmit.disabled = false;
          enableSubmit.textContent = 'Enable encryption';
          if (pw1El) pw1El.value = '';
          if (pw2El) pw2El.value = '';
          updateEncryptionUI();
        }).catch(function (e) {
          if (enableError) {
            enableError.textContent = 'Error enabling encryption: ' + (e && e.message ? e.message : String(e));
            enableError.hidden = false;
          }
          enableSubmit.disabled = false;
          enableSubmit.textContent = 'Enable encryption';
        });
      });
    }

    // ── Enable dialog: Enter key shortcut ─────────────────
    if (enableDialog) {
      enableDialog.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && enableSubmit && !enableSubmit.disabled) enableSubmit.click();
      });
      // When the dialog is dismissed with Escape, ensure checkbox stays unchecked
      enableDialog.addEventListener('cancel', function () {
        if (checkbox) checkbox.checked = OBS.storage.isEncrypted();
      });
    }

    // ── Enable dialog: cancel ─────────────────────────────
    if (enableCancel) {
      enableCancel.addEventListener('click', function () {
        if (enableDialog) enableDialog.close();
        if (pw1El) pw1El.value = '';
        if (pw2El) pw2El.value = '';
        if (enableError) enableError.hidden = true;
        if (checkbox) checkbox.checked = OBS.storage.isEncrypted();
      });
    }

    // ── Unlock dialog: submit ─────────────────────────────
    if (unlockSubmit) {
      unlockSubmit.addEventListener('click', function () {
        var pw = unlockPwEl ? unlockPwEl.value : '';
        if (!pw) {
          if (unlockError) { unlockError.textContent = 'Please enter your password.'; unlockError.hidden = false; }
          return;
        }
        if (unlockError) unlockError.hidden = true;
        unlockSubmit.disabled = true;
        unlockSubmit.textContent = 'Unlocking…';
        OBS.storage.unlock(pw).then(function (result) {
          unlockSubmit.disabled = false;
          unlockSubmit.textContent = 'Unlock';
          if (result.ok) {
            if (unlockPwEl) unlockPwEl.value = '';
            if (unlockDialog) unlockDialog.close();
            resumeEncryptedDraft(result.assessment);
            updateEncryptionUI();
          } else {
            if (unlockError) { unlockError.textContent = 'Incorrect password. Please try again.'; unlockError.hidden = false; }
            if (unlockPwEl) { unlockPwEl.value = ''; unlockPwEl.focus(); }
          }
        }).catch(function () {
          unlockSubmit.disabled = false;
          unlockSubmit.textContent = 'Unlock';
          if (unlockError) { unlockError.textContent = 'An error occurred. Please try again.'; unlockError.hidden = false; }
        });
      });
    }

    // ── Unlock dialog: Enter key shortcut ─────────────────
    if (unlockPwEl) {
      unlockPwEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && unlockSubmit && !unlockSubmit.disabled) unlockSubmit.click();
      });
    }

    // ── Unlock dialog: skip (start without the encrypted draft) ──
    if (unlockSkip) {
      unlockSkip.addEventListener('click', function () {
        if (unlockPwEl) unlockPwEl.value = '';
        if (unlockError) unlockError.hidden = true;
        if (unlockDialog) unlockDialog.close();
        updateEncryptionUI();
      });
    }

    // Set initial visual state
    updateEncryptionUI();
  }

  /* ── Init ────────────────────────────────────────────────── */

  function init() {
    // Apply translated chrome on initial load
    applyChrome(app.lang);

    // Footer year
    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Set today's date as default
    var dateEl = document.getElementById('assessment-date');
    if (dateEl && !dateEl.value) {
      var now = new Date();
      var yyyy = now.getFullYear();
      var mm = String(now.getMonth() + 1).padStart(2, '0');
      var dd = String(now.getDate()).padStart(2, '0');
      dateEl.value = yyyy + '-' + mm + '-' + dd;
    }

    // localStorage availability check
    if (!OBS.storage.available()) {
      var lsWarn = document.getElementById('localstorage-warning');
      if (lsWarn) lsWarn.hidden = false;
    }

    // Populate template <select>
    populateTemplateSelect();

    // Init encryption UI handlers before draft check (unlock dialog may open below)
    initEncryptionUI();

    // Check for existing draft
    var prior = OBS.storage.loadDraft();
    if (prior && prior.ok) {
      var draftAssessment = prior.assessment;
      var draftTemplate = window.OBS_TEMPLATES &&
                          window.OBS_TEMPLATES[draftAssessment.templateId];
      if (draftTemplate) {
        var draftBanner = document.getElementById('draft-banner');
        var draftText = document.getElementById('draft-banner-text');
        if (draftBanner && draftText) {
          var clientName = draftAssessment.meta && draftAssessment.meta.clientName;
          draftText.textContent = clientName
            ? OBS.ui.t('draft.bannerWithName', app.lang).replace('{name}', clientName)
            : OBS.ui.t('draft.bannerNoName', app.lang);
          draftBanner.hidden = false;

          document.getElementById('btn-resume-draft').addEventListener('click', function () {
            draftBanner.hidden = true;
            var result = OBS.storage.reconcile(draftAssessment, draftTemplate);
            app.template = draftTemplate;
            app.assessment = result.assessment;
            app.lang = app.assessment.language || 'en';
            document.documentElement.lang = app.lang;
            buildLangToggle(draftTemplate);
            // Sync template select
            var sel = document.getElementById('template-select');
            if (sel) sel.value = draftTemplate.id;
            // Restore form fields
            restoreFormMeta(app.assessment.meta);
            if (result.notices.length) showNotices(result.notices);
            autosave();
            showTab('questionnaire');
            render();
          });

          document.getElementById('btn-discard-draft').addEventListener('click', function () {
            draftBanner.hidden = true;
            // Clear the draft key so it won't be offered again
            try { localStorage.removeItem('obs-assessment-draft'); } catch (e) { /* ignore */ }
          });
        }
      }
    } else if (prior && prior.encrypted) {
      // Draft is AES-GCM encrypted — open the unlock dialog
      var encUnlockDlg = document.getElementById('enc-unlock-dialog');
      if (encUnlockDlg) {
        encUnlockDlg.showModal();
        // Focus after the browser has rendered the dialog
        var encPwInput = document.getElementById('enc-unlock-password');
        if (encPwInput) setTimeout(function () { encPwInput.focus(); }, 60);
      }
    }

    // ── Wire tab nav ─────────────────────────────────────────
    var tabBtns = document.querySelectorAll('[role="tab"]');
    for (var ti = 0; ti < tabBtns.length; ti++) {
      tabBtns[ti].addEventListener('click', function () {
        var tabName = this.getAttribute('data-tab');
        showTab(tabName);
        if (tabName === 'dashboard') {
          // Always re-render so the dashboard reflects the latest answers
          if (typeof OBS.report !== 'undefined' &&
              typeof OBS.report.renderDashboard === 'function' &&
              app.assessment) {
            var dashPanel = document.getElementById('dashboard-main');
            if (dashPanel) {
              OBS.report.renderDashboard(dashPanel, app.template, app.assessment, app.lang);
            }
          }
        } else if (tabName === 'editor') {
          if (typeof OBS !== 'undefined' &&
              OBS.editor && typeof OBS.editor.render === 'function') {
            var editorPanel = document.getElementById('editor-main');
            if (editorPanel) OBS.editor.render(editorPanel);
          }
        }
      });
    }

    // ── Wire Begin button ────────────────────────────────────
    var btnBegin = document.getElementById('btn-begin');
    if (btnBegin) {
      btnBegin.addEventListener('click', function () {
        var sel = document.getElementById('template-select');
        var templateId = sel ? sel.value : null;
        if (!templateId || !window.OBS_TEMPLATES || !window.OBS_TEMPLATES[templateId]) {
          alert(OBS.ui.t('alert.noTemplate', app.lang));
          return;
        }
        newAssessment(templateId);
        // Read metadata from form into assessment
        var meta = readMetaFromForm();
        app.assessment.meta = meta;
        autosave();
        showTab('questionnaire');
        render();
      });
    }

    // ── Wire meta field changes (live autosave) ──────────────
    var metaMap = {
      'client-name': 'clientName',
      'assessor-name': 'assessorName',
      'meta-org': 'assessorOrg',
      'assessment-date': 'date'
    };
    var metaIds = Object.keys(metaMap);
    for (var mi = 0; mi < metaIds.length; mi++) {
      (function (fieldId, propKey) {
        var el = document.getElementById(fieldId);
        if (el) {
          el.addEventListener('input', function () {
            if (app.assessment && app.assessment.meta) {
              app.assessment.meta[propKey] = el.value;
              autosave();
            }
          });
        }
      })(metaIds[mi], metaMap[metaIds[mi]]);
    }

    // ── Wire Save (JSON) ─────────────────────────────────────
    var btnSave = document.getElementById('btn-save');
    if (btnSave) {
      btnSave.addEventListener('click', function () {
        if (!app.assessment) {
          alert(OBS.ui.t('alert.noAssessmentSave', app.lang));
          return;
        }
        // Sync meta from form before saving
        var meta = readMetaFromForm();
        Object.assign(app.assessment.meta, meta);
        var content = OBS.storage.serialize(app.assessment);
        var filename = safeFilename(app.assessment.meta.clientName) + '.json';
        downloadBlob(content, filename, 'application/json');
      });
    }

    // ── Wire Import ──────────────────────────────────────────
    var btnImport = document.getElementById('btn-import');
    var importFile = document.getElementById('import-file');
    if (btnImport && importFile) {
      btnImport.addEventListener('click', function () {
        importFile.value = '';
        importFile.click();
      });
      importFile.addEventListener('change', function () {
        var file = importFile.files && importFile.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          var parsed = OBS.storage.parseAssessment(e.target.result);
          if (!parsed.ok) {
            alert(OBS.ui.t('alert.importFailed', app.lang) + parsed.error);
            return;
          }
          var imported = parsed.assessment;
          var template = window.OBS_TEMPLATES &&
                         window.OBS_TEMPLATES[imported.templateId];
          if (!template) {
            alert(OBS.ui.t('alert.importBadTmpl1', app.lang) + imported.templateId +
                  OBS.ui.t('alert.importBadTmpl2', app.lang));
            return;
          }
          var result = OBS.storage.reconcile(imported, template);
          app.template = template;
          app.assessment = result.assessment;
          app.lang = app.assessment.language || 'en';
          document.documentElement.lang = app.lang;
          buildLangToggle(template);
          // Sync template select
          var sel = document.getElementById('template-select');
          if (sel) sel.value = template.id;
          restoreFormMeta(app.assessment.meta);
          if (result.notices.length) showNotices(result.notices);
          autosave();
          showTab('questionnaire');
          render();
        };
        reader.onerror = function () {
          alert(OBS.ui.t('alert.fileReadError', app.lang));
        };
        reader.readAsText(file);
      });
    }

    // ── Wire Export PDF — opens options dialog first ─────────
    var btnPdf = document.getElementById('btn-export-pdf');
    if (btnPdf) {
      btnPdf.addEventListener('click', function () {
        if (!app.assessment) { alert(OBS.ui.t('alert.noAssessmentExport', app.lang)); return; }
        if (!(OBS.exporters && typeof OBS.exporters.buildPdf === 'function')) {
          alert(OBS.ui.t('alert.noPdf', app.lang));
          return;
        }
        var dlg = document.getElementById('pdf-options-dialog');
        if (dlg) {
          dlg.showModal();
          // Move focus to the first checkbox so keyboard users can act immediately
          var firstCb = dlg.querySelector('input[type="checkbox"]');
          if (firstCb) firstCb.focus();
        }
      });
    }

    // ── Wire PDF options dialog ──────────────────────────────
    var pdfOptsDlg   = document.getElementById('pdf-options-dialog');
    var btnPdfGen    = document.getElementById('pdf-options-generate');
    var btnPdfCancel = document.getElementById('pdf-options-cancel');

    if (pdfOptsDlg) {
      // Cancel / Escape (native <dialog> handles Escape automatically with showModal)
      if (btnPdfCancel) {
        btnPdfCancel.addEventListener('click', function () {
          pdfOptsDlg.close();
        });
      }

      // Generate PDF with chosen options
      if (btnPdfGen) {
        btnPdfGen.addEventListener('click', function () {
          var options = {
            summary:         !!(document.getElementById('pdf-opt-summary') || {}).checked,
            charts:          !!(document.getElementById('pdf-opt-charts') || {}).checked,
            recommendations: !!(document.getElementById('pdf-opt-recommendations') || {}).checked,
            details:         !!(document.getElementById('pdf-opt-details') || {}).checked,
            narratives:      !!(document.getElementById('pdf-opt-narratives') || {}).checked
          };
          pdfOptsDlg.close();
          if (!app.assessment) return;
          try {
            // Render the dashboard first so charts are always available,
            // even if the user never opened the Dashboard tab.
            var imgs = {};
            if (OBS.report && OBS.report.renderDashboard && OBS.report.chartImages) {
              var panel = document.getElementById('tab-dashboard');
              if (panel) OBS.report.renderDashboard(panel, app.template, app.assessment, app.lang);
              imgs = OBS.report.chartImages() || {};
            }
            var doc = OBS.exporters.buildPdf(app.template, app.assessment, app.lang, imgs, options);
            doc.save(safeFilename(app.assessment.meta.clientName || 'assessment') + '.pdf');
          } catch (e) {
            alert(OBS.ui.t('alert.pdfError', app.lang) + (e && e.message ? e.message : e));
          }
        });
      }
    }

    // ── Wire Export CSV (guarded) ────────────────────────────
    var btnCsv = document.getElementById('btn-export-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', function () {
        if (!app.assessment) { alert(OBS.ui.t('alert.noAssessmentExport', app.lang)); return; }
        if (!(OBS.exporters && typeof OBS.exporters.assessmentToCsv === 'function')) {
          alert(OBS.ui.t('alert.noCsv', app.lang));
          return;
        }
        var csv = OBS.exporters.assessmentToCsv(app.template, app.assessment, app.lang);
        downloadBlob(csv, safeFilename(app.assessment.meta.clientName || 'assessment') + '.csv', 'text/csv;charset=utf-8');
      });
    }

    // ── Wire logo file input ─────────────────────────────────
    var logoFile = document.getElementById('logo-file');
    var logoPreview = document.getElementById('logo-preview');
    if (logoFile) {
      logoFile.addEventListener('change', function () {
        var file = logoFile.files && logoFile.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          var dataURL = e.target.result;
          // Always cache so the value is available when Begin is clicked
          pendingLogo = dataURL;
          if (app.assessment && app.assessment.meta) {
            app.assessment.meta.logo = dataURL;
          }
          if (logoPreview) {
            logoPreview.src = dataURL;
            logoPreview.hidden = false;
          }
          autosave();
        };
        reader.readAsDataURL(file);
      });
    }

    // ── Wire Remove logo button ──────────────────────────────
    var btnRemoveLogo = document.getElementById('btn-remove-logo');
    if (btnRemoveLogo) {
      btnRemoveLogo.addEventListener('click', function () {
        // Always clear so Begin picks up the removal even before assessment exists
        pendingLogo = null;
        if (app.assessment && app.assessment.meta) {
          app.assessment.meta.logo = null;
        }
        if (logoPreview) {
          logoPreview.src = '';
          logoPreview.hidden = true;
        }
        if (logoFile) logoFile.value = '';
        autosave();
      });
    }

    // ── Wire brand colour input ──────────────────────────────
    var brandColorInput = document.getElementById('meta-brand-color');
    if (brandColorInput) {
      brandColorInput.addEventListener('change', function () {
        pendingBrandColor = brandColorInput.value;
        if (app.assessment && app.assessment.meta) {
          app.assessment.meta.brandColor = pendingBrandColor;
        }
        autosave();
      });
    }

    // ── Wire reset brand colour button ───────────────────────
    var btnResetBrand = document.getElementById('btn-reset-brand');
    if (btnResetBrand) {
      btnResetBrand.addEventListener('click', function () {
        pendingBrandColor = '';
        if (brandColorInput) brandColorInput.value = '#0f213d';
        if (app.assessment && app.assessment.meta) {
          app.assessment.meta.brandColor = '';
        }
        autosave();
      });
    }

    // ── Attach questionnaire delegated listeners ──────────────
    attachQuestionnaireListeners();
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ──────────────────────────────────────────── */
  app.emptyAssessment      = emptyAssessment;
  app.newAssessment        = newAssessment;
  app.autosave             = autosave;
  app.setLang              = setLang;
  app.showTab              = showTab;
  app.render               = render;
  app.renderQuestionnaire  = renderQuestionnaire;

})();
