'use strict';
const validate = require('../assets/js/validate.js');
global.window = global;
global.OBS_TEMPLATES = {};
require('../templates/infosec-iso27001.js');
const t = global.OBS_TEMPLATES['infosec-iso27001'];

test('template registers itself', function () {
  assert.ok(t, 'template missing');
});
test('template is structurally valid', function () {
  const r = validate.validateTemplate(t);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
test('has 8 domains and 58 questions', function () {
  assert.strictEqual(t.domains.length, 8);
  const n = t.domains.reduce(function (s, d) { return s + d.questions.length; }, 0);
  assert.strictEqual(n, 58);
});
test('every domain has 2 custom slots', function () {
  t.domains.forEach(function (d) { assert.strictEqual(d.customSlots, 2); });
});
test('all question ids are unique', function () {
  const ids = {};
  t.domains.forEach(function (d) {
    d.questions.forEach(function (q) {
      assert.ok(!ids[q.id], 'duplicate id ' + q.id);
      ids[q.id] = true;
    });
  });
});
test('template is valid with both en and sq languages', function () {
  const r = validate.validateTemplate(t);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
test('Albanian translation is flagged as machine-draft', function () {
  assert.strictEqual(t.translationStatus.sq, 'machine-draft');
});
