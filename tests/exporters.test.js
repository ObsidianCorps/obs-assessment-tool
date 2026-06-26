'use strict';
const exporters = require('../assets/js/exporters.js');
const template = { domains: [{ id: 'd1', title: { en: 'D1' }, questions: [
  { id: 'Q1', threatIndicator: 5, critical: true, text: { en: 'Policy?' }, references: { iso27001: 'A.5.1', nis2: 'Art.21' } }
]}]};
const assessment = { answers: { Q1: { status: 'non-compliant', naReason: '', evidence: 'none', remediation: { owner: 'Bob', targetDate: '2026-09-01', status: 'planned' } } }, customQuestions: {} };

test('csv has header and one data row with reference + remediation', function () {
  const csv = exporters.assessmentToCsv(template, assessment, 'en');
  const lines = csv.trim().split('\n');
  assert.ok(lines[0].indexOf('Control') >= 0);
  assert.ok(lines[1].indexOf('A.5.1') >= 0);
  assert.ok(lines[1].indexOf('Bob') >= 0);
});
test('csv escapes commas and quotes', function () {
  const a2 = { answers: { Q1: { status: 'partial', evidence: 'has, comma and "quote"' } }, customQuestions: {} };
  const csv = exporters.assessmentToCsv(template, a2, 'en');
  assert.ok(csv.indexOf('"has, comma and ""quote"""') >= 0);
});
test('csv neutralises formula injection (leading = + - @)', function () {
  const a3 = { answers: { Q1: { status: 'non-compliant', evidence: '=cmd|/c calc', remediation: { owner: '+SUM(A1)', status: '@danger' } } }, customQuestions: {} };
  const csv = exporters.assessmentToCsv(template, a3, 'en');
  // each dangerous value must be prefixed with a single quote so Excel treats it as text
  assert.ok(csv.indexOf("'=cmd|/c calc") >= 0, 'evidence formula not neutralised');
  assert.ok(csv.indexOf("'+SUM(A1)") >= 0, 'owner formula not neutralised');
  assert.ok(csv.indexOf("'@danger") >= 0, 'status formula not neutralised');
});
test('csv includes custom questions (Statement of Applicability completeness)', function () {
  const a4 = {
    answers: { Q1: { status: 'compliant' } },
    customQuestions: { d1: [{ text: 'Custom control?', references: { iso27001: 'A.9.9' }, status: 'partial', partialPercent: 30, evidence: 'partial ev', remediation: { owner: 'Carol' } }] }
  };
  const csv = exporters.assessmentToCsv(template, a4, 'en');
  const lines = csv.trim().split('\n');
  assert.strictEqual(lines.length, 3, 'expected header + template row + custom row');
  const custom = lines[2];
  assert.ok(custom.indexOf('Custom control?') >= 0, 'custom question text missing');
  assert.ok(custom.indexOf('A.9.9') >= 0, 'custom question reference missing');
  assert.ok(custom.indexOf('Carol') >= 0, 'custom remediation owner missing');
  assert.ok(custom.indexOf('partial') >= 0 && custom.indexOf('30') >= 0, 'custom status/percent missing');
});
