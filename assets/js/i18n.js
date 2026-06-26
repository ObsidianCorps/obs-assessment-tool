(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.i18n = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  function pick(field, lang) {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    if (field[lang] != null && field[lang] !== '') return field[lang];
    if (field.en != null) return field.en;
    return '';
  }
  function langs(template) {
    return (template && template.languages) ? template.languages.slice() : ['en'];
  }
  return { pick: pick, langs: langs };
});
