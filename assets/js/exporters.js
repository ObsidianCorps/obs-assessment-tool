(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.exporters = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var i18n = (typeof require !== 'undefined') ? require('./i18n.js') : (root_OBS().i18n);
  function root_OBS() { return (typeof window !== 'undefined' ? window : globalThis).OBS; }

  /* ── UI chrome string helper ─────────────────────────────────── */
  function t(key, lang) {
    var obs = (typeof window !== 'undefined' ? window : globalThis).OBS;
    var ui = obs && obs.ui;
    return (ui && typeof ui.t === 'function') ? ui.t(key, lang) : key;
  }

  /* ── Status key → translated label ──────────────────────────── */
  var STATUS_KEY_MAP = {
    'compliant':     'status.compliant',
    'partial':       'status.partial',
    'non-compliant': 'status.nonCompliant',
    'na':            'status.na',
    'unanswered':    'status.unanswered'
  };
  function statusLabel(status, lang) {
    var key = STATUS_KEY_MAP[status];
    return key ? t(key, lang) : (status || t('status.unanswered', lang));
  }

  function esc(v) {
    v = (v == null) ? '' : String(v);
    // Neutralise CSV formula injection: a leading = + - @ (or tab/CR) can be
    // executed as a formula by Excel/LibreOffice. Prefix such values with a
    // single quote so spreadsheets treat them as text.
    if (/^[=+\-@\t\r]/.test(v)) v = "'" + v;
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function refStr(r) { return [r && r.iso27001, r && r.iso27002, r && r.nis2, r && r.cis, r && r.other].filter(Boolean).join(' | '); }

  function assessmentToCsv(template, assessment, lang) {
    var header = ['Domain', 'Control', 'Question', 'Applicable', 'Status', 'PartialPercent', 'Justification', 'Evidence', 'Threat', 'RemediationOwner', 'RemediationTarget', 'RemediationStatus'];
    var rows = [header.map(esc).join(',')];
    template.domains.forEach(function (d) {
      d.questions.forEach(function (q) {
        var a = (assessment.answers || {})[q.id] || {};
        var rem = a.remediation || {};
        rows.push([
          i18n.pick(d.title, lang), refStr(q.references), i18n.pick(q.text, lang),
          a.status === 'na' ? 'N' : 'Y', a.status || 'unanswered',
          a.status === 'partial' ? (a.partialPercent == null ? 50 : a.partialPercent) : '',
          a.naReason || '', a.evidence || '', q.threatIndicator,
          rem.owner || '', rem.targetDate || '', rem.status || ''
        ].map(esc).join(','));
      });
    });
    return rows.join('\n');
  }

  function hexToRgb(hex, fallback) {
    if (typeof hex === 'string') {
      var m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
      if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
    }
    return fallback;
  }
  /* STATUS_LABEL kept for any external reference; PDF now uses statusLabel(status, lang) */

  // Produce a polished, branded A4 report. `chartImages` = { radar, doughnut } PNG data URLs.
  function buildPdf(template, assessment, lang, chartImages, options) {
    var jsPDFns = (typeof window !== 'undefined') && window.jspdf;
    if (!jsPDFns) throw new Error('jsPDF not loaded');
    var doc = new jsPDFns.jsPDF({ unit: 'pt', format: 'a4' });
    var I = root_OBS().i18n, S = root_OBS().scoring;
    var meta = assessment.meta || {};
    var PAGE_W = doc.internal.pageSize.getWidth();   // ~595pt
    var PAGE_H = doc.internal.pageSize.getHeight();   // ~842pt
    var M = 40;                                       // page margin
    var brand = hexToRgb(meta.brandColor, [15, 33, 61]);   // default professional navy
    var ink = [33, 37, 41], muted = [110, 116, 124];

    // -- section visibility: all true when options is omitted --
    var o = options || {};
    var showSummary      = o.summary         !== false;
    var showCharts       = o.charts          !== false;
    var showRecs         = o.recommendations !== false;
    var showDetails      = o.details         !== false;
    var showNarratives   = o.narratives      !== false;

    // --- Header band (brand colour) with logo + title ---
    // Phase 1: determine logo dimensions and titleX without drawing yet.
    var titleX = M;
    var chipPad = 6;
    var hasLogo = false, lw = 0, lh = 0, logoFmt = '';
    if (meta.logo) {
      try {
        logoFmt = /^data:image\/png/i.test(meta.logo) ? 'PNG' : 'JPEG';
        var MAX_LW = 130, MAX_LH = 50;
        lw = MAX_LW; lh = MAX_LH;
        try {
          if (typeof doc.getImageProperties === 'function') {
            var imgProps = doc.getImageProperties(meta.logo);
            var natRatio = imgProps.width / imgProps.height;
            if (natRatio > MAX_LW / MAX_LH) { lw = MAX_LW; lh = MAX_LW / natRatio; }
            else { lh = MAX_LH; lw = MAX_LH * natRatio; }
          }
        } catch (e2) { lw = 104; lh = 40; }
        titleX = M + lw + chipPad * 2 + 16;
        hasLogo = true;
      } catch (e) { /* malformed logo: ignore, never block the report */ }
    }

    // Phase 2: measure header text with dynamic wrapping to compute band height.
    var HPAD = 20;   // vertical padding inside the band (top and bottom)
    var maxHdrW = PAGE_W - titleX - M;
    var titleFs = 17, smallFs = 9;
    var titleLH = titleFs * 1.2, smallLH = smallFs * 1.3;   // line-height steps

    doc.setFont('helvetica', 'bold'); doc.setFontSize(titleFs);
    var hTitleLines = doc.splitTextToSize(I.pick(template.title, lang), maxHdrW);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(smallFs);
    var hFwStr = (template.frameworks || []).join('  \xb7  ');
    var hFwLines = hFwStr ? doc.splitTextToSize(hFwStr, maxHdrW) : [];
    var hSubText = t('pdf.subheader', lang);

    // Approximate total pixel height of the text block
    var textBlockH = hTitleLines.length * titleLH
      + (hFwLines.length ? 6 + hFwLines.length * smallLH : 0)
      + 6 + smallLH;   // subtitle line

    var logoChipH = hasLogo ? (lh + chipPad * 2) : 0;
    var bandH = Math.max(logoChipH, textBlockH) + 2 * HPAD;

    // Phase 3: draw background band.
    doc.setFillColor(brand[0], brand[1], brand[2]);
    doc.rect(0, 0, PAGE_W, bandH, 'F');

    // Phase 4: draw logo chip (vertically centred).
    if (hasLogo) {
      try {
        var chipTop = Math.round((bandH - logoChipH) / 2);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(M, chipTop, lw + chipPad * 2, logoChipH, 4, 4, 'F');
        doc.addImage(meta.logo, logoFmt, M + chipPad, chipTop + chipPad, lw, lh, undefined, 'FAST');
      } catch (e) { /* ignore */ }
    }

    // Phase 5: draw header text with advancing y (no fixed positions, no overlaps).
    doc.setTextColor(255, 255, 255);
    var ty = Math.round((bandH - textBlockH) / 2);
    if (ty < HPAD) ty = HPAD;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(titleFs);
    // y passed to text() is the baseline; add ~85 % of font size as ascent offset
    doc.text(hTitleLines, titleX, ty + Math.round(titleFs * 0.85));
    ty += hTitleLines.length * titleLH;

    if (hFwLines.length) {
      ty += 6;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(smallFs);
      doc.text(hFwLines, titleX, ty + Math.round(smallFs * 0.85));
      ty += hFwLines.length * smallLH;
    }

    ty += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(smallFs);
    doc.text(hSubText, titleX, ty + Math.round(smallFs * 0.85));

    var y = bandH + 28;
    // --- Metadata block ---
    doc.setTextColor(ink[0], ink[1], ink[2]);
    function metaRow(label, value) {
      if (!value) return;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(muted[0], muted[1], muted[2]);
      doc.text(label.toUpperCase(), M, y);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(ink[0], ink[1], ink[2]);
      doc.text(String(value), M + 130, y);
      y += 20;
    }
    metaRow(t('pdf.metaClient', lang), meta.clientName);
    metaRow(t('pdf.metaAssessor', lang), meta.assessorName);
    metaRow(t('pdf.metaAgency', lang), meta.assessorOrg);
    metaRow(t('pdf.metaDate', lang), meta.date);
    y += 6;
    if (template.translationStatus && template.translationStatus[lang]) {
      doc.setFillColor(255, 244, 229); doc.rect(M, y - 10, PAGE_W - 2 * M, 22, 'F');
      doc.setTextColor(150, 75, 0); doc.setFontSize(9);
      doc.text(t('pdf.translationPrefix', lang) + lang + t('pdf.translationSuffix', lang), M + 8, y + 4);
      doc.setTextColor(ink[0], ink[1], ink[2]); y += 28;
    }

    // --- Executive summary band ---
    if (showSummary) {
      var overall = S.overallScore(template, assessment);
      var mat = S.maturity(overall, template.maturityLevels);
      var comp = S.complianceSummary(template, assessment);
      var c = S.completeness(template, assessment);
      doc.setDrawColor(225, 228, 232); doc.setFillColor(248, 249, 251);
      doc.roundedRect(M, y, PAGE_W - 2 * M, 70, 4, 4, 'FD');
      var colW = (PAGE_W - 2 * M) / 4;
      function summaryCell(i, big, small) {
        var cx = M + colW * i + 14;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(brand[0], brand[1], brand[2]);
        doc.text(big, cx, y + 34);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(muted[0], muted[1], muted[2]);
        doc.text(small.toUpperCase(), cx, y + 52);
      }
      summaryCell(0, overall == null ? 'n/a' : Math.round(overall) + '%', t('pdf.overallScore', lang));
      summaryCell(1, mat ? String(mat.level) + '/5' : '–', mat ? I.pick(mat.label, lang) : t('pdf.maturity', lang));
      summaryCell(2, c.answered + '/' + c.total, t('pdf.answered', lang));
      summaryCell(3, String(comp.criticalGaps.length), t('pdf.criticalGaps', lang));
      doc.setTextColor(ink[0], ink[1], ink[2]); y += 86;
    }

    // --- Charts ---
    if (showCharts && chartImages && (chartImages.radar || chartImages.doughnut)) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text(t('pdf.scoresByDomain', lang), M, y); y += 8;
      if (chartImages.radar) doc.addImage(chartImages.radar, 'PNG', M, y, 250, 250);
      if (chartImages.doughnut) doc.addImage(chartImages.doughnut, 'PNG', M + 280, y + 20, 210, 210);
      y += 264;
    }

    // --- Recommendations table (severity-ranked) ---
    if (showRecs) {
      var recs = S.recommendations(template, assessment);
      var body = recs.map(function (r, i) {
        var rem = r.remediation || {};
        var remTxt = [rem.owner, rem.targetDate, rem.status].filter(Boolean).join(' · ');
        return [String(i + 1), I.pick(r.text, lang), statusLabel(r.status, lang), String(r.threat), refStr(r.references), remTxt];
      });
      if (y > PAGE_H - 140) { doc.addPage(); y = M; }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(ink[0], ink[1], ink[2]);
      doc.text(t('pdf.findingsRecsPrefix', lang) + recs.length + ')', M, y); y += 10;
      var head = [[
        t('pdf.colNum', lang), t('pdf.colFinding', lang), t('pdf.colStatus', lang),
        t('pdf.colThreat', lang), t('pdf.colRefs', lang), t('pdf.colRem', lang)
      ]];
      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          startY: y + 4, head: head, body: body, margin: { left: M, right: M },
          styles: { fontSize: 8, cellPadding: 5, valign: 'top', overflow: 'linebreak', textColor: ink },
          headStyles: { fillColor: brand, textColor: [255, 255, 255], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [248, 249, 251] },
          columnStyles: { 0: { cellWidth: 22 }, 2: { cellWidth: 64 }, 3: { cellWidth: 40, halign: 'center' }, 4: { cellWidth: 110 }, 5: { cellWidth: 90 } }
        });
        y = doc.lastAutoTable.finalY + 12;
      } else {
        // Fallback if the autotable plugin is unavailable: simple wrapped lines.
        doc.setFontSize(9); y += 14;
        body.forEach(function (row) {
          if (y > PAGE_H - 60) { doc.addPage(); y = M; }
          doc.text(doc.splitTextToSize(row[0] + '. [' + row[2] + '] ' + row[1] + '  (' + row[4] + ')', PAGE_W - 2 * M), M, y);
          y += 26;
        });
      }
    }

    // --- Detailed assessment (every domain, every question) ---
    if (showDetails) {
      doc.addPage();
      var yD = M;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(ink[0], ink[1], ink[2]);
      doc.text(t('pdf.detailedAssessment', lang), M, yD); yD += 24;

      (template.domains || []).forEach(function (domain) {
        // Domain heading + score
        if (yD > PAGE_H - 100) { doc.addPage(); yD = M; }
        var ds = S.domainScore(domain, assessment);
        var scoreStr = (ds && ds.score != null) ? Math.round(ds.score) + '%' : 'n/a';
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
        doc.setTextColor(brand[0], brand[1], brand[2]);
        doc.text(I.pick(domain.title, lang) + '  —  ' + scoreStr, M, yD); yD += 16;

        // Domain narrative (omitted when showNarratives is false)
        var narrative = showNarratives && assessment.domainNarratives && assessment.domainNarratives[domain.id];
        if (narrative) {
          doc.setFont('helvetica', 'italic'); doc.setFontSize(9);
          doc.setTextColor(muted[0], muted[1], muted[2]);
          var narLines = doc.splitTextToSize(String(narrative), PAGE_W - 2 * M);
          if (yD + narLines.length * 12 > PAGE_H - 60) { doc.addPage(); yD = M; }
          doc.text(narLines, M, yD); yD += narLines.length * 12 + 8;
        }

        // Gather template questions + any custom questions for this domain
        var allQs = (domain.questions || []).slice();
        var customQs = (assessment.customQuestions && assessment.customQuestions[domain.id]) || [];
        allQs = allQs.concat(customQs);

        // Build table rows
        var qBody = allQs.map(function (q) {
          var a = (assessment.answers || {})[q.id] || {};
          var statusLbl = statusLabel(a.status, lang);
          if (a.status === 'partial') {
            statusLbl = t('status.partial', lang) + ' (' + (a.partialPercent == null ? 50 : a.partialPercent) + '%)';
          }
          var rem = a.remediation || {};
          var remTxt = [rem.owner, rem.targetDate, rem.status].filter(Boolean).join(' / ');
          return [
            String(q.id || ''),
            I.pick(q.text, lang),
            statusLbl,
            a.naReason || '',
            a.evidence || '',
            remTxt
          ];
        });

        var qHead = [[
          t('pdf.colId', lang), t('pdf.colQuestion', lang), t('pdf.colStatus', lang),
          t('pdf.colNaReason', lang), t('pdf.colEvidence', lang), t('pdf.colRem', lang)
        ]];

        if (typeof doc.autoTable === 'function') {
          doc.autoTable({
            startY: yD,
            head: qHead,
            body: qBody,
            margin: { left: M, right: M },
            styles: { fontSize: 7.5, cellPadding: 4, valign: 'top', overflow: 'linebreak', textColor: ink },
            headStyles: { fillColor: brand, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
            alternateRowStyles: { fillColor: [248, 249, 251] },
            columnStyles: {
              0: { cellWidth: 42 },
              2: { cellWidth: 68 },
              3: { cellWidth: 72 },
              4: { cellWidth: 80 },
              5: { cellWidth: 80 }
            }
          });
          yD = doc.lastAutoTable.finalY + 18;
        } else {
          // Fallback: simple wrapped text per question
          doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
          doc.setTextColor(ink[0], ink[1], ink[2]);
          qBody.forEach(function (row) {
            if (yD > PAGE_H - 60) { doc.addPage(); yD = M; }
            var txt = '[' + row[0] + '] ' + row[1] + '  |  ' + row[2];
            if (row[3]) txt += '  |  N/A: ' + row[3];
            if (row[4]) txt += '  |  Evidence: ' + row[4];
            if (row[5]) txt += '  |  Remediation: ' + row[5];
            var fLines = doc.splitTextToSize(txt, PAGE_W - 2 * M);
            doc.text(fLines, M, yD); yD += fLines.length * 12 + 8;
          });
          yD += 10;
        }
      });
    }

    // --- Footer + page numbers on every page ---
    var pages = doc.internal.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setDrawColor(225, 228, 232); doc.line(M, PAGE_H - 28, PAGE_W - M, PAGE_H - 28);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(muted[0], muted[1], muted[2]);
      var left = (meta.assessorOrg || meta.assessorName || 'OBS Assessment Tool') + (meta.clientName ? '  —  ' + meta.clientName : '') + t('pdf.confidential', lang);
      doc.text(left, M, PAGE_H - 14, { maxWidth: PAGE_W - 2 * M - 120 });
      doc.text(t('pdf.page', lang) + p + t('pdf.of', lang) + pages, PAGE_W - M, PAGE_H - 14, { align: 'right' });
    }
    return doc;
  }
  return { assessmentToCsv: assessmentToCsv, buildPdf: buildPdf };
});
