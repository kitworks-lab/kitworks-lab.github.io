/* KitWorks Lab — Shared Guides Hub Runtime
   Zero-dependency link resolver & formatting utilities */
(function () {
  'use strict';

  var scriptSrc = (document.currentScript && document.currentScript.src) || '';
  var cachedLinks = null;
  var linksPromise = null;

  function resolveLinksUrl() {
    if (scriptSrc) {
      try {
        return new URL('affiliate-links.json', scriptSrc).href;
      } catch (e) {
        // Fall through to pathname detection
      }
    }
    var pathname = window.location.pathname || '/';
    var idx = pathname.indexOf('/guides/');
    if (idx !== -1) {
      var after = pathname.slice(idx + '/guides/'.length).replace(/index\.html$/i, '');
      var segments = after.split('/').filter(Boolean);
      return segments.length === 0 ? './affiliate-links.json' : '../affiliate-links.json';
    }
    return './affiliate-links.json';
  }

  function loadLinks() {
    if (linksPromise) {
      return linksPromise;
    }
    var url = resolveLinksUrl();
    linksPromise = fetch(url, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Failed to load affiliate-links.json (' + res.status + ')');
        }
        return res.json();
      })
      .then(function (data) {
        cachedLinks = data || {};
        return cachedLinks;
      })
      .catch(function (err) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('[KitGuides]', err.message);
        }
        cachedLinks = {};
        return cachedLinks;
      });
    return linksPromise;
  }

  function wireAnchor(anchor, map) {
    var key = anchor.getAttribute('data-aff');
    if (!key || !map || !map[key]) {
      return;
    }
    var entry = map[key];
    var affUrl = typeof entry.affiliate_url === 'string' ? entry.affiliate_url.trim() : '';
    var hasAff = affUrl.length > 0;
    var preferPricing = anchor.hasAttribute('data-aff-pricing');
    var targetUrl = hasAff
      ? affUrl
      : (preferPricing && entry.pricing_url ? entry.pricing_url : entry.official_url);

    if (targetUrl) {
      anchor.setAttribute('href', targetUrl);
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', hasAff ? 'sponsored noopener noreferrer' : 'noopener noreferrer');
    }
  }

  function applyLinks(root) {
    var scope = root || document;
    var applyNow = function (map) {
      var nodes = scope.querySelectorAll('a[data-aff]');
      for (var i = 0; i < nodes.length; i++) {
        wireAnchor(nodes[i], map);
      }
      return map;
    };
    if (cachedLinks) {
      return Promise.resolve(applyNow(cachedLinks));
    }
    return loadLinks().then(applyNow);
  }

  function getLink(key, preferPricing) {
    if (!cachedLinks || !cachedLinks[key]) {
      return null;
    }
    var entry = cachedLinks[key];
    var affUrl = typeof entry.affiliate_url === 'string' ? entry.affiliate_url.trim() : '';
    var hasAff = affUrl.length > 0;
    var url = hasAff
      ? affUrl
      : (preferPricing && entry.pricing_url ? entry.pricing_url : entry.official_url);
    return {
      url: url,
      isAffiliate: hasAff,
      rel: hasAff ? 'sponsored noopener noreferrer' : 'noopener noreferrer',
      entry: entry
    };
  }

  function fmtUSD(value, decimals) {
    if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) {
      return 'Custom';
    }
    var num = Number(value);
    if (!Number.isFinite(num)) {
      return 'Custom';
    }
    var neg = num < 0;
    var abs = Math.abs(num);
    var fracDigits;
    if (typeof decimals === 'number') {
      fracDigits = decimals;
    } else {
      fracDigits = Math.abs(abs - Math.round(abs)) < 0.005 ? 0 : 2;
    }
    var formatted = abs.toLocaleString('en-US', {
      minimumFractionDigits: fracDigits,
      maximumFractionDigits: fracDigits
    });
    return (neg ? '-$' : '$') + formatted;
  }

  function fmtPct(value, decimals) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return '0%';
    }
    var digits = typeof decimals === 'number' ? decimals : 1;
    var num = Number(value);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }) + '%';
  }

  window.KitGuides = {
    fmtUSD: fmtUSD,
    fmtPct: fmtPct,
    loadLinks: loadLinks,
    applyLinks: applyLinks,
    getLink: getLink
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyLinks(document);
    });
  } else {
    applyLinks(document);
  }
})();