(function (root) {
  'use strict';

  root.OBS = root.OBS || {};

  /* ── Chart instance refs — module-scope ONLY for destroy + chartImages ── */
  var _radarChart    = null;
  var _doughnutChart = null;
  var _radarCanvas   = null;
  var _doughnutCanvas = null;

  /* ── i18n helper (delegates to OBS.i18n if present) ─────────────────── */
  function pick(field, lang) {
    if (root.OBS.i18n && typeof root.OBS.i18n.pick === 'function') {
      return root.OBS.i18n.pick(field, lang);
    }
    if (field == null) return '';
    if (typeof field === 'string') return field;
    if (field[lang] != null && field[lang] !== '') return field[lang];
    return field.en || '';
  }

  /* ── UI chrome string helper (delegates to OBS.ui if present) ────────── */
  function t(key, lang) {
    return (root.OBS && root.OBS.ui && typeof root.OBS.ui.t === 'function')
      ? root.OBS.ui.t(key, lang)
      : key;
  }

  /* ── DOM helper — inline styles, textContent only (XSS-safe) ─────────── */
  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) node.style.cssText = styles;
    if (text != null) node.textContent = text;
    return node;
  }

  function sectionHeading(text) {
    var h = el('h3',
      'font-size:1rem;font-weight:700;color:var(--clr-navy);margin-bottom:1rem;');
    h.textContent = text;
    return h;
  }

  function labelDiv(text) {
    return el('div',
      'font-size:0.75rem;font-weight:700;text-transform:uppercase;' +
      'letter-spacing:0.08em;color:var(--clr-text-muted);margin-bottom:0.5rem;',
      text);
  }

  /* ── Score band helpers ──────────────────────────────────────────────── */
  function bandColor(score) {
    if (score == null) return 'var(--clr-text-muted)';
    if (score < 40)   return 'var(--clr-danger)';
    if (score < 70)   return 'var(--clr-warning)';
    return 'var(--clr-compliant)';
  }
  function bandBg(score) {
    if (score == null) return 'var(--clr-bg)';
    if (score < 40)   return 'var(--clr-danger-bg)';
    if (score < 70)   return 'var(--clr-warning-bg)';
    return 'var(--clr-compliant-bg)';
  }
  function bandLabel(score, lang) {
    if (score == null) return t('dash.bandNoData', lang);
    if (score < 40)   return t('dash.bandHighRisk', lang);
    if (score < 70)   return t('dash.bandModerate', lang);
    return t('dash.bandGood', lang);
  }

  /* ── Destroy previous chart instances ───────────────────────────────── */
  function destroyCharts() {
    if (_radarChart)    { try { _radarChart.destroy();    } catch (e) {} _radarChart    = null; }
    if (_doughnutChart) { try { _doughnutChart.destroy(); } catch (e) {} _doughnutChart = null; }
    _radarCanvas    = null;
    _doughnutCanvas = null;
  }

  /* ── Threat-weighted risk score (0–100; lower = better) ─────────────── */
  /* sum((1 - value) × weight) over answered non-NA questions, normalised  */
  function computeRiskScore(template, assessment, scoring) {
    var num = 0, den = 0;
    var domains = template.domains || [];
    for (var di = 0; di < domains.length; di++) {
      var domain    = domains[di];
      var questions = domain.questions || [];
      for (var qi = 0; qi < questions.length; qi++) {
        var q = questions[qi];
        var v = scoring.answerValue((assessment.answers || {})[q.id]);
        if (v !== null) {
          var w = scoring.weight(q);
          num += (1 - v) * w;
          den += w;
        }
      }
      /* Custom questions */
      var customs = (assessment.customQuestions || {})[domain.id] || [];
      for (var ci = 0; ci < customs.length; ci++) {
        var cq = customs[ci];
        if (cq && (cq.text || cq.status)) {
          var cv = scoring.answerValue(cq);
          if (cv !== null) {
            var cw = scoring.weight({ weight: 1, threatIndicator: 3 });
            num += (1 - cv) * cw;
            den += cw;
          }
        }
      }
    }
    return den > 0 ? Math.round((num / den) * 100) : null;
  }

  /* ── Framework coverage — count questions referencing each standard ───── */
  function computeCoverage(template) {
    var counts = { iso27001: 0, nis2: 0, cis: 0 };
    var domains = template.domains || [];
    for (var di = 0; di < domains.length; di++) {
      var questions = domains[di].questions || [];
      for (var qi = 0; qi < questions.length; qi++) {
        var refs = questions[qi].references;
        if (!refs) continue;
        if (refs.iso27001) counts.iso27001++;
        if (refs.nis2)     counts.nis2++;
        if (refs.cis)      counts.cis++;
      }
    }
    return counts;
  }

  /* ── 1. HERO SUMMARY CARD ────────────────────────────────────────────── */
  function buildHeroCard(overall, mat, comp, lang) {
    var score = overall != null ? Math.round(overall) : null;
    var card = el('div',
      'background:var(--clr-surface);border:1px solid var(--clr-border);' +
      'border-radius:var(--radius-lg);padding:var(--sp-6) var(--sp-8);' +
      'box-shadow:var(--shadow-sm);margin-bottom:1.5rem;' +
      'display:grid;grid-template-columns:auto 1fr auto;' +
      'gap:2rem;align-items:center;');
    card.style.borderLeft = '6px solid ' + bandColor(score);

    /* Left — score circle */
    var scoreBlock = el('div', 'text-align:center;min-width:100px;');
    var circle = el('div',
      'width:96px;height:96px;border-radius:50%;' +
      'display:inline-flex;align-items:center;justify-content:center;' +
      'flex-direction:column;' +
      'background:' + bandBg(score) + ';' +
      'border:3px solid ' + bandColor(score) + ';');
    var scoreNum = el('span',
      'font-size:1.75rem;font-weight:800;line-height:1;color:' + bandColor(score) + ';');
    scoreNum.textContent = score != null ? score + '%' : '—';
    circle.appendChild(scoreNum);
    var scoreSub = el('span',
      'font-size:0.625rem;font-weight:700;text-transform:uppercase;' +
      'letter-spacing:0.05em;color:' + bandColor(score) + ';margin-top:2px;');
    scoreSub.textContent = bandLabel(score, lang);
    circle.appendChild(scoreSub);
    scoreBlock.appendChild(circle);
    card.appendChild(scoreBlock);

    /* Middle — maturity + progress */
    var mid = el('div', '');
    var titleRow = el('div', 'display:flex;align-items:baseline;gap:0.75rem;margin-bottom:0.5rem;');
    var mainTitle = el('span', 'font-size:1rem;font-weight:700;color:var(--clr-navy);');
    mainTitle.textContent = t('dash.overview', lang);
    titleRow.appendChild(mainTitle);
    if (mat) {
      var matBadge = el('span',
        'display:inline-flex;align-items:center;gap:0.25rem;' +
        'background:var(--clr-sky-tint);color:var(--clr-navy);' +
        'border-radius:999px;padding:0.125rem 0.625rem;' +
        'font-size:0.75rem;font-weight:700;');
      matBadge.textContent = 'L' + mat.level + ' · ' + pick(mat.label, lang);
      titleRow.appendChild(matBadge);
    }
    mid.appendChild(titleRow);

    var compPct = Math.round(comp.percent);
    var compLabel = el('div',
      'font-size:0.75rem;color:var(--clr-text-muted);margin-bottom:0.375rem;');
    compLabel.textContent = t('dash.completenessLabel', lang) + comp.answered + ' / ' + comp.total +
      t('dash.questionsAnswered', lang) + compPct + '%)';
    mid.appendChild(compLabel);

    var track = el('div',
      'height:6px;background:var(--clr-border);border-radius:999px;overflow:hidden;max-width:360px;');
    var fill = el('div',
      'height:100%;border-radius:999px;background:var(--clr-accent);' +
      'width:' + compPct + '%;');
    track.appendChild(fill);
    mid.appendChild(track);

    if (compPct < 100) {
      mid.appendChild(el('div',
        'font-size:0.7rem;color:var(--clr-text-muted);margin-top:0.25rem;',
        t('dash.incomplete', lang)));
    }
    card.appendChild(mid);

    /* Right — risk band pill */
    var pill = el('div',
      'text-align:center;padding:0.625rem 1rem;border-radius:var(--radius);' +
      'background:' + bandBg(score) + ';' +
      'border:1px solid ' + bandColor(score) + ';min-width:100px;');
    pill.appendChild(el('div',
      'font-size:0.625rem;font-weight:700;text-transform:uppercase;' +
      'letter-spacing:0.07em;color:var(--clr-text-muted);margin-bottom:0.125rem;',
      t('dash.riskBand', lang)));
    pill.appendChild(el('div',
      'font-size:1rem;font-weight:800;color:' + bandColor(score) + ';',
      bandLabel(score, lang)));
    card.appendChild(pill);

    return card;
  }

  /* ── 2. METRICS ROW (risk · coverage · status) ───────────────────────── */
  function buildMetricsRow(template, assessment, scoring, compSummary, lang) {
    var row = el('div',
      'display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem;');

    /* Card A — Threat-weighted risk score */
    var riskScore = computeRiskScore(template, assessment, scoring);
    /* Risk is inverse: high risk score = high exposure; colour accordingly */
    var riskColor = bandColor(riskScore != null ? (100 - riskScore) : null);
    var riskCard = el('div',
      'background:var(--clr-surface);border:1px solid var(--clr-border);' +
      'border-radius:var(--radius-lg);padding:var(--sp-5) var(--sp-6);box-shadow:var(--shadow-xs);');
    riskCard.appendChild(labelDiv(t('dash.threatRisk', lang)));
    riskCard.appendChild(el('div',
      'font-size:2rem;font-weight:800;line-height:1;color:' + riskColor + ';',
      riskScore != null ? riskScore + '%' : '—'));
    riskCard.appendChild(el('div',
      'font-size:0.75rem;color:var(--clr-text-muted);margin-top:0.25rem;',
      t('dash.riskSubtext', lang)));
    row.appendChild(riskCard);

    /* Card B — Framework coverage */
    var coverage = computeCoverage(template);
    var fwCard = el('div',
      'background:var(--clr-surface);border:1px solid var(--clr-border);' +
      'border-radius:var(--radius-lg);padding:var(--sp-5) var(--sp-6);box-shadow:var(--shadow-xs);');
    fwCard.appendChild(labelDiv(t('dash.fwCoverage', lang)));
    var FRAMEWORKS = [
      { key: 'iso27001', label: 'ISO 27001', color: 'var(--clr-accent)'    },
      { key: 'nis2',     label: 'NIS2',      color: 'var(--clr-partial)'   },
      { key: 'cis',      label: 'CIS',       color: 'var(--clr-compliant)' }
    ];
    for (var fi = 0; fi < FRAMEWORKS.length; fi++) {
      var fw = FRAMEWORKS[fi];
      var fwRow = el('div',
        'display:flex;align-items:center;justify-content:space-between;' +
        'padding:0.25rem 0;' +
        (fi < FRAMEWORKS.length - 1 ? 'border-bottom:1px solid var(--clr-border);' : ''));
      fwRow.appendChild(el('span', 'font-size:0.8125rem;color:var(--clr-text);', fw.label));
      fwRow.appendChild(el('span',
        'font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;' +
        'background:var(--clr-bg);border-radius:var(--radius-sm);' +
        'padding:0 0.375rem;color:' + fw.color + ';',
        String(coverage[fw.key])));
      fwCard.appendChild(fwRow);
    }
    row.appendChild(fwCard);

    /* Card C — Status breakdown */
    var sumCard = el('div',
      'background:var(--clr-surface);border:1px solid var(--clr-border);' +
      'border-radius:var(--radius-lg);padding:var(--sp-5) var(--sp-6);box-shadow:var(--shadow-xs);');
    sumCard.appendChild(labelDiv(t('dash.statusBreakdown', lang)));
    var STATUS_ROWS = [
      { key: 'compliant',    label: t('status.compliant', lang),    color: 'var(--clr-compliant)'   },
      { key: 'partial',      label: t('status.partial', lang),      color: 'var(--clr-partial)'     },
      { key: 'nonCompliant', label: t('status.nonCompliant', lang), color: 'var(--clr-danger)'      },
      { key: 'na',           label: t('status.na', lang),           color: 'var(--clr-na)'          },
      { key: 'unanswered',   label: t('status.unanswered', lang),   color: 'var(--clr-text-muted)'  }
    ];
    for (var si = 0; si < STATUS_ROWS.length; si++) {
      var sr = STATUS_ROWS[si];
      var sRow = el('div',
        'display:flex;align-items:center;gap:0.375rem;padding:0.2rem 0;font-size:0.8125rem;');
      var dot = el('span',
        'width:8px;height:8px;border-radius:50%;flex-shrink:0;' +
        'display:inline-block;background:' + sr.color + ';');
      var sLabel = el('span', 'flex:1;color:var(--clr-text);', sr.label);
      var sCount = el('span',
        'font-weight:700;font-variant-numeric:tabular-nums;color:var(--clr-text);',
        String(compSummary[sr.key]));
      sRow.appendChild(dot);
      sRow.appendChild(sLabel);
      sRow.appendChild(sCount);
      sumCard.appendChild(sRow);
    }
    row.appendChild(sumCard);

    return row;
  }

  /* ── 3. CHARTS (radar + doughnut) ────────────────────────────────────── */
  function buildChartSection(template, assessment, scoring, compSummary, lang) {
    var section = el('div', 'margin-bottom:1.5rem;');
    section.appendChild(sectionHeading(t('dash.scoreVis', lang)));

    var grid = el('div',
      'display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start;');

    var radarCard = el('div',
      'background:var(--clr-surface);border:1px solid var(--clr-border);' +
      'border-radius:var(--radius-lg);padding:var(--sp-5) var(--sp-6);' +
      'box-shadow:var(--shadow-xs);text-align:center;');
    radarCard.appendChild(labelDiv(t('dash.domainScores', lang)));

    var doughnutCard = el('div',
      'background:var(--clr-surface);border:1px solid var(--clr-border);' +
      'border-radius:var(--radius-lg);padding:var(--sp-5) var(--sp-6);' +
      'box-shadow:var(--shadow-xs);text-align:center;');
    doughnutCard.appendChild(labelDiv(t('dash.statusBreakdown', lang)));

    /* Compute domain scores for radar */
    var domainLabels = [];
    var domainData   = [];
    var hasNull      = false;
    var domains      = template.domains || [];
    for (var di = 0; di < domains.length; di++) {
      var dom = domains[di];
      var ds  = scoring.domainScore(dom, assessment);
      domainLabels.push(pick(dom.title, lang));
      if (ds.score === null) { hasNull = true; domainData.push(0); }
      else { domainData.push(Math.round(ds.score)); }
    }

    if (hasNull) {
      radarCard.appendChild(el('div',
        'font-size:0.7rem;color:var(--clr-text-muted);margin-bottom:0.25rem;',
        t('dash.noScores', lang)));
    }

    if (typeof root.Chart !== 'undefined') {
      /* Canvas-based charts (Chart.js UMD auto-registers; no Chart.register() needed) */
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

      _radarChart = new root.Chart(radarCanvas.getContext('2d'), {
        type: 'radar',
        data: {
          labels: domainLabels,
          datasets: [{
            label: t('dash.scoreDataset', lang),
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
          plugins: { legend: { display: false } }
        }
      });

      _doughnutChart = new root.Chart(doughnutCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: [
              t('status.compliant', lang),
              t('status.partial', lang),
              t('status.nonCompliant', lang),
              t('status.na', lang),
              t('status.unanswered', lang)
            ],
          datasets: [{
            data: [
              compSummary.compliant,
              compSummary.partial,
              compSummary.nonCompliant,
              compSummary.na,
              compSummary.unanswered
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
      /* Textual fallback when Chart.js is absent */
      radarCard.appendChild(el('div',
        'font-size:0.7rem;color:var(--clr-warning);margin-bottom:0.5rem;',
        t('dash.noChartJs', lang)));

      for (var fdi = 0; fdi < domains.length; fdi++) {
        var fdom = domains[fdi];
        var fds  = scoring.domainScore(fdom, assessment);
        var pct  = fds.score !== null ? Math.round(fds.score) : null;

        var bar  = el('div',
          'display:grid;grid-template-columns:1fr auto;align-items:center;' +
          'gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid var(--clr-border);');
        var nameWrap = el('div', '');
        nameWrap.appendChild(el('div',
          'font-size:0.875rem;font-weight:600;color:var(--clr-text);',
          pick(fdom.title, lang)));
        var barTrack = el('div',
          'height:8px;background:var(--clr-border);border-radius:999px;overflow:hidden;margin-top:0.25rem;');
        var barFill = el('div',
          'height:100%;border-radius:999px;background:' + bandColor(pct) + ';' +
          'width:' + (pct !== null ? pct : 0) + '%;');
        barTrack.appendChild(barFill);
        nameWrap.appendChild(barTrack);
        var pctSpan = el('span',
          'font-size:0.875rem;font-weight:700;color:var(--clr-text);' +
          'font-variant-numeric:tabular-nums;min-width:3ch;text-align:right;',
          pct !== null ? pct + '%' : 'N/A');
        bar.appendChild(nameWrap);
        bar.appendChild(pctSpan);
        radarCard.appendChild(bar);
      }

      doughnutCard.appendChild(el('div',
        'font-size:0.7rem;color:var(--clr-warning);margin-bottom:0.5rem;',
        t('dash.noChartJsDoughnut', lang)));

      var STAT_LABELS = [
        { key: 'compliant',    label: t('status.compliant', lang)    },
        { key: 'partial',      label: t('status.partial', lang)      },
        { key: 'nonCompliant', label: t('status.nonCompliant', lang) },
        { key: 'na',           label: t('status.na', lang)           },
        { key: 'unanswered',   label: t('status.unanswered', lang)   }
      ];
      var ftable = el('table', 'width:100%;border-collapse:collapse;font-size:0.875rem;');
      for (var fsi = 0; fsi < STAT_LABELS.length; fsi++) {
        var ftr  = document.createElement('tr');
        var ftd1 = el('td', 'padding:0.25rem 0.5rem;text-align:left;',  STAT_LABELS[fsi].label);
        var ftd2 = el('td', 'padding:0.25rem 0.5rem;text-align:right;font-weight:700;',
          String(compSummary[STAT_LABELS[fsi].key]));
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

  /* ── 4. PER-DOMAIN DRILL-DOWN ────────────────────────────────────────── */
  function buildDomainDrilldown(template, assessment, scoring, lang) {
    var section = el('div', 'margin-bottom:1.5rem;');
    section.appendChild(sectionHeading(t('dash.drillDown', lang)));

    var STATUS_INFO = {
      'compliant':     { label: t('status.compliant', lang),    color: 'var(--clr-compliant)', bg: 'var(--clr-compliant-bg)' },
      'partial':       { label: t('status.partial', lang),      color: 'var(--clr-partial)',   bg: 'var(--clr-partial-bg)'   },
      'non-compliant': { label: t('status.nonCompliant', lang), color: 'var(--clr-danger)',    bg: 'var(--clr-danger-bg)'    },
      'na':            { label: t('status.na', lang),           color: 'var(--clr-na)',        bg: 'var(--clr-na-bg)'        },
      'unanswered':    { label: t('status.unanswered', lang),   color: 'var(--clr-text-muted)',bg: 'var(--clr-bg)'           }
    };

    var domains = template.domains || [];
    for (var di = 0; di < domains.length; di++) {
      var domain  = domains[di];
      var ds      = scoring.domainScore(domain, assessment);
      var score   = ds.score !== null ? Math.round(ds.score) : null;
      var sColor  = bandColor(score);

      /* <details> — native collapsible, file://-safe, no JS toggle needed */
      var details = document.createElement('details');
      details.className = 'obs-domain-details';

      /* <summary> — always-visible header row */
      var detSummary = document.createElement('summary');
      detSummary.className = 'obs-domain-summary';
      detSummary.style.borderLeft = '5px solid ' + sColor;

      var domTitle = el('span', 'flex:1;font-size:0.9rem;font-weight:700;color:var(--clr-navy);');
      domTitle.textContent = pick(domain.title, lang);
      detSummary.appendChild(domTitle);

      detSummary.appendChild(el('span',
        'font-size:0.75rem;color:var(--clr-text-muted);font-variant-numeric:tabular-nums;white-space:nowrap;',
        ds.answered + '/' + ds.total + ' ' + t('dash.answered', lang)));

      detSummary.appendChild(el('span',
        'font-size:0.875rem;font-weight:800;min-width:3.5rem;text-align:right;' +
        'color:' + sColor + ';font-variant-numeric:tabular-nums;',
        score !== null ? score + '%' : '—'));

      var miniTrack = el('div',
        'width:80px;height:6px;background:var(--clr-border);' +
        'border-radius:999px;overflow:hidden;flex-shrink:0;');
      var miniFill = el('div',
        'height:100%;border-radius:999px;background:' + sColor + ';' +
        'width:' + (score !== null ? score : 0) + '%;');
      miniTrack.appendChild(miniFill);
      detSummary.appendChild(miniTrack);

      details.appendChild(detSummary);

      /* Expanded questions list */
      var qList = el('div',
        'padding:0.75rem 1.25rem 1rem;border-top:1px solid var(--clr-border);');

      var questions = domain.questions || [];
      for (var qi = 0; qi < questions.length; qi++) {
        var q       = questions[qi];
        var ans     = (assessment.answers || {})[q.id];
        var stKey   = (ans && ans.status) || 'unanswered';
        var stInfo  = STATUS_INFO[stKey] || STATUS_INFO['unanswered'];

        var qRow = el('div',
          'display:flex;align-items:flex-start;gap:0.75rem;' +
          'padding:0.5rem 0;border-bottom:1px solid var(--clr-border);');

        var stBadge = el('span',
          'flex-shrink:0;font-size:0.65rem;font-weight:700;text-transform:uppercase;' +
          'letter-spacing:0.04em;padding:0.125rem 0.5rem;border-radius:999px;' +
          'background:' + stInfo.bg + ';color:' + stInfo.color + ';white-space:nowrap;',
          stInfo.label);
        qRow.appendChild(stBadge);

        var qContent = el('div', 'flex:1;min-width:0;');
        var qId = el('span',
          'font-family:var(--font-mono);font-size:0.65rem;color:var(--clr-text-muted);display:block;margin-bottom:0.125rem;',
          q.id);
        qContent.appendChild(qId);
        var qText = el('span', 'font-size:0.8125rem;color:var(--clr-text);line-height:1.4;');
        qText.textContent = pick(q.text, lang);
        qContent.appendChild(qText);
        qRow.appendChild(qContent);

        var threatVal   = q.threatIndicator != null ? q.threatIndicator : 3;
        var threatColor = threatVal >= 4 ? 'var(--clr-danger)' : (threatVal >= 3 ? 'var(--clr-warning)' : 'var(--clr-text-muted)');
        qRow.appendChild(el('span',
          'flex-shrink:0;font-size:0.7rem;font-weight:700;' +
          'color:' + threatColor + ';white-space:nowrap;min-width:1.5rem;text-align:right;',
          'T' + threatVal));

        qList.appendChild(qRow);
      }

      /* Custom questions in this domain */
      var customs = (assessment.customQuestions || {})[domain.id] || [];
      for (var ci2 = 0; ci2 < customs.length; ci2++) {
        var cq = customs[ci2];
        if (!cq || (!cq.text && !cq.status)) continue;
        var cStKey  = cq.status || 'unanswered';
        var cStInfo = STATUS_INFO[cStKey] || STATUS_INFO['unanswered'];

        var cRow = el('div',
          'display:flex;align-items:flex-start;gap:0.75rem;' +
          'padding:0.5rem 0;border-bottom:1px solid var(--clr-border);');

        cRow.appendChild(el('span',
          'flex-shrink:0;font-size:0.65rem;font-weight:700;text-transform:uppercase;' +
          'letter-spacing:0.04em;padding:0.125rem 0.5rem;border-radius:999px;' +
          'background:' + cStInfo.bg + ';color:' + cStInfo.color + ';white-space:nowrap;',
          cStInfo.label));

        var cContent = el('div', 'flex:1;min-width:0;');
        cContent.appendChild(el('span',
          'font-family:var(--font-mono);font-size:0.65rem;color:var(--clr-text-muted);display:block;margin-bottom:0.125rem;',
          'custom-' + domain.id + '-' + ci2));
        var cTextEl = el('span', 'font-size:0.8125rem;color:var(--clr-text);line-height:1.4;font-style:italic;');
        cTextEl.textContent = (cq.text && typeof cq.text === 'string') ? cq.text : '';
        cContent.appendChild(cTextEl);
        cRow.appendChild(cContent);

        cRow.appendChild(el('span',
          'flex-shrink:0;font-size:0.65rem;color:var(--clr-text-muted);white-space:nowrap;',
          'custom'));

        qList.appendChild(cRow);
      }

      details.appendChild(qList);
      section.appendChild(details);
    }

    return section;
  }

  /* ── 5. ACTIONABLE GAPS — prioritised remediation ────────────────────── */
  function buildActionableGaps(recs, template, lang) {
    var section = el('div', 'margin-bottom:2rem;');
    section.appendChild(sectionHeading(t('dash.gaps', lang)));

    if (!recs || recs.length === 0) {
      section.appendChild(el('p', 'color:var(--clr-text-muted);',
        t('dash.noGaps', lang)));
      return section;
    }

    /* Domain id → title lookup */
    var domTitles = {};
    var domains   = template.domains || [];
    for (var di = 0; di < domains.length; di++) {
      domTitles[domains[di].id] = pick(domains[di].title, lang);
    }

    var wrap  = el('div', 'overflow-x:auto;');
    var table = el('table', 'width:100%;border-collapse:collapse;font-size:0.8125rem;');

    /* Table header */
    var thead = document.createElement('thead');
    var hrow  = document.createElement('tr');
    hrow.style.background = 'var(--clr-bg)';
    var COLS = [
      t('dash.colNum', lang), t('dash.colDomain', lang), t('dash.colQuestion', lang),
      t('dash.colStatus', lang), t('dash.colThreat', lang),
      t('dash.colRefs', lang), t('dash.colRem', lang)
    ];
    for (var ci = 0; ci < COLS.length; ci++) {
      var th = el('th',
        'text-align:left;padding:0.5rem 0.75rem;' +
        'border-bottom:2px solid var(--clr-border);' +
        'font-size:0.7rem;text-transform:uppercase;letter-spacing:0.07em;' +
        'color:var(--clr-text-muted);white-space:nowrap;',
        COLS[ci]);
      hrow.appendChild(th);
    }
    thead.appendChild(hrow);
    table.appendChild(thead);

    /* Table body */
    var tbody   = document.createElement('tbody');
    var CELL    = 'padding:0.5rem 0.75rem;border-bottom:1px solid var(--clr-border);vertical-align:top;';
    var hasCrit = false;

    for (var ri = 0; ri < recs.length; ri++) {
      var rec        = recs[ri];
      var isCritical = rec.threat >= 4;
      if (isCritical) hasCrit = true;

      var tr = document.createElement('tr');
      if (isCritical) {
        tr.style.cssText = 'background:var(--clr-danger-bg);border-left:3px solid var(--clr-danger);';
      } else if (ri % 2 !== 0) {
        tr.style.background = 'var(--clr-bg)';
      }

      /* # */
      tr.appendChild(el('td',
        CELL + 'font-size:0.7rem;color:var(--clr-text-muted);text-align:center;font-weight:700;',
        String(ri + 1)));

      /* Domain */
      tr.appendChild(el('td',
        CELL + 'font-size:0.75rem;color:var(--clr-text-muted);white-space:nowrap;',
        domTitles[rec.domainId] || rec.domainId));

      /* Question ID + text */
      var tdQ = document.createElement('td');
      tdQ.style.cssText = CELL;
      var qIdSpan = el('span',
        'font-family:var(--font-mono);font-size:0.7rem;color:var(--clr-text-muted);display:block;',
        rec.qid);
      var qTextNode = document.createElement('span');
      qTextNode.style.cssText = 'font-size:0.8125rem;line-height:1.4;';
      qTextNode.textContent = pick(rec.text, lang);
      tdQ.appendChild(qIdSpan);
      tdQ.appendChild(qTextNode);
      tr.appendChild(tdQ);

      /* Status */
      var stColor = rec.status === 'non-compliant' ? 'var(--clr-danger)' : 'var(--clr-partial)';
      var stLabel = rec.status === 'non-compliant' ? t('status.nonCompliant', lang) : t('status.partial', lang);
      tr.appendChild(el('td',
        CELL + 'font-weight:700;white-space:nowrap;color:' + stColor + ';', stLabel));

      /* Threat */
      var tColor = rec.threat >= 4
        ? 'var(--clr-danger)'
        : (rec.threat >= 3 ? 'var(--clr-warning)' : 'var(--clr-text-muted)');
      var tdThreat = el('td',
        CELL + 'text-align:center;font-weight:800;color:' + tColor + ';' +
        (rec.threat >= 4 ? 'font-size:1rem;' : ''));
      tdThreat.textContent = (rec.threat != null ? String(rec.threat) : '—') +
        (isCritical ? ' ⚠' : '');
      tr.appendChild(tdThreat);

      /* References */
      var tdRefs = document.createElement('td');
      tdRefs.style.cssText = CELL + 'font-size:0.7rem;color:var(--clr-text-muted);';
      if (rec.references) {
        var refParts = [];
        var REF_KEYS = ['iso27001', 'iso27002', 'nis2', 'cis', 'other'];
        for (var rk = 0; rk < REF_KEYS.length; rk++) {
          if (rec.references[REF_KEYS[rk]]) {
            refParts.push(REF_KEYS[rk].toUpperCase() + ': ' + rec.references[REF_KEYS[rk]]);
          }
        }
        tdRefs.textContent = refParts.join(' · ') || '—';
      } else {
        tdRefs.textContent = '—';
      }
      tr.appendChild(tdRefs);

      /* Remediation */
      var tdRem = document.createElement('td');
      tdRem.style.cssText = CELL + 'font-size:0.75rem;';
      var rem = rec.remediation;
      if (rem) {
        var remParts = [];
        if (rem.owner)      remParts.push('Owner: ' + rem.owner);
        if (rem.targetDate) remParts.push('By: ' + rem.targetDate);
        if (rem.status && rem.status !== 'none') {
          remParts.push(rem.status.replace(/-/g, ' '));
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

    if (hasCrit) {
      section.appendChild(el('div',
        'margin-top:0.5rem;font-size:0.7rem;color:var(--clr-text-muted);',
        t('dash.criticalNote', lang)));
    }

    return section;
  }

  /* ── Public: renderDashboard ─────────────────────────────────────────── */
  /* Called fresh on every Dashboard tab open and on language change.       */
  /* Everything is recomputed from the passed assessment — no stale data.   */
  function renderDashboard(container, template, assessment, lang) {
    if (!container || !template || !assessment) return;

    /* Destroy old Chart.js instances before clearing the DOM */
    destroyCharts();

    /* Clear the panel */
    while (container.firstChild) container.removeChild(container.firstChild);

    var scoring = root.OBS.scoring;
    if (!scoring) return; /* guard: scoring module not yet loaded */

    lang = lang || 'en';

    /* Recompute all metrics from the current assessment on every call */
    var comp       = scoring.completeness(template, assessment);
    var overall    = scoring.overallScore(template, assessment);
    var mat        = scoring.maturity(overall, template.maturityLevels || []);
    var compSum    = scoring.complianceSummary(template, assessment);
    var recs       = scoring.recommendations(template, assessment);

    var wrapper = el('div', 'padding:2rem 2.5rem;max-width:1100px;');

    /* 1 — Hero summary (score %, maturity, completeness) */
    wrapper.appendChild(buildHeroCard(overall, mat, comp, lang));

    /* 2 — Three metric cards (risk, framework coverage, status) */
    wrapper.appendChild(buildMetricsRow(template, assessment, scoring, compSum, lang));

    /* 3 — Radar + doughnut charts */
    wrapper.appendChild(buildChartSection(template, assessment, scoring, compSum, lang));

    /* 4 — Per-domain collapsible drill-down */
    wrapper.appendChild(buildDomainDrilldown(template, assessment, scoring, lang));

    /* 5 — Actionable gaps table, sorted by severity */
    wrapper.appendChild(buildActionableGaps(recs, template, lang));

    container.appendChild(wrapper);
  }

  /* ── Public: chartImages ─────────────────────────────────────────────── */
  /* Returns {radar, doughnut} PNG data URLs for PDF export.               */
  /* Returns {} if Chart.js was absent (no canvas rendered).               */
  function chartImages() {
    var result = {};
    if (_radarCanvas) {
      try { result.radar    = _radarCanvas.toDataURL('image/png');    } catch (e) {}
    }
    if (_doughnutCanvas) {
      try { result.doughnut = _doughnutCanvas.toDataURL('image/png'); } catch (e) {}
    }
    return result;
  }

  /* ── Attach to OBS namespace ─────────────────────────────────────────── */
  root.OBS.report = {
    renderDashboard: renderDashboard,
    chartImages: chartImages
  };

})(typeof window !== 'undefined' ? window : globalThis);
