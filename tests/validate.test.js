'use strict';
const validate = require('../assets/js/validate.js');

function goodTemplate() {
  return {
    id: 't', version: '1.0.0', languages: ['en', 'sq'],
    title: { en: 'T', sq: 'T' }, description: { en: 'd', sq: 'd' },
    maturityLevels: [{ level: 1, label: { en: 'Initial', sq: 'Fillestar' }, min: 0, max: 100 }],
    domains: [{
      id: 'd1', title: { en: 'D1', sq: 'D1' }, customSlots: 2,
      questions: [{
        id: 'Q1', kind: 'standard', threatIndicator: 3, weight: 1, critical: false,
        text: { en: 'q', sq: 'q' }, goodPractice: { en: ['a'], sq: ['a'] },
        followUp: { en: 'f', sq: 'f' },
        references: { iso27001: 'A.5.1', iso27002: '5.1', nis2: 'Art.21', cis: 'CIS 14' }
      }]
    }]
  };
}

test('valid template passes', function () {
  const r = validate.validateTemplate(goodTemplate());
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
test('missing language coverage fails', function () {
  const t = goodTemplate();
  delete t.domains[0].questions[0].text.sq;
  const r = validate.validateTemplate(t);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some((e) => e.indexOf('Q1') >= 0 && e.indexOf('sq') >= 0));
});
test('threatIndicator out of range fails', function () {
  const t = goodTemplate();
  t.domains[0].questions[0].threatIndicator = 9;
  assert.strictEqual(validate.validateTemplate(t).ok, false);
});
test('duplicate question ids fail', function () {
  const t = goodTemplate();
  t.domains[0].questions.push(Object.assign({}, t.domains[0].questions[0]));
  assert.strictEqual(validate.validateTemplate(t).ok, false);
});
test('followUp missing language fails', function () {
  const t = goodTemplate();
  delete t.domains[0].questions[0].followUp.sq;
  const r = validate.validateTemplate(t);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some((e) => e.indexOf('Q1') >= 0 && e.indexOf('sq') >= 0));
});
test('maturityLevels item missing min fails', function () {
  const t = goodTemplate();
  delete t.maturityLevels[0].min;
  assert.strictEqual(validate.validateTemplate(t).ok, false);
});
