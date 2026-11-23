(function () {
  'use strict';

  var DEFAULTS = {
    seats: 1,
    keywords: 500,
    projects: 5,
    ai: true,
    surfer: false,
    billing: 'annual'
  };

  var PRESETS = {
    blogger: { seats: 1, keywords: 200, projects: 2, ai: false, surfer: false },
    indie: { seats: 1, keywords: 500, projects: 5, ai: true, surfer: false },
    boutique: { seats: 3, keywords: 1500, projects: 12, ai: true, surfer: true },
    heavy: { seats: 4, keywords: 2000, projects: 18, ai: true, surfer: false }
  };

  var state = {
    seats: DEFAULTS.seats,
    keywords: DEFAULTS.keywords,
    projects: DEFAULTS.projects,
    ai: DEFAULTS.ai,
    surfer: DEFAULTS.surfer,
    billing: DEFAULTS.billing
  };

  var el = {
    seatsInput: document.getElementById('seatsInput'),
    keywordsInput: document.getElementById('keywordsInput'),
    projectsInput: document.getElementById('projectsInput'),
    seatsOut: document.getElementById('seatsOut'),
    keywordsOut: document.getElementById('keywordsOut'),
    projectsOut: document.getElementById('projectsOut'),
    billingOut: document.getElementById('billingOut'),
    aiToggle: document.getElementById('aiToggle'),
    surferToggle: document.getElementById('surferToggle'),
    resetBtn: document.getElementById('seo-reset'),
    kpiWinner: document.getElementById('kpiWinner'),
    kpiWinnerName: document.getElementById('kpiWinnerName'),
    kpiFullSuite: document.getElementById('kpiFullSuite'),
    kpiFullSuiteName: document.getElementById('kpiFullSuiteName'),
    kpiSavings: document.getElementById('kpiSavings'),
    kpiSavingsNote: document.getElementById('kpiSavingsNote'),
    summaryAlert: document.getElementById('summaryAlert'),
    limitWarn: document.getElementById('limitWarn'),
    cardSemrush: document.getElementById('cardSemrush'),
    cardSeranking: document.getElementById('cardSeranking'),
    cardMangools: document.getElementById('cardMangools'),
    semrushTier: document.getElementById('semrushTier'),
    semrushBadge: document.getElementById('semrushBadge'),
    semrushPrice: document.getElementById('semrushPrice'),
    semrushSub: document.getElementById('semrushSub'),
    semrushSpecs: document.getElementById('semrushSpecs'),
    semrushNote: document.getElementById('semrushNote'),
    serankingTier: document.getElementById('serankingTier'),
    serankingBadge: document.getElementById('serankingBadge'),
    serankingPrice: document.getElementById('serankingPrice'),
    serankingSub: document.getElementById('serankingSub'),
    serankingSpecs: document.getElementById('serankingSpecs'),
    serankingNote: document.getElementById('serankingNote'),
    mangoolsTier: document.getElementById('mangoolsTier'),
    mangoolsBadge: document.getElementById('mangoolsBadge'),
    mangoolsPrice: document.getElementById('mangoolsPrice'),
    mangoolsSub: document.getElementById('mangoolsSub'),
    mangoolsSpecs: document.getElementById('mangoolsSpecs'),
    mangoolsNote: document.getElementById('mangoolsNote'),
    surferPanel: document.getElementById('surferPanel'),
    surferTierName: document.getElementById('surferTierName'),
    surferPrice: document.getElementById('surferPrice'),
    surferDesc: document.getElementById('surferDesc'),
    meterMeta: document.getElementById('meterMeta'),
    barSemrush: document.getElementById('barSemrush'),
    barSeranking: document.getElementById('barSeranking'),
    barMangools: document.getElementById('barMangools'),
    barValSemrush: document.getElementById('barValSemrush'),
    barValSeranking: document.getElementById('barValSeranking'),
    barValMangools: document.getElementById('barValMangools')
  };

  function fmtUsd(n) {
    return Math.abs(n - Math.round(n)) >= 0.01
      ? '$' + n.toFixed(2)
      : '$' + Math.round(n).toLocaleString('en-US');
  }

  function fmtWhole(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function setBreakdown(ul, rows) {
    ul.innerHTML = '';
    for (var i = 0; i < rows.length; i++) {
      var li = document.createElement('li');
      var k = document.createElement('span');
      var v = document.createElement('span');
      k.textContent = rows[i][0];
      v.textContent = rows[i][1];
      li.appendChild(k);
      li.appendChild(v);
      ul.appendChild(li);
    }
  }

  function calcSemrush(seats, keywords, projects, ai, isAnnual) {
    var tier, baseMonthly, baseAnnual, kwCap, projCap, aiNote;

    if (!ai && projects <= 5 && keywords <= 500) {
      tier = 'SEO (Classic)';
      baseMonthly = 139.95;
      baseAnnual = 117.33;
      kwCap = '500 kw';
      projCap = '5 projects';
      aiNote = 'Not included ($99/mo standalone)';
    } else if (projects <= 5 && keywords <= 500) {
      tier = 'Semrush One Starter';
      baseMonthly = 199;
      baseAnnual = 165.17;
      kwCap = '500 kw';
      projCap = '5 projects';
      aiNote = '50 custom AI prompts';
    } else if (projects <= 15 && keywords <= 1500) {
      tier = 'Semrush One Pro+';
      baseMonthly = 299;
      baseAnnual = 248.17;
      kwCap = '1,500 kw';
      projCap = '15 projects';
      aiNote = '100 AI prompts + JS crawl';
    } else {
      tier = 'Semrush One Advanced';
      baseMonthly = 549;
      baseAnnual = 455.67;
      kwCap = '5,000 kw';
      projCap = '40 projects';
      aiNote = '200 AI prompts + API';
    }

    var base = isAnnual ? baseAnnual : baseMonthly;
    var extraSeats = Math.max(0, seats - 1);
    var extraSeatCost = extraSeats * 45;
    var totalMonthly = base + extraSeatCost;
    var highSeatRange = extraSeats > 0 && tier !== 'SEO (Classic)' && tier !== 'Semrush One Starter';

    return {
      tier: tier,
      monthly: totalMonthly,
      annualTotal: totalMonthly * 12,
      perSeat: totalMonthly / seats,
      eligible: true,
      highSeatRange: highSeatRange,
      rows: [
        ['Annual total', fmtWhole(totalMonthly * 12) + '/yr'],
        ['Cost per seat', fmtUsd(totalMonthly / seats) + '/mo'],
        ['Extra seat fee', extraSeats > 0 ? '+' + fmtWhole(extraSeatCost) + '/mo min' : '$0 (1 seat base)'],
        ['Quotas', kwCap + ' / ' + projCap],
        ['AI Visibility', aiNote]
      ],
      note: extraSeats > 0
        ? 'Base includes 1 seat. Extra seats start at +$45/mo each and scale up to $100/seat on upper tiers.'
        : 'Deepest backlink (43T) and keyword (28B+) index across 142 regions; includes technical site audit.',
      warnNote: extraSeats > 0
    };
  }

  function calcSeranking(seats, keywords, projects, ai, isAnnual) {
    var tier, base, rows, note, extraSeatNote = false;

    if (seats <= 1 && projects <= 10 && keywords <= 2000) {
      tier = 'Core';
      base = isAnnual ? 103.2 : 129;
      rows = [
        ['Annual total', fmtWhole(base * 12) + '/yr'],
        ['Cost per seat', fmtUsd(base / seats) + '/mo'],
        ['Included seats', '1 manager seat'],
        ['Daily keywords', '2,000 kw / 10 proj'],
        ['API & AI', '25K API + MCP + 25 AI/day']
      ];
      note = 'Includes 250K audit pages/mo and 25 AI prompts/day. 1 active session limit; 6-month historical data (Growth adds lifetime history).';
    } else {
      tier = 'Growth';
      base = isAnnual ? 223.2 : 279;
      extraSeatNote = seats > 3;
      rows = [
        ['Annual total', fmtWhole(base * 12) + '/yr'],
        ['Cost per seat', fmtUsd(base / seats) + '/mo'],
        ['Included seats', extraSeatNote ? '3 base (+add-ons)' : '3 manager seats'],
        ['Daily keywords', '5,000 kw / 30 proj'],
        ['API & AI', '100K API + MCP + starter AI']
      ];
      note = extraSeatNote
        ? 'Growth includes 3 manager seats. Seats 4-' + seats + ' require paid seat add-ons or view-only guest links. AI Search Add-on is +$' + (isAnnual ? '71.20' : '89') + '/mo.'
        : 'Includes 2M audit pages/mo, lifetime history, and guest links. Optional white-label Agency Pack is +$69/mo annual.';
    }

    return {
      tier: tier,
      monthly: base,
      annualTotal: base * 12,
      perSeat: base / seats,
      eligible: true,
      extraSeatNote: extraSeatNote,
      rows: rows,
      note: note,
      warnNote: extraSeatNote
    };
  }

  function calcMangools(seats, keywords, projects, ai, isAnnual) {
    var aiAddon = ai ? (isAnnual ? 7.8 : 12) : 0;
    var tier, base, eligible = true, rows, note, weeklyOnly = false;

    if (keywords > 1500) {
      tier = 'Agency (Cap Exceeded)';
      base = (isAnnual ? 89.9 : 129) + aiAddon;
      eligible = false;
      rows = [
        ['Annual total', fmtWhole(base * 12) + '/yr'],
        ['Included seats', '6 seats (1 + 5)'],
        ['Keyword ceiling', '1,500 max (exceeded)'],
        ['24h lookup cap', '1,200 / 24h']
      ];
      note = 'Exceeds Mangools Agency 1,500-keyword limit. Switch to SE Ranking (2,000-5,000 daily) or Semrush One Advanced.';
    } else if (seats <= 1 && keywords <= 200) {
      tier = ai ? 'Basic + AI Bundle' : 'Basic';
      base = (isAnnual ? 29.9 : 49) + aiAddon;
      weeklyOnly = true;
      rows = [
        ['Annual total', fmtWhole(base * 12) + '/yr'],
        ['Cost per seat', fmtUsd(base / seats) + '/mo'],
        ['Included seats', '1 seat'],
        ['Tracked keywords', '200 (weekly updates)'],
        ['24h lookup cap', '100 / 24h + API/MCP']
      ];
      note = 'Lowest solo entry point. Rank tracking updates weekly (daily needs Agency at $89.90/mo annual) and there is no site audit crawler.';
    } else if (seats <= 4 && keywords <= 700) {
      tier = ai ? 'Premium + AI Bundle' : 'Premium';
      base = (isAnnual ? 44.9 : 69) + aiAddon;
      weeklyOnly = true;
      rows = [
        ['Annual total', fmtWhole(base * 12) + '/yr'],
        ['Cost per seat', fmtUsd(base / seats) + '/mo'],
        ['Included seats', '4 seats (1 + 3)'],
        ['Tracked keywords', '700 (weekly updates)'],
        ['24h lookup cap', '500 / 24h + API/MCP']
      ];
      note = 'Includes 4 seats with zero per-seat fees, but rank tracking is weekly only and there is no technical site audit crawler.';
    } else {
      tier = ai ? 'Agency + AI Bundle' : 'Agency';
      base = (isAnnual ? 89.9 : 129) + aiAddon;
      rows = [
        ['Annual total', fmtWhole(base * 12) + '/yr'],
        ['Cost per seat', fmtUsd(base / seats) + '/mo'],
        ['Included seats', '6 seats (1 + 5)'],
        ['Tracked keywords', '1,500 (daily updates)'],
        ['24h lookup cap', '1,200 / 24h + API/MCP']
      ];
      note = 'Includes 6 seats and daily rank tracking up to 1,500 keywords, but lacks a full technical site audit crawler.';
    }

    return {
      tier: tier,
      monthly: base,
      annualTotal: base * 12,
      perSeat: base / seats,
      eligible: eligible,
      weeklyOnly: weeklyOnly,
      rows: rows,
      note: note,
      warnNote: !eligible || weeklyOnly
    };
  }

  function calcSurfer(seats, ai, isAnnual) {
    if (seats <= 1 && !ai) {
      return {
        tier: 'Discovery',
        monthly: isAnnual ? 49 : 59,
        desc: '1 seat, 10 Content Editor docs/mo, 10 tracked pages, Surfy AI assistant. Adds NLP content scoring on top of your base SEO tool.'
      };
    }
    if (seats <= 3) {
      return {
        tier: 'Standard',
        monthly: isAnnual ? 99 : 119,
        desc: '3 seats, 30 Content Editor docs/mo (360/yr), 50 tracked pages, 25 weekly AI prompts, plagiarism checker. Standalone AI Search Analytics is $' + (isAnnual ? '82' : '95') + '/mo.'
      };
    }
    return {
      tier: 'Pro',
      monthly: isAnnual ? 182 : 219,
      desc: '5 seats, 5 brand workspaces, 30 Content Editor docs/mo, 200 tracked pages, 50 daily AI prompts, MCP access.'
    };
  }

  function render() {
    var isAnnual = state.billing === 'annual';
    var seats = state.seats;
    var keywords = state.keywords;
    var projects = state.projects;
    var ai = state.ai;

    el.seatsOut.textContent = seats + (seats === 1 ? ' seat' : ' seats');
    el.keywordsOut.textContent = keywords.toLocaleString('en-US') + ' keywords';
    el.projectsOut.textContent = projects + (projects === 1 ? ' project' : ' projects');
    el.billingOut.textContent = isAnnual ? 'Annual' : 'Monthly';
    el.meterMeta.textContent = seats + (seats === 1 ? ' seat' : ' seats') + ' \u00B7 ' + keywords.toLocaleString('en-US') + ' kw \u00B7 ' + projects + ' projects';

    var semrush = calcSemrush(seats, keywords, projects, ai, isAnnual);
    var seranking = calcSeranking(seats, keywords, projects, ai, isAnnual);
    var mangools = calcMangools(seats, keywords, projects, ai, isAnnual);

    // Semrush card
    el.semrushTier.textContent = semrush.tier;
    el.semrushPrice.innerHTML = fmtUsd(semrush.monthly) + (semrush.highSeatRange ? '+' : '') + '<small>/mo</small>';
    el.semrushSub.textContent = fmtWhole(semrush.annualTotal) + '/yr (' + (isAnnual ? 'annual' : 'monthly') + ')';
    setBreakdown(el.semrushSpecs, semrush.rows);
    el.semrushNote.textContent = semrush.note;
    el.semrushNote.className = 'result-note' + (semrush.warnNote ? ' is-warn' : '');

    // SE Ranking card
    el.serankingTier.textContent = seranking.tier;
    el.serankingPrice.innerHTML = fmtUsd(seranking.monthly) + (seranking.extraSeatNote ? '+' : '') + '<small>/mo</small>';
    el.serankingSub.textContent = fmtWhole(seranking.annualTotal) + '/yr (' + (isAnnual ? 'annual, 20% off' : 'monthly') + ')';
    setBreakdown(el.serankingSpecs, seranking.rows);
    el.serankingNote.textContent = seranking.note;
    el.serankingNote.className = 'result-note' + (seranking.warnNote ? ' is-warn' : '');

    // Mangools card
    el.mangoolsTier.textContent = mangools.tier;
    el.mangoolsPrice.innerHTML = fmtUsd(mangools.monthly) + '<small>/mo</small>';
    el.mangoolsSub.textContent = mangools.eligible
      ? fmtWhole(mangools.annualTotal) + '/yr (' + (isAnnual ? 'annual, ~35% off' : 'monthly') + ')'
      : 'Exceeds 1,500-keyword cap';
    setBreakdown(el.mangoolsSpecs, mangools.rows);
    el.mangoolsNote.textContent = mangools.note;
    el.mangoolsNote.className = 'result-note' + (mangools.warnNote ? ' is-warn' : '');

    // Winner selection
    var pool = [
      { key: 'semrush', cost: semrush.monthly, name: 'Semrush ' + semrush.tier },
      { key: 'seranking', cost: seranking.monthly, name: 'SE Ranking ' + seranking.tier }
    ];
    if (mangools.eligible) {
      pool.push({ key: 'mangools', cost: mangools.monthly, name: 'Mangools ' + mangools.tier });
    }
    pool.sort(function (a, b) { return a.cost - b.cost; });
    var winner = pool[0];

    el.cardSemrush.classList.toggle('is-winner', winner.key === 'semrush');
    el.cardSeranking.classList.toggle('is-winner', winner.key === 'seranking');
    el.cardMangools.classList.toggle('is-winner', winner.key === 'mangools');

    el.semrushBadge.textContent = winner.key === 'semrush' ? 'Lowest Cost' : 'Full Suite';
    el.serankingBadge.textContent = winner.key === 'seranking' ? 'Lowest Cost' : 'Daily + Crawler';
    el.mangoolsBadge.textContent = !mangools.eligible ? 'Cap Exceeded' : (winner.key === 'mangools' ? 'Lowest Cost' : 'Solo Entry');
    el.mangoolsBadge.className = 'result-badge' + (!mangools.eligible ? ' is-warn' : '');

    // KPI strip
    var fullSuiteWinner = seranking.monthly <= semrush.monthly
      ? { cost: seranking.monthly, name: 'SE Ranking ' + seranking.tier }
      : { cost: semrush.monthly, name: 'Semrush ' + semrush.tier };
    var saveVsSemrush = Math.max(0, Math.round((semrush.monthly - winner.cost) * 12));

    el.kpiWinner.textContent = fmtUsd(winner.cost) + '/mo';
    el.kpiWinnerName.textContent = winner.name;
    el.kpiFullSuite.textContent = fmtUsd(fullSuiteWinner.cost) + '/mo';
    el.kpiFullSuiteName.textContent = fullSuiteWinner.name;
    el.kpiSavings.textContent = fmtWhole(saveVsSemrush) + '/yr';
    el.kpiSavingsNote.textContent = 'vs ' + semrush.tier;

    // Summary alert
    if (winner.key === 'mangools') {
      el.summaryAlert.innerHTML =
        '<strong>Lowest raw entry price: ' + winner.name + ' at ' + fmtUsd(mangools.monthly) + '/mo</strong> (saves ' +
        fmtWhole(saveVsSemrush) + '/yr vs Semrush).' +
        (mangools.weeklyOnly
          ? ' Basic and Premium update rank tracking weekly and omit a technical site crawler. For daily tracking plus a site audit crawler, SE Ranking ' + seranking.tier + ' runs ' + fmtUsd(seranking.monthly) + '/mo.'
          : ' Mangools Agency includes daily rank tracking up to 1,500 keywords, while SE Ranking ' + seranking.tier + ' (' + fmtUsd(seranking.monthly) + '/mo) adds a full technical site audit crawler.');
    } else if (winner.key === 'seranking') {
      el.summaryAlert.innerHTML =
        '<strong>Lowest full-fit suite: ' + winner.name + ' at ' + fmtUsd(seranking.monthly) + '/mo</strong> (saves ' +
        fmtWhole(saveVsSemrush) + '/yr vs Semrush while keeping daily rank tracking, a technical site crawler, and API/MCP access).';
    } else {
      el.summaryAlert.innerHTML =
        '<strong>Lowest fit here: ' + winner.name + ' at ' + fmtUsd(semrush.monthly) + '/mo.</strong>';
    }

    // Warnings
    var warns = [];
    if (!mangools.eligible) {
      warns.push('Tracking ' + keywords.toLocaleString('en-US') + ' daily keywords exceeds Mangools Agency\'s 1,500-keyword cap. Compare SE Ranking (2,000-5,000 daily) and Semrush One Advanced (5,000).');
    }
    if (seats > 1) {
      warns.push('Semrush includes 1 base seat and charges $45/mo minimum per extra seat (up to $100/seat on higher plans).');
    }
    if (seranking.extraSeatNote) {
      warns.push('SE Ranking Growth includes 3 manager seats; supporting ' + seats + ' active logins requires extra seat add-ons or view-only guest links.');
    }
    el.limitWarn.hidden = warns.length === 0;
    if (warns.length > 0) {
      el.limitWarn.innerHTML = '<strong>Quota &amp; seat alert:</strong> ' + warns.join(' ');
    }

    // Optional Surfer panel
    el.surferPanel.hidden = !state.surfer;
    if (state.surfer) {
      var surfer = calcSurfer(seats, ai, isAnnual);
      el.surferTierName.textContent = surfer.tier;
      el.surferPrice.textContent = '+' + fmtWhole(surfer.monthly) + '/mo (' + fmtWhole(surfer.monthly * 12) + '/yr)';
      el.surferDesc.textContent = surfer.desc + ' Combined with ' + winner.name + ', total stack cost is ' +
        fmtUsd(winner.cost + surfer.monthly) + '/mo (' + fmtWhole((winner.cost + surfer.monthly) * 12) + '/yr).';
    }

    // Meter bars
    var maxCost = Math.max(semrush.monthly, seranking.monthly, mangools.monthly, 1);
    var setBar = function (bar, label, cost, isWinner, suffix) {
      var pct = Math.max(6, Math.min(100, (cost / maxCost) * 100));
      bar.style.width = pct.toFixed(1) + '%';
      bar.className = 'meter-fill' + (isWinner ? '' : (cost === maxCost ? ' is-over' : ' is-tight'));
      label.textContent = fmtWhole(cost) + suffix;
    };
    setBar(el.barSemrush, el.barValSemrush, semrush.monthly, winner.key === 'semrush', '/mo');
    setBar(el.barSeranking, el.barValSeranking, seranking.monthly, winner.key === 'seranking', '/mo');
    setBar(el.barMangools, el.barValMangools, mangools.monthly, winner.key === 'mangools', mangools.eligible ? '/mo' : ' (over cap)');
  }

  function clearPresets() {
    var btns = document.querySelectorAll('.preset-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('is-active');
  }

  el.seatsInput.addEventListener('input', function () {
    state.seats = Number(this.value);
    clearPresets();
    render();
  });

  el.keywordsInput.addEventListener('input', function () {
    state.keywords = Number(this.value);
    clearPresets();
    render();
  });

  el.projectsInput.addEventListener('input', function () {
    state.projects = Number(this.value);
    clearPresets();
    render();
  });

  el.aiToggle.addEventListener('change', function () {
    state.ai = this.checked;
    clearPresets();
    render();
  });

  el.surferToggle.addEventListener('change', function () {
    state.surfer = this.checked;
    clearPresets();
    render();
  });

  var billingBtns = document.querySelectorAll('[data-billing]');
  for (var i = 0; i < billingBtns.length; i++) {
    billingBtns[i].addEventListener('click', function () {
      state.billing = this.getAttribute('data-billing');
      for (var j = 0; j < billingBtns.length; j++) {
        var active = billingBtns[j] === this;
        billingBtns[j].classList.toggle('is-active', active);
        billingBtns[j].setAttribute('aria-pressed', active ? 'true' : 'false');
      }
      render();
    });
  }

  var presetBtns = document.querySelectorAll('.preset-btn');
  for (var k = 0; k < presetBtns.length; k++) {
    presetBtns[k].addEventListener('click', function () {
      var p = PRESETS[this.getAttribute('data-preset')];
      if (!p) return;
      state.seats = p.seats;
      state.keywords = p.keywords;
      state.projects = p.projects;
      state.ai = p.ai;
      state.surfer = p.surfer;
      el.seatsInput.value = p.seats;
      el.keywordsInput.value = p.keywords;
      el.projectsInput.value = p.projects;
      el.aiToggle.checked = p.ai;
      el.surferToggle.checked = p.surfer;
      clearPresets();
      this.classList.add('is-active');
      render();
    });
  }

  el.resetBtn.addEventListener('click', function () {
    state.seats = DEFAULTS.seats;
    state.keywords = DEFAULTS.keywords;
    state.projects = DEFAULTS.projects;
    state.ai = DEFAULTS.ai;
    state.surfer = DEFAULTS.surfer;
    state.billing = DEFAULTS.billing;
    el.seatsInput.value = DEFAULTS.seats;
    el.keywordsInput.value = DEFAULTS.keywords;
    el.projectsInput.value = DEFAULTS.projects;
    el.aiToggle.checked = DEFAULTS.ai;
    el.surferToggle.checked = DEFAULTS.surfer;
    for (var j = 0; j < billingBtns.length; j++) {
      var active = billingBtns[j].getAttribute('data-billing') === 'annual';
      billingBtns[j].classList.toggle('is-active', active);
      billingBtns[j].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    clearPresets();
    var defPreset = document.querySelector('[data-preset="indie"]');
    if (defPreset) defPreset.classList.add('is-active');
    render();
  });

  render();
})();
