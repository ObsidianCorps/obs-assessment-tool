(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.exporters = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var i18n = (typeof require !== 'undefined') ? require('./i18n.js') : (root_OBS().i18n);
  function root_OBS() { return (typeof window !== 'undefined' ? window : globalThis).OBS; }

  function esc(v) {
    v = (v == null) ? '' : String(v);
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
  var STATUS_LABEL = { compliant: 'Compliant', partial: 'Partial', 'non-compliant': 'Non-compliant', na: 'N/A', unanswered: 'Unanswered' };

  // Produce a polished, branded A4 report. `chartImages` = { radar, doughnut } PNG data URLs.
  function buildPdf(template, assessment, lang, chartImages) {
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

    // --- Header band (brand colour) with logo + title ---
    doc.setFillColor(brand[0], brand[1], brand[2]);
    doc.rect(0, 0, PAGE_W, 96, 'F');
    var titleX = M;
    if (meta.logo) {
      try {
        var fmt = /^data:image\/png/i.test(meta.logo) ? 'PNG' : 'JPEG';
        // logo on a white chip so it reads on the coloured band
        doc.setFillColor(255, 255, 255); doc.roundedRect(M, 24, 116, 48, 4, 4, 'F');
        doc.addImage(meta.logo, fmt, M + 6, 28, 104, 40, undefined, 'FAST');
        titleX = M + 132;
      } catch (e) { /* malformed logo: ignore, never block the report */ }
    }
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.text(I.pick(template.title, lang), titleX, 46, { maxWidth: PAGE_W - titleX - M });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text((template.frameworks || []).join('  ·  '), titleX, 66, { maxWidth: PAGE_W - titleX - M });
    doc.text('Information Security Assessment Report', titleX, 80);

    var y = 124;
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
    metaRow('Client / organisation', meta.clientName);
    metaRow('Assessor', meta.assessorName);
    metaRow('Agency', meta.assessorOrg);
    metaRow('Date', meta.date);
    y += 6;
    if (template.translationStatus && template.translationStatus[lang]) {
      doc.setFillColor(255, 244, 229); doc.rect(M, y - 10, PAGE_W - 2 * M, 22, 'F');
      doc.setTextColor(150, 75, 0); doc.setFontSize(9);
      doc.text('Translation (' + lang + ') is machine-drafted and pending professional review.', M + 8, y + 4);
      doc.setTextColor(ink[0], ink[1], ink[2]); y += 28;
    }

    // --- Executive summary band ---
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
    summaryCell(0, overall == null ? 'n/a' : Math.round(overall) + '%', 'Overall score');
    summaryCell(1, mat ? String(mat.level) + '/5' : '–', mat ? I.pick(mat.label, lang) : 'Maturity');
    summaryCell(2, c.answered + '/' + c.total, 'Answered');
    summaryCell(3, String(comp.criticalGaps.length), 'Critical gaps');
    doc.setTextColor(ink[0], ink[1], ink[2]); y += 86;

    // --- Charts ---
    if (chartImages && (chartImages.radar || chartImages.doughnut)) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text('Scores by domain', M, y); y += 8;
      if (chartImages.radar) doc.addImage(chartImages.radar, 'PNG', M, y, 250, 250);
      if (chartImages.doughnut) doc.addImage(chartImages.doughnut, 'PNG', M + 280, y + 20, 210, 210);
      y += 264;
    }

    // --- Recommendations table (severity-ranked) ---
    var recs = S.recommendations(template, assessment);
    var body = recs.map(function (r, i) {
      var rem = r.remediation || {};
      var remTxt = [rem.owner, rem.targetDate, rem.status].filter(Boolean).join(' · ');
      return [String(i + 1), I.pick(r.text, lang), STATUS_LABEL[r.status] || r.status, String(r.threat), refStr(r.references), remTxt];
    });
    if (y > PAGE_H - 140) { doc.addPage(); y = M; }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(ink[0], ink[1], ink[2]);
    doc.text('Findings & recommendations (' + recs.length + ')', M, y); y += 10;
    var head = [['#', 'Finding', 'Status', 'Threat', 'References', 'Remediation']];
    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        startY: y + 4, head: head, body: body, margin: { left: M, right: M },
        styles: { fontSize: 8, cellPadding: 5, valign: 'top', overflow: 'linebreak', textColor: ink },
        headStyles: { fillColor: brand, textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 249, 251] },
        columnStyles: { 0: { cellWidth: 22 }, 2: { cellWidth: 64 }, 3: { cellWidth: 40, halign: 'center' }, 4: { cellWidth: 110 }, 5: { cellWidth: 90 } }
      });
    } else {
      // Fallback if the autotable plugin is unavailable: simple wrapped lines.
      doc.setFontSize(9); y += 14;
      body.forEach(function (row) {
        if (y > PAGE_H - 60) { doc.addPage(); y = M; }
        doc.text(doc.splitTextToSize(row[0] + '. [' + row[2] + '] ' + row[1] + '  (' + row[4] + ')', PAGE_W - 2 * M), M, y);
        y += 26;
      });
    }

    // --- Footer + page numbers on every page ---
    var pages = doc.internal.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setDrawColor(225, 228, 232); doc.line(M, PAGE_H - 28, PAGE_W - M, PAGE_H - 28);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(muted[0], muted[1], muted[2]);
      var left = (meta.assessorOrg || meta.assessorName || 'OBS Assessment Tool') + (meta.clientName ? '  —  ' + meta.clientName : '') + '   ·   Confidential';
      doc.text(left, M, PAGE_H - 14, { maxWidth: PAGE_W - 2 * M - 120 });
      doc.text('Page ' + p + ' of ' + pages, PAGE_W - M, PAGE_H - 14, { align: 'right' });
    }
    return doc;
  }
  return { assessmentToCsv: assessmentToCsv, buildPdf: buildPdf };
});
