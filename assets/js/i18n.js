/* IST Auto — i18n.js
   Bilingual (RO default, EN) via data-i18n attributes + JSON dictionaries.
   - Persists language in localStorage.
   - Updates <html lang>.
   - Updates WhatsApp CTA href with language-appropriate prefilled message.
*/
(function () {
  'use strict';

  var DEFAULT_LANG = 'ro';
  var SUPPORTED = ['ro', 'en'];
  var STORAGE_KEY = 'istauto.lang';
  var WHATSAPP_NUMBER = '40740346163';

  var dictCache = {};

  function getInitialLang() {
    var urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && SUPPORTED.indexOf(urlLang) !== -1) return urlLang;
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (_) { /* private mode */ }
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    return DEFAULT_LANG;
  }

  function lookup(dict, dotted) {
    var parts = dotted.split('.');
    var cur = dict;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return null;
      cur = cur[parts[i]];
    }
    return (typeof cur === 'string') ? cur : null;
  }

  function applyDict(dict) {
    var nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = lookup(dict, key);
      if (value == null) return;
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });
  }

  function updateWhatsAppCTAs(dict) {
    var message = lookup(dict, 'whatsapp.prefilled_message') || '';
    var href = 'https://wa.me/' + WHATSAPP_NUMBER + (message ? '?text=' + encodeURIComponent(message) : '');
    document.querySelectorAll('a[id^="cta-whatsapp"]').forEach(function (a) {
      a.setAttribute('href', href);
    });
  }

  function updateLangSwitcherPressed(lang) {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
  }

  function fetchDict(lang) {
    if (dictCache[lang]) return Promise.resolve(dictCache[lang]);
    return fetch('assets/lang/' + lang + '.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load ' + lang);
        return r.json();
      })
      .then(function (json) { dictCache[lang] = json; return json; });
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    return fetchDict(lang).then(function (dict) {
      document.documentElement.setAttribute('lang', lang);
      applyDict(dict);
      updateWhatsAppCTAs(dict);
      updateLangSwitcherPressed(lang);
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* noop */ }
      document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: lang, dict: dict } }));
    }).catch(function (err) {
      console.error('[i18n]', err);
    });
  }

  function bindLangSwitcher() {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });
  }

  function bindNavToggle() {
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function init() {
    bindLangSwitcher();
    bindNavToggle();
    setLang(getInitialLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
