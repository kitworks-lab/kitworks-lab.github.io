(function () {
  'use strict';

  var EXTERNAL_BILLING_STACK_USD = 35;

  var DEFAULTS = {
    seats: 6,
    ai: false,
    clientMode: false,
    billing: 'annual'
  };

  var PRESETS = {
    solo: { seats: 1, ai: false, clientMode: true },
    studio: { seats: 3, ai: false, clientMode: true },
    trap6: { seats: 6, ai: false, clientMode: false },
    ai10: { seats: 10, ai: true, clientMode: false }
  };

  var state = {
    seats: DEFAULTS.seats,
    ai: DEFAULTS.ai,
    clientMode: DEFAULTS.clientMode,
    billing: DEFAULTS.billing
  };

  var el = {
    seatsInput: document.getElementById('seatsInput'),
    seatsOut: document.getElementById('seatsOut'),
    billingOut: document.getElementById('billingOut'),
    aiToggle: document.getElementById('aiToggle'),
    clientModeToggle: document.getElementById('clientModeToggle'),
    resetBtn: document.getElementById('pm-reset'),
    kpiWinner: document.getElementById('kpiWinner'),
    kpiWinnerName: document.getElementById('kpiWinnerName'),
    kpiMondaySeats: document.getElementById('kpiMondaySeats'),
    kpiMondayWaste: document.getElementById('kpiMondayWaste'),
    kpiSpread: document.getElementById('kpiSpread'),
    kpiSpreadNote: document.getElementById('kpiSpreadNote'),
    mondayBucketAlert: document.getElementById('mondayBucketAlert'),
    summaryAlert: document.getElementById('summaryAlert'),
    cardClickup: document.getElementById('cardClickup'),
    cardMonday: document.getElementById('cardMonday'),
    cardNotion: document.getElementById('cardNotion'),
    cardBonsai: document.getElementById('cardBonsai'),
    clickupTier: document.getElementById('clickupTier'),
    clickupBadge: document.getElementById('clickupBadge'),
    clickupPrice: document.getElementById('clickupPrice'),
    clickupSub: document.getElementById('clickupSub'),
    clickupSpecs: document.getElementById('clickupSpecs'),
    clickupNote: document.getElementById('clickupNote'),
    mondayTier: document.getElementById('mondayTier'),
    mondayBadge: document.getElementById('mondayBadge'),
    mondayPrice: document.getElementById('mondayPrice'),
    mondaySub: document.getElementById('mondaySub'),
    mondaySpecs: document.getElementById('mondaySpecs'),
    mondayNote: document.getElementById('mondayNote'),
    notionTier: document.getElementById('notionTier'),
    notionBadge: document.getElementById('notionBadge'),
    notionPrice: document.getElementById('notionPrice'),
    notionSub: document.getElementById('notionSub'),
    notionSpecs: document.getElementById('notionSpecs'),
    notionNote: document.getElementById('notionNote'),
    bonsaiTier: document.getElementById('bonsaiTier'),
    bonsaiBadge: document.getElementById('bonsaiBadge'),
    bonsaiPrice: document.getElementById('bonsaiPrice'),
    bonsaiSub: document.getElementById('bonsaiSub'),
    bonsaiSpecs: document.getElementById('bonsaiSpecs'),
    bonsaiNote: document.getElementById('bonsaiNote'),
    barTitle: document.getElementById('barTitle'),
    barMeta: document.getElementById('barMeta'),
    barClickup: document.getElementById('barClickup'),
    barMonday: document.getElementById('barMonday'),
    barNotion: document.getElementById('barNotion'),
    barBonsai: document.getElementById('barBonsai'),
    barValClickup: document.getElementById('barValClickup'),
    barValMonday: document.getElementById('barValMonday'),
    barValNotion: document.getElementById('barValNotion'),
    barValBonsai: document.getElementById('barValBonsai')
  };

  function fmtWhole(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function fmtDec(n) {
    return '$' + n.toFixed(2);
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

  function mondayBucket(seats) {
    if (seats <= 3) return 3;
    return Math.ceil(seats / 5) * 5;
  }

  function calcClickup(seats, ai, clientMode, isAnnual) {
    var rate = isAnnual ? 9 : 12;
    var baseMonthly = seats * rate;
    var addon = clientMode ? EXTERNAL_BILLING_STACK_USD : 0;
    var totalMonthly = baseMonthly + addon;
    var businessMonthly = seats * (isAnnual ? 17 : 25);

    var rows = [
      ['Billed seats', seats + (seats === 1 ? ' seat (exact)' : ' seats (exact)')],
      ['Effective / active user', fmtDec(totalMonthly / seats) + '/mo'],
      ['Base PM license', fmtWhole(baseMonthly) + '/mo ($' + rate + '/user)'],
      ['Included AI credits', '1,000 pooled/user/mo']
    ];
    if (clientMode) {
      rows.push(['Separate billing stack', '+$' + EXTERNAL_BILLING_STACK_USD + '/mo est.']);
    }

    var note = clientMode
      ? 'Includes basic time tracking, but no native legally binding contracts or client invoicing. Business ($' + (isAnnual ? '17' : '25') + '/user = ' + fmtWhole(businessMonthly) + '/mo) adds Workload view.'
      : 'Core bundles Gantt charts and 1,000 pooled AI credits/user/mo. Free Forever ($0) caps workspace file storage at 60 MB.';

    return {
      tier: clientMode ? 'Core + Billing Stack' : 'Core',
      baseMonthly: baseMonthly,
      totalMonthly: totalMonthly,
      annualTotal: totalMonthly * 12,
      rows: rows,
      note: note,
      warnNote: false
    };
  }

  function calcMonday(seats, ai, clientMode, isAnnual) {
    var billed = mondayBucket(seats);
    var empty = billed - seats;
    var tierShort = clientMode ? 'Pro' : 'Standard';
    var rate = clientMode ? (isAnnual ? 19 : 24) : (isAnnual ? 12 : 14);
    var baseMonthly = billed * rate;
    var addon = clientMode ? EXTERNAL_BILLING_STACK_USD : 0;
    var totalMonthly = baseMonthly + addon;
    var wasteMonthly = empty * rate;

    var rows = [
      ['Billed bucket', billed + ' seats' + (empty > 0 ? ' (' + empty + ' empty)' : ' (exact)')],
      ['Effective / active user', fmtDec(totalMonthly / seats) + '/mo'],
      ['Empty-seat waste', empty > 0 ? fmtWhole(wasteMonthly) + '/mo (' + fmtWhole(wasteMonthly * 12) + '/yr)' : '$0'],
      ['Base PM license', fmtWhole(baseMonthly) + '/mo ($' + rate + '/seat)']
    ];
    if (clientMode) {
      rows.push(['Separate billing stack', '+$' + EXTERNAL_BILLING_STACK_USD + '/mo est.']);
    }

    var note = clientMode
      ? 'Pro ($' + rate + '/seat) is required for native time tracking, private boards, and formulas; still requires separate contracts/invoicing tools.'
      : (seats <= 2
          ? 'Paid plans enforce a 3-seat minimum. Free tier covers up to 2 seats (max 3 boards, 500 MB, no automations or Gantt).'
          : 'Standard includes Timeline/Gantt and 250 automations/mo. Basic ($' + (isAnnual ? '9' : '12') + '/seat) omits Gantt and automations.');

    return {
      tier: clientMode ? tierShort + ' + Billing Stack' : tierShort,
      tierShort: tierShort,
      rate: rate,
      baseMonthly: baseMonthly,
      totalMonthly: totalMonthly,
      annualTotal: totalMonthly * 12,
      billedSeats: billed,
      emptySeats: empty,
      wasteMonthly: wasteMonthly,
      rows: rows,
      note: note,
      warnNote: empty > 0
    };
  }

  function calcNotion(seats, ai, clientMode, isAnnual) {
    var tierShort = ai ? 'Business' : 'Plus';
    var rate = ai ? (isAnnual ? 20 : 24) : (isAnnual ? 10 : 12);
    var baseMonthly = seats * rate;
    var addon = clientMode ? EXTERNAL_BILLING_STACK_USD : 0;
    var totalMonthly = baseMonthly + addon;

    var rows = [
      ['Billed seats', seats + (seats === 1 ? ' seat (exact)' : ' seats (exact)')],
      ['Effective / active user', fmtDec(totalMonthly / seats) + '/mo'],
      ['Base workspace', fmtWhole(baseMonthly) + '/mo ($' + rate + '/member)'],
      ['Notion AI access', ai ? 'Full AI bundled' : 'Limited trial only']
    ];
    if (clientMode) {
      rows.push(['Separate billing stack', '+$' + EXTERNAL_BILLING_STACK_USD + '/mo est.']);
    }

    var note = ai
      ? 'Full Notion AI (Agent, AI Meeting Notes, Enterprise Search) requires upgrading every member to Business ($' + rate + '/user/mo).'
      : (seats === 1
          ? 'Solo Free plan ($0) works for docs and light tracking (5 MB uploads, 7-day history); external guests are free.'
          : 'Great for docs/wikis with free external guests, but lacks native Gantt/workload resource views and time tracking.');

    return {
      tier: clientMode ? tierShort + ' + Billing Stack' : tierShort,
      baseMonthly: baseMonthly,
      totalMonthly: totalMonthly,
      annualTotal: totalMonthly * 12,
      rows: rows,
      note: note,
      warnNote: ai
    };
  }

  function calcBonsai(seats, ai, clientMode, isAnnual) {
    var tierShort = clientMode ? 'Essentials' : 'Basic';
    var rate = clientMode ? (isAnnual ? 19 : 25) : (isAnnual ? 9 : 15);
    var totalMonthly = seats * rate;
    var premiumMonthly = seats * (isAnnual ? 29 : 39);

    var rows = [
      ['Billed seats', seats + (seats === 1 ? ' seat (exact)' : ' seats (exact)')],
      ['Effective / active user', fmtDec(totalMonthly / seats) + '/mo'],
      ['Base license', fmtWhole(totalMonthly) + '/mo ($' + rate + '/user)'],
      ['Contracts & invoicing', clientMode ? 'Included natively ($0 extra)' : 'Upgrade to Essentials ($' + (isAnnual ? '19' : '25') + ')']
    ];

    var note = clientMode
      ? 'Essentials includes proposals, contracts, invoicing, client portal, scheduling, and time tracking. Premium ($' + (isAnnual ? '29' : '39') + '/user = ' + fmtWhole(premiumMonthly) + '/mo) removes branding & adds QuickBooks/Xero/Zapier.'
      : 'Basic covers tasks, CRM, and time tracking with no seat minimum (7-day trial, no permanent free tier). Built for client-service studios rather than dev sprints.';

    return {
      tier: tierShort,
      baseMonthly: totalMonthly,
      totalMonthly: totalMonthly,
      annualTotal: totalMonthly * 12,
      rows: rows,
      note: note,
      warnNote: false
    };
  }

  function render() {
    var isAnnual = state.billing === 'annual';
    var seats = state.seats;
    var ai = state.ai;
    var clientMode = state.clientMode;

    el.seatsOut.textContent = seats + (seats === 1 ? ' user' : ' users');
    el.billingOut.textContent = isAnnual ? 'Annual' : 'Monthly';
    el.barMeta.textContent = seats + (seats === 1 ? ' active user' : ' active users') + (clientMode ? ' + billing stack' : '');

    var clickup = calcClickup(seats, ai, clientMode, isAnnual);
    var monday = calcMonday(seats, ai, clientMode, isAnnual);
    var notion = calcNotion(seats, ai, clientMode, isAnnual);
    var bonsai = calcBonsai(seats, ai, clientMode, isAnnual);

    // ClickUp
    el.clickupTier.textContent = clickup.tier;
    el.clickupPrice.innerHTML = fmtWhole(clickup.totalMonthly) + '<small>/mo</small>';
    el.clickupSub.textContent = fmtWhole(clickup.annualTotal) + '/yr (' + (isAnnual ? 'annual' : 'monthly') + ')';
    setBreakdown(el.clickupSpecs, clickup.rows);
    el.clickupNote.textContent = clickup.note;
    el.clickupNote.className = 'result-note';

    // monday.com
    el.mondayTier.textContent = monday.tier;
    el.mondayPrice.innerHTML = fmtWhole(monday.totalMonthly) + '<small>/mo</small>';
    el.mondaySub.textContent = fmtWhole(monday.annualTotal) + '/yr (' + (isAnnual ? 'annual' : 'monthly') + ')';
    setBreakdown(el.mondaySpecs, monday.rows);
    el.mondayNote.textContent = monday.note;
    el.mondayNote.className = 'result-note' + (monday.warnNote ? ' is-warn' : '');

    // Notion
    el.notionTier.textContent = notion.tier;
    el.notionPrice.innerHTML = fmtWhole(notion.totalMonthly) + '<small>/mo</small>';
    el.notionSub.textContent = fmtWhole(notion.annualTotal) + '/yr (' + (isAnnual ? 'annual' : 'monthly') + ')';
    setBreakdown(el.notionSpecs, notion.rows);
    el.notionNote.textContent = notion.note;
    el.notionNote.className = 'result-note' + (notion.warnNote ? ' is-warn' : '');

    // Hello Bonsai
    el.bonsaiTier.textContent = bonsai.tier;
    el.bonsaiPrice.innerHTML = fmtWhole(bonsai.totalMonthly) + '<small>/mo</small>';
    el.bonsaiSub.textContent = fmtWhole(bonsai.annualTotal) + '/yr (' + (isAnnual ? 'annual' : 'monthly') + ')';
    setBreakdown(el.bonsaiSpecs, bonsai.rows);
    el.bonsaiNote.textContent = bonsai.note;
    el.bonsaiNote.className = 'result-note';

    // Determine lowest-cost winner(s)
    var options = [
      { key: 'clickup', cost: clickup.totalMonthly, name: 'ClickUp ' + clickup.tier },
      { key: 'monday', cost: monday.totalMonthly, name: 'monday.com ' + monday.tier },
      { key: 'notion', cost: notion.totalMonthly, name: 'Notion ' + notion.tier },
      { key: 'bonsai', cost: bonsai.totalMonthly, name: 'Bonsai ' + bonsai.tier }
    ];
    options.sort(function (a, b) { return a.cost - b.cost; });
    var minCost = options[0].cost;
    var maxCost = options[options.length - 1].cost;

    var winners = options.filter(function (o) { return o.cost === minCost; });

    el.cardClickup.classList.toggle('is-winner', clickup.totalMonthly === minCost);
    el.cardMonday.classList.toggle('is-winner', monday.totalMonthly === minCost);
    el.cardNotion.classList.toggle('is-winner', notion.totalMonthly === minCost);
    el.cardBonsai.classList.toggle('is-winner', bonsai.totalMonthly === minCost);

    el.clickupBadge.textContent = clickup.totalMonthly === minCost ? 'Lowest Cost' : 'Per-Seat';
    el.mondayBadge.textContent = monday.emptySeats > 0 ? (monday.emptySeats + ' Empty ' + (monday.emptySeats === 1 ? 'Seat' : 'Seats')) : (monday.totalMonthly === minCost ? 'Lowest Cost' : 'Exact Bucket');
    el.mondayBadge.className = 'result-badge' + (monday.emptySeats > 0 ? ' is-warn' : '');
    el.notionBadge.textContent = notion.totalMonthly === minCost ? 'Lowest Cost' : (ai ? 'AI Upgrade' : 'Docs + Wiki');
    el.notionBadge.className = 'result-badge' + (ai && notion.totalMonthly !== minCost ? ' is-warn' : '');
    el.bonsaiBadge.textContent = bonsai.totalMonthly === minCost ? 'Lowest Cost' : (clientMode ? 'All-in-One' : 'Client Studio');

    // KPI strip
    el.kpiWinner.textContent = fmtWhole(minCost) + '/mo';
    el.kpiWinnerName.textContent = winners.map(function (w) { return w.name; }).join(' / ');
    el.kpiMondaySeats.textContent = monday.billedSeats + ' seats';
    el.kpiMondayWaste.textContent = monday.emptySeats > 0
      ? monday.emptySeats + ' empty (' + fmtWhole(monday.wasteMonthly) + '/mo wasted)'
      : 'Exact bucket match ($0 empty)';
    el.kpiSpread.textContent = fmtWhole((maxCost - minCost) * 12) + '/yr';
    el.kpiSpreadNote.textContent = fmtWhole(minCost) + ' vs ' + fmtWhole(maxCost) + '/mo';

    // Explicit monday.com seat-bucket warning banner
    if (monday.emptySeats > 0) {
      el.mondayBucketAlert.hidden = false;
      var uLabel = seats === 1 ? '1 user' : seats + ' users';
      var eLabel = monday.emptySeats === 1 ? '1 empty seat' : monday.emptySeats + ' empty seats';
      el.mondayBucketAlert.innerHTML =
        '<strong>monday.com seat-bucket warning:</strong> For ' + uLabel + ', monday.com bills you for <strong>' +
        monday.billedSeats + ' seats (' + eLabel + ')</strong>. On ' + monday.tierShort + ' (' +
        fmtWhole(monday.rate) + '/seat ' + (isAnnual ? 'annual' : 'monthly') + '), that adds <strong>' +
        fmtWhole(monday.wasteMonthly) + '/mo (' + fmtWhole(monday.wasteMonthly * 12) + '/yr)</strong> for unused seats.';
    } else {
      el.mondayBucketAlert.hidden = true;
    }

    // Summary alert
    if (clientMode) {
      var diffBonsai = clickup.totalMonthly - bonsai.totalMonthly;
      if (diffBonsai > 0) {
        el.summaryAlert.innerHTML =
          '<strong>All-in-one studio savings: Hello Bonsai Essentials (' + fmtWhole(bonsai.totalMonthly) + '/mo)</strong> saves ' +
          fmtWhole(diffBonsai) + '/mo (' + fmtWhole(diffBonsai * 12) + '/yr) vs ClickUp Core plus a separate $' +
          EXTERNAL_BILLING_STACK_USD + '/mo invoicing and contract tool, and saves ' +
          fmtWhole((monday.totalMonthly - bonsai.totalMonthly) * 12) + '/yr vs monday.com Pro + billing tools.';
      } else {
        el.summaryAlert.innerHTML =
          '<strong>Team-scale crossover:</strong> At ' + seats + ' users, paying $' + (isAnnual ? '19' : '25') +
          '/user across all seats on Bonsai Essentials (' + fmtWhole(bonsai.totalMonthly) + '/mo) exceeds ClickUp Core plus one flat $' +
          EXTERNAL_BILLING_STACK_USD + '/mo invoicing subscription (' + fmtWhole(clickup.totalMonthly) + '/mo).';
      }
    } else if (ai) {
      var aiSave = (notion.totalMonthly - clickup.totalMonthly) * 12;
      el.summaryAlert.innerHTML =
        '<strong>Built-in AI math: ClickUp Core (' + fmtWhole(clickup.totalMonthly) + '/mo)</strong> bundles 1,000 pooled AI credits/user/mo, saving ' +
        fmtWhole(aiSave) + '/yr compared to upgrading all ' + seats + ' users to Notion Business (' + fmtWhole(notion.totalMonthly) + '/mo) for full Notion AI.';
    } else {
      var saveVsMonday = Math.max(0, (monday.totalMonthly - clickup.totalMonthly) * 12);
      el.summaryAlert.innerHTML =
        '<strong>Lowest workspace license:</strong> ClickUp Core and Bonsai Basic tie at ' +
        fmtWhole(clickup.totalMonthly) + '/mo (' + fmtWhole(clickup.annualTotal) + '/yr), saving ' +
        fmtWhole(saveVsMonday) + '/yr versus monday.com Standard (' + fmtWhole(monday.totalMonthly) + '/mo). ' +
        'Choose ClickUp for broader PM views, Notion (' + fmtWhole(notion.totalMonthly) + '/mo) for wiki-first teams, or Bonsai if you bill clients.';
    }

    // Meter bars
    el.barTitle.textContent = clientMode
      ? 'Total Monthly Stack Comparison (PM + Contracts/Invoicing)'
      : 'Total Monthly Workspace Cost Comparison';

    var barMax = Math.max(maxCost, 1);
    var setBar = function (bar, label, cost) {
      var pct = Math.max(6, Math.min(100, (cost / barMax) * 100));
      var isBest = cost === minCost;
      var isHigh = cost === maxCost && cost > minCost;
      bar.style.width = pct.toFixed(1) + '%';
      bar.className = 'meter-fill' + (isBest ? '' : (isHigh ? ' is-over' : ' is-tight'));
      label.textContent = fmtWhole(cost) + '/mo';
    };
    setBar(el.barClickup, el.barValClickup, clickup.totalMonthly);
    setBar(el.barMonday, el.barValMonday, monday.totalMonthly);
    setBar(el.barNotion, el.barValNotion, notion.totalMonthly);
    setBar(el.barBonsai, el.barValBonsai, bonsai.totalMonthly);
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

  el.aiToggle.addEventListener('change', function () {
    state.ai = this.checked;
    clearPresets();
    render();
  });

  el.clientModeToggle.addEventListener('change', function () {
    state.clientMode = this.checked;
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
      state.ai = p.ai;
      state.clientMode = p.clientMode;
      el.seatsInput.value = p.seats;
      el.aiToggle.checked = p.ai;
      el.clientModeToggle.checked = p.clientMode;
      clearPresets();
      this.classList.add('is-active');
      render();
    });
  }

  el.resetBtn.addEventListener('click', function () {
    state.seats = DEFAULTS.seats;
    state.ai = DEFAULTS.ai;
    state.clientMode = DEFAULTS.clientMode;
    state.billing = DEFAULTS.billing;
    el.seatsInput.value = DEFAULTS.seats;
    el.aiToggle.checked = false;
    el.clientModeToggle.checked = false;
    for (var j = 0; j < billingBtns.length; j++) {
      var active = billingBtns[j].getAttribute('data-billing') === 'annual';
      billingBtns[j].classList.toggle('is-active', active);
      billingBtns[j].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    clearPresets();
    var defPreset = document.querySelector('[data-preset="trap6"]');
    if (defPreset) defPreset.classList.add('is-active');
    render();
  });

  render();
})();
