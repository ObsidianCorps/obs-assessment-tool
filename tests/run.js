'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const tests = [];
global.test = function (name, fn) { tests.push({ name, fn }); };
global.assert = assert;

// auto-discover *.test.js next to this file
fs.readdirSync(__dirname)
  .filter((f) => f.endsWith('.test.js'))
  .forEach((f) => require(path.join(__dirname, f)));

let failed = 0;
for (const t of tests) {
  try { t.fn(); console.log('  ok  ' + t.name); }
  catch (e) { failed++; console.error('FAIL  ' + t.name + '\n      ' + e.message); }
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
