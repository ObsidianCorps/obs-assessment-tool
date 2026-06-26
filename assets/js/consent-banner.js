/*
 * Privacy / localStorage notice banner.
 * Self-contained: own EN/SQ strings, inline styles (CSP 'unsafe-inline' for
 * styles is allowed), dismissal persisted in localStorage. No dependencies, so
 * it can load on both index.html and app.html regardless of other scripts.
 *
 * Honest notice: this tool stores assessment data ONLY in the browser
 * (localStorage); nothing entered is sent to or stored on the server — only
 * standard web-server access logs are kept.
 */
(function () {
  'use strict';

  var DISMISS_KEY = 'obs-privacy-notice-dismissed';
  var LANG_KEY = 'obs-lang';

  var STRINGS = {
    message: {
      en: 'This tool keeps your assessment only in your browser (localStorage) so you don’t lose your work. Nothing you enter is sent to or stored on our servers — only standard access logs are kept. Export your assessment to keep a copy.',
      sq: 'Ky mjet i ruan vlerësimet tuaja vetëm në shfletuesin tuaj (localStorage) që të mos humbni punën. Asgjë që shkruani nuk dërgohet ose ruhet në serverat tanë — mbahen vetëm regjistra standardë të aksesit. Eksportoni vlerësimin për të ruajtur një kopje.'
    },
    privacy: { en: 'Privacy notice', sq: 'Njoftimi i privatësisë' },
    dismiss: { en: 'Got it', sq: 'Në rregull' }
  };

  function currentLang() {
    var l = document.documentElement.lang;
    if (l !== 'en' && l !== 'sq') {
      try { l = localStorage.getItem(LANG_KEY); } catch (e) { l = null; }
    }
    return (l === 'sq') ? 'sq' : 'en';
  }

  function pick(field, lang) { return field[lang] != null ? field[lang] : field.en; }

  function alreadyDismissed() {
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch (e) { return false; }
  }
  function rememberDismissed() {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) { /* storage blocked */ }
  }

  function build() {
    if (alreadyDismissed()) return;

    var lang = currentLang();

    var bar = document.createElement('div');
    bar.id = 'privacy-banner';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Privacy notice');
    bar.setAttribute('style', [
      'position:fixed', 'left:0', 'right:0', 'bottom:0', 'z-index:9999',
      'background:#0f213d', 'color:#f1f5f9',
      'border-top:1px solid rgba(255,255,255,0.14)',
      'box-shadow:0 -2px 14px rgba(0,0,0,0.28)',
      'padding:14px 18px', 'font-size:13.5px', 'line-height:1.5'
    ].join(';'));

    var inner = document.createElement('div');
    inner.setAttribute('style', [
      'max-width:1100px', 'margin:0 auto', 'display:flex',
      'flex-wrap:wrap', 'align-items:center', 'gap:14px',
      'justify-content:space-between'
    ].join(';'));

    var msg = document.createElement('p');
    msg.setAttribute('style', 'margin:0;flex:1 1 360px;color:rgba(241,245,249,0.92);');
    msg.textContent = pick(STRINGS.message, lang);

    var actions = document.createElement('div');
    actions.setAttribute('style', 'display:flex;align-items:center;gap:14px;flex:0 0 auto;');

    var link = document.createElement('a');
    link.href = 'docs/PRIVACY.md';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = pick(STRINGS.privacy, lang);
    link.setAttribute('style', 'color:#bcd3ff;text-decoration:underline;white-space:nowrap;');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = pick(STRINGS.dismiss, lang);
    btn.setAttribute('style', [
      'background:#3b82f6', 'color:#fff', 'border:0', 'border-radius:7px',
      'padding:8px 16px', 'font-size:13.5px', 'font-weight:600', 'cursor:pointer',
      'white-space:nowrap'
    ].join(';'));
    btn.addEventListener('click', function () {
      rememberDismissed();
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    });

    actions.appendChild(link);
    actions.appendChild(btn);
    inner.appendChild(msg);
    inner.appendChild(actions);
    bar.appendChild(inner);
    document.body.appendChild(bar);

    // Re-translate live if the user flips the language toggle while the banner is open.
    var langBtns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener('click', function () {
        var l = currentLang();
        msg.textContent = pick(STRINGS.message, l);
        link.textContent = pick(STRINGS.privacy, l);
        btn.textContent = pick(STRINGS.dismiss, l);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
}());
