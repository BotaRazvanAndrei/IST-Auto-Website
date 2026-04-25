/* IST Auto — listings.js
   Reads assets/data/listings.json and renders WhatsApp-preview-style cards
   (photo + title + description + olx.ro domain). Each card is a single link
   that opens the OLX listing in a new tab.

   If listings.json is empty, missing, or fetch fails, falls back to a single
   "View all on OLX" card pointing at the seller page.
*/
(function () {
  'use strict';

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function getStrings() {
    return new Promise(function (resolve) {
      var lang = document.documentElement.getAttribute('lang') || 'ro';
      fetch('assets/lang/' + lang + '.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { resolve((j && j.listings) || null); })
        .catch(function () { resolve(null); });
    });
  }

  function renderFallback(container, sellerUrl, strings) {
    var t = (strings && strings.fallback) || {};
    var heading = t.heading || 'Vezi toate mașinile pe OLX';
    var lede = t.lede || 'Anunțurile active sunt pe OLX. Deschide lista completă într-un tab nou.';
    var cta = t.cta || 'Deschide pe OLX';

    var safeUrl = (typeof sellerUrl === 'string' && /^https?:\/\//i.test(sellerUrl)) ? sellerUrl : '#';

    container.innerHTML = '';
    var wrap = el('div', { class: 'listings-fallback' });
    wrap.appendChild(el('h3', { text: heading }));
    wrap.appendChild(el('p', { text: lede }));
    var a = el('a', { class: 'btn btn--primary', href: safeUrl, target: '_blank', rel: 'noopener', text: cta });
    wrap.appendChild(a);
    container.appendChild(wrap);
  }

  var INITIAL_VISIBLE = 3;

  function renderCards(container, items, sellerUrl, strings) {
    container.innerHTML = '';
    var grid = el('div', { class: 'listings-grid' });
    var validItems = items.filter(function (i) { return i && i.url && i.title; });

    validItems.forEach(function (item, idx) {
      var card = el('a', {
        class: 'listing-card' + (idx >= INITIAL_VISIBLE ? ' listing-card--hidden' : ''),
        href: item.url,
        target: '_blank',
        rel: 'noopener',
        'aria-label': item.title
      });

      var photoWrap = el('div', { class: 'listing-card__photo' });
      if (item.photo) {
        var img = el('img', { src: item.photo, alt: '', loading: 'lazy', decoding: 'async' });
        photoWrap.appendChild(img);
      }

      var body = el('div', { class: 'listing-card__body' });
      body.appendChild(el('h3', { class: 'listing-card__title', text: item.title }));
      if (item.description) {
        body.appendChild(el('p', { class: 'listing-card__desc', text: item.description }));
      }
      var domain = '';
      try { domain = new URL(item.url).hostname.replace(/^www\./, ''); } catch (_) {}
      if (domain) {
        body.appendChild(el('span', { class: 'listing-card__domain', text: domain }));
      }

      card.appendChild(photoWrap);
      card.appendChild(body);
      grid.appendChild(card);
    });

    container.appendChild(grid);

    if (validItems.length > INITIAL_VISIBLE) {
      var moreLabel = (strings && strings.show_more) || 'Mai multe';
      var lessLabel = (strings && strings.show_less) || 'Mai puține';
      var btn = el('button', {
        type: 'button',
        class: 'btn btn--ghost listings-toggle',
        'aria-expanded': 'false',
        text: moreLabel
      });
      btn.addEventListener('click', function () {
        var expanded = grid.classList.toggle('listings-grid--expanded');
        btn.textContent = expanded ? lessLabel : moreLabel;
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
      var wrap = el('p', { class: 'listings-more' });
      wrap.appendChild(btn);
      container.appendChild(wrap);
    }
  }

  function init() {
    var container = document.getElementById('listings-grid');
    if (!container) return;
    var sellerUrl = container.getAttribute('data-olx-url') || '';

    Promise.all([
      fetch('assets/data/listings.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : []; })
        .catch(function () { return []; }),
      getStrings()
    ]).then(function (results) {
      var items = Array.isArray(results[0]) ? results[0] : [];
      var strings = results[1];
      if (items.length === 0) {
        renderFallback(container, sellerUrl, strings);
      } else {
        renderCards(container, items, sellerUrl, strings);
      }
    });
  }

  document.addEventListener('i18n:changed', function () {
    init();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
