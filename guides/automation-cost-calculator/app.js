(function () {
  'use strict';

  var EUR_TO_USD = 1.08;

  var DEFAULTS = {
    runs: 2500,
    steps: 10,
    workflows: 6,
    billing: 'annual',
    selfHost: false
  };

  var PRESETS = {
    lead: { runs: 1500, steps: 3, workflows: 4 },
    ai: { runs: 2500, steps: 10, workflows: 6 },
    webhook: { runs: 10000, steps: 4, workflows: 8 },
    agency: { runs: 8000, steps: 16, workflows: 15 }
  };

  var state = {
    runs: DEFAULTS.runs,
    steps: DEFAULTS.steps,
    workflows: DEFAULTS.workflows,
    billing: DEFAULTS.billing,
    selfHost: DEFAULTS.selfHost
  };

  var el = {
    runsInput: document.getElementById('runsInput'),
    stepsInput: document.getElementById('stepsInput'),
    workflowsInput: document.getElementById('workflowsInput'),
    runsOut: document.getElementById('runsOut'),
    stepsOut: document.getElementById('stepsOut'),
    workflowsOut: document.getElementById('workflowsOut'),
    billingOut: document.getElementById('billingOut'),
    selfHostToggle: document.getElementById('selfHostToggle'),
    resetBtn: document.getElementById('auto-reset'),
    unitZapier: document.getElementById('unitZapier'),
    unitZapierNote: document.getElementById('unitZapierNote'),
    unitMake: document.getElementById('unitMake'),
    unitN8n: document.getElementById('unitN8n'),
    crossoverAlert: document.getElementById('crossoverAlert'),
    warningAlert: document.getElementById('warningAlert'),
    cardMake: document.getElementById('cardMake'),
    cardN8n: document.getElementById('cardN8n'),
    cardZapier: document.getElementById('cardZapier'),
    makeTier: document.getElementById('makeTier'),
    makeBadge: document.getElementById('makeBadge'),
    makePrice: document.getElementById('makePrice'),
    makeSub: document.getElementById('makeSub'),
    makeSpecs: document.getElementById('makeSpecs'),
    makeNote: document.getElementById('makeNote'),
    n8nTier: document.getElementById('n8nTier'),
    n8nBadge: document.getElementById('n8nBadge'),
    n8nPrice: document.getElementById('n8nPrice'),
    n8nSub: document.getElementById('n8nSub'),
    n8nSpecs: document.getElementById('n8nSpecs'),
    n8nNote: document.getElementById('n8nNote'),
    zapierTier: document.getElementById('zapierTier'),
    zapierBadge: document.getElementById('zapierBadge'),
    zapierPrice: document.getElementById('zapierPrice'),
    zapierSub: document.getElementById('zapierSub'),
    zapierSpecs: document.getElementById('zapierSpecs'),
    zapierNote: document.getElementById('zapierNote'),
    barMake: document.getElementById('barMake'),
    barN8n: document.getElementById('barN8n'),
    barZapier: document.getElementById('barZapier'),
    barValMake: document.getElementById('barValMake'),
    barValN8n: document.getElementById('barValN8n'),
    barValZapier: document.getElementById('barValZapier'),
    selfHostBox: document.getElementById('selfHostBox'),
    selfHostDelta: document.getElementById('selfHostDelta'),
    selfHostSummary: document.getElementById('selfHostSummary'),
    cloudBreakEvenShort: document.getElementById('cloudBreakEvenShort'),
    cloudBreakEven: document.getElementById('cloudBreakEven')
  };

  function fmtInt(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function fmtUsd(n) {
    if (n === 0) return '$0';
    return n < 100 && Math.abs(n - Math.round(n)) >= 0.01
      ? '$' + n.toFixed(2)
      : '$' + Math.round(n).toLocaleString('en-US');
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

  function calcMake(runs, steps, workflows, isAnnual) {
    var credits = runs * steps;
    if (credits <= 1000 && workflows <= 2) {
      return {
        tier: 'Free (1k credits)',
        monthlyUsd: 0,
        annualTotalUsd: 0,
        credits: credits,
        isEst: false,
        rows: [
          ['Credits used', fmtInt(credits) + ' / 1,000'],
          ['Active scenarios', workflows + ' / 2 max'],
          ['Min interval', '15 min']
        ],
        note: 'Fits Free tier (1,000 credits, 2 active scenarios). Routers and error handlers use 0 credits.',
        warnNote: false
      };
    }

    var units10k = Math.max(1, Math.ceil(credits / 10000));
    var allocated = units10k * 10000;

    if (credits <= 300000) {
      var rateRegional = isAnnual ? 9 : 10.59;
      var rateUsLow = isAnnual ? 11 : 16;
      var rateUsHigh = isAnnual ? 12 : 16;
      var monthlyUsd = units10k * rateRegional;
      var usLow = units10k * rateUsLow;
      var usHigh = units10k * rateUsHigh;
      var usRange = usLow === usHigh ? fmtUsd(usLow) + '/mo' : fmtUsd(usLow) + '-' + fmtUsd(usHigh) + '/mo';

      return {
        tier: 'Core (' + fmtInt(allocated / 1000) + 'k credits)',
        monthlyUsd: monthlyUsd,
        annualTotalUsd: monthlyUsd * 12,
        credits: credits,
        isEst: units10k > 1,
        rows: [
          ['Credits billed', fmtInt(credits) + ' (' + units10k + ' x 10k)'],
          ['US checkout range', usRange],
          ['Active scenarios', 'Unlimited (1-min)']
        ],
        note: units10k > 1
          ? 'Scaled from Core 10k baseline; larger prepaid brackets discount slightly while top-up packs cost +25%.'
          : 'Core 10k base includes unlimited active scenarios. Polling triggers burn credits on empty checks.',
        warnNote: false
      };
    }

    var proRegional = isAnnual ? 16 : 18.82;
    var proUs = isAnnual ? 21 : 28;
    var proMonthly = units10k * proRegional;
    return {
      tier: 'Pro (' + fmtInt(allocated / 1000) + 'k credits)',
      monthlyUsd: proMonthly,
      annualTotalUsd: proMonthly * 12,
      credits: credits,
      isEst: true,
      rows: [
        ['Credits billed', fmtInt(credits) + ' (Pro tier)'],
        ['US Pro baseline', fmtUsd(units10k * proUs) + '/mo'],
        ['Core 300k cap', 'Exceeded']
      ],
      note: 'Core caps at 300,000 credits/mo. Pro scales to 8M credits with volume discounts at make.com/en/pricing.',
      warnNote: true
    };
  }

  function calcN8n(runs, isAnnual) {
    var eurMonthly, tier, quota, concurrency, isEst = false;
    if (runs <= 2500) {
      eurMonthly = isAnnual ? 20 : 24;
      tier = 'Starter (2.5k runs)';
      quota = '2,500 /mo';
      concurrency = '5 concurrent';
    } else if (runs <= 10000) {
      eurMonthly = isAnnual ? 50 : 60;
      tier = 'Pro (10k runs)';
      quota = '10,000 /mo';
      concurrency = '50 concurrent';
    } else {
      eurMonthly = isAnnual ? 120 : 145;
      tier = 'Pro (50k runs)';
      quota = '50,000 /mo';
      concurrency = '50 concurrent';
      isEst = isAnnual;
    }

    var usdApprox = eurMonthly * EUR_TO_USD;
    return {
      tier: tier,
      eurMonthly: eurMonthly,
      monthlyUsd: usdApprox,
      annualTotalEur: eurMonthly * 12,
      annualTotalUsd: usdApprox * 12,
      isEst: isEst,
      rows: [
        ['Executions used', fmtInt(runs) + ' / ' + quota],
        ['USD approx.', '~' + fmtUsd(usdApprox) + '/mo'],
        ['Users & workflows', 'Unlimited (' + concurrency + ')']
      ],
      note: '1 full workflow run = 1 execution even with 20 steps. Billed in EUR; steeper technical setup than Zapier.',
      warnNote: false
    };
  }

  function calcZapier(runs, steps, isAnnual) {
    var tasks = runs * Math.max(1, steps - 1);

    if (tasks <= 100 && steps <= 2) {
      return {
        tier: 'Free (100 tasks)',
        monthlyUsd: 0,
        annualTotalUsd: 0,
        tasks: tasks,
        isEst: false,
        rows: [
          ['Billable tasks', fmtInt(tasks) + ' / 100'],
          ['Multi-step Zaps', 'Not included'],
          ['Seats', '1 seat']
        ],
        note: 'Free tier supports 2-step Zaps only. Multi-step workflows require Professional.',
        warnNote: false
      };
    }

    var tiers = [
      { cap: 750, name: 'Pro (750 tasks)', annual: 19.99, monthly: 29.99, mEst: false },
      { cap: 1500, name: 'Pro (1,500 tasks)', annual: 39, monthly: 58.5, mEst: false },
      { cap: 2000, name: 'Pro (2,000 tasks)', annual: 49, monthly: 73.5, mEst: false },
      { cap: 5000, name: 'Pro (5,000 tasks)', annual: 89, monthly: 133.5, mEst: true }
    ];

    for (var i = 0; i < tiers.length; i++) {
      var t = tiers[i];
      if (tasks <= t.cap) {
        var price = isAnnual ? t.annual : t.monthly;
        return {
          tier: t.name,
          monthlyUsd: price,
          annualTotalUsd: price * 12,
          tasks: tasks,
          isEst: !isAnnual && t.mEst,
          rows: [
            ['Billable tasks', fmtInt(tasks) + ' / ' + fmtInt(t.cap)],
            ['Free built-ins', 'Filter/Formatter/Paths'],
            ['Seats', '1 seat (Team 2k $69/mo)']
          ],
          note: 'Broadest plug-and-play SaaS connector catalog. Triggers are free; MCP calls count as 2 tasks.',
          warnNote: false
        };
      }
    }

    if (tasks <= 15000) {
      var base = isAnnual ? 89 : 133.5;
      var overageTasks = tasks - 5000;
      var total = base + overageTasks * (base / 5000) * 1.25;
      return {
        tier: 'Pro 5k + 1.25x Overage',
        monthlyUsd: total,
        annualTotalUsd: total * 12,
        tasks: tasks,
        isEst: true,
        rows: [
          ['Billable tasks', fmtInt(tasks) + ' /mo'],
          ['5k base plan', fmtUsd(base) + '/mo'],
          ['Overage ceiling', '3x plan (15,000 tasks)']
        ],
        note: 'Exceeds verified 5,000-task Pro tier ($89/mo annual). Stepping up to a 10k/20k pack beats 1.25x overages.',
        warnNote: true
      };
    }

    var extra5k = Math.ceil((tasks - 5000) / 5000);
    var estAnnual = 89 + extra5k * 45;
    var estPrice = isAnnual ? estAnnual : estAnnual * 1.5;
    return {
      tier: 'High-Volume Pack (Est.)',
      monthlyUsd: estPrice,
      annualTotalUsd: estPrice * 12,
      tasks: tasks,
      isEst: true,
      rows: [
        ['Billable tasks', fmtInt(tasks) + ' /mo'],
        ['5k tier ceiling', 'Exceeded (>15k tasks)'],
        ['Pricing note', 'Verify volume pack']
      ],
      note: 'Conservative estimate beyond verified 5k tier. Check zapier.com/pricing for exact high-volume task packs.',
      warnNote: true
    };
  }

  function findStepCrossover(runs, isAnnual) {
    var n8n = calcN8n(runs, isAnnual);
    for (var s = 2; s <= 25; s++) {
      var mk = calcMake(runs, s, Math.max(3, state.workflows), isAnnual);
      if (mk.monthlyUsd > n8n.monthlyUsd) return s;
    }
    return null;
  }

  function render() {
    var isAnnual = state.billing === 'annual';
    var runs = state.runs;
    var steps = state.steps;
    var workflows = state.workflows;

    el.runsOut.textContent = fmtInt(runs) + ' runs/mo';
    el.stepsOut.textContent = steps + ' steps (' + (steps - 1) + ' actions)';
    el.workflowsOut.textContent = workflows + ' active';
    el.billingOut.textContent = isAnnual ? 'Annual' : 'Monthly';

    var make = calcMake(runs, steps, workflows, isAnnual);
    var n8n = calcN8n(runs, isAnnual);
    var zapier = calcZapier(runs, steps, isAnnual);

    el.unitZapier.textContent = fmtInt(zapier.tasks);
    el.unitZapierNote.textContent = fmtInt(runs) + ' x ' + (steps - 1) + ' actions';
    el.unitMake.textContent = fmtInt(make.credits);
    el.unitN8n.textContent = fmtInt(runs);

    // Make card
    el.makeTier.textContent = make.tier;
    el.makePrice.innerHTML = (make.isEst ? '~' : '') + fmtUsd(make.monthlyUsd) + '<small>/mo</small>';
    el.makeSub.textContent = make.monthlyUsd === 0
      ? '$0/yr on Free tier'
      : fmtUsd(make.annualTotalUsd) + '/yr (' + (isAnnual ? 'annual' : 'monthly') + ', regional base)';
    setBreakdown(el.makeSpecs, make.rows);
    el.makeNote.textContent = make.note;
    el.makeNote.className = 'result-note' + (make.warnNote ? ' is-warn' : '');

    // n8n card
    el.n8nTier.textContent = n8n.tier;
    el.n8nPrice.innerHTML = (n8n.isEst ? '~' : '') + '\u20AC' + fmtInt(n8n.eurMonthly) + '<small>/mo</small>';
    el.n8nSub.textContent = 'Approx. ' + fmtUsd(n8n.monthlyUsd) + ' USD/mo (\u20AC' + fmtInt(n8n.annualTotalEur) + '/yr)';
    setBreakdown(el.n8nSpecs, n8n.rows);
    el.n8nNote.textContent = n8n.note;
    el.n8nNote.className = 'result-note';

    // Zapier card
    el.zapierTier.textContent = zapier.tier;
    el.zapierPrice.innerHTML = (zapier.isEst ? '~' : '') + fmtUsd(zapier.monthlyUsd) + '<small>/mo</small>';
    el.zapierSub.textContent = (zapier.isEst ? 'Est. ' : '') + fmtUsd(zapier.annualTotalUsd) + '/yr (' + (isAnnual ? 'annual' : 'monthly') + ')';
    setBreakdown(el.zapierSpecs, zapier.rows);
    el.zapierNote.textContent = zapier.note;
    el.zapierNote.className = 'result-note' + (zapier.warnNote ? ' is-warn' : '');

    // Winner
    var list = [
      { key: 'make', cost: make.monthlyUsd },
      { key: 'n8n', cost: n8n.monthlyUsd },
      { key: 'zapier', cost: zapier.monthlyUsd }
    ];
    list.sort(function (a, b) { return a.cost - b.cost; });
    var winner = list[0];

    el.cardMake.classList.toggle('is-winner', winner.key === 'make');
    el.cardN8n.classList.toggle('is-winner', winner.key === 'n8n');
    el.cardZapier.classList.toggle('is-winner', winner.key === 'zapier');

    el.makeBadge.textContent = winner.key === 'make' ? 'Lowest Cost' : 'Credit-based';
    el.n8nBadge.textContent = winner.key === 'n8n' ? 'Lowest Cost' : 'Execution-based';
    el.zapierBadge.textContent = winner.key === 'zapier' ? 'Lowest Cost' : (zapier.isEst ? 'High Volume' : 'Task-based');
    el.zapierBadge.className = 'result-badge' + (zapier.isEst && winner.key !== 'zapier' ? ' is-warn' : '');

    // Crossover alert
    var crossStep = findStepCrossover(runs, isAnnual);
    var saveVsZapier = Math.max(0, Math.round((zapier.monthlyUsd - winner.cost) * 12));
    if (winner.key === 'n8n') {
      el.crossoverAlert.innerHTML =
        '<strong>n8n Cloud wins at this step depth (~' + fmtUsd(n8n.monthlyUsd) + '/mo):</strong> ' +
        'Execution-based billing beats Make.com by ' + fmtUsd(make.monthlyUsd - n8n.monthlyUsd) + '/mo and saves roughly ' +
        fmtUsd(saveVsZapier) + '/yr versus Zapier.' +
        (crossStep ? ' At ' + fmtInt(runs) + ' runs/mo, n8n Cloud overtakes Make.com starting at ' + crossStep + ' steps per run.' : '');
    } else if (winner.key === 'make') {
      el.crossoverAlert.innerHTML =
        '<strong>Make.com wins on shallow runs (' + fmtUsd(make.monthlyUsd) + '/mo regional base):</strong> ' +
        'At ' + steps + ' steps across ' + fmtInt(runs) + ' runs, Make uses ' + fmtInt(make.credits) +
        ' credits and undercuts n8n Cloud by ' + fmtUsd(n8n.monthlyUsd - make.monthlyUsd) + '/mo.' +
        (crossStep
          ? ' If average workflow length reaches ' + crossStep + '+ steps at this run volume, n8n Cloud becomes cheaper.'
          : ' At this run volume, Make stays cheaper than n8n Pro across 2 to 20 steps.');
    } else {
      el.crossoverAlert.innerHTML =
        '<strong>Zapier fits this minimal run count:</strong> Very small task volumes stay on Zapier\'s entry tier before multi-step expansion raises costs.';
    }

    // Warnings
    var warns = [];
    if (workflows > 2 && make.credits <= 1000) {
      warns.push('Make.com Free caps at 2 active scenarios, so running ' + workflows + ' workflows requires Core ($9/mo annual regional) even below 1,000 credits.');
    }
    if (make.credits > 300000) {
      warns.push('Make.com Core caps at 300,000 credits/mo. At ' + fmtInt(make.credits) + ' credits/mo, Make requires the Pro plan.');
    }
    if (zapier.tasks > 5000) {
      warns.push('Zapier tasks (' + fmtInt(zapier.tasks) + '/mo) exceed the verified 5,000-task Pro tier ($89/mo annual). Verify exact volume packs on zapier.com/pricing.');
    }
    el.warningAlert.hidden = warns.length === 0;
    if (warns.length > 0) {
      el.warningAlert.innerHTML = '<strong>Threshold notice:</strong> ' + warns.join(' ');
    }

    // Meter bars
    var maxCost = Math.max(make.monthlyUsd, n8n.monthlyUsd, zapier.monthlyUsd, 1);
    var setBar = function (bar, label, cost, prefix, isWinner) {
      var pct = cost === 0 ? 3 : Math.max(6, Math.min(100, (cost / maxCost) * 100));
      bar.style.width = pct.toFixed(1) + '%';
      bar.className = 'meter-fill' + (isWinner ? '' : (cost === maxCost ? ' is-over' : ' is-tight'));
      label.textContent = prefix + fmtUsd(cost) + '/mo';
    };
    setBar(el.barMake, el.barValMake, make.monthlyUsd, make.isEst ? '~' : '', winner.key === 'make');
    setBar(el.barN8n, el.barValN8n, n8n.monthlyUsd, '~', winner.key === 'n8n');
    setBar(el.barZapier, el.barValZapier, zapier.monthlyUsd, zapier.isEst ? '~' : '', winner.key === 'zapier');

    // Self-hosting panel
    el.selfHostBox.hidden = !state.selfHost;
    if (state.selfHost) {
      var lowDiff = Math.max(0, Math.round(n8n.monthlyUsd - 12));
      var highDiff = Math.max(0, Math.round(n8n.monthlyUsd - 6));
      el.selfHostDelta.textContent = 'Saves $' + lowDiff + '-$' + highDiff + '/mo cash';
      el.selfHostSummary.textContent =
        'At ' + fmtInt(runs) + ' runs/mo, managed n8n Cloud (' + n8n.tier + ') runs approx. ' +
        fmtUsd(n8n.monthlyUsd) + '/mo compared to $6-$12/mo for a 2-4 GB VPS hosting Community Edition.';
      if (n8n.monthlyUsd <= 30) {
        el.cloudBreakEvenShort.textContent = 'Cloud beats DIY for most solo devs';
        el.cloudBreakEven.textContent =
          'At ~' + fmtUsd(n8n.monthlyUsd) + '/mo, managed Starter Cloud costs less than 30 minutes of typical engineering upkeep per month. Self-hosting mainly makes sense for strict data residency or scaling past 10,000+ runs/mo.';
      } else {
        el.cloudBreakEvenShort.textContent = 'VPS saves ~$' + Math.round((n8n.monthlyUsd - 15) * 12) + '+/yr';
        el.cloudBreakEven.textContent =
          'At ~' + fmtUsd(n8n.monthlyUsd) + '/mo for ' + n8n.tier + ', self-hosting on a $10-$20/mo VPS saves roughly $' +
          Math.round((n8n.monthlyUsd - 15) * 12) + '+/yr if your team already manages Docker servers and backups.';
      }
    }
  }

  function clearPresets() {
    var btns = document.querySelectorAll('.preset-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('is-active');
  }

  el.runsInput.addEventListener('input', function () {
    state.runs = Number(this.value);
    clearPresets();
    render();
  });

  el.stepsInput.addEventListener('input', function () {
    state.steps = Number(this.value);
    clearPresets();
    render();
  });

  el.workflowsInput.addEventListener('input', function () {
    state.workflows = Number(this.value);
    clearPresets();
    render();
  });

  el.selfHostToggle.addEventListener('change', function () {
    state.selfHost = this.checked;
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
      state.runs = p.runs;
      state.steps = p.steps;
      state.workflows = p.workflows;
      el.runsInput.value = p.runs;
      el.stepsInput.value = p.steps;
      el.workflowsInput.value = p.workflows;
      clearPresets();
      this.classList.add('is-active');
      render();
    });
  }

  el.resetBtn.addEventListener('click', function () {
    state.runs = DEFAULTS.runs;
    state.steps = DEFAULTS.steps;
    state.workflows = DEFAULTS.workflows;
    state.billing = DEFAULTS.billing;
    state.selfHost = DEFAULTS.selfHost;
    el.runsInput.value = DEFAULTS.runs;
    el.stepsInput.value = DEFAULTS.steps;
    el.workflowsInput.value = DEFAULTS.workflows;
    el.selfHostToggle.checked = false;
    for (var j = 0; j < billingBtns.length; j++) {
      var active = billingBtns[j].getAttribute('data-billing') === 'annual';
      billingBtns[j].classList.toggle('is-active', active);
      billingBtns[j].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    clearPresets();
    var aiPreset = document.querySelector('[data-preset="ai"]');
    if (aiPreset) aiPreset.classList.add('is-active');
    render();
  });

  render();
})();
