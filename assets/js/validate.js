(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.validate = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  function hasAllLangs(field, langs, label, errors) {
    if (field == null) { errors.push(label + ' missing'); return; }
    langs.forEach(function (l) {
      if (field[l] == null || field[l] === '') errors.push(label + ' missing language "' + l + '"');
    });
  }
  function validateTemplate(t) {
    var errors = [];
    if (!t || typeof t !== 'object') return { ok: false, errors: ['template not an object'] };
    if (typeof t.id !== 'string') errors.push('id must be a string');
    if (typeof t.version !== 'string') errors.push('version must be a string');
    var langs = Array.isArray(t.languages) ? t.languages : [];
    if (!langs.length) errors.push('languages must be a non-empty array');
    if (!Array.isArray(t.maturityLevels) || !t.maturityLevels.length) {
      errors.push('maturityLevels required');
    } else {
      t.maturityLevels.forEach(function (ml, i) {
        if (typeof ml.level !== 'number') errors.push('maturityLevels[' + i + '].level must be numeric');
        if (ml.label == null) errors.push('maturityLevels[' + i + '].label required');
        if (typeof ml.min !== 'number') errors.push('maturityLevels[' + i + '].min must be numeric');
        if (typeof ml.max !== 'number') errors.push('maturityLevels[' + i + '].max must be numeric');
      });
    }
    if (!Array.isArray(t.domains) || !t.domains.length) errors.push('domains required');
    var seen = {};
    (t.domains || []).forEach(function (d, di) {
      if (typeof d.id !== 'string') errors.push('domain[' + di + '].id required');
      hasAllLangs(d.title, langs, 'domain "' + d.id + '" title', errors);
      if (!Array.isArray(d.questions)) { errors.push('domain "' + d.id + '" questions required'); return; }
      d.questions.forEach(function (q) {
        if (typeof q.id !== 'string') { errors.push('question id required in domain ' + d.id); return; }
        if (seen[q.id]) errors.push('duplicate question id ' + q.id);
        seen[q.id] = true;
        if (!(q.threatIndicator >= 1 && q.threatIndicator <= 5)) errors.push(q.id + ' threatIndicator must be 1..5');
        if (q.weight != null && typeof q.weight !== 'number') errors.push(q.id + ' weight must be numeric');
        hasAllLangs(q.text, langs, q.id + ' text', errors);
        hasAllLangs(q.goodPractice, langs, q.id + ' goodPractice', errors);
        if (q.followUp != null) hasAllLangs(q.followUp, langs, q.id + ' followUp', errors);
        if (q.references == null || typeof q.references !== 'object') errors.push(q.id + ' references required');
      });
    });
    return { ok: errors.length === 0, errors: errors };
  }
  return { validateTemplate: validateTemplate };
});
