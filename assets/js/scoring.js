(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.scoring = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var DECIDED = { compliant: 1, partial: 1, 'non-compliant': 1, na: 1 };

  function clamp01(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }

  function answerValue(ans) {
    if (!ans || !ans.status || ans.status === 'unanswered') return null;
    if (ans.status === 'compliant') return 1;
    if (ans.status === 'non-compliant') return 0;
    if (ans.status === 'na') return null;
    if (ans.status === 'partial') {
      var p = (ans.partialPercent == null) ? 50 : ans.partialPercent;
      return clamp01(p / 100);
    }
    return null;
  }
  function weight(q) { return (q.weight == null ? 1 : q.weight) * (q.threatIndicator == null ? 3 : q.threatIndicator); }

  function effectiveQuestions(domain, assessment) {
    var list = domain.questions.map(function (q) { return { q: q, ans: (assessment.answers || {})[q.id] }; });
    var customs = (assessment.customQuestions || {})[domain.id] || [];
    customs.forEach(function (c, i) {
      if (c && (c.text || c.status)) list.push({
        q: { id: 'custom-' + domain.id + '-' + i, kind: 'custom', weight: 1, threatIndicator: 3, critical: false, text: c.text, references: c.references },
        ans: c
      });
    });
    return list;
  }

  function domainScore(domain, assessment) {
    var items = effectiveQuestions(domain, assessment);
    var num = 0, den = 0, scored = 0, answered = 0;
    items.forEach(function (it) {
      var st = it.ans && it.ans.status;
      if (st && DECIDED[st]) answered++;
      var v = answerValue(it.ans);
      if (v !== null) { var w = weight(it.q); num += v * w; den += w; scored++; }
    });
    return { score: den > 0 ? (num / den) * 100 : null, answered: answered, total: items.length, scored: scored };
  }

  function overallScore(template, assessment) {
    var num = 0, den = 0;
    template.domains.forEach(function (d) {
      effectiveQuestions(d, assessment).forEach(function (it) {
        var v = answerValue(it.ans);
        if (v !== null) { var w = weight(it.q); num += v * w; den += w; }
      });
    });
    return den > 0 ? (num / den) * 100 : null;
  }

  function completeness(template, assessment) {
    var answered = 0, total = 0;
    template.domains.forEach(function (d) {
      effectiveQuestions(d, assessment).forEach(function (it) {
        total++;
        var st = it.ans && it.ans.status;
        if (st && DECIDED[st]) answered++;
      });
    });
    return { answered: answered, total: total, percent: total ? (answered / total) * 100 : 0 };
  }

  // Map a 0–100 score to a maturity band. Bands are treated as lower-bound
  // thresholds (highest `min` that the score reaches wins), so fractional
  // scores that fall in the integer gap between two bands' max/min (e.g. 20.5,
  // 60.5) still resolve to a level instead of returning null. Levels are
  // assumed authored in ascending `min` order.
  function maturity(score, levels) {
    if (score == null || !levels || !levels.length) return null;
    var chosen = null;
    for (var i = 0; i < levels.length; i++) {
      if (score >= levels[i].min) chosen = levels[i];
    }
    if (!chosen) chosen = levels[0];
    return { level: chosen.level, label: chosen.label };
  }

  function complianceSummary(template, assessment) {
    var s = { compliant: 0, partial: 0, nonCompliant: 0, na: 0, unanswered: 0, criticalGaps: [] };
    template.domains.forEach(function (d) {
      effectiveQuestions(d, assessment).forEach(function (it) {
        var q = it.q, ans = it.ans;
        var st = (ans && ans.status) || 'unanswered';
        if (st === 'compliant') s.compliant++;
        else if (st === 'partial') s.partial++;
        else if (st === 'non-compliant') s.nonCompliant++;
        else if (st === 'na') s.na++;
        else s.unanswered++;
        if (q.critical && (st === 'non-compliant' || st === 'partial')) {
          s.criticalGaps.push({ qid: q.id, domainId: d.id, text: q.text });
        }
      });
    });
    return s;
  }

  function recommendations(template, assessment) {
    var out = [];
    template.domains.forEach(function (d) {
      effectiveQuestions(d, assessment).forEach(function (it) {
        var q = it.q, ans = it.ans;
        var st = ans && ans.status;
        if (st === 'partial' || st === 'non-compliant') {
          out.push({
            qid: q.id, domainId: d.id, status: st,
            threat: q.threatIndicator, weight: weight(q),
            references: q.references, text: q.text, goodPractice: q.goodPractice,
            remediation: ans.remediation || null
          });
        }
      });
    });
    out.sort(function (a, b) {
      return (b.threat - a.threat) || (b.weight - a.weight) || (a.qid < b.qid ? -1 : a.qid > b.qid ? 1 : 0);
    });
    return out;
  }

  return {
    answerValue: answerValue, weight: weight, domainScore: domainScore, overallScore: overallScore,
    completeness: completeness, maturity: maturity, complianceSummary: complianceSummary,
    recommendations: recommendations
  };
});
