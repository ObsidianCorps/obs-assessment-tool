'use strict';
const scoring = require('../assets/js/scoring.js');

const template = {
  maturityLevels: [
    { level: 1, label: { en: 'Initial' }, min: 0, max: 20 },
    { level: 3, label: { en: 'Defined' }, min: 41, max: 60 },
    { level: 5, label: { en: 'Optimized' }, min: 81, max: 100 }
  ],
  domains: [{
    id: 'd1', title: { en: 'D1' },
    questions: [
      { id: 'Q1', threatIndicator: 4, weight: 1, critical: true, references: {}, text: { en: 'q1' }, goodPractice: { en: [] } },
      { id: 'Q2', threatIndicator: 2, weight: 1, critical: false, references: {}, text: { en: 'q2' }, goodPractice: { en: [] } }
    ]
  }]
};

test('answerValue maps statuses', function () {
  assert.strictEqual(scoring.answerValue({ status: 'compliant' }), 1);
  assert.strictEqual(scoring.answerValue({ status: 'non-compliant' }), 0);
  assert.strictEqual(scoring.answerValue({ status: 'partial', partialPercent: 40 }), 0.4);
  assert.strictEqual(scoring.answerValue({ status: 'partial' }), 0.5);
  assert.strictEqual(scoring.answerValue({ status: 'na' }), null);
  assert.strictEqual(scoring.answerValue({ status: 'unanswered' }), null);
  assert.strictEqual(scoring.answerValue(undefined), null);
});

test('domainScore weights by weight*threat and excludes na', function () {
  const a = { answers: { Q1: { status: 'compliant' }, Q2: { status: 'na' } }, customQuestions: {} };
  const r = scoring.domainScore(template.domains[0], a);
  assert.strictEqual(r.score, 100); // only Q1 scored
  assert.strictEqual(r.scored, 1);
  assert.strictEqual(r.total, 2);
});

test('domainScore mixes partial correctly', function () {
  // Q1 compliant (w=1*4=4, v=1), Q2 partial 50% (w=1*2=2, v=0.5)
  const a = { answers: { Q1: { status: 'compliant' }, Q2: { status: 'partial', partialPercent: 50 } }, customQuestions: {} };
  const r = scoring.domainScore(template.domains[0], a);
  // (1*4 + 0.5*2) / (4+2) = 5/6 = 83.33
  assert.ok(Math.abs(r.score - 83.333) < 0.01);
});

test('completeness counts decided answers incl na', function () {
  const a = { answers: { Q1: { status: 'compliant' }, Q2: { status: 'na' } }, customQuestions: {} };
  const c = scoring.completeness(template, a);
  assert.deepStrictEqual([c.answered, c.total], [2, 2]);
});

test('maturity bands map score to level', function () {
  assert.strictEqual(scoring.maturity(90, template.maturityLevels).level, 5);
  assert.strictEqual(scoring.maturity(50, template.maturityLevels).level, 3);
});

test('complianceSummary lists critical gaps', function () {
  const a = { answers: { Q1: { status: 'non-compliant' }, Q2: { status: 'compliant' } }, customQuestions: {} };
  const s = scoring.complianceSummary(template, a);
  assert.strictEqual(s.nonCompliant, 1);
  assert.strictEqual(s.criticalGaps.length, 1);
  assert.strictEqual(s.criticalGaps[0].qid, 'Q1');
});

test('recommendations sort by threat desc', function () {
  const a = { answers: { Q1: { status: 'non-compliant' }, Q2: { status: 'partial' } }, customQuestions: {} };
  const recs = scoring.recommendations(template, a);
  assert.strictEqual(recs.length, 2);
  assert.strictEqual(recs[0].qid, 'Q1'); // threat 4 before threat 2
});
