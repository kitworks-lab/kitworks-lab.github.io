/* KitWorks Lab — Main Controller (Language Toggle & Demo Boot) */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'kitworks-site-lang';
  var tokiDemo = null;
  var goalDemo = null;

  function detectInitialLang() {
    try {
      var params = new URLSearchParams(global.location.search || '');
      var urlLang = params.get('lang');
      if (urlLang === 'en' || urlLang === 'ja') return urlLang;

      var saved = global.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ja') return saved;
    } catch (e) {
      /* ignore storage access errors */
    }
    var navLang = (global.navigator && global.navigator.language) || 'ja';
    return navLang.toLowerCase().indexOf('ja') === 0 ? 'ja' : 'en';
  }

  function applyLanguage(lang) {
    var safeLang = lang === 'en' ? 'en' : 'ja';
    global.KitWorksLang = safeLang;
    document.documentElement.lang = safeLang;

    var dict = (global.KitWorksI18N && global.KitWorksI18N[safeLang]) || {};
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

    if (tokiDemo && typeof tokiDemo.refreshLang === 'function') {
      tokiDemo.refreshLang();
    }
    if (goalDemo && typeof goalDemo.refreshLang === 'function') {
      goalDemo.refreshLang();
    }
  }

  function boot() {
    global.KitWorksLang = detectInitialLang();
    if (global.KitWorksDemos) {
      tokiDemo = global.KitWorksDemos.initTokiDockDemo();
      goalDemo = global.KitWorksDemos.initGoalDockDemo();
    }

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLanguage(btn.getAttribute('data-lang-btn'));
      });
    });

    applyLanguage(global.KitWorksLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
