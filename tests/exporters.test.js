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
