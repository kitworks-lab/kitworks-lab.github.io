/* KitWorks Lab — Interactive TokiDock & GoalDock Browser Demos (Zero dependencies) */
(function (global) {
  'use strict';

  var TOKI_THEMES = [
    {
      id: 'minimal-glass',
      name: 'Minimal Glass',
      pro: false,
      bg: 'rgba(15, 23, 42, 0.78)',
      border: 'rgba(255, 255, 255, 0.22)',
      text: '#f8fafc',
      muted: 'rgba(226, 232, 240, 0.80)',
      accent: '#38bdf8',
      accent2: '#818cf8',
      shadow: '0 10px 28px rgba(0, 0, 0, 0.34)',
      font: '"Segoe UI", "Yu Gothic UI", "Hiragino Sans", sans-serif',
      radius: '16px'
    },
    {
      id: 'cozy-cafe',
      name: 'Cozy Cafe',
      pro: true,
      bg: 'rgba(42, 31, 24, 0.90)',
      border: 'rgba(217, 174, 126, 0.44)',
      text: '#fdf6ec',
      muted: '#d6bfa9',
      accent: '#e2a35b',
      accent2: '#c97b63',
      shadow: '0 10px 28px rgba(20, 12, 8, 0.42)',
      font: 'Georgia, "Yu Mincho", serif',
      radius: '14px'
    },
    {
      id: 'cyberpunk-hud',
      name: 'Cyberpunk HUD',
      pro: true,
      bg: 'rgba(6, 10, 22, 0.90)',
      border: 'rgba(0, 245, 212, 0.70)',
      text: '#e0fbfc',
      muted: 'rgba(0, 245, 212, 0.82)',
      accent: '#00f5d4',
      accent2: '#ff2a85',
      shadow: '0 0 22px rgba(0, 245, 212, 0.28)',
      font: '"Cascadia Code", Consolas, monospace',
      radius: '6px'
    },
    {
      id: 'pastel-kawaii',
      name: 'Pastel Kawaii',
      pro: true,
      bg: 'rgba(255, 245, 250, 0.94)',
      border: 'rgba(244, 114, 182, 0.55)',
      text: '#502344',
      muted: '#8f4d76',
      accent: '#f472b6',
      accent2: '#a78bfa',
      shadow: '0 8px 24px rgba(244, 114, 182, 0.24)',
      font: '"Yu Gothic UI", "Hiragino Maru Gothic ProN", sans-serif',
      radius: '22px'
    },
    {
      id: 'sakura-bloom',
      name: 'Sakura Bloom',
      pro: true,
      bg: 'rgba(255, 241, 245, 0.94)',
      border: 'rgba(251, 113, 133, 0.48)',
      text: '#4c1d2b',
      muted: '#94435a',
      accent: '#fb7185',
      accent2: '#fda4af',
      shadow: '0 8px 22px rgba(251, 113, 133, 0.20)',
      font: '"Yu Gothic UI", "Hiragino Sans", sans-serif',
      radius: '20px'
    },
    {
      id: 'terminal-hacker',
      name: 'Terminal Hacker',
      pro: true,
      bg: 'rgba(4, 14, 8, 0.92)',
      border: 'rgba(52, 211, 153, 0.58)',
      text: '#6ee7b7',
      muted: 'rgba(110, 231, 183, 0.78)',
      accent: '#10b981',
      accent2: '#34d399',
      shadow: '0 0 20px rgba(16, 185, 129, 0.24)',
      font: '"Cascadia Code", Consolas, monospace',
      radius: '6px'
    },
    {
      id: 'pixel-retro',
      name: 'Pixel Retro',
      pro: true,
      bg: 'rgba(24, 24, 52, 0.95)',
      border: '#facc15',
      text: '#fef08a',
      muted: '#93c5fd',
      accent: '#facc15',
      accent2: '#fb7185',
      shadow: '4px 4px 0 rgba(0, 0, 0, 0.75)',
      font: 'Consolas, "MS Gothic", monospace',
      radius: '4px'
    },
    {
      id: 'pure-light',
      name: 'Pure Minimal Light',
      pro: true,
      bg: 'rgba(255, 255, 255, 0.94)',
      border: 'rgba(15, 23, 42, 0.16)',
      text: '#0f172a',
      muted: '#475569',
      accent: '#0f172a',
      accent2: '#3b82f6',
      shadow: '0 10px 26px rgba(15, 23, 42, 0.14)',
      font: '"Segoe UI", "Yu Gothic UI", sans-serif',
      radius: '16px'
    }
  ];

  var GOAL_THEMES = [
    {
      id: 'obsidian-glass',
      name: 'Obsidian Glass',
      pro: false,
      bg: 'rgba(16, 20, 27, 0.88)',
      border: 'rgba(255, 255, 255, 0.18)',
      text: '#f4f6f8',
      muted: '#b6c0cf',
      accent: '#38bdf8',
      track: 'rgba(255, 255, 255, 0.14)',
      celebrate: '#34d399',
      radius: '14px',
      shadow: '0 10px 26px rgba(0, 0, 0, 0.36)',
      font: '"Segoe UI", "Yu Gothic UI", "Hiragino Sans", sans-serif'
    },
    {
      id: 'paper-ink',
      name: 'Paper Ink',
      pro: false,
      bg: '#faf8f4',
      border: '#18181b',
      text: '#18181b',
      muted: '#57534e',
      accent: '#c84b31',
      track: '#e7e2d8',
      celebrate: '#2f6f4e',
      radius: '10px',
      shadow: '4px 4px 0 #18181b',
      font: '"Segoe UI", "Yu Gothic UI", "Hiragino Sans", sans-serif'
    },
    {
      id: 'broadcast-studio',
      name: 'Broadcast Studio',
      pro: true,
      bg: 'rgba(18, 20, 26, 0.94)',
      border: 'rgba(245, 158, 11, 0.55)',
      text: '#f8fafc',
      muted: '#cbd5e1',
      accent: '#f59e0b',
      track: 'rgba(255, 255, 255, 0.14)',
      celebrate: '#22c55e',
      radius: '8px',
      shadow: '0 10px 26px rgba(0, 0, 0, 0.42)',
      font: '"Segoe UI", "Yu Gothic UI", sans-serif'
    },
    {
      id: 'matcha-cafe',
      name: 'Matcha Cafe',
      pro: true,
      bg: '#f6f2e9',
      border: '#527850',
      text: '#2c251e',
      muted: '#655c51',
      accent: '#527850',
      track: '#e2dccc',
      celebrate: '#b45309',
      radius: '14px',
      shadow: '0 8px 22px rgba(44, 37, 30, 0.16)',
      font: 'Georgia, "Yu Mincho", serif'
    },
    {
      id: 'cyber-grid',
      name: 'Cyber Grid',
      pro: true,
      bg: 'rgba(9, 15, 20, 0.92)',
      border: 'rgba(20, 184, 166, 0.65)',
      text: '#e2f8f5',
      muted: '#7dd3c8',
      accent: '#14b8a6',
      track: 'rgba(20, 184, 166, 0.18)',
      celebrate: '#facc15',
      radius: '6px',
      shadow: '0 0 20px rgba(20, 184, 166, 0.25)',
      font: '"Cascadia Code", Consolas, monospace'
    },
    {
      id: 'sakura-soft',
      name: 'Sakura Soft',
      pro: true,
      bg: '#fff9fa',
      border: 'rgba(214, 99, 132, 0.48)',
      text: '#3a242d',
      muted: '#825566',
      accent: '#d66384',
      track: '#f7e1e8',
      celebrate: '#e11d48',
      radius: '18px',
      shadow: '0 8px 22px rgba(214, 99, 132, 0.18)',
      font: '"Yu Gothic UI", "Hiragino Maru Gothic ProN", sans-serif'
    },
    {
      id: 'pixel-arcade',
      name: 'Pixel Arcade',
      pro: true,
      bg: '#131629',
      border: '#facc15',
      text: '#f8fafc',
      muted: '#93c5fd',
      accent: '#facc15',
      track: '#252b4a',
      celebrate: '#4ade80',
      radius: '4px',
      shadow: '4px 4px 0 #000000',
      font: 'Consolas, "MS Gothic", monospace'
    },
    {
      id: 'warm-sunset',
      name: 'Warm Sunset',
      pro: true,
      bg: 'rgba(29, 20, 23, 0.92)',
      border: 'rgba(249, 115, 22, 0.55)',
      text: '#fdf4ec',
      muted: '#e4beaa',
      accent: '#f97316',
      track: 'rgba(255, 255, 255, 0.15)',
      celebrate: '#fbbf24',
      radius: '14px',
      shadow: '0 10px 28px rgba(29, 20, 23, 0.45)',
      font: '"Segoe UI", "Yu Gothic UI", sans-serif'
    }
  ];

  var ROULETTE_TOPICS = {
    ja: [
      '最近ハマっている作業BGM',
      '今までで一番焦った配信ハプニング',
      '好きなコンビニ飯トップ3',
      '配信を始めたきっかけ',
      '今年中にクリアしたい目標',
      '思い出のゲーム1本',
      '作業が捗るデスク周りの小物',
      '視聴者さんに聞いてみたいこと'
    ],
    en: [
      'Go-to focus playlist right now',
      'Funniest live-stream mishap so far',
      'Top 3 late-night stream snacks',
      'What made you start streaming?',
      'One goal to finish this month',
      'All-time favorite indie game',
      'Desk gadget you cannot live without',
      'Question for chat right now'
    ]
  };

  function pad2(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, '0');
  }

  function formatMMSS(totalSeconds) {
    var s = Math.max(0, Math.floor(totalSeconds));
    var mins = Math.floor(s / 60);
    var secs = s % 60;
    return pad2(mins) + ':' + pad2(secs);
  }

  function formatHHMMSS(totalSeconds) {
    var s = Math.max(0, Math.floor(totalSeconds));
    var hrs = Math.floor(s / 3600);
    var mins = Math.floor((s % 3600) / 60);
    var secs = s % 60;
    return pad2(hrs) + ':' + pad2(mins) + ':' + pad2(secs);
  }

  function getLang() {
    return global.KitWorksLang || 'ja';
  }

  function t(key) {
    var lang = getLang();
    var dict = (global.KitWorksI18N && global.KitWorksI18N[lang]) || {};
    return dict[key] !== undefined ? dict[key] : key;
  }

  function triggerSyncPulse(badgeEl) {
    if (!badgeEl) return;
    badgeEl.classList.add('is-synced');
    badgeEl.textContent = t('syncActive');
    if (badgeEl._syncTimer) {
      global.clearTimeout(badgeEl._syncTimer);
    }
    badgeEl._syncTimer = global.setTimeout(function () {
      badgeEl.classList.remove('is-synced');
      badgeEl.textContent = t('syncIdle');
    }, 950);
  }

  function initTokiDockDemo() {
    var root = document.getElementById('tokidock-workbench');
    if (!root) return null;

    var state = {
      mode: 'pomodoro', // pomodoro | waiting | clock | watchparty
      themeId: 'minimal-glass',
      layout: 'standard', // standard | compact | vertical
      bgMode: 'dark',
      workMinutes: 25,
      breakMinutes: 5,
      phase: 'work', // work | break
      session: 1,
      totalSessions: 4,
      remainingSec: 25 * 60,
      totalSec: 25 * 60,
      watchPhase: 'countdown', // countdown | elapsed
      watchElapsedSec: 0,
      running: false,
      customLabel: '',
      waitingDone: false
    };

    var syncBadge = document.getElementById('toki-sync-badge');
    var canvas = document.getElementById('toki-canvas');
    var widget = document.getElementById('toki-widget');
    var elBadge = document.getElementById('toki-overlay-badge');
    var elTime = document.getElementById('toki-overlay-time');
    var elSub = document.getElementById('toki-overlay-sub');
    var elDots = document.getElementById('toki-overlay-dots');
    var elProgressWrap = document.getElementById('toki-overlay-progress-wrap');
    var elProgressFill = document.getElementById('toki-overlay-progress-fill');

    var btnStart = document.getElementById('toki-btn-start');
    var btnReset = document.getElementById('toki-btn-reset');
    var btnPhase = document.getElementById('toki-btn-phase');
    var inputLabel = document.getElementById('toki-label-input');
    var inputMin = document.getElementById('toki-min-input');
    var btnApplyMin = document.getElementById('toki-apply-min');
    var themeGrid = document.getElementById('toki-theme-grid');

    function getTheme() {
      for (var i = 0; i < TOKI_THEMES.length; i++) {
        if (TOKI_THEMES[i].id === state.themeId) return TOKI_THEMES[i];
      }
      return TOKI_THEMES[0];
    }

    function renderThemeButtons() {
      themeGrid.innerHTML = '';
      TOKI_THEMES.forEach(function (th) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-chip' + (state.themeId === th.id ? ' is-active' : '');
        btn.setAttribute('data-theme-id', th.id);
        btn.setAttribute('aria-pressed', state.themeId === th.id ? 'true' : 'false');

        var swatch = document.createElement('span');
        swatch.className = 'theme-swatch';
        swatch.style.background = th.bg;
        swatch.style.borderColor = th.accent;

        var dot = document.createElement('span');
        dot.className = 'theme-swatch-dot';
        dot.style.background = th.accent;
        swatch.appendChild(dot);

        var name = document.createElement('span');
        name.className = 'theme-name';
        name.textContent = th.name;

        var tag = document.createElement('span');
        tag.className = 'edition-mini ' + (th.pro ? 'is-pro' : 'is-lite');
        tag.textContent = th.pro ? t('proTag') : t('liteTag');

        btn.appendChild(swatch);
        btn.appendChild(name);
        btn.appendChild(tag);

        btn.addEventListener('click', function () {
          state.themeId = th.id;
          renderAll(true);
        });
        themeGrid.appendChild(btn);
      });
    }

    function applyThemeStyles() {
      var th = getTheme();
      widget.style.background = th.bg;
      widget.style.borderColor = th.border;
      widget.style.color = th.text;
      widget.style.borderRadius = th.radius;
      widget.style.boxShadow = th.shadow;
      widget.style.fontFamily = th.font;
      widget.style.setProperty('--w-accent', th.accent);
      widget.style.setProperty('--w-accent2', th.accent2);
      widget.style.setProperty('--w-muted', th.muted);
      widget.style.setProperty('--w-text', th.text);
    }

    function renderOverlay() {
      applyThemeStyles();
      widget.setAttribute('data-layout', state.layout);
      canvas.setAttribute('data-bg', state.bgMode);

      var now = new Date();
      var lang = getLang();

      if (state.mode === 'clock') {
        elBadge.textContent = state.customLabel.trim() || t('tokiOverlayClock');
        elTime.textContent = pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds());
        elTime.classList.remove('is-message');
        var locale = lang === 'ja' ? 'ja-JP' : 'en-US';
        elSub.textContent = now.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short'
        });
        elDots.hidden = true;
        elProgressWrap.hidden = true;
      } else if (state.mode === 'pomodoro') {
        var defaultBadge = state.phase === 'work' ? t('tokiOverlayWork') : t('tokiOverlayBreak');
        elBadge.textContent = state.customLabel.trim() || defaultBadge;
        elTime.textContent = formatMMSS(state.remainingSec);
        elTime.classList.remove('is-message');
        elSub.textContent = t('tokiSessionPrefix') + ' ' + state.session + ' / ' + state.totalSessions + ' · ' + state.workMinutes + 'm / ' + state.breakMinutes + 'm';
        elDots.hidden = false;
        elDots.innerHTML = '';
        for (var i = 1; i <= state.totalSessions; i++) {
          var d = document.createElement('span');
          d.className = 'session-dot' + (i < state.session ? ' is-done' : '') + (i === state.session ? ' is-current' : '');
          elDots.appendChild(d);
        }
        elProgressWrap.hidden = false;
        var pct = state.totalSec > 0 ? ((state.totalSec - state.remainingSec) / state.totalSec) * 100 : 0;
        elProgressFill.style.width = Math.max(0, Math.min(100, pct)) + '%';
      } else if (state.mode === 'waiting') {
        elBadge.textContent = state.customLabel.trim() || t('tokiOverlayWaiting');
        if (state.waitingDone || state.remainingSec <= 0) {
          elTime.textContent = t('tokiOverlayStarting');
          elTime.classList.add('is-message');
          elSub.textContent = '00:00';
        } else {
          elTime.textContent = formatMMSS(state.remainingSec);
          elTime.classList.remove('is-message');
          elSub.textContent = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
        }
        elDots.hidden = true;
        elProgressWrap.hidden = false;
        var wpct = state.totalSec > 0 ? ((state.totalSec - state.remainingSec) / state.totalSec) * 100 : 100;
        elProgressFill.style.width = Math.max(0, Math.min(100, wpct)) + '%';
      } else if (state.mode === 'watchparty') {
        if (state.watchPhase === 'countdown') {
          elBadge.textContent = state.customLabel.trim() || t('tokiOverlayWatchReady');
          elTime.textContent = formatMMSS(state.remainingSec);
          elTime.classList.remove('is-message');
          elSub.textContent = lang === 'ja' ? '10秒後に再生経過時間へ自動切替' : 'Auto-switches to elapsed time at 00:00';
          elProgressWrap.hidden = false;
          var spct = ((10 - state.remainingSec) / 10) * 100;
          elProgressFill.style.width = Math.max(0, Math.min(100, spct)) + '%';
        } else {
          elBadge.textContent = state.customLabel.trim() || t('tokiOverlayWatchLive');
          elTime.textContent = formatHHMMSS(state.watchElapsedSec);
          elTime.classList.remove('is-message');
          elSub.textContent = lang === 'ja' ? '同時視聴 再生中' : 'Watch party live';
          elProgressWrap.hidden = true;
        }
        elDots.hidden = true;
      }
    }

    function renderControls() {
      root.querySelectorAll('[data-toki-mode]').forEach(function (btn) {
        var active = btn.getAttribute('data-toki-mode') === state.mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      root.querySelectorAll('[data-toki-layout]').forEach(function (btn) {
        var active = btn.getAttribute('data-toki-layout') === state.layout;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      root.querySelectorAll('[data-toki-bg]').forEach(function (btn) {
        var active = btn.getAttribute('data-toki-bg') === state.bgMode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      var isClock = state.mode === 'clock';
      btnStart.disabled = isClock;
      btnReset.disabled = isClock;
      btnPhase.disabled = state.mode !== 'pomodoro';
      btnStart.textContent = state.running ? t('tokiPause') : t('tokiStart');
      btnStart.classList.toggle('is-running', state.running);
      btnReset.textContent = t('tokiReset');
      btnPhase.textContent = t('tokiNextPhase');

      renderThemeButtons();
    }

    function renderAll(withSyncPulse) {
      renderControls();
      renderOverlay();
      if (withSyncPulse) triggerSyncPulse(syncBadge);
    }

    function setMode(mode) {
      state.mode = mode;
      state.running = false;
      state.waitingDone = false;
      if (mode === 'pomodoro') {
        state.phase = 'work';
        state.remainingSec = state.workMinutes * 60;
        state.totalSec = state.workMinutes * 60;
      } else if (mode === 'waiting') {
        state.remainingSec = 5 * 60;
        state.totalSec = 5 * 60;
        inputMin.value = '5';
      } else if (mode === 'watchparty') {
        state.watchPhase = 'countdown';
        state.remainingSec = 10;
        state.totalSec = 10;
        state.watchElapsedSec = 0;
      }
      renderAll(true);
    }

    function resetTimer() {
      state.running = false;
      state.waitingDone = false;
      if (state.mode === 'pomodoro') {
        var mins = state.phase === 'work' ? state.workMinutes : state.breakMinutes;
        state.remainingSec = mins * 60;
        state.totalSec = mins * 60;
      } else if (state.mode === 'waiting') {
        var wMin = Math.max(1, parseInt(inputMin.value, 10) || 5);
        state.remainingSec = wMin * 60;
        state.totalSec = wMin * 60;
      } else if (state.mode === 'watchparty') {
        state.watchPhase = 'countdown';
        state.remainingSec = 10;
        state.totalSec = 10;
        state.watchElapsedSec = 0;
      }
      renderAll(true);
    }

    function tick() {
      if (state.mode === 'clock') {
        renderOverlay();
        return;
      }
      if (!state.running) return;

      if (state.mode === 'pomodoro') {
        if (state.remainingSec > 1) {
          state.remainingSec -= 1;
        } else {
          if (state.phase === 'work') {
            state.phase = 'break';
            state.remainingSec = state.breakMinutes * 60;
            state.totalSec = state.breakMinutes * 60;
          } else {
            state.phase = 'work';
            state.session = state.session >= state.totalSessions ? 1 : state.session + 1;
            state.remainingSec = state.workMinutes * 60;
            state.totalSec = state.workMinutes * 60;
          }
          triggerSyncPulse(syncBadge);
        }
        renderOverlay();
      } else if (state.mode === 'waiting') {
        if (state.remainingSec > 1) {
          state.remainingSec -= 1;
        } else {
          state.remainingSec = 0;
          state.waitingDone = true;
          state.running = false;
          renderControls();
          triggerSyncPulse(syncBadge);
        }
        renderOverlay();
      } else if (state.mode === 'watchparty') {
        if (state.watchPhase === 'countdown') {
          if (state.remainingSec > 1) {
            state.remainingSec -= 1;
          } else {
            state.remainingSec = 0;
            state.watchPhase = 'elapsed';
            state.watchElapsedSec = 0;
            triggerSyncPulse(syncBadge);
          }
        } else {
          state.watchElapsedSec += 1;
        }
        renderOverlay();
      }
    }

    // Bind events
    root.querySelectorAll('[data-toki-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setMode(btn.getAttribute('data-toki-mode'));
      });
    });

    root.querySelectorAll('[data-toki-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var preset = btn.getAttribute('data-toki-preset');
        state.running = false;
        state.waitingDone = false;
        if (preset === '25-5') {
          state.mode = 'pomodoro';
          state.phase = 'work';
          state.workMinutes = 25;
          state.breakMinutes = 5;
          state.remainingSec = 25 * 60;
          state.totalSec = 25 * 60;
          inputMin.value = '25';
        } else if (preset === '50-10') {
          state.mode = 'pomodoro';
          state.phase = 'work';
          state.workMinutes = 50;
          state.breakMinutes = 10;
          state.remainingSec = 50 * 60;
          state.totalSec = 50 * 60;
          inputMin.value = '50';
        } else if (preset === '15-3') {
          state.mode = 'pomodoro';
          state.phase = 'work';
          state.workMinutes = 15;
          state.breakMinutes = 3;
          state.remainingSec = 15 * 60;
          state.totalSec = 15 * 60;
          inputMin.value = '15';
        } else if (preset === 'wait-5') {
          state.mode = 'waiting';
          state.remainingSec = 5 * 60;
          state.totalSec = 5 * 60;
          inputMin.value = '5';
        }
        renderAll(true);
      });
    });

    btnApplyMin.addEventListener('click', function () {
      var val = Math.max(1, Math.min(180, parseInt(inputMin.value, 10) || 25));
      inputMin.value = String(val);
      state.running = false;
      state.waitingDone = false;
      if (state.mode === 'waiting') {
        state.remainingSec = val * 60;
        state.totalSec = val * 60;
      } else {
        state.mode = 'pomodoro';
        if (state.phase === 'work') {
          state.workMinutes = val;
        } else {
          state.breakMinutes = val;
        }
        state.remainingSec = val * 60;
        state.totalSec = val * 60;
      }
      renderAll(true);
    });

    btnStart.addEventListener('click', function () {
      if (state.mode === 'clock') return;
      if (state.mode === 'waiting' && state.waitingDone) {
        resetTimer();
      }
      state.running = !state.running;
      renderAll(true);
    });

    btnReset.addEventListener('click', resetTimer);

    btnPhase.addEventListener('click', function () {
      if (state.mode !== 'pomodoro') return;
      state.running = false;
      state.phase = state.phase === 'work' ? 'break' : 'work';
      var mins = state.phase === 'work' ? state.workMinutes : state.breakMinutes;
      state.remainingSec = mins * 60;
      state.totalSec = mins * 60;
      renderAll(true);
    });

    inputLabel.addEventListener('input', function () {
      state.customLabel = inputLabel.value;
      renderOverlay();
      triggerSyncPulse(syncBadge);
    });

    root.querySelectorAll('[data-toki-layout]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.layout = btn.getAttribute('data-toki-layout');
        renderAll(true);
      });
    });

    root.querySelectorAll('[data-toki-bg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.bgMode = btn.getAttribute('data-toki-bg');
        renderAll(false);
      });
    });

    global.setInterval(tick, 1000);
    renderAll(false);

    return {
      refreshLang: function () {
        if (syncBadge && !syncBadge.classList.contains('is-synced')) {
          syncBadge.textContent = t('syncIdle');
        }
        renderAll(false);
      }
    };
  }

  function initGoalDockDemo() {
    var root = document.getElementById('goaldock-workbench');
    if (!root) return null;

    var state = {
      mode: 'goal', // goal | counter | roulette
      themeId: 'obsidian-glass',
      density: 'standard', // standard | compact
      bgMode: 'dark',
      titleCustomized: false,
      goal: {
        titleJa: 'チャンネル登録者 1,000人チャレンジ',
        titleEn: '1,000 Subscribers Milestone',
        customTitle: '',
        current: 840,
        target: 1000,
        unitJa: '人',
        unitEn: ''
      },
      counter: {
        titleJa: '100勝耐久チャレンジ',
        titleEn: '100 Wins Endurance Run',
        customTitle: '',
        value: 42,
        target: 100,
        unitJa: '勝',
        unitEn: ' wins',
        history: []
      },
      roulette: {
        spinning: false,
        winnerIndex: -1,
        currentText: ''
      }
    };

    var syncBadge = document.getElementById('goal-sync-badge');
    var canvas = document.getElementById('goal-canvas');
    var widget = document.getElementById('goal-widget');

    var inputTitle = document.getElementById('goal-title-input');
    var inputTarget = document.getElementById('goal-target-input');
    var groupGoalControls = document.getElementById('goal-controls-goal');
    var groupCounterControls = document.getElementById('goal-controls-counter');
    var groupRouletteControls = document.getElementById('goal-controls-roulette');
    var btnSpin = document.getElementById('goal-btn-spin');
    var btnUndo = document.getElementById('goal-btn-undo');
    var themeGrid = document.getElementById('goal-theme-grid');

    // Overlay views
    var viewGoal = document.getElementById('goal-view-goal');
    var viewCounter = document.getElementById('goal-view-counter');
    var viewRoulette = document.getElementById('goal-view-roulette');

    var elGoalTitle = document.getElementById('goal-overlay-title');
    var elGoalNumbers = document.getElementById('goal-overlay-numbers');
    var elGoalPercent = document.getElementById('goal-overlay-percent');
    var elGoalBar = document.getElementById('goal-overlay-bar');
    var elGoalMeta = document.getElementById('goal-overlay-meta');

    var elCounterTitle = document.getElementById('counter-overlay-title');
    var elCounterValue = document.getElementById('counter-overlay-value');
    var elCounterSub = document.getElementById('counter-overlay-sub');
    var elCounterBar = document.getElementById('counter-overlay-bar');

    var elRouletteLabel = document.getElementById('roulette-overlay-label');
    var elRouletteTopic = document.getElementById('roulette-overlay-topic');

    function getTheme() {
      for (var i = 0; i < GOAL_THEMES.length; i++) {
        if (GOAL_THEMES[i].id === state.themeId) return GOAL_THEMES[i];
      }
      return GOAL_THEMES[0];
    }

    function getCurrentGoalTitle() {
      if (state.goal.customTitle) return state.goal.customTitle;
      return getLang() === 'ja' ? state.goal.titleJa : state.goal.titleEn;
    }

    function getCurrentCounterTitle() {
      if (state.counter.customTitle) return state.counter.customTitle;
      return getLang() === 'ja' ? state.counter.titleJa : state.counter.titleEn;
    }

    function renderThemeButtons() {
      themeGrid.innerHTML = '';
      GOAL_THEMES.forEach(function (th) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-chip' + (state.themeId === th.id ? ' is-active' : '');
        btn.setAttribute('data-theme-id', th.id);
        btn.setAttribute('aria-pressed', state.themeId === th.id ? 'true' : 'false');

        var swatch = document.createElement('span');
        swatch.className = 'theme-swatch';
        swatch.style.background = th.bg;
        swatch.style.borderColor = th.accent;

        var dot = document.createElement('span');
        dot.className = 'theme-swatch-dot';
        dot.style.background = th.accent;
        swatch.appendChild(dot);

        var name = document.createElement('span');
        name.className = 'theme-name';
        name.textContent = th.name;

        var tag = document.createElement('span');
        tag.className = 'edition-mini ' + (th.pro ? 'is-pro' : 'is-lite');
        tag.textContent = th.pro ? t('proTag') : t('liteTag');

        btn.appendChild(swatch);
        btn.appendChild(name);
        btn.appendChild(tag);

        btn.addEventListener('click', function () {
          state.themeId = th.id;
          renderAll(true);
        });
        themeGrid.appendChild(btn);
      });
    }

    function applyThemeStyles() {
      var th = getTheme();
      widget.style.background = th.bg;
      widget.style.borderColor = th.border;
      widget.style.color = th.text;
      widget.style.borderRadius = th.radius;
      widget.style.boxShadow = th.shadow;
      widget.style.fontFamily = th.font;
      widget.style.setProperty('--g-accent', th.accent);
      widget.style.setProperty('--g-muted', th.muted);
      widget.style.setProperty('--g-track', th.track);
      widget.style.setProperty('--g-celebrate', th.celebrate);
    }

    function renderOverlay() {
      applyThemeStyles();
      widget.setAttribute('data-density', state.density);
      canvas.setAttribute('data-bg', state.bgMode);

      viewGoal.hidden = state.mode !== 'goal';
      viewCounter.hidden = state.mode !== 'counter';
      viewRoulette.hidden = state.mode !== 'roulette';

      var lang = getLang();
      var locale = lang === 'ja' ? 'ja-JP' : 'en-US';

      if (state.mode === 'goal') {
        var cur = Math.max(0, state.goal.current);
        var tgt = Math.max(1, state.goal.target);
        var pct = Math.round((cur / tgt) * 100);
        var barPct = Math.min(100, (cur / tgt) * 100);
        var reached = cur >= tgt;
        var unit = lang === 'ja' ? state.goal.unitJa : state.goal.unitEn;

        elGoalTitle.textContent = getCurrentGoalTitle();
        elGoalNumbers.textContent = cur.toLocaleString(locale) + unit + ' / ' + tgt.toLocaleString(locale) + unit;
        elGoalPercent.textContent = pct + '%';
        elGoalBar.style.width = barPct + '%';
        widget.classList.toggle('is-reached', reached);

        if (reached) {
          elGoalMeta.textContent = t('goalReachedBadge');
          elGoalMeta.classList.add('is-celebrate');
        } else {
          var rem = tgt - cur;
          elGoalMeta.textContent = t('goalRemainingPrefix') + ' ' + rem.toLocaleString(locale) + unit;
          elGoalMeta.classList.remove('is-celebrate');
        }
      } else if (state.mode === 'counter') {
        var cVal = Math.max(0, state.counter.value);
        var cTgt = Math.max(0, state.counter.target);
        var cUnit = lang === 'ja' ? state.counter.unitJa : state.counter.unitEn;
        var cReached = cTgt > 0 && cVal >= cTgt;

        elCounterTitle.textContent = getCurrentCounterTitle();
        elCounterValue.textContent = cVal.toLocaleString(locale) + cUnit;
        widget.classList.toggle('is-reached', cReached);
        if (cTgt > 0) {
          var cPct = Math.min(100, (cVal / cTgt) * 100);
          elCounterSub.textContent = t('goalCounterTargetLabel') + ' ' + cTgt.toLocaleString(locale) + cUnit + ' (' + Math.round((cVal / cTgt) * 100) + '%)';
          elCounterBar.style.width = cPct + '%';
        } else {
          elCounterSub.textContent = '';
          elCounterBar.style.width = '0%';
        }
      } else if (state.mode === 'roulette') {
        widget.classList.remove('is-reached');
        elRouletteLabel.textContent = state.roulette.currentText ? t('goalRouletteResultLabel') : 'TOPIC ROULETTE';
        elRouletteTopic.textContent = state.roulette.currentText || t('goalRoulettePrompt');
        elRouletteTopic.classList.toggle('is-spinning', state.roulette.spinning);
      }
    }

    function renderControls() {
      root.querySelectorAll('[data-goal-mode]').forEach(function (btn) {
        var active = btn.getAttribute('data-goal-mode') === state.mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      root.querySelectorAll('[data-goal-density]').forEach(function (btn) {
        var active = btn.getAttribute('data-goal-density') === state.density;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      root.querySelectorAll('[data-goal-bg]').forEach(function (btn) {
        var active = btn.getAttribute('data-goal-bg') === state.bgMode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      groupGoalControls.hidden = state.mode !== 'goal';
      groupCounterControls.hidden = state.mode !== 'counter';
      groupRouletteControls.hidden = state.mode !== 'roulette';

      var fieldsWrap = document.getElementById('goal-edit-fields');
      if (fieldsWrap) fieldsWrap.hidden = state.mode === 'roulette';

      if (state.mode === 'goal') {
        inputTitle.value = getCurrentGoalTitle();
        inputTarget.value = String(state.goal.target);
      } else if (state.mode === 'counter') {
        inputTitle.value = getCurrentCounterTitle();
        inputTarget.value = String(state.counter.target);
      }

      if (btnUndo) {
        btnUndo.disabled = state.counter.history.length === 0;
      }
      if (btnSpin) {
        btnSpin.disabled = state.roulette.spinning;
        btnSpin.textContent = state.roulette.spinning ? t('goalSpinning') : t('goalSpin');
      }

      renderThemeButtons();
    }

    function renderAll(withSyncPulse) {
      renderControls();
      renderOverlay();
      if (withSyncPulse) triggerSyncPulse(syncBadge);
    }

    // Mode switch
    root.querySelectorAll('[data-goal-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.mode = btn.getAttribute('data-goal-mode');
        renderAll(true);
      });
    });

    // Title & target live editing
    inputTitle.addEventListener('input', function () {
      if (state.mode === 'goal') {
        state.goal.customTitle = inputTitle.value;
      } else if (state.mode === 'counter') {
        state.counter.customTitle = inputTitle.value;
      }
      renderOverlay();
      triggerSyncPulse(syncBadge);
    });

    inputTarget.addEventListener('input', function () {
      var val = parseInt(inputTarget.value, 10);
      if (isNaN(val) || val < 1) return;
      if (state.mode === 'goal') {
        state.goal.target = Math.min(9999999, val);
      } else if (state.mode === 'counter') {
        state.counter.target = Math.min(999999, val);
      }
      renderOverlay();
      triggerSyncPulse(syncBadge);
    });

    // Goal presets
    root.querySelectorAll('[data-goal-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var preset = btn.getAttribute('data-goal-preset');
        state.goal.customTitle = '';
        if (preset === 'sub') {
          state.goal.titleJa = 'チャンネル登録者 1,000人チャレンジ';
          state.goal.titleEn = '1,000 Subscribers Milestone';
          state.goal.current = 840;
          state.goal.target = 1000;
          state.goal.unitJa = '人';
          state.goal.unitEn = '';
        } else if (preset === 'like') {
          state.goal.titleJa = '今日の高評価 300チャレンジ';
          state.goal.titleEn = 'Today’s 300 Likes Goal';
          state.goal.current = 215;
          state.goal.target = 300;
          state.goal.unitJa = '件';
          state.goal.unitEn = '';
        } else if (preset === 'super') {
          state.goal.titleJa = '配信マイク更新 目標ゲージ';
          state.goal.titleEn = 'New Broadcast Mic Goal';
          state.goal.current = 12500;
          state.goal.target = 20000;
          state.goal.unitJa = '円';
          state.goal.unitEn = ' JPY';
        }
        renderAll(true);
      });
    });

    // Goal delta buttons
    root.querySelectorAll('[data-goal-delta]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-goal-delta');
        if (action === 'reset') {
          state.goal.current = 0;
        } else if (action === 'max') {
          state.goal.current = state.goal.target;
        } else {
          var delta = parseInt(action, 10) || 0;
          state.goal.current = Math.max(0, state.goal.current + delta);
        }
        renderAll(true);
      });
    });

    // Counter delta buttons
    root.querySelectorAll('[data-counter-delta]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-counter-delta');
        if (action === 'undo') {
          if (state.counter.history.length > 0) {
            state.counter.value = state.counter.history.pop();
          }
        } else {
          state.counter.history.push(state.counter.value);
          if (state.counter.history.length > 20) state.counter.history.shift();
          if (action === 'reset') {
            state.counter.value = 0;
          } else {
            var delta = parseInt(action, 10) || 0;
            state.counter.value = Math.max(0, state.counter.value + delta);
          }
        }
        renderAll(true);
      });
    });

    // Roulette spin
    btnSpin.addEventListener('click', function () {
      if (state.roulette.spinning) return;
      var list = ROULETTE_TOPICS[getLang()] || ROULETTE_TOPICS.ja;
      var targetIndex = Math.floor(Math.random() * list.length);
      if (list.length > 1 && targetIndex === state.roulette.winnerIndex) {
        targetIndex = (targetIndex + 1) % list.length;
      }

      var reducedMotion = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        state.roulette.winnerIndex = targetIndex;
        state.roulette.currentText = list[targetIndex];
        renderAll(true);
        return;
      }

      state.roulette.spinning = true;
      renderControls();
      triggerSyncPulse(syncBadge);

      var steps = 14;
      var step = 0;
      var cursor = Math.max(0, state.roulette.winnerIndex);

      function nextStep() {
        step += 1;
        if (step >= steps) {
          state.roulette.spinning = false;
          state.roulette.winnerIndex = targetIndex;
          state.roulette.currentText = list[targetIndex];
          renderAll(true);
          return;
        }
        cursor = (cursor + 1) % list.length;
        state.roulette.currentText = list[cursor];
        renderOverlay();
        var delay = 55 + Math.floor((step / steps) * (step / steps) * 180);
        global.setTimeout(nextStep, delay);
      }

      nextStep();
    });

    // Density & BG
    root.querySelectorAll('[data-goal-density]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.density = btn.getAttribute('data-goal-density');
        renderAll(true);
      });
    });

    root.querySelectorAll('[data-goal-bg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.bgMode = btn.getAttribute('data-goal-bg');
        renderAll(false);
      });
    });

    renderAll(false);

    return {
      refreshLang: function () {
        if (syncBadge && !syncBadge.classList.contains('is-synced')) {
          syncBadge.textContent = t('syncIdle');
        }
        if (state.roulette.winnerIndex >= 0) {
          var list = ROULETTE_TOPICS[getLang()] || ROULETTE_TOPICS.ja;
          state.roulette.currentText = list[state.roulette.winnerIndex % list.length];
        }
        renderAll(false);
      }
    };
  }

  global.KitWorksDemos = {
    initTokiDockDemo: initTokiDockDemo,
    initGoalDockDemo: initGoalDockDemo
  };
})(window);
