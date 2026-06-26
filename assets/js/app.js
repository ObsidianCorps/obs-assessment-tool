(function () {
  'use strict';

  window.OBS = window.OBS || {};

  var app = { template: null, assessment: null, lang: 'en' };
  window.OBS.app = app;

  /* ── Core state helpers ──────────────────────────────────── */

  function emptyAssessment(template) {
    return {
      schemaVersion: 1,
      templateId: template.id,
      templateVersion: template.version,
      meta: { clientName: '', assessorName: '', date: '', logo: null },
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
        typeof OBS.report.renderDashboard === 'function') {
      OBS.report.renderDashboard();
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
    var dt = document.getElementById('assessment-date');
    var lp = document.getElementById('logo-preview');
    if (cl) cl.value = meta.clientName || '';
    if (as) as.value = meta.assessorName || '';
    if (dt) dt.value = meta.date || '';
    if (lp) {
      if (meta.logo) {
        lp.src = meta.logo;
        lp.hidden = false;
      } else {
        lp.src = '';
        lp.hidden = true;
      }
    }
  }

  function readMetaFromForm() {
    return {
      clientName: (document.getElementById('client-name') || { value: '' }).value || '',
      assessorName: (document.getElementById('assessor-name') || { value: '' }).value || '',
      date: (document.getElementById('assessment-date') || { value: '' }).value || '',
      logo: app.assessment ? (app.assessment.meta && app.assessment.meta.logo) : null
    };
  }

  function safeFilename(str) {
    return (str || 'assessment')
      .replace(/[^a-z0-9_\-]/gi, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'assessment';
  }

  /* ── Init ────────────────────────────────────────────────── */

  function init() {
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
          draftText.textContent = 'A saved draft' +
            (clientName ? ' for “' + clientName + '”' : '') +
            ' was found. Resume where you left off, or start fresh.';
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
    }

    // ── Wire tab nav ─────────────────────────────────────────
    var tabBtns = document.querySelectorAll('[role="tab"]');
    for (var ti = 0; ti < tabBtns.length; ti++) {
      tabBtns[ti].addEventListener('click', function () {
        showTab(this.getAttribute('data-tab'));
      });
    }

    // ── Wire Begin button ────────────────────────────────────
    var btnBegin = document.getElementById('btn-begin');
    if (btnBegin) {
      btnBegin.addEventListener('click', function () {
        var sel = document.getElementById('template-select');
        var templateId = sel ? sel.value : null;
        if (!templateId || !window.OBS_TEMPLATES || !window.OBS_TEMPLATES[templateId]) {
          alert('Please select a template first.');
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
          alert('No active assessment to save. Click "Begin assessment" first.');
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
            alert('Import failed: ' + parsed.error);
            return;
          }
          var imported = parsed.assessment;
          var template = window.OBS_TEMPLATES &&
                         window.OBS_TEMPLATES[imported.templateId];
          if (!template) {
            alert('Import failed: template “' + imported.templateId +
                  '” is not available in this version of the tool.');
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
          alert('Could not read the selected file. Please try again.');
        };
        reader.readAsText(file);
      });
    }

    // ── Wire Export PDF (guarded — OBS.exporters arrives in a later task) ──
    var btnPdf = document.getElementById('btn-export-pdf');
    if (btnPdf) {
      btnPdf.addEventListener('click', function () {
        if (!app.assessment) { alert('No active assessment to export.'); return; }
        if (typeof OBS.exporters !== 'undefined' &&
            typeof OBS.exporters.exportPDF === 'function') {
          OBS.exporters.exportPDF(app.assessment, app.template, app.lang);
        } else if (typeof OBS.report !== 'undefined' &&
                   typeof OBS.report.exportPDF === 'function') {
          OBS.report.exportPDF(app.assessment, app.template, app.lang);
        }
        // Silently no-op if exporter not yet loaded (later task)
      });
    }

    // ── Wire Export CSV (guarded) ────────────────────────────
    var btnCsv = document.getElementById('btn-export-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', function () {
        if (!app.assessment) { alert('No active assessment to export.'); return; }
        if (typeof OBS.exporters !== 'undefined' &&
            typeof OBS.exporters.exportCSV === 'function') {
          OBS.exporters.exportCSV(app.assessment, app.template, app.lang);
        } else if (typeof OBS.report !== 'undefined' &&
                   typeof OBS.report.exportCSV === 'function') {
          OBS.report.exportCSV(app.assessment, app.template, app.lang);
        }
        // Silently no-op if exporter not yet loaded (later task)
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
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ──────────────────────────────────────────── */
  app.emptyAssessment = emptyAssessment;
  app.newAssessment   = newAssessment;
  app.autosave        = autosave;
  app.setLang         = setLang;
  app.showTab         = showTab;
  app.render          = render;

})();
