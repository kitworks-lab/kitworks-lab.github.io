/* KitWorks Lab — Multistreaming Cost & Bandwidth Calculator (2026)
   Pricing verified November 2026 from official vendor pricing pages. */
(function () {
  'use strict';

  var DEFAULTS = {
    destinations: 3,
    quality: '1080p',
    workflow: 'obs',
    dual: false,
    account: 'individual',
    billing: 'annual',
    upload: 20,
    bitrate: 6.0
  };

  var state = Object.assign({}, DEFAULTS);

  var RESTREAM_TIERS = [
    { id: 'free', name: 'Free', monthly: 0, annualMo: 0, annualYr: 0, maxDest: 2 },
    { id: 'standard', name: 'Standard', monthly: 19, annualMo: 16, annualYr: 190, maxDest: 3 },
    { id: 'pro', name: 'Professional', monthly: 49, annualMo: 39, annualYr: 470, maxDest: 5 },
    { id: 'business', name: 'Business', monthly: 239, annualMo: 199, annualYr: 2390, maxDest: 8 }
  ];

  var STREAMYARD_TIERS = {
    essential: { name: 'Essential', monthly: 18.99, annualMo: 14.99, annualYr: 179.88, maxDest: 2 },
    core: { name: 'Core', monthly: 44.99, annualMo: 35.99, annualYr: 431.88, maxDest: 3 },
    advanced: { name: 'Advanced', monthly: 88.99, annualMo: 68.99, annualYr: 827.88, maxDest: 8 },
    business: { name: 'Business (Custom)', monthly: null, annualMo: null, annualYr: null, maxDest: 99 }
  };

  var RIVERSIDE_GROW = {
    name: 'Grow',
    monthly: 45,
    annualMo: 34,
    annualYr: 408,
    maxDest: 99
  };

  function fmtUSD(v, decimals) {
    if (window.KitGuides && window.KitGuides.fmtUSD) {
      return window.KitGuides.fmtUSD(v, decimals);
    }
    if (v === null || v === undefined) return 'Custom';
    return '$' + Number(v).toFixed(decimals === undefined ? 0 : decimals);
  }

  function fmtPct(v, decimals) {
    if (window.KitGuides && window.KitGuides.fmtPct) {
      return window.KitGuides.fmtPct(v, decimals);
    }
    return Number(v).toFixed(1) + '%';
  }

  function fmtMbps(v) {
    return Number(v).toFixed(1) + ' Mbps';
  }

  function evalRestream(s) {
    var idx = 0;
    if (s.destinations > 5) idx = 3;
    else if (s.destinations > 3) idx = 2;
    else if (s.destinations > 2) idx = 1;

    var reasons = [];
    if (s.destinations > 2) {
      reasons.push(s.destinations + ' destinations');
    }
    if (s.dual && idx < 2) {
      idx = 2;
      reasons.push('dual 16:9 + 9:16 requires Pro');
    }
    if (s.quality === '4k' && idx < 2) {
      idx = 2;
      reasons.push('4K local / split-feed requires Pro');
    }
    if (s.workflow === 'browser' && s.quality !== '720p' && idx < 2) {
      idx = 2;
      reasons.push('1080p Restream Studio requires Pro (Standard caps Studio at 720p)');
    }

    var tier = RESTREAM_TIERS[idx];
    var mo = s.billing === 'annual' ? tier.annualMo : tier.monthly;
    var yr = s.billing === 'annual' ? tier.annualYr : tier.monthly * 12;

    var note = '';
    var noteWarn = false;
    if (idx === 0 && s.workflow === 'browser') {
      note = 'Free Restream Studio includes a Restream watermark and caps output at 720p. Standard ($16/mo annual or $19/mo monthly) removes the watermark.';
      noteWarn = true;
    } else if (idx === 0 && s.workflow === 'obs') {
      note = 'OBS RTMP passthrough supports up to 4K on Free for 2 destinations with no Studio watermark.';
    } else if (idx === 1 && s.workflow === 'obs') {
      note = 'Standard gives 3 OBS RTMP destinations up to 4K passthrough. Cloud recording retention is 15 days.';
    } else if (idx === 2) {
      note = 'Includes 1080p Studio, dual horizontal + vertical output, 4K local recording, and 30-day cloud retention. AI Clips are a separate paid add-on.';
    } else if (idx === 3) {
      note = '8 destinations requires jumping from Professional ($39/$49) to Business ($199/$239).';
      noteWarn = true;
    }

    return {
      key: 'restream',
      name: 'Restream',
      tier: tier.name,
      monthly: mo,
      annual: yr,
      eligible: true,
      badge: s.workflow === 'obs' ? 'OBS RTMP Native' : 'Cloud Studio',
      badgeWarn: false,
      note: note,
      noteWarn: noteWarn,
      reasons: reasons,
      details: [
        ['Plan limit', tier.maxDest + ' simultaneous channels'],
        ['Cloud recording', idx >= 2 ? '30-day retention' : '15-day retention'],
        ['Business / LLC allowed', 'Yes (self-serve)']
      ],
      ctaLabel: 'Visit Restream'
    };
  }

  function evalStreamYard(s) {
    if (s.account === 'business') {
      return {
        key: 'streamyard',
        name: 'StreamYard',
        tier: 'Business (Custom Quote)',
        monthly: null,
        annual: null,
        eligible: false,
        badge: 'Business Quote Only',
        badgeWarn: true,
        note: 'StreamYard restricts Essential, Core, and Advanced plans strictly to Individual personal use under its Plan Usage Policy. LLCs, brands, and agencies require a custom Business contract.',
        noteWarn: true,
        details: [
          ['Consumer tiers', 'Blocked for LLC / Business'],
          ['Watermark-free', 'Included on Business'],
          ['4K local recording', 'Custom Business terms']
        ],
        ctaLabel: 'Check StreamYard Pricing'
      };
    }

    var tier;
    if (s.destinations > 3 || s.quality === '4k') {
      tier = STREAMYARD_TIERS.advanced;
    } else if (s.destinations > 2) {
      tier = STREAMYARD_TIERS.core;
    } else {
      tier = STREAMYARD_TIERS.essential;
    }

    var mo = s.billing === 'annual' ? tier.annualMo : tier.monthly;
    var yr = s.billing === 'annual' ? tier.annualYr : Number((tier.monthly * 12).toFixed(2));
    var note = '';
    var noteWarn = false;

    if (tier === STREAMYARD_TIERS.essential) {
      note = 'Watermark caveat: Essential includes 1080p for 2 destinations, but watermark removal is not listed until Core (' +
        fmtUSD(s.billing === 'annual' ? 35.99 : 44.99, 2) + '/mo).';
      noteWarn = true;
    } else if (tier === STREAMYARD_TIERS.core) {
      note = 'Removes StreamYard watermark and includes 50 hrs permanent storage plus AI clips. Restricted to Individual personal use.';
    } else {
      note = 'Required for 4K local recording or 4-8 destinations. Restricted to Individual personal use; 8 destinations max.';
    }

    if (s.dual) {
      note += ' Dual 16:9 + 9:16 is not a single-click OBS cloud relay; vertical destinations count separately toward your channel limit.';
      noteWarn = true;
    }

    var obsMismatch = s.workflow === 'obs';
    if (obsMismatch) {
      note += ' Browser-studio workflow (OBS feeds typically connect via virtual camera rather than passive RTMP passthrough).';
    }

    return {
      key: 'streamyard',
      name: 'StreamYard',
      tier: tier.name,
      monthly: mo,
      annual: yr,
      eligible: !obsMismatch,
      badge: obsMismatch ? 'Browser Studio First' : (tier === STREAMYARD_TIERS.essential ? 'Has Watermark' : 'Individual Only'),
      badgeWarn: tier === STREAMYARD_TIERS.essential || obsMismatch,
      note: note,
      noteWarn: noteWarn,
      details: [
        ['Plan limit', tier.maxDest + ' destinations (Individual)'],
        ['Watermark removed', tier === STREAMYARD_TIERS.essential ? 'No (Core+ required)' : 'Yes'],
        ['4K local tracks', tier === STREAMYARD_TIERS.advanced ? 'Included' : 'Not included']
      ],
      ctaLabel: 'Visit StreamYard'
    };
  }

  function evalRiverside(s) {
    var mo = s.billing === 'annual' ? RIVERSIDE_GROW.annualMo : RIVERSIDE_GROW.monthly;
    var yr = s.billing === 'annual' ? RIVERSIDE_GROW.annualYr : RIVERSIDE_GROW.monthly * 12;
    var obsMismatch = s.workflow === 'obs';

    var note = 'Multistreaming is locked behind Grow (Riverside Pro at $24/$35 does not include multistreaming). Grow unlocks unlimited destinations, multi-aspect ratio streaming, and 4K local multitrack up to 20 hrs/mo of separate-track downloads.';
    if (obsMismatch) {
      note = 'Riverside is a browser studio rather than a passive OBS RTMP cloud splitter. If you switch from OBS to Riverside Studio, Grow covers unlimited destinations and 4K local tracks at ' + fmtUSD(mo) + '/mo.';
    }

    return {
      key: 'riverside',
      name: 'Riverside',
      tier: 'Grow (Multistream Tier)',
      monthly: mo,
      annual: yr,
      eligible: !obsMismatch,
      badge: obsMismatch ? 'Browser Studio First' : 'Unlimited Dest + 4K',
      badgeWarn: obsMismatch,
      note: note,
      noteWarn: obsMismatch,
      details: [
        ['Plan limit', 'Unlimited 1080p destinations'],
        ['4K local multitrack', '20 hrs/mo separate tracks'],
        ['Multi-aspect ratio', 'Included on Grow']
      ],
      ctaLabel: 'Visit Riverside'
    };
  }

  function evalObsMultiRtmp(s, bw) {
    var blockedReasons = [];
    if (s.workflow === 'browser') {
      blockedReasons.push('Desktop OBS only (no browser guest greenroom)');
    }
    if (s.quality === '4k') {
      blockedReasons.push('Cannot record remote guests in uncompressed local 4K');
    }
    if (bw.status === 'over') {
      blockedReasons.push('Exceeds your ' + s.upload + ' Mbps upload speed');
    } else if (bw.status === 'tight') {
      blockedReasons.push('Below 25% upload safety headroom (' + fmtMbps(bw.obsSafe) + ' recommended)');
    }

    var eligible = blockedReasons.length === 0;
    var note;
    var noteWarn = !eligible;
    if (eligible) {
      note = 'Your ' + s.upload + ' Mbps upload line clears the ' + fmtMbps(bw.obsSafe) + ' safe threshold for ' + s.destinations + ' simultaneous streams at ' + s.bitrate.toFixed(1) + ' Mbps each. Requires free obs-multi-rtmp plugin' + (s.dual ? ' plus Aitum Vertical plugin for 9:16.' : '.');
    } else {
      note = 'Not a drop-in fit for this configuration: ' + blockedReasons.join('; ') + '.';
    }

    return {
      key: null,
      name: 'OBS Multi-RTMP',
      tier: 'Free Open-Source Plugin',
      monthly: 0,
      annual: 0,
      eligible: eligible,
      badge: eligible ? 'Upload Line Fits' : (bw.status === 'over' ? 'Upload Bottleneck' : 'Constraint Mismatch'),
      badgeWarn: !eligible,
      note: note,
      noteWarn: noteWarn,
      details: [
        ['Raw upload needed', fmtMbps(bw.obsRaw)],
        ['Safe upload (1.25x)', fmtMbps(bw.obsSafe)],
        ['Software license', '$0 (Open-source plugin)']
      ],
      ctaLabel: null
    };
  }

  function computeBandwidth(s) {
    var obsRaw = s.destinations * s.bitrate;
    var obsSafe = obsRaw * 1.25;
    var cloudRaw = s.bitrate;
    var cloudSafe = cloudRaw * 1.25;
    var savedRaw = (s.destinations - 1) * s.bitrate;
    var savedPct = ((s.destinations - 1) / s.destinations) * 100;

    var status = 'ok';
    if (s.upload < obsRaw) status = 'over';
    else if (s.upload < obsSafe) status = 'tight';

    var cloudStatus = 'ok';
    if (s.upload < cloudRaw) cloudStatus = 'over';
    else if (s.upload < cloudSafe) cloudStatus = 'tight';

    return {
      obsRaw: obsRaw,
      obsSafe: obsSafe,
      cloudRaw: cloudRaw,
      cloudSafe: cloudSafe,
      savedRaw: savedRaw,
      savedPct: savedPct,
      status: status,
      cloudStatus: cloudStatus
    };
  }

  function buildAlerts(s, bw) {
    var alerts = [];
    if (s.account === 'business') {
      alerts.push({
        warn: true,
        html: '<strong>StreamYard Business Policy Triggered:</strong> StreamYard\'s Essential ($14.99/$18.99), Core ($35.99/$44.99), and Advanced ($68.99/$88.99) tiers are licensed strictly for <strong>Individual personal use</strong>. LLCs, brands, and agencies must buy a custom StreamYard Business plan.'
      });
    }
    if (bw.status === 'over') {
      alerts.push({
        warn: true,
        html: '<strong>OBS Multi-RTMP Upload Bottleneck:</strong> Pushing ' + s.destinations + ' streams at ' + s.bitrate.toFixed(1) + ' Mbps requires <strong>' + fmtMbps(bw.obsRaw) + ' raw (' + fmtMbps(bw.obsSafe) + ' with 25% headroom)</strong>, exceeding your ' + s.upload + ' Mbps upload speed. A cloud relay cuts upstream usage to <strong>' + fmtMbps(bw.cloudRaw) + '</strong> (saving ' + fmtMbps(bw.savedRaw) + ' / ' + fmtPct(bw.savedPct, 0) + ').'
      });
    } else if (bw.status === 'tight') {
      alerts.push({
        warn: true,
        html: '<strong>Tight Local Upload Margin:</strong> Raw OBS Multi-RTMP bitrate (' + fmtMbps(bw.obsRaw) + ') fits under ' + s.upload + ' Mbps, but leaves less than 25% headroom (' + fmtMbps(bw.obsSafe) + ' recommended). Any ISP dip or audio/chat spike can drop frames across all channels.'
      });
    }
    if (s.workflow === 'browser' && s.quality === '1080p') {
      alerts.push({
        warn: false,
        html: '<strong>Restream 720p Studio Cap:</strong> Restream Standard ($16/$19) still caps Restream Studio at 720p. Choosing 1080p in a Browser Guest Studio bumps Restream to Professional ($39/$49), making Riverside Grow ($34/$45) competitive for multi-destination browser shows.'
      });
    }
    if (s.account === 'individual' && s.destinations === 2 && s.quality !== '4k') {
      alerts.push({
        warn: false,
        html: '<strong>StreamYard Essential Watermark Caveat:</strong> StreamYard Essential ($14.99/$18.99) unlocks 1080p for 2 destinations, but watermark removal is not included until Core ($35.99/$44.99).'
      });
    }
    if (bw.cloudStatus === 'over') {
      alerts.push({
        warn: true,
        html: '<strong>Single-Stream Bitrate Exceeds Upload:</strong> Even a single ' + s.bitrate.toFixed(1) + ' Mbps stream exceeds your ' + s.upload + ' Mbps upload line. Lower your bitrate slider before streaming.'
      });
    }
    return alerts;
  }

  function render() {
    document.getElementById('lbl-destinations').textContent = state.destinations + ' channels';
    document.getElementById('lbl-quality').textContent = state.quality === '4k' ? '4K Multitrack' : state.quality;
    document.getElementById('lbl-workflow').textContent = state.workflow === 'obs' ? 'OBS Studio' : 'Browser Guest Studio';
    document.getElementById('lbl-account').textContent = state.account === 'individual' ? 'Individual' : 'Business / LLC';
    document.getElementById('lbl-billing').textContent = state.billing === 'annual' ? 'Annual' : 'Monthly';
    document.getElementById('lbl-upload').textContent = state.upload + ' Mbps';
    document.getElementById('lbl-bitrate').textContent = state.bitrate.toFixed(1) + ' Mbps';

    var bw = computeBandwidth(state);
    var results = [
      evalRestream(state),
      evalStreamYard(state),
      evalRiverside(state),
      evalObsMultiRtmp(state, bw)
    ];

    // Pick lowest-cost eligible winner matching workflow & policy
    var eligible = results.filter(function (r) {
      return r.eligible && r.monthly !== null;
    });
    eligible.sort(function (a, b) {
      return a.monthly - b.monthly;
    });
    var winner = eligible.length ? eligible[0] : null;

    // Determine cheapest cloud option for savings comparison
    var cloudEligible = results.filter(function (r) {
      return r.key !== null && r.eligible && r.monthly !== null;
    });
    cloudEligible.sort(function (a, b) {
      return a.monthly - b.monthly;
    });
    var bestCloud = cloudEligible.length ? cloudEligible[0] : null;

    // Render KPI Strip
    var kpiHtml = '';
    kpiHtml += '<div class="kpi-box is-highlight">' +
      '<div class="kpi-label">Lowest-Cost Eligible Fit</div>' +
      '<div class="kpi-val">' + (winner ? winner.name + ' · ' + fmtUSD(winner.monthly) + '/mo' : 'Custom Quote') + '</div>' +
      '<div class="kpi-note">' + (winner ? winner.tier + ' (' + fmtUSD(winner.annual) + '/yr)' : 'Check enterprise terms') + '</div>' +
      '</div>';

    kpiHtml += '<div class="kpi-box">' +
      '<div class="kpi-label">Upload Saved via Cloud Relay</div>' +
      '<div class="kpi-val">' + fmtMbps(bw.savedRaw) + '</div>' +
      '<div class="kpi-note">' + fmtPct(bw.savedPct, 0) + ' less local upload vs ' + state.destinations + 'x OBS RTMP</div>' +
      '</div>';

    var obsStatusText = bw.status === 'ok' ? 'Safe (' + fmtMbps(bw.obsSafe) + ')' : (bw.status === 'tight' ? 'Tight (<25% buffer)' : 'Bottleneck');
    kpiHtml += '<div class="kpi-box">' +
      '<div class="kpi-label">Local OBS Multi-RTMP Line Check</div>' +
      '<div class="kpi-val">' + obsStatusText + '</div>' +
      '<div class="kpi-note">' + (bestCloud ? 'Cheapest cloud relay: ' + bestCloud.name + ' (' + fmtUSD(bestCloud.monthly) + '/mo)' : 'Check custom plans') + '</div>' +
      '</div>';
    document.getElementById('ms-kpis').innerHTML = kpiHtml;

    // Render Bandwidth Meter
    var obsPctBar = Math.min(100, (bw.obsSafe / state.upload) * 100);
    var cloudPctBar = Math.min(100, (bw.cloudSafe / state.upload) * 100);
    var obsFillClass = bw.status === 'over' ? 'is-over' : (bw.status === 'tight' ? 'is-tight' : '');
    var cloudFillClass = bw.cloudStatus === 'over' ? 'is-over' : (bw.cloudStatus === 'tight' ? 'is-tight' : '');

    document.getElementById('ms-bandwidth').innerHTML =
      '<div class="meter-head">' +
        '<h4 class="meter-title">Upload Bandwidth Headroom (1.25x Safety Margin vs Your ' + state.upload + ' Mbps Line)</h4>' +
        '<span class="meter-stats">' + state.destinations + ' streams × ' + state.bitrate.toFixed(1) + ' Mbps</span>' +
      '</div>' +
      '<div class="meter-track-row">' +
        '<div class="meter-track-label"><span>OBS Multi-RTMP (local push to ' + state.destinations + ' endpoints)</span><span>' + fmtMbps(bw.obsRaw) + ' raw · ' + fmtMbps(bw.obsSafe) + ' safe</span></div>' +
        '<div class="meter-track"><div class="meter-fill ' + obsFillClass + '" style="width:' + obsPctBar.toFixed(1) + '%"></div></div>' +
      '</div>' +
      '<div class="meter-track-row">' +
        '<div class="meter-track-label"><span>Cloud Relay (1 upstream ingest to Restream / Studio)</span><span>' + fmtMbps(bw.cloudRaw) + ' raw · ' + fmtMbps(bw.cloudSafe) + ' safe</span></div>' +
        '<div class="meter-track"><div class="meter-fill ' + cloudFillClass + '" style="width:' + cloudPctBar.toFixed(1) + '%"></div></div>' +
      '</div>';

    // Render Alerts
    var alerts = buildAlerts(state, bw);
    document.getElementById('ms-alerts').innerHTML = alerts.map(function (a) {
      return '<div class="alert-box' + (a.warn ? ' alert-warn' : '') + '">' + a.html + '</div>';
    }).join('');

    // Render Result Cards
    var cardsEl = document.getElementById('ms-cards');
    cardsEl.innerHTML = results.map(function (r) {
      var isWinner = winner && winner.name === r.name;
      var priceStr = r.monthly === null
        ? 'Custom'
        : fmtUSD(r.monthly) + '<small>/mo</small>';
      var subStr = r.monthly === null
        ? 'Sales quote required for Business / LLC'
        : (state.billing === 'annual'
          ? fmtUSD(r.annual) + ' billed annually'
          : fmtUSD(r.annual) + '/yr at monthly billing');

      var detailsHtml = r.details.map(function (pair) {
        return '<li><span>' + pair[0] + '</span><span>' + pair[1] + '</span></li>';
      }).join('');

      var badgeText = isWinner ? 'Lowest Eligible Cost' : r.badge;
      var badgeClass = isWinner ? 'result-badge' : ('result-badge' + (r.badgeWarn ? ' is-warn' : ''));

      var ctaHtml = '';
      if (r.key) {
        ctaHtml = '<div class="result-card-foot">' +
          '<a class="' + (isWinner ? 'cta-btn' : 'cta-btn-secondary') + '" data-aff="' + r.key + '" data-aff-pricing href="#">' + r.ctaLabel + '</a>' +
          '</div>';
      } else {
        ctaHtml = '<div class="result-card-foot">' +
          '<a class="cta-btn-secondary" href="https://obsproject.com/" target="_blank" rel="noopener noreferrer">OBS Studio (Free)</a>' +
          '</div>';
      }

      return '<article class="result-card' + (isWinner ? ' is-winner' : '') + '">' +
        '<div class="result-card-head">' +
          '<div>' +
            '<h4 class="result-card-title">' + r.name + '</h4>' +
            '<div class="result-tier">' + r.tier + '</div>' +
          '</div>' +
          '<span class="' + badgeClass + '">' + badgeText + '</span>' +
        '</div>' +
        '<div class="result-price">' + priceStr + '</div>' +
        '<p class="result-sub">' + subStr + '</p>' +
        '<ul class="result-breakdown">' + detailsHtml + '</ul>' +
        '<p class="result-note' + (r.noteWarn ? ' is-warn' : '') + '">' + r.note + '</p>' +
        ctaHtml +
      '</article>';
    }).join('');

    if (window.KitGuides && window.KitGuides.applyLinks) {
      window.KitGuides.applyLinks(cardsEl);
    }
  }

  function bindEvents() {
    var groups = document.querySelectorAll('#ms-form .seg-group[data-field]');
    groups.forEach(function (group) {
      var field = group.getAttribute('data-field');
      group.addEventListener('click', function (e) {
        var btn = e.target.closest('.seg-btn');
        if (!btn) return;
        var val = btn.getAttribute('data-val');
        state[field] = field === 'destinations' ? Number(val) : val;
        group.querySelectorAll('.seg-btn').forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        render();
      });
    });

    var dualInput = document.getElementById('inp-dual');
    dualInput.addEventListener('change', function () {
      state.dual = dualInput.checked;
      render();
    });

    var uploadInput = document.getElementById('inp-upload');
    uploadInput.addEventListener('input', function () {
      state.upload = Number(uploadInput.value);
      render();
    });

    var bitrateInput = document.getElementById('inp-bitrate');
    bitrateInput.addEventListener('input', function () {
      state.bitrate = Number(bitrateInput.value);
      render();
    });

    document.getElementById('ms-reset').addEventListener('click', function () {
      state = Object.assign({}, DEFAULTS);
      dualInput.checked = state.dual;
      uploadInput.value = String(state.upload);
      bitrateInput.value = String(state.bitrate);
      groups.forEach(function (group) {
        var field = group.getAttribute('data-field');
        var target = String(state[field]);
        group.querySelectorAll('.seg-btn').forEach(function (b) {
          var active = b.getAttribute('data-val') === target;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
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