(function (root, factory) {
  var mod = factory();
  root.OBS = root.OBS || {};
  root.OBS.storage = mod;
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var glob = (typeof window !== 'undefined') ? window
           : (typeof globalThis !== 'undefined') ? globalThis : this;
  var KEY = 'obs-assessment-draft';

  // ── Crypto availability guard ──────────────────────────────────────
  // Guards all crypto paths; pure functions (serialize/parseAssessment/reconcile)
  // remain synchronous and work in Node for unit tests.
  var hasCrypto = typeof crypto !== 'undefined' && !!(crypto.subtle);

  // ── Module-level encryption state ─────────────────────────────────
  var _cachedKey  = null;  // CryptoKey or null
  var _cachedSalt = null;  // Uint8Array or null

  // ── Async-save queue (prevents overlapping encrypt+write calls) ────
  var _saveInFlight    = false;
  var _pendingAssessment = null;

  // ── Base64 helpers (browser-only; only reachable when hasCrypto) ───
  function _toB64(buf) {
    var bytes = new Uint8Array(buf);
    var binary = '';
    for (var i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  function _fromB64(str) {
    var binary = atob(str);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  // ── Key derivation: PBKDF2(SHA-256, 150k iter) → AES-GCM-256 ─────
  // Called once on enable/unlock; derived key is cached. Never called per-keystroke.
  function deriveKey(password, saltBytes) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    ).then(function (baseKey) {
      return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: saltBytes, iterations: 150000, hash: 'SHA-256' },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    });
  }

  // ── Encrypt assessment → JSON string { enc:1, v:1, salt, iv, ct } ─
  // New random 12-byte IV per call; salt is fixed per password session.
  function _encryptTo(key, saltBytes, assessment) {
    var iv  = crypto.getRandomValues(new Uint8Array(12));
    var enc = new TextEncoder();
    var pt  = enc.encode(JSON.stringify(assessment));
    return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, pt)
      .then(function (ct) {
        return JSON.stringify({
          enc:  1,
          v:    1,
          salt: _toB64(saltBytes),
          iv:   _toB64(iv),
          ct:   _toB64(ct)
        });
      });
  }

  // ── Decrypt stored blob → { ok, assessment } or { ok: false } ─────
  // AES-GCM auth failure on wrong password throws → caught → {ok:false}.
  function _decryptFrom(key, blob) {
    var iv = _fromB64(blob.iv);
    var ct = _fromB64(blob.ct);
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ct)
      .then(function (pt) {
        return { ok: true, assessment: JSON.parse(new TextDecoder().decode(pt)) };
      })
      .catch(function () { return { ok: false }; });
  }

  // ── Encrypted-save worker with pending-queue ───────────────────────
  function _doEncryptedSave(assessment, key, salt) {
    _saveInFlight = true;
    _encryptTo(key, salt, assessment).then(function (blob) {
      try { glob.localStorage.setItem(KEY, blob); } catch (e) { /* ignore */ }
      _saveInFlight = false;
      if (_pendingAssessment !== null) {
        var pending = _pendingAssessment;
        _pendingAssessment = null;
        if (_cachedKey) _doEncryptedSave(pending, _cachedKey, _cachedSalt);
      }
    }).catch(function () {
      _saveInFlight = false;
      _pendingAssessment = null;
    });
  }

  // ── serialize ──────────────────────────────────────────────────────
  function serialize(a) { return JSON.stringify(a, null, 2); }

  // ── parseAssessment ────────────────────────────────────────────────
  function parseAssessment(text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, error: 'Invalid JSON: ' + e.message }; }
    if (!obj || typeof obj !== 'object' || typeof obj.templateId !== 'string' || obj.answers === null || typeof obj.answers !== 'object') {
      return { ok: false, error: 'Not a valid assessment file' };
    }
    if (!obj.customQuestions) obj.customQuestions = {};
    if (!obj.meta) obj.meta = {};
    return { ok: true, assessment: obj };
  }

  // ── reconcile ──────────────────────────────────────────────────────
  function reconcile(a, template) {
    var valid = {};
    template.domains.forEach(function (d) { d.questions.forEach(function (q) { valid[q.id] = true; }); });
    var kept = {}, orphaned = {}, notices = [];
    Object.keys(a.answers || {}).forEach(function (id) {
      if (valid[id]) kept[id] = a.answers[id]; else orphaned[id] = a.answers[id];
    });
    if (Object.keys(orphaned).length) notices.push(Object.keys(orphaned).length + ' answer(s) no longer in this template version were set aside.');
    if (template.version && a.templateVersion !== template.version) {
      notices.push('Assessment was created against template v' + (a.templateVersion || 'unknown') + '; current is v' + template.version + '.');
    }
    var out = Object.assign({}, a, { answers: kept, templateVersion: template.version });
    return { assessment: out, notices: notices, orphaned: orphaned };
  }

  // ── available ──────────────────────────────────────────────────────
  function available() {
    try {
      var t = '__obs_test__';
      glob.localStorage.setItem(t, '1'); glob.localStorage.removeItem(t); return true;
    } catch (e) { return false; }
  }

  // ── saveDraft ──────────────────────────────────────────────────────
  // If a key is cached → AES-GCM encrypt (async, fire-and-forget with queue).
  // Otherwise → synchronous plaintext save as before.
  // Returns true in both cases (sync path returns bool; async path queues work).
  function saveDraft(assessment) {
    if (_cachedKey && hasCrypto) {
      if (_saveInFlight) {
        _pendingAssessment = assessment; // queue latest state; saved after current completes
        return true;
      }
      _doEncryptedSave(assessment, _cachedKey, _cachedSalt);
      return true;
    }
    try { glob.localStorage.setItem(KEY, serialize(assessment)); return true; } catch (e) { return false; }
  }

  // ── loadDraft ──────────────────────────────────────────────────────
  // Plaintext draft → { ok, assessment } as before (backward-compatible).
  // Encrypted draft → { ok: false, encrypted: true } (app must call unlock()).
  // No draft        → null.
  function loadDraft() {
    try {
      var v = glob.localStorage.getItem(KEY);
      if (!v) return null;
      var obj;
      try { obj = JSON.parse(v); } catch (e) { return parseAssessment(v); }
      if (obj && obj.enc === 1) return { ok: false, encrypted: true };
      return parseAssessment(v);
    } catch (e) { return null; }
  }

  // ── isEncrypted ────────────────────────────────────────────────────
  // Returns true when the stored draft blob has enc:1.
  function isEncrypted() {
    try {
      var v = glob.localStorage.getItem(KEY);
      if (!v) return false;
      var obj;
      try { obj = JSON.parse(v); } catch (e) { return false; }
      return !!(obj && obj.enc === 1);
    } catch (e) { return false; }
  }

  // ── isUnlocked ─────────────────────────────────────────────────────
  // Returns true when a CryptoKey is cached (autosave will encrypt).
  function isUnlocked() { return _cachedKey !== null; }

  // ── lock ───────────────────────────────────────────────────────────
  // Clears the cached key. Future saveDraft calls will fail gracefully
  // (encryption is active but no key is available), so the app should
  // stop autosaving or re-prompt for the password after calling lock().
  function lock() { _cachedKey = null; _cachedSalt = null; }

  // ── unlock ─────────────────────────────────────────────────────────
  // Derives key from the salt stored in the encrypted blob, verifies by
  // decrypting (GCM auth failure = wrong password), caches key on success.
  // Returns Promise<{ ok, assessment }> (ok=true) or Promise<{ ok:false }>.
  function unlock(password) {
    if (!hasCrypto) return Promise.resolve({ ok: false, error: 'Web Crypto not available' });
    try {
      var v = glob.localStorage.getItem(KEY);
      if (!v) return Promise.resolve({ ok: false, error: 'No draft found' });
      var blob;
      try { blob = JSON.parse(v); } catch (e) { return Promise.resolve({ ok: false, error: 'Not an encrypted draft' }); }
      if (!blob || blob.enc !== 1) return Promise.resolve({ ok: false, error: 'Not an encrypted draft' });
      var salt = _fromB64(blob.salt);
      return deriveKey(password, salt).then(function (key) {
        return _decryptFrom(key, blob).then(function (result) {
          if (result.ok) { _cachedKey = key; _cachedSalt = salt; }
          return result;
        });
      }).catch(function () { return { ok: false }; });
    } catch (e) {
      return Promise.resolve({ ok: false, error: String(e) });
    }
  }

  // ── setEncryption ──────────────────────────────────────────────────
  // enable=true:  generate random salt, PBKDF2-derive key, cache it, re-encrypt
  //              current plaintext draft (or re-encrypt from old key if changing).
  // enable=false: decrypt current draft (using cached key or supplied password),
  //              save as plaintext, clear cached key.
  function setEncryption(enabled, password) {
    if (!hasCrypto) return Promise.reject(new Error('Web Crypto not available'));

    if (enabled) {
      var newSalt = crypto.getRandomValues(new Uint8Array(16));
      return deriveKey(password, newSalt).then(function (newKey) {
        var v = glob.localStorage.getItem(KEY);
        if (!v) {
          _cachedKey = newKey; _cachedSalt = newSalt;
          return;
        }
        var objE;
        try { objE = JSON.parse(v); } catch (e2) { objE = null; }

        var getAssessment;
        if (objE && objE.enc === 1) {
          // Already encrypted — re-encrypt with new key using old cached key to decrypt first
          if (_cachedKey) {
            var oldKey = _cachedKey;
            getAssessment = _decryptFrom(oldKey, objE).then(function (r) {
              return r.ok ? r.assessment : null;
            });
          } else {
            // No old key available; just update the cached key
            _cachedKey = newKey; _cachedSalt = newSalt;
            return;
          }
        } else if (objE && typeof objE.templateId === 'string') {
          getAssessment = Promise.resolve(objE);
        } else {
          _cachedKey = newKey; _cachedSalt = newSalt;
          return;
        }

        return getAssessment.then(function (assessment) {
          _cachedKey = newKey; _cachedSalt = newSalt;
          if (!assessment) return;
          return _encryptTo(newKey, newSalt, assessment).then(function (blob) {
            try { glob.localStorage.setItem(KEY, blob); } catch (e3) { /* ignore */ }
          });
        });
      });

    } else {
      // Disable: decrypt current draft, save plaintext, clear key
      try {
        var v2 = glob.localStorage.getItem(KEY);
        if (!v2) { lock(); return Promise.resolve(); }
        var blob2;
        try { blob2 = JSON.parse(v2); } catch (e4) { lock(); return Promise.resolve(); }
        if (!blob2 || blob2.enc !== 1) { lock(); return Promise.resolve(); }

        var keyP = _cachedKey
          ? Promise.resolve(_cachedKey)
          : deriveKey(password, _fromB64(blob2.salt));

        return keyP.then(function (key) {
          return _decryptFrom(key, blob2).then(function (result) {
            lock();
            if (result.ok) {
              try { glob.localStorage.setItem(KEY, serialize(result.assessment)); } catch (e5) { /* ignore */ }
            }
          });
        }).catch(function () { lock(); });
      } catch (e6) {
        lock();
        return Promise.resolve();
      }
    }
  }

  // ── decryptDraft ───────────────────────────────────────────────────
  // Convenience helper: decrypt without caching the key (e.g. for export).
  function decryptDraft(password) {
    if (!hasCrypto) return Promise.resolve({ ok: false, error: 'Web Crypto not available' });
    try {
      var v = glob.localStorage.getItem(KEY);
      if (!v) return Promise.resolve({ ok: false, error: 'No draft' });
      var blob;
      try { blob = JSON.parse(v); } catch (e) { return Promise.resolve({ ok: false }); }
      if (!blob || blob.enc !== 1) return Promise.resolve({ ok: false, error: 'Not encrypted' });
      return deriveKey(password, _fromB64(blob.salt)).then(function (key) {
        return _decryptFrom(key, blob);
      });
    } catch (e) {
      return Promise.resolve({ ok: false });
    }
  }

  return {
    // Existing exports (unchanged signatures — Node unit tests target these)
    serialize:        serialize,
    parseAssessment:  parseAssessment,
    reconcile:        reconcile,
    available:        available,
    saveDraft:        saveDraft,
    loadDraft:        loadDraft,
    // Encryption API (browser-only; guarded by hasCrypto internally)
    isEncrypted:      isEncrypted,
    isUnlocked:       isUnlocked,
    lock:             lock,
    unlock:           unlock,
    setEncryption:    setEncryption,
    decryptDraft:     decryptDraft
  };
});
