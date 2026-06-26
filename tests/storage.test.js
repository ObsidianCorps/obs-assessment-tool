'use strict';
const storage = require('../assets/js/storage.js');

const template = { id: 't', version: '2.0.0', domains: [{ id: 'd1', questions: [{ id: 'Q1' }, { id: 'Q2' }] }] };

test('serialize then parseAssessment round-trips', function () {
  const a = { schemaVersion: 1, templateId: 't', templateVersion: '1.0.0', meta: {}, answers: { Q1: { status: 'compliant' } }, customQuestions: {} };
  const round = storage.parseAssessment(storage.serialize(a));
  assert.strictEqual(round.ok, true);
  assert.deepStrictEqual(round.assessment.answers, a.answers);
});
test('parseAssessment rejects malformed json', function () {
  const r = storage.parseAssessment('{not json');
  assert.strictEqual(r.ok, false);
  assert.ok(r.error);
});
test('parseAssessment rejects wrong shape', function () {
  const r = storage.parseAssessment(JSON.stringify({ foo: 1 }));
  assert.strictEqual(r.ok, false);
});
test('reconcile preserves known, orphans unknown', function () {
  const a = { schemaVersion: 1, templateId: 't', templateVersion: '1.0.0', meta: {}, answers: { Q1: { status: 'compliant' }, QX: { status: 'partial' } }, customQuestions: {} };
  const r = storage.reconcile(a, template);
  assert.ok(r.assessment.answers.Q1);
  assert.ok(!r.assessment.answers.QX);
  assert.ok(r.orphaned.QX);
  assert.ok(r.notices.length >= 1);
});
