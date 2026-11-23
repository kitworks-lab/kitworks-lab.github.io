/* KitWorks Lab — Creator Newsletter & Digital Product Profit Calculator (2026)
   Pricing verified November 2026 from official Kit, beehiiv, and Gumroad pricing sheets. */
(function () {
  'use strict';

  var DEFAULTS = {
    subs: 2500,
    gmv: 1500,
    aov: 25,
    billing: 'annual',
    needAutomations: true,
    needCustomDomain: true,
    removeBranding: false
  };

  var state = Object.assign({}, DEFAULTS);

  var KIT_CREATOR = [
    { maxSubs: 1000, label: 'Up to 1k', monthly: 39, annualMo: 32.50, annualYr: 390 },
    { maxSubs: 3000, label: 'Up to 3k', monthly: 59, annualMo: 49.17, annualYr: 590 },
    { maxSubs: 5000, label: 'Up to 5k', monthly: 89, annualMo: 74.17, annualYr: 890 },
    { maxSubs: 10000, label: 'Up to 10k', monthly: 139, annualMo: 115.83, annualYr: 1390 },
    { maxSubs: 25000, label: 'Up to 25k', monthly: 199, annualMo: 165.83, annualYr: 1990 },
    { maxSubs: 55000, label: 'Up to 55k', monthly: 379, annualMo: 315.83, annualYr: 3790 }
  ];

  var BEEHIIV_LITE = [
    { maxSubs: 1000, label: 'Up to 1k', monthly: 59, annualMo: 49 },
    { maxSubs: 2500, label: 'Up to 2.5k', monthly: 79, annualMo: 69 },
    { maxSubs: 5000, label: 'Up to 5k', monthly: 109, annualMo: 95 },
    { maxSubs: 10000, label: 'Up to 10k', monthly: 139, annualMo: 119 },
    { maxSubs: 25000, label: 'Up to 25k', monthly: 199, annualMo: 169 },
    { maxSubs: 50000, label: 'Up to 50k', monthly: 299, annualMo: 249 }
  ];

  var BEEHIIV_PRO = [
    { maxSubs: 1000, label: 'Up to 1k', monthly: 109, annualMo: 95 },
    { maxSubs: 2500, label: 'Up to 2.5k', monthly: 149, annualMo: 129 },
    { maxSubs: 5000, label: 'Up to 5k', monthly: 199, annualMo: 169 },
    { maxSubs: 10000, label: 'Up to 10k', monthly: 239, annualMo: 199 },
    { maxSubs: 25000, label: 'Up to 25k', monthly: 349, annualMo: 299 },
    { maxSubs: 50000, label: 'Up to 50k', monthly: 469, annualMo: 399 }
  ];

  function fmtUSD(v, decimals) {
    if (window.KitGuides && window.KitGuides.fmtUSD) {
      return window.KitGuides.fmtUSD(v, decimals);
    }
    if (v === null || v === undefined) return 'Custom';
    var n = Number(v);
    var sign = n < 0 ? '-$' : '$';
    return sign + Math.abs(n).toFixed(decimals === undefined ? 0 : decimals);
  }

  function fmtPct(v, decimals) {
    if (window.KitGuides && window.KitGuides.fmtPct) {
      return window.KitGuides.fmtPct(v, decimals);
    }
    return Number(v).toFixed(1) + '%';
  }

  function pickBracket(table, subs) {
    for (var i = 0; i < table.length; i++) {
      if (subs <= table[i].maxSubs) return table[i];
    }
    return table[table.length - 1];
  }

  function evalGumroad(s, orders) {
    var platformFee = s.gmv * 0.10;
    var procEst = orders * 0.50;
    var txFees = platformFee + procEst;
    var saasCost = 0;
    var totalCost = saasCost + txFees;
    var net = s.gmv - totalCost;
    var effRate = s.gmv > 0 ? (totalCost / s.gmv) * 100 : 0;

    var note = '10% flat platform fee + $0.50/order processing estimate (assumption). Acts as Merchant of Record for global VAT/sales tax. Excludes 30% Discover marketplace fee.';
    var noteWarn = false;
    if (s.needAutomations || s.needCustomDomain) {
      note = 'Checkout & basic buyer emails only: Gumroad does not replace visual newsletter automations or a custom newsletter publication domain. ' + note;
      noteWarn = true;
    }

    return {
      key: null,
      directUrl: 'https://gumroad.com/pricing',
      name: 'Gumroad',
      tier: 'Pay-as-you-go ($0 base)',
      saasCost: saasCost,
      txFees: txFees,
      totalCost: totalCost,
      net: net,
      effRate: effRate,
      breakEvenGmv: null,
      badge: '$0 Fixed Base',
      badgeWarn: false,
      note: note,
      noteWarn: noteWarn,
      details: [
        ['Base SaaS fee', '$0/mo'],
        ['10% platform + $0.50/tx est.', fmtUSD(txFees, 2) + '/mo'],
        ['Effective fee rate', s.gmv > 0 ? fmtPct(effRate, 1) : 'N/A ($0 GMV)'],
        ['Annual total fees', fmtUSD(totalCost * 12, 0) + '/yr']
      ],
      ctaLabel: 'Gumroad Pricing'
    };
  }

  function evalKit(s, orders) {
    var qualifiesFree = s.subs <= 10000 && !s.needAutomations && !s.removeBranding;
    var tierName;
    var saasCost;
    if (qualifiesFree) {
      tierName = 'Newsletter Free (up to 10k subs)';
      saasCost = 0;
    } else {
      var bracket = pickBracket(KIT_CREATOR, s.subs);
      tierName = 'Creator (' + bracket.label + ' subs)';
      saasCost = s.billing === 'annual' ? bracket.annualMo : bracket.monthly;
    }

    var txFees = s.gmv * 0.035 + orders * 0.30;
    var totalCost = saasCost + txFees;
    var net = s.gmv - totalCost;
    var effRate = s.gmv > 0 ? (totalCost / s.gmv) * 100 : 0;

    // Savings per $1 GMV vs Gumroad: (0.10 + 0.50/P) - (0.035 + 0.30/P) = 0.065 + 0.20/P
    var deltaRate = 0.065 + (0.20 / s.aov);
    var breakEvenGmv = saasCost === 0 ? 0 : (saasCost / deltaRate);

    var note;
    var noteWarn = false;
    if (qualifiesFree) {
      note = 'Kit Newsletter Free covers up to 10,000 subscribers and Kit Commerce (3.5% + $0.30) at $0/mo, beating Gumroad from the first sale. Visual Automations and branding removal require Creator.';
    } else {
      note = 'Creator includes unlimited Visual Automations, Sequences, and branding removal. Kit Commerce charges 3.5% + $0.30/sale. Break-even vs Gumroad at $' + s.aov + ' average ticket: ' + fmtUSD(breakEvenGmv, 0) + '/mo GMV.';
    }
    if (s.subs > 25000) {
      note += ' Above 25k subscribers, Kit jumps to the 55k bracket ($379/mo monthly), where beehiiv Lite is cheaper.';
      noteWarn = true;
    }

    return {
      key: 'kit',
      name: 'Kit',
      tier: tierName,
      saasCost: saasCost,
      txFees: txFees,
      totalCost: totalCost,
      net: net,
      effRate: effRate,
      breakEvenGmv: breakEvenGmv,
      badge: qualifiesFree ? 'Free up to 10k' : '3.5% + $0.30 Fee',
      badgeWarn: false,
      note: note,
      noteWarn: noteWarn,
      details: [
        ['Base SaaS fee', fmtUSD(saasCost, 2) + '/mo'],
        ['Kit Commerce (3.5%+$0.30)', fmtUSD(txFees, 2) + '/mo'],
        ['Effective fee rate', s.gmv > 0 ? fmtPct(effRate, 1) : 'N/A ($0 GMV)'],
        ['Break-even vs Gumroad', breakEvenGmv === 0 ? '$0/mo (Sale #1)' : fmtUSD(breakEvenGmv, 0) + '/mo GMV']
      ],
      ctaLabel: 'Visit Kit'
    };
  }

  function evalBeehiiv(s, orders) {
    var qualifiesFree = s.subs <= 2500 && !s.needAutomations && !s.needCustomDomain && !s.removeBranding && s.gmv === 0;
    var tierName;
    var saasCost;
    var isPro = false;

    if (qualifiesFree) {
      tierName = 'Free (up to 2.5k subs)';
      saasCost = 0;
    } else if (s.removeBranding) {
      var proB = pickBracket(BEEHIIV_PRO, s.subs);
      tierName = 'Pro (' + proB.label + ' subs)';
      saasCost = s.billing === 'annual' ? proB.annualMo : proB.monthly;
      isPro = true;
    } else {
      var liteB = pickBracket(BEEHIIV_LITE, s.subs);
      tierName = 'Lite (' + liteB.label + ' subs)';
      saasCost = s.billing === 'annual' ? liteB.annualMo : liteB.monthly;
    }

    // 0% beehiiv platform fee + Stripe processing assumption (2.9% + $0.30/order)
    var stripeFees = s.gmv * 0.029 + orders * 0.30;
    var totalCost = saasCost + stripeFees;
    var net = s.gmv - totalCost;
    var effRate = s.gmv > 0 ? (totalCost / s.gmv) * 100 : 0;

    // Savings per $1 GMV vs Gumroad: (0.10 + 0.50/P) - (0.029 + 0.30/P) = 0.071 + 0.20/P
    var deltaRate = 0.071 + (0.20 / s.aov);
    var breakEvenGmv = saasCost === 0 ? 0 : (saasCost / deltaRate);

    var note;
    var noteWarn = false;
    if (qualifiesFree) {
      note = 'beehiiv Free covers up to 2,500 subscribers with unlimited sends, but locks custom domains, automations, and paid monetization behind Lite ($49/$59+).';
    } else if (isPro) {
      note = 'Removing beehiiv footer branding requires Pro (Oct 2026 pricing). Takes 0% platform cut (+ ~2.9% + $0.30 Stripe processing estimate). Break-even vs Gumroad: ' + fmtUSD(breakEvenGmv, 0) + '/mo GMV.';
      noteWarn = true;
    } else {
      note = 'Oct 2026 Lite includes custom domain, up to 10 automations, Ad Network access, and 0% platform cut (+ ~2.9% + $0.30 Stripe estimate). Keeps beehiiv footer branding until Pro. Break-even vs Gumroad: ' + fmtUSD(breakEvenGmv, 0) + '/mo GMV.';
    }

    return {
      key: 'beehiiv',
      name: 'beehiiv',
      tier: tierName,
      saasCost: saasCost,
      txFees: stripeFees,
      totalCost: totalCost,
      net: net,
      effRate: effRate,
      breakEvenGmv: breakEvenGmv,
      badge: isPro ? 'Pro (No Branding)' : (qualifiesFree ? 'Free up to 2.5k' : '0% Cut + Stripe'),
      badgeWarn: isPro,
      note: note,
      noteWarn: noteWarn,
      details: [
        ['Base SaaS fee', fmtUSD(saasCost, 2) + '/mo'],
        ['Stripe est. (2.9%+$0.30)', fmtUSD(stripeFees, 2) + '/mo'],
        ['Effective fee rate', s.gmv > 0 ? fmtPct(effRate, 1) : 'N/A ($0 GMV)'],
        ['Break-even vs Gumroad', breakEvenGmv === 0 ? '$0/mo' : fmtUSD(breakEvenGmv, 0) + '/mo GMV']
      ],
      ctaLabel: 'Visit beehiiv'
    };
  }

  function syncPresets() {
    document.querySelectorAll('.preset-row[data-preset-for]').forEach(function (row) {
      var field = row.getAttribute('data-preset-for');
      var cur = String(state[field]);
      row.querySelectorAll('.preset-btn').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-val') === cur);
      });
    });
  }

  function render() {
    var orders = state.gmv > 0 ? state.gmv / state.aov : 0;

    document.getElementById('lbl-subs').textContent = state.subs.toLocaleString('en-US');
    document.getElementById('lbl-gmv').textContent = fmtUSD(state.gmv, 0);
    document.getElementById('lbl-aov').textContent = fmtUSD(state.aov, 0);
    document.getElementById('lbl-billing').textContent = state.billing === 'annual' ? 'Annual' : 'Monthly';
    document.getElementById('hint-orders').textContent = state.gmv > 0
      ? 'Estimated ' + Math.round(orders).toLocaleString('en-US') + ' transactions/month at ' + fmtUSD(state.aov, 0) + ' average ticket.'
      : 'At $0 GMV, cards compare pure monthly newsletter subscription costs.';

    syncPresets();

    var gumroad = evalGumroad(state, orders);
    var kit = evalKit(state, orders);
    var beehiiv = evalBeehiiv(state, orders);
    var platforms = [kit, beehiiv, gumroad];

    // Highest Net Monthly Take-Home wins
    var sorted = platforms.slice().sort(function (a, b) {
      return b.net - a.net;
    });
    var winner = sorted[0];

    var bestPaidEsp = kit.net >= beehiiv.net ? kit : beehiiv;
    var annualDiffVsGumroad = (bestPaidEsp.net - gumroad.net) * 12;

    // KPI Strip
    var kpiHtml = '';
    kpiHtml += '<div class="kpi-box is-highlight">' +
      '<div class="kpi-label">' + (state.gmv > 0 ? 'Highest Net Monthly Take-Home' : 'Lowest Monthly Platform Cost') + '</div>' +
      '<div class="kpi-val">' + winner.name + ' · ' + fmtUSD(winner.net, 2) + '/mo</div>' +
      '<div class="kpi-note">' + winner.tier + ' (Total fees: ' + fmtUSD(winner.totalCost, 2) + '/mo)</div>' +
      '</div>';

    var savingsHeadline = annualDiffVsGumroad >= 0
      ? '+' + fmtUSD(annualDiffVsGumroad, 0) + '/yr'
      : fmtUSD(Math.abs(annualDiffVsGumroad), 0) + '/yr cheaper on Gumroad';
    var savingsNote = annualDiffVsGumroad >= 0
      ? bestPaidEsp.name + ' saves ' + fmtUSD(annualDiffVsGumroad / 12, 2) + '/mo vs Gumroad'
      : 'Increase GMV past break-even before leaving Gumroad for fees alone';

    kpiHtml += '<div class="kpi-box">' +
      '<div class="kpi-label">Annual Fee Savings vs Gumroad</div>' +
      '<div class="kpi-val">' + savingsHeadline + '</div>' +
      '<div class="kpi-note">' + savingsNote + '</div>' +
      '</div>';

    var minBreakEven = Math.min(kit.breakEvenGmv, beehiiv.breakEvenGmv);
    var minBeTool = kit.breakEvenGmv <= beehiiv.breakEvenGmv ? 'Kit' : 'beehiiv';
    kpiHtml += '<div class="kpi-box">' +
      '<div class="kpi-label">Break-Even GMV to Leave Gumroad</div>' +
      '<div class="kpi-val">' + (minBreakEven === 0 ? '$0/mo (Sale #1)' : fmtUSD(minBreakEven, 0) + '/mo') + '</div>' +
      '<div class="kpi-note">Kit: ' + (kit.breakEvenGmv === 0 ? '$0' : fmtUSD(kit.breakEvenGmv, 0)) + '/mo · beehiiv: ' + (beehiiv.breakEvenGmv === 0 ? '$0' : fmtUSD(beehiiv.breakEvenGmv, 0)) + '/mo (' + minBeTool + ' breaks even first)</div>' +
      '</div>';
    document.getElementById('nl-kpis').innerHTML = kpiHtml;

    // Contextual Alerts
    var alerts = [];
    if (state.aov <= 10 && state.gmv > 0) {
      alerts.push({
        warn: true,
        html: '<strong>Low-Ticket Per-Transaction Drag:</strong> At a ' + fmtUSD(state.aov, 0) + ' average order price, fixed per-transaction charges ($0.30-$0.50) add ' + fmtPct((0.30 / state.aov) * 100, 1) + ' to ' + fmtPct((0.50 / state.aov) * 100, 1) + ' on top of percentage fees. Bundling small packs into higher-ticket bundles cuts payment drag immediately.'
      });
    }
    if (state.removeBranding) {
      alerts.push({
        warn: true,
        html: '<strong>beehiiv Branding Paywall:</strong> Under October 2026 pricing, beehiiv Lite retains beehiiv footer branding. Removing branding bumps beehiiv to <strong>Pro (' + fmtUSD(beehiiv.saasCost, 0) + '/mo)</strong>, whereas Kit Creator includes branding removal at ' + fmtUSD(kit.saasCost, 2) + '/mo.'
      });
    }
    if (state.subs <= 10000 && !state.needAutomations && !state.removeBranding) {
      alerts.push({
        warn: false,
        html: '<strong>Kit 10,000-Subscriber Free Tier Active:</strong> Without visual automations or branding removal, Kit Newsletter Free covers up to 10k subscribers at $0/mo while still offering Kit Commerce (3.5% + $0.30), cutting Gumroad\'s 10% fee from the very first sale.'
      });
    }
    if (state.subs > 25000) {
      alerts.push({
        warn: false,
        html: '<strong>High-Volume Tier Crossover (>25k subs):</strong> Above 25,000 subscribers, Kit steps up to its 55k bracket ($379/mo monthly / ~$315.83 annual equiv), while beehiiv Lite stays at $299/mo monthly ($249/mo annual) with a 0% commerce platform fee.'
      });
    }
    document.getElementById('nl-alerts').innerHTML = alerts.map(function (a) {
      return '<div class="alert-box' + (a.warn ? ' alert-warn' : '') + '">' + a.html + '</div>';
    }).join('');

    // Render 3 Platform Cards
    var cardsEl = document.getElementById('nl-cards');
    cardsEl.innerHTML = platforms.map(function (p) {
      var isWinner = p.name === winner.name;
      var diffVsGumroadYr = (p.net - gumroad.net) * 12;
      var subLine;
      if (p.name === 'Gumroad') {
        subLine = state.gmv > 0
          ? 'Baseline: ' + fmtUSD(p.totalCost, 2) + '/mo in variable fees'
          : 'No fixed monthly SaaS cost';
      } else if (diffVsGumroadYr > 1) {
        subLine = 'Saves ' + fmtUSD(diffVsGumroadYr, 0) + '/yr vs Gumroad';
      } else if (diffVsGumroadYr < -1) {
        subLine = fmtUSD(Math.abs(diffVsGumroadYr), 0) + '/yr more than Gumroad at this GMV';
      } else {
        subLine = 'Roughly equal to Gumroad at this GMV';
      }

      var detailsHtml = p.details.map(function (pair) {
        return '<li><span>' + pair[0] + '</span><span>' + pair[1] + '</span></li>';
      }).join('');

      var ctaHtml = p.key
        ? '<a class="' + (isWinner ? 'cta-btn' : 'cta-btn-secondary') + '" data-aff="' + p.key + '" data-aff-pricing href="#">' + p.ctaLabel + '</a>'
        : '<a class="' + (isWinner ? 'cta-btn' : 'cta-btn-secondary') + '" href="' + p.directUrl + '" target="_blank" rel="noopener noreferrer">' + p.ctaLabel + '</a>';

      return '<article class="result-card' + (isWinner ? ' is-winner' : '') + '">' +
        '<div class="result-card-head">' +
          '<div>' +
            '<h4 class="result-card-title">' + p.name + '</h4>' +
            '<div class="result-tier">' + p.tier + '</div>' +
          '</div>' +
          '<span class="result-badge' + (!isWinner && p.badgeWarn ? ' is-warn' : '') + '">' + (isWinner ? (state.gmv > 0 ? 'Highest Take-Home' : 'Lowest Cost') : p.badge) + '</span>' +
        '</div>' +
        '<div class="result-price">' + fmtUSD(p.net, 2) + '<small>/mo net</small></div>' +
        '<p class="result-sub">' + subLine + '</p>' +
        '<ul class="result-breakdown">' + detailsHtml + '</ul>' +
        '<p class="result-note' + (p.noteWarn ? ' is-warn' : '') + '">' + p.note + '</p>' +
        '<div class="result-card-foot">' + ctaHtml + '</div>' +
      '</article>';
    }).join('');

    if (window.KitGuides && window.KitGuides.applyLinks) {
      window.KitGuides.applyLinks(cardsEl);
    }
  }

  function bindEvents() {
    var inpSubs = document.getElementById('inp-subs');
    var inpGmv = document.getElementById('inp-gmv');
    var inpAov = document.getElementById('inp-aov');
    var inpAuto = document.getElementById('inp-auto');
    var inpDomain = document.getElementById('inp-domain');
    var inpBrand = document.getElementById('inp-brand');

    inpSubs.addEventListener('input', function () {
      state.subs = Number(inpSubs.value);
      render();
    });
    inpGmv.addEventListener('input', function () {
      state.gmv = Number(inpGmv.value);
      render();
    });
    inpAov.addEventListener('input', function () {
      state.aov = Number(inpAov.value);
      render();
    });
    inpAuto.addEventListener('change', function () {
      state.needAutomations = inpAuto.checked;
      render();
    });
    inpDomain.addEventListener('change', function () {
      state.needCustomDomain = inpDomain.checked;
      render();
    });
    inpBrand.addEventListener('change', function () {
      state.removeBranding = inpBrand.checked;
      render();
    });

    document.querySelectorAll('.preset-row[data-preset-for]').forEach(function (row) {
      var field = row.getAttribute('data-preset-for');
      row.addEventListener('click', function (e) {
        var btn = e.target.closest('.preset-btn');
        if (!btn) return;
        var val = Number(btn.getAttribute('data-val'));
        state[field] = val;
        if (field === 'subs') inpSubs.value = String(val);
        if (field === 'gmv') inpGmv.value = String(val);
        render();
      });
    });

    var billingGroup = document.querySelector('#nl-form .seg-group[data-field="billing"]');
    billingGroup.addEventListener('click', function (e) {
      var btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.billing = btn.getAttribute('data-val');
      billingGroup.querySelectorAll('.seg-btn').forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      render();
    });

    document.getElementById('nl-reset').addEventListener('click', function () {
      state = Object.assign({}, DEFAULTS);
      inpSubs.value = String(state.subs);
      inpGmv.value = String(state.gmv);
      inpAov.value = String(state.aov);
      inpAuto.checked = state.needAutomations;
      inpDomain.checked = state.needCustomDomain;
      inpBrand.checked = state.removeBranding;
      billingGroup.querySelectorAll('.seg-btn').forEach(function (b) {
        var active = b.getAttribute('data-val') === state.billing;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      render();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindEvents();
      render();
    });
  } else {
    bindEvents();
    render();
  }
})();