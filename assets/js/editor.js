(function (root, factory) {
  'use strict';
  root.OBS = root.OBS || {};
  root.OBS.editor = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  /* ── Module state ────────────────────────────────────────── */
  var wc = null;            // working copy of the template being edited
  var _panel = null;        // the editor container element
  var _listenersSet = false;// whether delegated listeners are attached

  /* ── Utility helpers ─────────────────────────────────────── */

  function deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function downloadBlob(content, filename, mime) {
    var blob = new Blob([content], { type: mime });
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

  function getPathValue(obj, path) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      var p = parts[i];
      cur = /^\d+$/.test(p) ? cur[parseInt(p, 10)] : cur[p];
    }
    return cur;
  }

  function setPathValue(obj, path, value) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      var p = parts[i];
      var next = /^\d+$/.test(p) ? cur[parseInt(p, 10)] : cur[p];
      if (next == null) return;
      cur = next;
    }
    var last = parts[parts.length - 1];
    if (/^\d+$/.test(last)) {
      cur[parseInt(last, 10)] = value;
    } else {
      cur[last] = value;
    }
  }

  /* ── Default objects ─────────────────────────────────────── */

  function defaultTemplate() {
    return {
      id: 'custom-template',
      version: '1.0.0',
      title: { en: 'New Template', sq: '' },
      description: { en: '', sq: '' },
      languages: ['en'],
      translationStatus: {},
      maturityLevels: [
        { level: 1, label: { en: 'Initial', sq: 'Fillestar' }, min: 0, max: 20 },
        { level: 2, label: { en: 'Developing', sq: 'Në zhvillim' }, min: 21, max: 40 },
        { level: 3, label: { en: 'Defined', sq: 'I përcaktuar' }, min: 41, max: 60 },
        { level: 4, label: { en: 'Managed', sq: 'I menaxhuar' }, min: 61, max: 80 },
        { level: 5, label: { en: 'Optimized', sq: 'I optimizuar' }, min: 81, max: 100 }
      ],
      domains: []
    };
  }

  function defaultDomain() {
    return {
      id: 'domain-' + Date.now(),
      title: { en: 'New Domain', sq: '' },
      customSlots: 2,
      questions: []
    };
  }

  function newQuestionId() {
    var existing = {};
    if (wc && wc.domains) {
      wc.domains.forEach(function (d) {
        (d.questions || []).forEach(function (q) { existing[q.id] = true; });
      });
    }
    var n = 1;
    while (existing['Q' + n]) n++;
    return 'Q' + n;
  }

  function defaultQuestion() {
    return {
      id: newQuestionId(),
      kind: 'standard',
      threatIndicator: 3,
      weight: 1,
      critical: false,
      text: { en: '', sq: '' },
      goodPractice: { en: [], sq: [] },
      followUp: { en: '', sq: '' },
      references: { iso27001: '', iso27002: '', nis2: '', cis: '', other: '' }
    };
  }

  /* ── Entry point ─────────────────────────────────────────── */

  function render(panel) {
    // Initialise working copy on first call, or when panel changes
    if (!wc) {
      var src = (window.OBS_TEMPLATES && window.OBS_TEMPLATES['infosec-iso27001']) ||
                (window.OBS_TEMPLATES && window.OBS_TEMPLATES[Object.keys(window.OBS_TEMPLATES || {})[0]]);
      wc = src ? deepClone(src) : defaultTemplate();
    }

    if (panel !== _panel) {
      // Detach old listeners if any
      if (_panel && _listenersSet) {
        _panel.removeEventListener('input', onFieldChange);
        _panel.removeEventListener('change', onFieldChange);
      }
      _panel = panel;
      _listenersSet = false;
    }

    buildUI(panel);

    if (!_listenersSet) {
      panel.addEventListener('input', onFieldChange);
      panel.addEventListener('change', onFieldChange);
      _listenersSet = true;
    }
  }

  /* ── Delegated field-change handler ─────────────────────── */

  function onFieldChange(e) {
    var t = e.target;
    var path = t.getAttribute('data-ed-path');
    if (!path || !wc) return;
    var isArray = t.getAttribute('data-ed-type') === 'array';
    var value;
    if (t.type === 'checkbox') {
      value = t.checked;
    } else if (isArray) {
      value = t.value
        .split('\n')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    } else if (t.type === 'number') {
      value = t.value !== '' ? Number(t.value) : null;
    } else {
      value = t.value;
    }
    setPathValue(wc, path, value);
    // Update domain/question preview text in summary without full re-render
    var previewTarget = t.getAttribute('data-ed-preview-target');
    if (previewTarget) {
      var previewEl = document.getElementById(previewTarget);
      if (previewEl) previewEl.textContent = t.value || '(unnamed)';
    }
  }

  /* ── Structural re-render ────────────────────────────────── */

  // Capture which domain/question <details> are open before re-render
  function captureOpenStates() {
    var domStates = {};
    var qStates = {};
    if (!_panel) return { d: domStates, q: qStates };
    var dDetails = _panel.querySelectorAll('[data-ed-domain-idx]');
    for (var i = 0; i < dDetails.length; i++) {
      var di = dDetails[i].getAttribute('data-ed-domain-idx');
      domStates[di] = dDetails[i].open;
    }
    var qDetails = _panel.querySelectorAll('[data-ed-question-key]');
    for (var j = 0; j < qDetails.length; j++) {
      var key = qDetails[j].getAttribute('data-ed-question-key');
      qStates[key] = qDetails[j].open;
    }
    return { d: domStates, q: qStates };
  }

  function rerender(openStates) {
    var states = openStates || captureOpenStates();
    buildUI(_panel);
    // Restore open states
    if (!_panel) return;
    var dDetails = _panel.querySelectorAll('[data-ed-domain-idx]');
    for (var i = 0; i < dDetails.length; i++) {
      var di = dDetails[i].getAttribute('data-ed-domain-idx');
      if (states.d[di]) dDetails[i].open = true;
    }
    var qDetails = _panel.querySelectorAll('[data-ed-question-key]');
    for (var j = 0; j < qDetails.length; j++) {
      var key = qDetails[j].getAttribute('data-ed-question-key');
      if (states.q[key]) qDetails[j].open = true;
    }
  }

  /* ── DOM builders ────────────────────────────────────────── */

  function makeEl(tag, className) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  function makeBtn(text, className, handler) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = text;
    if (handler) btn.addEventListener('click', handler);
    return btn;
  }

  /* Create a labelled field group. Returns the input/textarea element. */
  function makeField(container, labelText, inputEl, uid) {
    var group = makeEl('div', 'editor-field-group');
    var lbl = document.createElement('label');
    lbl.setAttribute('for', uid);
    lbl.textContent = labelText;
    group.appendChild(lbl);
    inputEl.id = uid;
    group.appendChild(inputEl);
    container.appendChild(group);
    return inputEl;
  }

  function makeTextInput(uid, path, value, previewId) {
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.setAttribute('data-ed-path', path);
    inp.value = value != null ? String(value) : '';
    if (previewId) inp.setAttribute('data-ed-preview-target', previewId);
    return inp;
  }

  function makeNumberInput(uid, path, value, min, max) {
    var inp = document.createElement('input');
    inp.type = 'number';
    if (min != null) inp.min = String(min);
    if (max != null) inp.max = String(max);
    inp.setAttribute('data-ed-path', path);
    inp.value = value != null ? String(value) : '';
    return inp;
  }

  function makeTextarea(uid, path, value, rows, isArray) {
    var ta = document.createElement('textarea');
    ta.rows = rows || 3;
    ta.setAttribute('data-ed-path', path);
    if (isArray) {
      ta.setAttribute('data-ed-type', 'array');
      ta.value = Array.isArray(value) ? value.join('\n') : '';
    } else {
      ta.value = value != null ? String(value) : '';
    }
    return ta;
  }

  function makeSelect(uid, path, options, selectedVal) {
    var sel = document.createElement('select');
    sel.setAttribute('data-ed-path', path);
    options.forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      if (o.value === selectedVal) opt.selected = true;
      sel.appendChild(opt);
    });
    return sel;
  }

  /* ── Toolbar ─────────────────────────────────────────────── */

  function buildToolbar() {
    var bar = makeEl('div', 'editor-toolbar');

    // Load group
    var loadGroup = makeEl('div', 'editor-toolbar__group');

    var loadLbl = document.createElement('label');
    loadLbl.className = 'editor-toolbar__label';
    loadLbl.setAttribute('for', 'editor-template-source');
    loadLbl.textContent = 'Load from:';
    loadGroup.appendChild(loadLbl);

    var srcSel = document.createElement('select');
    srcSel.className = 'editor-toolbar__select';
    srcSel.id = 'editor-template-source';
    var tmplIds = window.OBS_TEMPLATES ? Object.keys(window.OBS_TEMPLATES) : [];
    tmplIds.forEach(function (id) {
      var opt = document.createElement('option');
      opt.value = id;
      opt.textContent = id;
      srcSel.appendChild(opt);
    });
    var blankOpt = document.createElement('option');
    blankOpt.value = '__blank__';
    blankOpt.textContent = '— Blank template —';
    srcSel.appendChild(blankOpt);
    // Pre-select current wc id if present
    if (wc && wc.id) {
      for (var k = 0; k < srcSel.options.length; k++) {
        if (srcSel.options[k].value === wc.id) {
          srcSel.selectedIndex = k;
          break;
        }
      }
    }
    loadGroup.appendChild(srcSel);

    loadGroup.appendChild(makeBtn('Load', 'btn-secondary btn-sm editor-btn', function () {
      var id = srcSel.value;
      var states = captureOpenStates();
      if (id === '__blank__') {
        wc = defaultTemplate();
      } else if (window.OBS_TEMPLATES && window.OBS_TEMPLATES[id]) {
        wc = deepClone(window.OBS_TEMPLATES[id]);
      }
      rerender(states);
    }));

    bar.appendChild(loadGroup);

    // Action buttons
    var actions = makeEl('div', 'editor-toolbar__actions');

    actions.appendChild(makeBtn('Validate', 'btn-secondary btn-sm editor-btn', function () {
      if (window.OBS && OBS.validate) {
        showValidationResult(OBS.validate.validateTemplate(wc));
      }
    }));

    actions.appendChild(makeBtn('Export JSON', 'btn-secondary btn-sm editor-btn', function () {
      var id = (wc && wc.id) || 'template';
      downloadBlob(JSON.stringify(wc, null, 2), id + '.template.json', 'application/json');
    }));

    // Import
    var importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json';
    importInput.hidden = true;
    importInput.setAttribute('aria-hidden', 'true');
    actions.appendChild(importInput);

    var importBtn = makeBtn('Import JSON', 'btn-secondary btn-sm editor-btn', function () {
      importInput.value = '';
      importInput.click();
    });
    actions.appendChild(importBtn);

    importInput.addEventListener('change', function () {
      var file = importInput.files && importInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var parsed;
        try { parsed = JSON.parse(e.target.result); }
        catch (ex) {
          showValidationResult({ ok: false, errors: ['JSON parse error: ' + String(ex.message || ex)] });
          return;
        }
        if (window.OBS && OBS.validate) {
          var result = OBS.validate.validateTemplate(parsed);
          showValidationResult(result);
          if (result.ok) {
            wc = parsed;
            rerender({});
          }
        } else {
          wc = parsed;
          rerender({});
        }
      };
      reader.onerror = function () {
        showValidationResult({ ok: false, errors: ['Could not read the selected file.'] });
      };
      reader.readAsText(file);
    });

    // Register & use
    actions.appendChild(makeBtn('Register & use', 'btn-primary btn-sm editor-btn', function () {
      if (!window.OBS || !OBS.validate) return;
      var result = OBS.validate.validateTemplate(wc);
      if (!result.ok) {
        showValidationResult(result);
        return;
      }
      window.OBS_TEMPLATES = window.OBS_TEMPLATES || {};
      window.OBS_TEMPLATES[wc.id] = deepClone(wc);
      // Refresh the Start tab's template select
      var startSel = document.getElementById('template-select');
      if (startSel) {
        var found = false;
        var displayTitle = (OBS.i18n && OBS.app)
          ? OBS.i18n.pick(wc.title, OBS.app.lang || 'en')
          : (wc.title && wc.title.en) || wc.id;
        for (var oi = 0; oi < startSel.options.length; oi++) {
          if (startSel.options[oi].value === wc.id) {
            startSel.options[oi].textContent = displayTitle;
            found = true;
            break;
          }
        }
        if (!found) {
          var newOpt = document.createElement('option');
          newOpt.value = wc.id;
          newOpt.textContent = displayTitle;
          startSel.appendChild(newOpt);
        }
        startSel.value = wc.id;
      }
      showValidationResult({
        ok: true,
        errors: [],
        message: 'Template "' + wc.id + '" registered. Go to the Start tab to begin a new assessment with it.'
      });
    }));

    bar.appendChild(actions);
    return bar;
  }

  /* ── Validation result banner ────────────────────────────── */

  function showValidationResult(result) {
    var el = document.getElementById('editor-val-result');
    if (!el) return;
    el.hidden = false;
    while (el.firstChild) el.removeChild(el.firstChild);

    if (result.message) {
      el.className = 'editor-val-result editor-val-result--ok';
      var mp = document.createElement('p');
      mp.textContent = result.message;
      el.appendChild(mp);
      return;
    }

    if (result.ok) {
      el.className = 'editor-val-result editor-val-result--ok';
      var op = document.createElement('p');
      op.textContent = 'Template is valid — all fields and languages look good.';
      el.appendChild(op);
    } else {
      el.className = 'editor-val-result editor-val-result--error';
      var hp = document.createElement('p');
      hp.textContent = 'Validation errors (' + result.errors.length + '):';
      el.appendChild(hp);
      var ul = document.createElement('ul');
      result.errors.forEach(function (err) {
        var li = document.createElement('li');
        li.textContent = err;
        ul.appendChild(li);
      });
      el.appendChild(ul);
    }
  }

  /* ── Template metadata section ───────────────────────────── */

  function buildMetaSection() {
    var section = makeEl('div', 'editor-section');

    var fs = makeEl('fieldset', 'editor-fieldset');
    var legend = document.createElement('legend');
    legend.className = 'editor-legend';
    legend.textContent = 'Template metadata';
    fs.appendChild(legend);

    var grid = makeEl('div', 'editor-meta-grid');

    var title = wc.title || {};
    var desc = wc.description || {};

    makeField(grid, 'Template ID', makeTextInput('ed-id', 'id', wc.id || ''), 'ed-id');
    makeField(grid, 'Version', makeTextInput('ed-version', 'version', wc.version || ''), 'ed-version');
    makeField(grid, 'Title (EN)', makeTextInput('ed-title-en', 'title.en', title.en || ''), 'ed-title-en');
    makeField(grid, 'Title (SQ)', makeTextInput('ed-title-sq', 'title.sq', title.sq || ''), 'ed-title-sq');
    makeField(grid, 'Description (EN)', makeTextarea('ed-desc-en', 'description.en', desc.en || '', 3), 'ed-desc-en');
    makeField(grid, 'Description (SQ)', makeTextarea('ed-desc-sq', 'description.sq', desc.sq || '', 3), 'ed-desc-sq');

    fs.appendChild(grid);
    section.appendChild(fs);
    return section;
  }

  /* ── Domains section ─────────────────────────────────────── */

  function buildDomainsSection() {
    var section = makeEl('div', 'editor-section');

    // Section heading
    var headRow = makeEl('div', 'editor-section-heading');
    var h3 = document.createElement('h3');
    h3.textContent = 'Domains';
    headRow.appendChild(h3);
    section.appendChild(headRow);

    var domains = wc.domains || [];
    domains.forEach(function (domain, di) {
      section.appendChild(buildDomainCard(domain, di, domains.length));
    });

    // Add domain button
    var addDomainBtn = makeBtn('+ Add domain', 'editor-add-btn editor-add-domain-btn', function () {
      var states = captureOpenStates();
      if (!wc.domains) wc.domains = [];
      wc.domains.push(defaultDomain());
      rerender(states);
    });
    section.appendChild(addDomainBtn);

    return section;
  }

  function buildDomainCard(domain, di, totalDomains) {
    var details = document.createElement('details');
    details.className = 'editor-domain-details';
    details.setAttribute('data-ed-domain-idx', String(di));

    // Summary (header) row
    var summary = document.createElement('summary');
    summary.className = 'editor-domain-summary';

    var chevron = makeEl('span', 'editor-domain-chevron');
    chevron.textContent = '▶';
    summary.appendChild(chevron);

    var previewId = 'editor-domain-preview-' + di;
    var titlePreview = makeEl('span', 'editor-domain-summary__title');
    titlePreview.id = previewId;
    titlePreview.textContent = (domain.title && domain.title.en) || '(unnamed domain)';
    summary.appendChild(titlePreview);

    // Move up/down
    var moveBtns = makeEl('div', 'editor-domain-move-btns');
    if (di > 0) {
      moveBtns.appendChild(makeBtn('▲', 'editor-icon-btn', function (e) {
        e.stopPropagation();
        var states = captureOpenStates();
        var tmp = wc.domains[di - 1];
        wc.domains[di - 1] = wc.domains[di];
        wc.domains[di] = tmp;
        rerender(states);
      }));
    }
    if (di < totalDomains - 1) {
      moveBtns.appendChild(makeBtn('▼', 'editor-icon-btn', function (e) {
        e.stopPropagation();
        var states = captureOpenStates();
        var tmp2 = wc.domains[di + 1];
        wc.domains[di + 1] = wc.domains[di];
        wc.domains[di] = tmp2;
        rerender(states);
      }));
    }
    summary.appendChild(moveBtns);

    // Delete domain
    summary.appendChild(makeBtn('Delete', 'editor-icon-btn editor-icon-btn--danger', function (e) {
      e.stopPropagation();
      if (!confirm('Delete domain "' + ((domain.title && domain.title.en) || domain.id) + '"? All its questions will be lost.')) return;
      var states = captureOpenStates();
      wc.domains.splice(di, 1);
      rerender(states);
    }));

    details.appendChild(summary);

    // Body
    var body = makeEl('div', 'editor-domain-body');

    // Domain title fields
    var titleFields = makeEl('div', 'editor-domain-fields');
    var enTitleInp = makeTextInput(
      'ed-dom-' + di + '-title-en',
      'domains.' + di + '.title.en',
      (domain.title && domain.title.en) || '',
      previewId
    );
    makeField(titleFields, 'Domain title (EN)', enTitleInp, 'ed-dom-' + di + '-title-en');

    var sqTitleInp = makeTextInput(
      'ed-dom-' + di + '-title-sq',
      'domains.' + di + '.title.sq',
      (domain.title && domain.title.sq) || ''
    );
    makeField(titleFields, 'Domain title (SQ)', sqTitleInp, 'ed-dom-' + di + '-title-sq');
    body.appendChild(titleFields);

    // Questions
    body.appendChild(buildQuestionsSection(domain, di));

    details.appendChild(body);
    return details;
  }

  /* ── Questions section within a domain ───────────────────── */

  function buildQuestionsSection(domain, di) {
    var wrap = document.createElement('div');

    var qHeading = makeEl('div', 'editor-questions-heading');
    var qh4 = document.createElement('h4');
    qh4.textContent = 'Questions (' + ((domain.questions || []).length) + ')';
    qHeading.appendChild(qh4);
    wrap.appendChild(qHeading);

    var qList = makeEl('div', 'editor-questions-list');
    var questions = domain.questions || [];
    questions.forEach(function (q, qi) {
      qList.appendChild(buildQuestionCard(domain, di, q, qi, questions.length));
    });
    wrap.appendChild(qList);

    // Add question button
    wrap.appendChild(makeBtn('+ Add question', 'editor-add-btn', function () {
      var states = captureOpenStates();
      if (!wc.domains[di].questions) wc.domains[di].questions = [];
      var newQ = defaultQuestion();
      wc.domains[di].questions.push(newQ);
      rerender(states);
    }));

    return wrap;
  }

  /* ── Single question card ────────────────────────────────── */

  function buildQuestionCard(domain, di, q, qi, totalQ) {
    var qKey = di + '.' + qi;

    var details = document.createElement('details');
    details.className = 'editor-question-details';
    details.setAttribute('data-ed-question-key', qKey);

    // Summary
    var summary = document.createElement('summary');
    summary.className = 'editor-question-summary';

    var qChev = makeEl('span', 'editor-question-chevron');
    qChev.textContent = '▶';
    summary.appendChild(qChev);

    var idBadge = makeEl('span', 'editor-question-summary__id');
    idBadge.textContent = q.id || '?';
    summary.appendChild(idBadge);

    var previewId = 'ed-q-preview-' + di + '-' + qi;
    var preview = makeEl('span', 'editor-question-summary__preview');
    preview.id = previewId;
    preview.textContent = (q.text && q.text.en) || '(no text yet)';
    summary.appendChild(preview);

    // Move up/down
    var qMoveBtns = makeEl('div', 'editor-domain-move-btns');
    if (qi > 0) {
      qMoveBtns.appendChild(makeBtn('▲', 'editor-icon-btn', function (e) {
        e.stopPropagation();
        var states = captureOpenStates();
        var qs = wc.domains[di].questions;
        var tmp = qs[qi - 1]; qs[qi - 1] = qs[qi]; qs[qi] = tmp;
        rerender(states);
      }));
    }
    if (qi < totalQ - 1) {
      qMoveBtns.appendChild(makeBtn('▼', 'editor-icon-btn', function (e) {
        e.stopPropagation();
        var states = captureOpenStates();
        var qs2 = wc.domains[di].questions;
        var tmp2 = qs2[qi + 1]; qs2[qi + 1] = qs2[qi]; qs2[qi] = tmp2;
        rerender(states);
      }));
    }
    summary.appendChild(qMoveBtns);

    // Delete question
    summary.appendChild(makeBtn('Delete', 'editor-icon-btn editor-icon-btn--danger', function (e) {
      e.stopPropagation();
      var states = captureOpenStates();
      wc.domains[di].questions.splice(qi, 1);
      rerender(states);
    }));

    details.appendChild(summary);

    // Body
    var body = makeEl('div', 'editor-question-body');
    var basePath = 'domains.' + di + '.questions.' + qi;

    // Meta row: id, kind, threatIndicator, weight, critical
    var metaRow = makeEl('div', 'editor-question-row editor-question-row--meta');

    var idBadgeInput = makeTextInput(
      'ed-q-' + qKey + '-id',
      basePath + '.id',
      q.id || ''
    );
    // Also update the summary badge when id changes
    idBadgeInput.addEventListener('input', function () {
      idBadge.textContent = idBadgeInput.value || '?';
    });
    makeField(metaRow, 'Question ID', idBadgeInput, 'ed-q-' + qKey + '-id');

    makeField(
      metaRow, 'Kind',
      makeSelect('ed-q-' + qKey + '-kind', basePath + '.kind',
        [{ value: 'standard', label: 'Standard' }, { value: 'custom', label: 'Custom' }],
        q.kind || 'standard'),
      'ed-q-' + qKey + '-kind'
    );

    makeField(
      metaRow, 'Threat indicator (1-5)',
      makeNumberInput('ed-q-' + qKey + '-ti', basePath + '.threatIndicator', q.threatIndicator, 1, 5),
      'ed-q-' + qKey + '-ti'
    );

    makeField(
      metaRow, 'Weight',
      makeNumberInput('ed-q-' + qKey + '-wt', basePath + '.weight', q.weight, 0),
      'ed-q-' + qKey + '-wt'
    );

    // Critical checkbox
    var critGroup = makeEl('div', 'editor-field-group');
    var critLbl = document.createElement('label');
    var critId = 'ed-q-' + qKey + '-crit';
    critLbl.setAttribute('for', critId);
    critLbl.textContent = 'Critical';
    var critCb = document.createElement('input');
    critCb.type = 'checkbox';
    critCb.id = critId;
    critCb.checked = !!q.critical;
    critCb.setAttribute('data-ed-path', basePath + '.critical');
    critGroup.appendChild(critLbl);
    critGroup.appendChild(critCb);
    metaRow.appendChild(critGroup);

    body.appendChild(metaRow);

    // Text fields (en/sq)
    var textGrid = makeEl('div', 'editor-bi-grid');
    var enTextTa = makeTextarea('ed-q-' + qKey + '-text-en', basePath + '.text.en', (q.text && q.text.en) || '', 3);
    enTextTa.setAttribute('data-ed-preview-target', previewId);
    enTextTa.addEventListener('input', function () {
      preview.textContent = enTextTa.value || '(no text yet)';
    });
    makeField(textGrid, 'Question text (EN)', enTextTa, 'ed-q-' + qKey + '-text-en');

    var sqTextTa = makeTextarea('ed-q-' + qKey + '-text-sq', basePath + '.text.sq', (q.text && q.text.sq) || '', 3);
    makeField(textGrid, 'Question text (SQ)', sqTextTa, 'ed-q-' + qKey + '-text-sq');
    body.appendChild(textGrid);

    // Good practice (collapsible)
    var gpDetails = document.createElement('details');
    gpDetails.className = 'editor-subsection';
    var gpSummary = document.createElement('summary');
    gpSummary.textContent = 'Good practice (one item per line)';
    gpDetails.appendChild(gpSummary);
    var gpBody = makeEl('div', 'editor-subsection__body');
    var gpGrid = makeEl('div', 'editor-bi-grid');
    var gp = q.goodPractice || {};
    makeField(gpGrid, 'Good practice (EN)', makeTextarea('ed-q-' + qKey + '-gp-en', basePath + '.goodPractice.en', gp.en || [], 5, true), 'ed-q-' + qKey + '-gp-en');
    makeField(gpGrid, 'Good practice (SQ)', makeTextarea('ed-q-' + qKey + '-gp-sq', basePath + '.goodPractice.sq', gp.sq || [], 5, true), 'ed-q-' + qKey + '-gp-sq');
    gpBody.appendChild(gpGrid);
    gpDetails.appendChild(gpBody);
    body.appendChild(gpDetails);

    // Follow-up & References (collapsible)
    var refDetails = document.createElement('details');
    refDetails.className = 'editor-subsection';
    var refSummary = document.createElement('summary');
    refSummary.textContent = 'Follow-up & References';
    refDetails.appendChild(refSummary);
    var refBody = makeEl('div', 'editor-subsection__body');

    var fu = q.followUp || {};
    var fuGrid = makeEl('div', 'editor-bi-grid');
    makeField(fuGrid, 'Follow-up prompt (EN)', makeTextarea('ed-q-' + qKey + '-fu-en', basePath + '.followUp.en', fu.en || '', 2), 'ed-q-' + qKey + '-fu-en');
    makeField(fuGrid, 'Follow-up prompt (SQ)', makeTextarea('ed-q-' + qKey + '-fu-sq', basePath + '.followUp.sq', fu.sq || '', 2), 'ed-q-' + qKey + '-fu-sq');
    refBody.appendChild(fuGrid);

    // References
    var refs = q.references || {};
    var refFields = makeEl('div', 'editor-question-row');
    var refKeys = ['iso27001', 'iso27002', 'nis2', 'cis', 'other'];
    refKeys.forEach(function (rk) {
      makeField(
        refFields,
        rk.toUpperCase(),
        makeTextInput('ed-q-' + qKey + '-ref-' + rk, basePath + '.references.' + rk, refs[rk] || ''),
        'ed-q-' + qKey + '-ref-' + rk
      );
    });
    refBody.appendChild(refFields);

    refDetails.appendChild(refBody);
    body.appendChild(refDetails);

    details.appendChild(body);
    return details;
  }

  /* ── Top-level UI builder ────────────────────────────────── */

  function buildUI(panel) {
    while (panel.firstChild) panel.removeChild(panel.firstChild);

    var layout = makeEl('div', 'editor-layout');

    layout.appendChild(buildToolbar());

    // Validation result area (initially hidden)
    var valResult = makeEl('div', 'editor-val-result');
    valResult.id = 'editor-val-result';
    valResult.hidden = true;
    layout.appendChild(valResult);

    var body = makeEl('div', 'editor-body');
    body.appendChild(buildMetaSection());
    body.appendChild(buildDomainsSection());
    layout.appendChild(body);

    panel.appendChild(layout);
  }

  /* ── Public API ──────────────────────────────────────────── */
  return {
    render: render
  };
});
