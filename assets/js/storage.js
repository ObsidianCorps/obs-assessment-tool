(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.storage = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var glob = (typeof window !== 'undefined') ? window
           : (typeof globalThis !== 'undefined') ? globalThis : this;
  var KEY = 'obs-assessment-draft';

  function serialize(a) { return JSON.stringify(a, null, 2); }

  function parseAssessment(text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, error: 'Invalid JSON: ' + e.message }; }
    if (!obj || typeof obj !== 'object' || typeof obj.templateId !== 'string' || obj.answers === null || typeof obj.answers !== 'object') {
      return { ok: false, error: 'Not a valid assessment file' };
    }
    if (!obj.customQuestions) obj.customQuestions = {};
    if (!obj.meta) obj.meta = {};
    return { ok: true, assessment: obj };
  }

  function reconcile(a, template) {
    var valid = {};
    template.domains.forEach(function (d) { d.questions.forEach(function (q) { valid[q.id] = true; }); });
    var kept = {}, orphaned = {}, notices = [];
    Object.keys(a.answers || {}).forEach(function (id) {
      if (valid[id]) kept[id] = a.answers[id]; else orphaned[id] = a.answers[id];
    });
    if (Object.keys(orphaned).length) notices.push(Object.keys(orphaned).length + ' answer(s) no longer in this template version were set aside.');
    if (template.version && a.templateVersion !== template.version) {
      notices.push('Assessment was created against template v' + (a.templateVersion || 'unknown') + '; current is v' + template.version + '.');
    }
    var out = Object.assign({}, a, { answers: kept, templateVersion: template.version });
    return { assessment: out, notices: notices, orphaned: orphaned };
  }

  function available() {
    try {
      var t = '__obs_test__';
      glob.localStorage.setItem(t, '1'); glob.localStorage.removeItem(t); return true;
    } catch (e) { return false; }
  }
  function saveDraft(a) { try { glob.localStorage.setItem(KEY, serialize(a)); return true; } catch (e) { return false; } }
  function loadDraft() { try { var v = glob.localStorage.getItem(KEY); return v ? parseAssessment(v) : null; } catch (e) { return null; } }

  return { serialize: serialize, parseAssessment: parseAssessment, reconcile: reconcile, available: available, saveDraft: saveDraft, loadDraft: loadDraft };
});
