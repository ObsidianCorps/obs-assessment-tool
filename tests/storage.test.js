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
test('available() true and saveDraft/loadDraft round-trip when localStorage exists', function () {
  var store = {};
  global.localStorage = {
    setItem: function (k, v) { store[k] = String(v); },
    getItem: function (k) { return k in store ? store[k] : null; },
    removeItem: function (k) { delete store[k]; }
  };
  try {
    assert.strictEqual(storage.available(), true);
    var a = { schemaVersion: 1, templateId: 't', templateVersion: '1', meta: {}, answers: { Q1: { status: 'compliant' } }, customQuestions: {} };
    assert.strictEqual(storage.saveDraft(a), true);
    var loaded = storage.loadDraft();
    assert.strictEqual(loaded.ok, true);
    assert.deepStrictEqual(loaded.assessment.answers, a.answers);
  } finally { delete global.localStorage; }
});
test('saveDraft refuses to overwrite an encrypted draft with plaintext when locked', function () {
  // Security regression (M1): if an enc:1 blob is present but no key is cached
  // (locked / unlock skipped), saveDraft must NOT downgrade it to plaintext.
  var store = { 'obs-assessment-draft': JSON.stringify({ enc: 1, v: 1, it: 600000, salt: 'x', iv: 'y', ct: 'z' }) };
  global.localStorage = {
    setItem: function (k, v) { store[k] = String(v); },
    getItem: function (k) { return k in store ? store[k] : null; },
    removeItem: function (k) { delete store[k]; }
  };
  try {
    var a = { schemaVersion: 1, templateId: 't', templateVersion: '1', meta: {}, answers: { Q1: { status: 'compliant' } }, customQuestions: {} };
    var hasCrypto = typeof crypto !== 'undefined' && !!(crypto && crypto.subtle);
    var result = storage.saveDraft(a);
    if (hasCrypto) {
      // Guard active: refused, and the encrypted blob is untouched.
      assert.strictEqual(result, false);
      assert.ok(store['obs-assessment-draft'].indexOf('"enc":1') >= 0, 'encrypted blob was overwritten');
      assert.ok(store['obs-assessment-draft'].indexOf('compliant') < 0, 'plaintext leaked into storage');
    } else {
      // No Web Crypto (guard not applicable in this runtime) — plaintext path.
      assert.strictEqual(result, true);
    }
  } finally { delete global.localStorage; }
});
test('parseAssessment rejects answers: null', function () {
  const r = storage.parseAssessment('{"templateId":"t","answers":null}');
  assert.strictEqual(r.ok, false);
});
test('reconcile notices missing templateVersion against versioned template', function () {
  const a = { schemaVersion: 1, templateId: 't', meta: {}, answers: { Q1: { status: 'compliant' } }, customQuestions: {} };
  const r = storage.reconcile(a, template);
  assert.ok(r.notices.length >= 1);
});
