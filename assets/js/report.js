(function (root) {
  'use strict';

  root.OBS = root.OBS || {};

  /* ── Chart instance refs (module-scope for cleanup + chartImages) ── */
  var _radarChart   = null;
  var _doughnutChart = null;
  var _radarCanvas   = null;
  var _doughnutCanvas = null;

  /* ── i18n helper (delegates to OBS.i18n if present) ──────────────── */
  function pick(field, lang) {
    if (root.OBS.i18n && typeof root.OBS.i18n.pick === 'function') {
      return root.OBS.i18n.pick(field, lang);
    }
    if (field == null) return '';
    if (typeof field === 'string') return field;
    if (field[lang] != null && field[lang] !== '') return field[lang];
    return field.en || '';
  }

  /* ── Small DOM helpers ────────────────────────────────────────────── */
  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.style.cssText = styles;
    if (text != null) node.textContent = text;
    return node;
  }

  function sectionHeading(text) {
    var h = document.createElement('h3');
    h.style.cssText = 'font-size:1rem;font-weight:700;color:var(--clr-navy);margin-bottom:1rem;';
    h.textContent = text;
    return h;
  }

  function labelDiv(text) {
    var d = document.createElement('div');
    d.style.cssText = 'font-size:0.75rem;font-weight:700;text-transform:uppercase;' +
      'letter-spacing:0.08em;color:var(--clr-text-muted);margin-bottom:0.5rem;';
    d.textContent = text;
    return d;
  }

  /* ── Destroy previous charts ──────────────────────────────────────── */
  function destroyCharts() {
    if (_radarChart) {
      try { _radarChart.destroy(); } catch (e) { /* ignore */ }
      _radarChart = null;
    }
    if (_doughnutChart) {
      try { _doughnutChart.destroy(); } catch (e) { /* ignore */ }
      _doughnutChart = null;
    }
    _radarCanvas    = null;
    _doughnutCanvas = null;
  }

  /* ── Section 1: Completeness banner ──────────────────────────────── */
  function buildCompletenessBanner(comp) {
    var card = document.createElement('div');
    card.className = 'stat-card';
    card.style.cssText = 'margin-bottom:1.5rem;';

    var valueDiv = document.createElement('div');
    valueDiv.className = 'stat-card__value';
    valueDiv.style.fontSize = '1.375rem';
    valueDiv.textContent = comp.answered + ' of ' + comp.total + ' answered';
    card.appendChild(valueDiv);

    var pct = Math.round(comp.percent);
    var note = pct < 100 ? ' — partial results below; scores may shift as more questions are answered.' : ' — assessment complete.';
    var sub = document.createElement('div');
    sub.className = 'stat-card__label';
    sub.textContent = pct + '% complete' + note;
    card.appendChild(sub);

    return card;
  }

  /* ── Section 2a: Maturity badge ──────────────────────────────────── */
  function buildMaturityCard(overall, mat, lang) {
    var card = document.createElement('div');
    card.className = 'stat-card';

    card.appendChild(labelDiv('Maturity Level'));

    if (mat) {
      var badge = el('div',
        'display:inline-flex;align-items:center;gap:0.5rem;' +
        'background:var(--clr-sky-tint);color:var(--clr-navy);' +
        'border-radius:999px;padding:0.25rem 0.875rem;margin-bottom:0.5rem;');
      badge.appendChild(el('span',
        'font-size:1.5rem;font-weight:800;line-height:1;', 'L' + mat.level));
      badge.appendChild(el('span',
        'font-size:0.875rem;font-weight:600;', pick(mat.label, lang)));
      card.appendChild(badge);

      var scoreNote = document.createElement('div');
      scoreNote.className = 'stat-card__label';
      scoreNote.textContent = 'Overall score: ' + Math.round(overall) + '%';
      card.appendChild(scoreNote);
    } else {
      var noVal = document.createElement('div');
      noVal.className = 'stat-card__value';
      noVal.textContent = '—';
      card.appendChild(noVal);

      var noLbl = document.createElement('div');
      noLbl.className = 'stat-card__label';
      noLbl.textContent = overall != null
        ? 'Score: ' + Math.round(overall) + '% (no maturity band matched)'
        : 'No scored answers yet';
      card.appendChild(noLbl);
    }

    return card;
  }

  /* ── Section 2b: Compliance summary + critical gaps ──────────────── */
  function buildSummaryCard(summary, lang) {
    var card = document.createElement('div');
    card.className = 'stat-card';

    card.appendChild(labelDiv('Compliance Summary'));

    var STATUS_ROWS = [
      { key: 'compliant',    label: 'Compliant',     color: 'var(--clr-compliant)' },
      { key: 'partial',      label: 'Partial',        color: 'var(--clr-partial)' },
      { key: 'nonCompliant', label: 'Non-compliant',  color: 'var(--clr-danger)' },
      { key: 'na',           label: 'N/A',            color: 'var(--clr-na)' },
      { key: 'unanswered',   label: 'Unanswered',     color: 'var(--clr-text-muted)' }
    ];

    var chips = el('div', 'display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;');
    for (var i = 0; i < STATUS_ROWS.length; i++) {
      var row = STATUS_ROWS[i];
      var chip = el('span',
        'display:inline-flex;align-items:center;gap:0.25rem;' +
        'background:var(--clr-bg);border:1px solid var(--clr-border);' +
        'border-radius:999px;padding:0.125rem 0.5rem;font-size:0.75rem;font-weight:600;');
      var dot = el('span',
        'width:8px;height:8px;border-radius:50%;flex-shrink:0;' +
        'background:' + row.color + ';display:inline-block;');
      chip.appendChild(dot);
      chip.appendChild(document.createTextNode(summary[row.key] + ' ' + row.label));
      chips.appendChild(chip);
    }
    card.appendChild(chips);

    /* Critical gaps list */
    var gaps = summary.criticalGaps || [];
    if (gaps.length) {
      var gapHdr = el('div',
        'font-size:0.75rem;font-weight:700;color:var(--clr-danger);' +
        'text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.25rem;',
        'Critical gaps (' + gaps.length + ')');
      card.appendChild(gapHdr);

      var ul = document.createElement('ul');
      ul.style.cssText = 'font-size:0.8rem;padding-left:1.25rem;color:var(--clr-text);margin:0;';
      for (var gi = 0; gi < gaps.length; gi++) {
        var gap = gaps[gi];
        var li = document.createElement('li');
        li.textContent = gap.qid + ': ' + pick(gap.text, lang);
        ul.appendChild(li);
      }
      card.appendChild(ul);
    } else {
      var noGaps = el('div',
        'font-size:0.8rem;color:var(--clr-compliant);font-weight:600;',
        'No critical gaps identified.');
      card.appendChild(noGaps);
    }

    return card;
  }

  /* ── Section 3: Charts ────────────────────────────────────────────── */
  function buildChartSection(template, assessment, scoring, lang) {
    var section = el('div', 'margin-bottom:1.5rem;');
    section.appendChild(sectionHeading('Score Visualisation'));

    var grid = el('div',
      'display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start;');

    /* Radar card */
    var radarCard = document.createElement('div');
    radarCard.className = 'stat-card';
    radarCard.style.textAlign = 'center';
    radarCard.appendChild(labelDiv('Domain Scores'));

    /* Doughnut card */
    var doughnutCard = document.createElement('div');
    doughnutCard.className = 'stat-card';
    doughnutCard.style.textAlign = 'center';
    doughnutCard.appendChild(labelDiv('Status Breakdown'));

    /* --- Compute domain scores for radar --- */
    var domainLabels = [];
    var domainData   = [];
    var hasNull = false;
    var domains = template.domains || [];
    for (var di = 0; di < domains.length; di++) {
      var dom = domains[di];
      var ds  = scoring.domainScore(dom, assessment);
      domainLabels.push(pick(dom.title, lang));
      if (ds.score === null) { hasNull = true; domainData.push(0); }
      else { domainData.push(Math.round(ds.score)); }
    }

    if (hasNull) {
      radarCard.appendChild(
        el('div',
          'font-size:0.7rem;color:var(--clr-text-muted);margin-bottom:0.25rem;',
          'Domains with no scored answers shown as 0'));
    }

    if (typeof root.Chart !== 'undefined') {
      /* ---- Canvas-based charts ---- */
      var radarCanvas = document.createElement('canvas');
      radarCanvas.id     = 'obs-radar-canvas';
      radarCanvas.width  = 360;
      radarCanvas.height = 360;
      _radarCanvas = radarCanvas;
      radarCard.appendChild(radarCanvas);

      var doughnutCanvas = document.createElement('canvas');
      doughnutCanvas.id     = 'obs-doughnut-canvas';
      doughnutCanvas.width  = 320;
      doughnutCanvas.height = 320;
      _doughnutCanvas = doughnutCanvas;
      doughnutCard.appendChild(doughnutCanvas);

      grid.appendChild(radarCard);
      grid.appendChild(doughnutCard);
      section.appendChild(grid);

      /* Draw after DOM is assembled (canvases must be in document for context) */
      /* Chart.js UMD bundle auto-registers all controllers; no Chart.register() needed */
      _radarChart = new root.Chart(radarCanvas.getContext('2d'), {
        type: 'radar',
        data: {
          labels: domainLabels,
          datasets: [{
            label: 'Score (%)',
            data: domainData,
            backgroundColor: 'rgba(28,93,176,0.15)',
            borderColor: '#1c5db0',
            borderWidth: 2,
            pointBackgroundColor: '#1c5db0',
            pointRadius: 4
          }]
        },
        options: {
          animation: false,
          responsive: false,
          devicePixelRatio: 2,
          scales: {
            r: {
              beginAtZero: true,
              min: 0,
              max: 100,
              ticks: { stepSize: 20, font: { size: 9 } },
              pointLabels: { font: { size: 9 } }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });

      var summary = scoring.complianceSummary(template, assessment);
      _doughnutChart = new root.Chart(doughnutCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Compliant', 'Partial', 'Non-compliant', 'N/A', 'Unanswered'],
          datasets: [{
            data: [
              summary.compliant,
              summary.partial,
              summary.nonCompliant,
              summary.na,
              summary.unanswered
            ],
            backgroundColor: ['#16a34a', '#7c3aed', '#dc2626', '#64748b', '#cbd5e1'],
            borderWidth: 0
          }]
        },
        options: {
          animation: false,
          responsive: false,
          devicePixelRatio: 2,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 11 }, padding: 10 }
            }
          }
        }
      });

    } else {
      /* ---- Textual fallback: domain score bars ---- */
      radarCard.appendChild(
        el('div',
          'font-size:0.7rem;color:var(--clr-warning);margin-bottom:0.5rem;',
          'Chart.js not available — showing scores as text.'));

      for (var fdi = 0; fdi < domains.length; fdi++) {
        var fdom = domains[fdi];
        var fds  = scoring.domainScore(fdom, assessment);
        var pct  = fds.score !== null ? Math.round(fds.score) : null;

        var bar = document.createElement('div');
        bar.className = 'domain-score-bar';

        var nameWrap = document.createElement('div');
        nameWrap.appendChild(
          el('div', null, pick(fdom.title, lang)));
        var track = el('div', null);
        track.className = 'domain-score-bar__track';
        var fill = el('div', null);
        fill.className = 'domain-score-bar__fill';
        fill.style.width = (pct !== null ? pct : 0) + '%';
        track.appendChild(fill);
        nameWrap.appendChild(track);

        var pctSpan = el('span', null, pct !== null ? pct + '%' : 'N/A');
        pctSpan.className = 'domain-score-bar__pct';

        bar.appendChild(nameWrap);
        bar.appendChild(pctSpan);
        radarCard.appendChild(bar);
      }

      /* Doughnut fallback: status counts table */
      doughnutCard.appendChild(
        el('div',
          'font-size:0.7rem;color:var(--clr-warning);margin-bottom:0.5rem;',
          'Chart.js not available — showing counts as text.'));

      var sum2 = scoring.complianceSummary(template, assessment);
      var STAT_LABELS = [
        { key: 'compliant',    label: 'Compliant' },
        { key: 'partial',      label: 'Partial' },
        { key: 'nonCompliant', label: 'Non-compliant' },
        { key: 'na',           label: 'N/A' },
        { key: 'unanswered',   label: 'Unanswered' }
      ];
      var ftable = el('table', 'width:100%;border-collapse:collapse;font-size:0.875rem;');
      for (var si = 0; si < STAT_LABELS.length; si++) {
        var ftr = document.createElement('tr');
        var ftd1 = el('td', 'padding:0.25rem 0.5rem;text-align:left;', STAT_LABELS[si].label);
        var ftd2 = el('td', 'padding:0.25rem 0.5rem;text-align:right;font-weight:700;',
          String(sum2[STAT_LABELS[si].key]));
        ftr.appendChild(ftd1);
        ftr.appendChild(ftd2);
        ftable.appendChild(ftr);
      }
      doughnutCard.appendChild(ftable);

      grid.appendChild(radarCard);
      grid.appendChild(doughnutCard);
      section.appendChild(grid);
    }

    return section;
  }

  /* ── Section 4: Recommendations table ───────────────────────────── */
  function buildRecommendationsTable(recs, template, scoring, lang) {
    var section = el('div', 'margin-bottom:2rem;');
    section.appendChild(sectionHeading('Recommendations'));

    if (!recs || recs.length === 0) {
      section.appendChild(
        el('p', 'color:var(--clr-text-muted);',
          'No recommendations — all answered questions are compliant or N/A.'));
      return section;
    }

    /* Build domain id→title lookup */
    var domTitles = {};
    var domains = template.domains || [];
    for (var di = 0; di < domains.length; di++) {
      domTitles[domains[di].id] = pick(domains[di].title, lang);
    }

    var wrap = el('div', 'overflow-x:auto;');
    var table = el('table', 'width:100%;border-collapse:collapse;font-size:0.8125rem;');

    /* Header */
    var thead = document.createElement('thead');
    var hrow  = document.createElement('tr');
    var COLS = ['Domain', 'Question', 'Status', 'Threat', 'References', 'Remediation'];
    for (var ci = 0; ci < COLS.length; ci++) {
      var th = el('th',
        'text-align:left;padding:0.5rem 0.75rem;border-bottom:2px solid var(--clr-border);' +
        'font-size:0.7rem;text-transform:uppercase;letter-spacing:0.07em;color:var(--clr-text-muted);' +
        'white-space:nowrap;',
        COLS[ci]);
      hrow.appendChild(th);
    }
    thead.appendChild(hrow);
    table.appendChild(thead);

    /* Body */
    var tbody = document.createElement('tbody');
    var CELL = 'padding:0.5rem 0.75rem;border-bottom:1px solid var(--clr-border);vertical-align:top;';

    for (var ri = 0; ri < recs.length; ri++) {
      var rec = recs[ri];
      var tr  = document.createElement('tr');
      if (ri % 2 !== 0) tr.style.background = 'var(--clr-bg)';

      /* Domain */
      var tdDomain = el('td', CELL + 'font-size:0.75rem;color:var(--clr-text-muted);',
        domTitles[rec.domainId] || rec.domainId);
      tr.appendChild(tdDomain);

      /* Question */
      var tdQ = el('td', CELL);
      var qIdSpan = el('span',
        'font-family:var(--font-mono);font-size:0.7rem;color:var(--clr-text-muted);display:block;',
        rec.qid);
      var qText = document.createTextNode(pick(rec.text, lang));
      tdQ.appendChild(qIdSpan);
      tdQ.appendChild(qText);
      tr.appendChild(tdQ);

      /* Status */
      var statusColor = rec.status === 'non-compliant' ? 'var(--clr-danger)' : 'var(--clr-partial)';
      var statusLabel = rec.status === 'non-compliant' ? 'Non-compliant' : 'Partial';
      var tdStatus = el('td', CELL + 'font-weight:600;white-space:nowrap;color:' + statusColor + ';',
        statusLabel);
      tr.appendChild(tdStatus);

      /* Threat */
      var threatColor = '';
      if (rec.threat >= 4) threatColor = 'color:var(--clr-danger);';
      else if (rec.threat >= 3) threatColor = 'color:var(--clr-warning);';
      var tdThreat = el('td',
        CELL + 'text-align:center;font-weight:700;' + threatColor,
        rec.threat != null ? String(rec.threat) : '—');
      tr.appendChild(tdThreat);

      /* References */
      var tdRefs = el('td', CELL + 'font-size:0.7rem;color:var(--clr-text-muted);');
      if (rec.references) {
        var refParts = [];
        var REF_KEYS = ['iso27001', 'iso27002', 'nis2', 'cis', 'other'];
        for (var rk = 0; rk < REF_KEYS.length; rk++) {
          if (rec.references[REF_KEYS[rk]]) {
            refParts.push(REF_KEYS[rk].toUpperCase() + ': ' + rec.references[REF_KEYS[rk]]);
          }
        }
        tdRefs.textContent = refParts.join(' · ');
      } else {
        tdRefs.textContent = '—';
      }
      tr.appendChild(tdRefs);

      /* Remediation */
      var tdRem = el('td', CELL + 'font-size:0.75rem;');
      var rem = rec.remediation;
      if (rem) {
        var remParts = [];
        if (rem.owner)      remParts.push('Owner: ' + rem.owner);
        if (rem.targetDate) remParts.push('By: ' + rem.targetDate);
        if (rem.status && rem.status !== 'none') {
          remParts.push(rem.status.replace(/-/g, ' '));
        }
        tdRem.textContent = remParts.join(' · ') || '—';
      } else {
        tdRem.textContent = '—';
      }
      tr.appendChild(tdRem);

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
    section.appendChild(wrap);
    return section;
  }

  /* ── Public: renderDashboard ─────────────────────────────────────── */
  function renderDashboard(container, template, assessment, lang) {
    if (!container || !template || !assessment) return;

    /* Destroy old chart instances before clearing DOM */
    destroyCharts();

    /* Clear panel */
    while (container.firstChild) container.removeChild(container.firstChild);

    var scoring = root.OBS.scoring;
    if (!scoring) return; /* guard: scoring module not yet loaded */

    lang = lang || 'en';

    var comp    = scoring.completeness(template, assessment);
    var overall = scoring.overallScore(template, assessment);
    var mat     = scoring.maturity(overall, template.maturityLevels || []);
    var summary = scoring.complianceSummary(template, assessment);
    var recs    = scoring.recommendations(template, assessment);

    /* Outer content wrapper */
    var wrapper = el('div', 'padding:2rem 2.5rem;max-width:1100px;');

    /* 1 — Completeness (always first) */
    wrapper.appendChild(buildCompletenessBanner(comp));

    /* 2 — Maturity badge + Compliance summary (side by side) */
    var row2 = el('div',
      'display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;');
    row2.appendChild(buildMaturityCard(overall, mat, lang));
    row2.appendChild(buildSummaryCard(summary, lang));
    wrapper.appendChild(row2);

    /* 3 — Charts */
    wrapper.appendChild(buildChartSection(template, assessment, scoring, lang));

    /* 4 — Recommendations table */
    wrapper.appendChild(buildRecommendationsTable(recs, template, scoring, lang));

    container.appendChild(wrapper);
  }

  /* ── Public: chartImages ─────────────────────────────────────────── */
  function chartImages() {
    var result = {};
    if (_radarCanvas) {
      try { result.radar = _radarCanvas.toDataURL('image/png'); } catch (e) { /* ignore */ }
    }
    if (_doughnutCanvas) {
      try { result.doughnut = _doughnutCanvas.toDataURL('image/png'); } catch (e) { /* ignore */ }
    }
    return result;
  }

  /* ── Attach to OBS namespace ─────────────────────────────────────── */
  root.OBS.report = {
    renderDashboard: renderDashboard,
    chartImages: chartImages
  };

})(typeof window !== 'undefined' ? window : globalThis);
