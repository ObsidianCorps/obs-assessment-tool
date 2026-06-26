'use strict';
const i18n = require('../assets/js/i18n.js');

test('pick returns requested language', function () {
  assert.strictEqual(i18n.pick({ en: 'Hello', sq: 'Përshëndetje' }, 'sq'), 'Përshëndetje');
});
test('pick falls back to en when language missing', function () {
  assert.strictEqual(i18n.pick({ en: 'Hello' }, 'sq'), 'Hello');
});
test('pick returns empty string when nothing available', function () {
  assert.strictEqual(i18n.pick({}, 'sq'), '');
});
test('pick passes through a plain string', function () {
  assert.strictEqual(i18n.pick('literal', 'sq'), 'literal');
});
test('langs returns template languages', function () {
  assert.deepStrictEqual(i18n.langs({ languages: ['en', 'sq'] }), ['en', 'sq']);
});
