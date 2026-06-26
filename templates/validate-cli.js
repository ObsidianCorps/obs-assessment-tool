'use strict';
// CI helper: load every registered template and validate it against the rules
// in assets/js/validate.js. Exits non-zero if any template is invalid.
const validate = require('../assets/js/validate.js');
global.window = global;
global.OBS_TEMPLATES = {};
require('./infosec-iso27001.js');

let bad = 0;
Object.keys(global.OBS_TEMPLATES).forEach(function (id) {
  const r = validate.validateTemplate(global.OBS_TEMPLATES[id]);
  if (!r.ok) {
    bad++;
    console.error('INVALID ' + id + ':\n  ' + r.errors.join('\n  '));
  } else {
    console.log('valid ' + id);
  }
});
process.exit(bad ? 1 : 0);
