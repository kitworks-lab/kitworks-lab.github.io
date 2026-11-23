/* KitWorks Lab — Shared Bilingual & Utility Helpers for Free Web Tools */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'kitworks-site-lang';

  function detectInitialLang() {
    try {
      var params = new URLSearchParams(global.location.search || '');
      var urlLang = params.get('lang');
      if (urlLang === 'en' || urlLang === 'ja') return urlLang;

      var saved = global.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ja') return saved;
    } catch (e) {
      /* ignore storage errors */
    }
    var navLang = (global.navigator && global.navigator.language) || 'ja';
    return navLang.toLowerCase().indexOf('ja') === 0 ? 'ja' : 'en';
  }

  function applyLanguage(lang, dictMap) {
    var safeLang = lang === 'en' ? 'en' : 'ja';
    global.KitWorksLang = safeLang;
    document.documentElement.lang = safeLang;

    var dict = (dictMap && dictMap[safeLang]) || {};
    if (dict.pageTitle) document.title = dict.pageTitle;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict.pageDesc) {
      metaDesc.setAttribute('content', dict.pageDesc);
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] === undefined) return;
      var val = dict[key];
      if (el.getAttribute('data-i18n-multiline') === 'true') {
        el.innerHTML = '';
        val.split('\n').forEach(function (line, idx) {
          if (idx > 0) el.appendChild(document.createElement('br'));
          el.appendChild(document.createTextNode(line));
        });
      } else {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    var links = dict.links || {};
    document.querySelectorAll('[data-i18n-href]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-href');
      if (links[key]) {
        el.setAttribute('href', links[key]);
      }
    });

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      var active = btn.getAttribute('data-lang-btn') === safeLang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    try {
      global.localStorage.setItem(STORAGE_KEY, safeLang);
    } catch (e) {
      /* ignore */
    }

    global.dispatchEvent(new CustomEvent('kitworks:langchange', { detail: { lang: safeLang, dict: dict } }));
  }

  function initToolsI18n(dictMap) {
    var current = detectInitialLang();
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLanguage(btn.getAttribute('data-lang-btn'), dictMap);
      });
    });
    applyLanguage(current, dictMap);
    return {
      getLang: function () { return global.KitWorksLang || 'ja'; },
      setLang: function (l) { applyLanguage(l, dictMap); }
    };
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text);
      });
    }
    return fallbackCopy(text);
  }

  function fallbackCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        document.body.removeChild(ta);
        reject(err);
      }
    });
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  global.KitWorksTools = {
    initI18n: initToolsI18n,
    copyText: copyText,
    formatBytes: formatBytes
  };
})(window);