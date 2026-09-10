/* Mawid — renderer application */
(function () {
  'use strict';
  const { escapeHtml: esc, countdown, countdownLabel, fmtDate, fmtMonthYear, hijri, hijriMonthRange, effectiveDate, parseDate, isoDate, ymOf, debounce, hashHue, firstDayOfWeek, monthName } = window.U;

  // ---------- Icons ----------
  const I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4"/></svg>',
    tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="13" rx="3"/><path d="M8 21h8M12 18v3"/></svg>',
    game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 7h11a4.5 4.5 0 0 1 4.4 5.4l-.9 4.4a2.5 2.5 0 0 1-4.3 1.2L15 16H9l-1.7 2a2.5 2.5 0 0 1-4.3-1.2l-.9-4.4A4.5 4.5 0 0 1 6.5 7z"/><path d="M8 11v3M6.5 12.5h3M15.5 11h.01M18 13h.01"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.4 3.7 4 7.2 4c2 0 3.4 1.1 4.8 2.8C13.4 5.1 14.8 4 16.8 4c3.5 0 5.8 3.4 4.5 7.1-1.8 4.8-9.3 9.4-9.3 9.4z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.4 3.7 4 7.2 4c2 0 3.4 1.1 4.8 2.8C13.4 5.1 14.8 4 16.8 4c3.5 0 5.8 3.4 4.5 7.1-1.8 4.8-9.3 9.4-9.3 9.4z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.7 6 21l1.3-6.8-5-4.7 6.8-.8z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l12-7.5z"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13.5A8.5 8.5 0 1 1 10.5 3a7 7 0 0 0 10.5 10.5z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    poster: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="8" height="18" rx="2"/><rect x="13" y="3" width="8" height="18" rx="2"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0v5l2 3H4l2-3z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="14" r="4"/><path d="M11 11 20 2M15 7l3 3M18 4l2 2"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M4 20h16"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M7 9l5-5 5 5M4 20h16"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.7L19.5 9.5l-5.7 1.8L12 17l-1.8-5.7L4.5 9.5l5.7-1.8zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9zM5 15l.7 2 2 .7-2 .7L5 20.4l-.7-2-2-.7 2-.7z"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M18 14h.01M9 14h6"/></svg>',
    calPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4M12 12v6M9 15h6"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    winMin: '<svg viewBox="0 0 12 12"><path d="M1 6h10" stroke="currentColor" stroke-width="1.2"/></svg>',
    winMax: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.5" y="1.5" width="9" height="9" rx="1"/></svg>',
    winRestore: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.5" y="3.5" width="7" height="7" rx="1"/><path d="M3.5 3.5v-1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1"/></svg>',
    winClose: '<svg viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.2"><path d="M2 2l8 8M10 2l-8 8"/></svg>',
  };
  const TYPE_ICON = { movie: I.film, tv: I.tv, game: I.game };

  // ---------- State ----------
  const S = {
    prefs: {}, user: {}, items: [], updatedAt: 0, version: '', platform: '',
    view: 'home', month: firstOfMonth(new Date()), query: '',
    filters: { platform: null, genre: null, sort: 'date' },
    refreshing: false, progress: null, heroIndex: 0, heroTimer: null, modalId: null, modalDetail: null, maximized: false,
    onboardDismissed: false, expandedCells: new Set(), keyStatus: {},
  };

  function firstOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  const lang = () => S.prefs.lang || 'ar';
  const t = (k) => { const d = window.I18N[lang()] || window.I18N.ar; const v = d[k]; return v === undefined ? (window.I18N.en[k] === undefined ? k : window.I18N.en[k]) : v; };
  const tf = (k, vars) => Object.entries(vars || {}).reduce((s, [a, b]) => s.split(`{${a}}`).join(b), t(k));
  const title = (it) => (lang() === 'ar' ? (it.title_ar || it.title) : it.title);
  const altTitle = (it) => (lang() === 'ar' ? (it.title_ar ? it.title : '') : (it.title_ar || ''));
  const overview = (it) => (lang() === 'ar' ? (it.overview_ar || it.overview || '') : (it.overview || it.overview_ar || ''));
  const overviewIsFallback = (it) => lang() === 'ar' && !it.overview_ar && !!it.overview;
  const genreLabel = (g) => (lang() === 'ar' ? (window.I18N.ar.genreNames[g] || g) : g);
  const platformLabel = (p) => (lang() === 'ar' ? (window.I18N.ar.platformNames[p] || p) : (p === 'Theaters' ? 'Theaters' : p));
  const region = () => S.prefs.region || 'SA';
  const userOf = (id) => S.user[id] || {};
  const hasKeys = () => !!(S.prefs.tmdbKey || S.prefs.rawgKey);
  const isWeb = () => !!(window.mawid && window.mawid.isWeb);
  const SEP = () => (lang() === 'ar' ? '، ' : ', ');
  // Official title logo (TMDB / Steam). Arabic logo when the studio published one, else the original logo.
  function logoFor(it) {
    if (S.prefs.showLogos === false) return null;
    const ar = it.logo_ar || null, en = it.logo_en || null;
    if (lang() === 'ar') return ar ? { url: ar, isAr: true } : en ? { url: en, isAr: false } : null;
    return en ? { url: en, isAr: false } : ar ? { url: ar, isAr: true } : null;
  }
  function ytSearchUrl(it) {
    const q = `${it.title} ${it.type === 'game' ? 'official trailer' : it.type === 'tv' ? `season ${(it.extra && it.extra.season) || ''} official trailer` : 'official trailer'}`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(q.replace(/\s+/g, ' ').trim())}`;
  }
  const ROLE_AR = { Director: 'المخرج', Screenplay: 'السيناريو', Writer: 'الكاتب', Producer: 'المنتج', 'Original Music Composer': 'الموسيقى', 'Director of Photography': 'التصوير', 'Executive Producer': 'منتج تنفيذي', Composer: 'الموسيقى', Creator: 'صانع العمل' };
  function roleLabel(r) { return lang() === 'ar' ? (ROLE_AR[r] || r) : r; }
  function personCard(pr, kind) {
    const url = pr.slug ? `https://rawg.io/creators/${pr.slug}` : pr.id ? `https://www.themoviedb.org/person/${pr.id}` : '';
    const initials = esc((pr.name || '?').split(' ').slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase());
    const h = hashHue(pr.name || '');
    const photo = pr.photo ? `<img src="${esc(pr.photo)}" alt="" loading="lazy" data-initials="${initials}" data-hue="${h}">` : `<div class="p-ph" style="background:linear-gradient(135deg,hsl(${h} 45% 30%),hsl(${(h + 40) % 360} 55% 45%))">${initials}</div>`;
    return `<button class="person" data-action="open-url" data-url="${esc(url)}" title="${esc(pr.name)}"><div class="p-photo">${photo}</div><div class="p-name">${esc(pr.name)}</div><div class="p-role">${esc(kind === 'crew' ? roleLabel(pr.role) : pr.role)}</div></button>`;
  }
  function peopleHtml(it) {
    const p = it.people;
    if (!p || (!(p.cast && p.cast.length) && !(p.crew && p.crew.length))) return '';
    const crew = (p.crew || []).slice(0, 8);
    const cast = (p.cast || []).slice(0, 14);
    return `${crew.length ? `<h4>${it.type === 'game' ? t('dev_team') : t('crew')}</h4><div class="people-row">${crew.map((x) => personCard(x, 'crew')).join('')}</div>` : ''}
      ${cast.length ? `<h4>${t('cast')}</h4><div class="people-row">${cast.map((x) => personCard(x, 'cast')).join('')}</div>` : ''}`;
  }
  function titleBlock(it, cls) {
    const lg = logoFor(it);
    const txt = esc(title(it));
    if (!lg) return `<h2 class="${cls}-title">${txt}</h2>`;
    const sub = lang() === 'ar' && !lg.isAr ? `<div class="${cls}-title-sub">${txt}</div>` : '';
    return `<div class="${cls}-logo-wrap"><img class="title-logo ${cls}-logo" src="${esc(lg.url)}" alt="${txt}" data-title="${txt}" data-cls="${cls}"></div>${sub}`;
  }
  const daysLeftLabel = (n) => {
    if (lang() === 'ar') return window.U.pluralAr(n, { one: 'يوم متبقٍ', two: 'يومان متبقيان', few: 'أيام متبقية', many: 'يومًا متبقيًا', other: 'يوم متبقٍ' }).replace('{n}', '');
    return n === 1 ? 'day left' : 'days left';
  };

  // ---------- Bootstrap ----------
  async function init() {
    const st = await window.mawid.getState();
    S.prefs = st.prefs; S.user = st.user; S.items = st.catalog.items; S.updatedAt = st.catalog.updatedAt; S.version = st.version; S.platform = st.platform; S.maximized = st.maximized;
    S.errors = st.catalog.errors || [];
    if (S.platform === 'darwin') document.body.classList.add('mac');
    if (isWeb() && window.innerWidth <= 760 && extraViews.feed) S.view = 'feed';
    applyPrefsToDom();
    renderAll();
    bindEvents();
    window.mawid.on('catalog:updated', (cat) => {
      S.items = cat.items; S.updatedAt = cat.updatedAt; S.errors = cat.errors || [];
      renderAll();
    });
    window.mawid.on('catalog:progress', (p) => { S.progress = p; renderProgress(); });
    window.mawid.on('open-item', (id) => { openDetail(id); });
    window.mawid.on('win:maximized', (m) => { S.maximized = m; renderWinControls(); });
    scheduleMidnight();
  }

  function applyPrefsToDom() {
    const l = lang();
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    const theme = S.prefs.theme || 'dark';
    const effective = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
    document.documentElement.setAttribute('data-theme', effective);
    document.body.classList.toggle('reduce-motion', !!S.prefs.reduceMotion);
    document.documentElement.style.setProperty('--ui', String(Number(S.prefs.uiScale) || 1));
    document.title = l === 'ar' ? 'موعد' : 'Mawid';
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.prefs.theme === 'system') applyPrefsToDom(); });

  function scheduleMidnight() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    setTimeout(() => { renderAll(); scheduleMidnight(); }, next - now);
  }

  // ---------- Data helpers ----------
  function monthItems(ym, type) {
    return S.items.filter((it) => (!type || it.type === type) && effectiveDate(it, region()) && effectiveDate(it, region()).slice(0, 7) === ym);
  }
  function sortItems(list, mode) {
    const arr = [...list];
    if (mode === 'hype') arr.sort((a, b) => (b.hype - a.hype) || cmpDate(a, b));
    else if (mode === 'title') arr.sort((a, b) => title(a).localeCompare(title(b), lang() === 'ar' ? 'ar' : 'en'));
    else arr.sort(cmpDate);
    return arr;
  }
  function cmpDate(a, b) {
    const da = effectiveDate(a, region()) || '9999', db = effectiveDate(b, region()) || '9999';
    return da < db ? -1 : da > db ? 1 : (b.hype - a.hype) || ((b.popularity || 0) - (a.popularity || 0));
  }
  function applyFilters(list) {
    let out = list;
    if (S.prefs.hideReleased) out = out.filter((it) => countdown(it, region()).state !== 'released');
    if (S.filters.platform) out = out.filter((it) => it.platforms.includes(S.filters.platform));
    if (S.filters.genre) out = out.filter((it) => it.genres.includes(S.filters.genre));
    return sortItems(out, S.filters.sort);
  }
  function searchItems(q) {
    const n = q.trim().toLowerCase();
    if (!n) return [];
    return sortItems(S.items.filter((it) => [it.title, it.title_ar, it.overview, it.overview_ar, (it.extra || {}).developer, (it.extra || {}).director, ...(it.platforms || [])].some((s) => s && String(s).toLowerCase().includes(n))), 'date');
  }
  function featuredItems(ym) {
    const list = monthItems(ym).filter((it) => it.backdrops.length);
    const upcoming = list.filter((it) => countdown(it, region()).state !== 'released');
    const pool = (upcoming.length >= 3 ? upcoming : list).sort((a, b) => (b.hype - a.hype) || ((b.popularity || 0) - (a.popularity || 0)) || cmpDate(a, b));
    // Mix types when possible
    const out = [];
    const byType = { movie: [], tv: [], game: [] };
    for (const it of pool) byType[it.type].push(it);
    for (let i = 0; out.length < 6 && i < 6; i++) for (const ty of ['movie', 'game', 'tv']) { const x = byType[ty][i]; if (x && out.length < 6) out.push(x); }
    return out.length ? out : pool.slice(0, 6);
  }
  function weekItems() {
    const today = isoDate(new Date());
    const end = isoDate(new Date(Date.now() + 7 * 86400000));
    return sortItems(S.items.filter((it) => { const d = effectiveDate(it, region()); return d && it.date_precision === 'day' && d >= today && d <= end; }), 'date');
  }
  function recentItems() {
    const today = isoDate(new Date());
    const start = isoDate(new Date(Date.now() - 10 * 86400000));
    return sortItems(S.items.filter((it) => { const d = effectiveDate(it, region()); return d && it.date_precision === 'day' && d >= start && d < today; }), 'date').reverse();
  }

  // ---------- Rendering ----------
  function renderAll() {
    renderWinControls();
    renderSidebar();
    renderTopbar();
    renderContent();
    renderProgress();
    if (S.modalId) renderModal();
  }

  function renderWinControls() {
    const el = document.getElementById('win-controls');
    el.innerHTML = `
      <button class="win-btn" data-action="win-min" title="${t('minimize')}">${I.winMin}</button>
      <button class="win-btn" data-action="win-max" title="${t('maximize')}">${S.maximized ? I.winRestore : I.winMax}</button>
      <button class="win-btn close" data-action="win-close" title="${t('close_window')}">${I.winClose}</button>`;
  }

  function renderSidebar() {
    const ym = ymOf(S.month);
    const counts = { movie: monthItems(ym, 'movie').length, tv: monthItems(ym, 'tv').length, game: monthItems(ym, 'game').length };
    const favCount = Object.values(S.user).filter((u) => u.favorite).length;
    const nav = isWeb() ? [
      ['feed', I.sparkle, t('nav_feed')], ['home', I.home, t('nav_home')], ['calendar', I.calendar, t('nav_calendar')],
      ['favorites', I.heart, t('nav_favorites'), favCount], ['settings', I.settings, t('nav_settings')],
    ] : [
      ['home', I.home, t('nav_home')], ['calendar', I.calendar, t('nav_calendar')], 'sep',
      ['movies', I.film, t('nav_movies'), counts.movie], ['tv', I.tv, t('nav_tv'), counts.tv], ['games', I.game, t('nav_games'), counts.game], 'sep',
      ['favorites', I.heart, t('nav_favorites'), favCount], ['settings', I.settings, t('nav_settings')],
    ];
    const upd = S.updatedAt ? `${t('last_updated')}: ${new Intl.DateTimeFormat(lang() === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(S.updatedAt))}` : t('never_updated');
    document.getElementById('sidebar').innerHTML = `
      <div class="brand"><div class="brand-logo">${lang() === 'ar' ? 'م' : 'M'}</div><div><div class="brand-name">${t('appName')}</div><div class="brand-sub">${lang() === 'ar' ? 'Mawid' : 'موعد'}</div></div></div>
      <nav class="nav">${nav.map((n) => n === 'sep' ? '<div class="nav-sep"></div>' : `<button class="nav-item ${(S.view === n[0] || (isWeb() && n[0] === 'home' && ['movies', 'tv', 'games'].includes(S.view))) && !S.query ? 'active' : ''}" data-action="nav" data-view="${n[0]}">${n[1]}<span>${n[2]}</span>${n[3] ? `<span class="count num">${n[3]}</span>` : ''}</button>`).join('')}</nav>
      <div class="sidebar-foot">
        <div class="row">
          <button class="btn sm ghost" data-action="lang" title="${t('shortcut_lang')} (Ctrl+L)">${I.globe}<span>${lang() === 'ar' ? 'English' : 'العربية'}</span></button>
          <button class="btn icon sm ghost" data-action="theme" title="${t('theme')}">${document.documentElement.getAttribute('data-theme') === 'dark' ? I.sun : I.moon}</button>
        </div>
        <div class="status-line"><span class="dot ${S.refreshing ? 'busy' : hasKeys() ? '' : 'off'}"></span>${S.refreshing ? t('refreshing') : esc(upd)}</div>
      </div>`;
  }

  function renderTopbar() {
    if (S.view === 'feed' && !S.query.trim() && extraViews.feed) { document.getElementById('topbar').innerHTML = ''; return; }
    const showMonth = ['home', 'calendar', 'movies', 'tv', 'games'].includes(S.view) && !S.query;
    const monthLabel = fmtMonthYear(S.month, lang());
    const hij = S.prefs.showHijri ? `<small>${esc(hijriMonthRange(S.month, lang()))}</small>` : '';
    const isCurrent = ymOf(S.month) === ymOf(new Date());
    document.getElementById('topbar').innerHTML = `
      ${showMonth ? `<div class="month-nav">
        <button class="btn icon" data-action="month-prev" title="←">${lang() === 'ar' ? I.chevR : I.chevL}</button>
        <div class="label">${esc(monthLabel)}${hij}</div>
        <button class="btn icon" data-action="month-next" title="→">${lang() === 'ar' ? I.chevL : I.chevR}</button>
        ${isCurrent ? '' : `<button class="btn sm ghost" data-action="month-today">${t('today')}</button>`}
      </div>` : '<div></div>'}
      <div class="spacer"></div>
      <div class="search">${I.search}<input class="input" id="search-input" type="search" placeholder="${t('search_placeholder')}" value="${esc(S.query)}" autocomplete="off" spellcheck="false">${S.query ? `<button class="clear" data-action="search-clear">${I.close}</button>` : ''}</div>
      <div class="actions">
        <button class="btn icon ${S.refreshing ? 'spin' : ''}" data-action="refresh" title="${t('refresh')} (Ctrl+R)" ${S.refreshing ? 'disabled' : ''}>${I.refresh}</button>
      </div>`;
  }

  function renderProgress() {
    let el = document.getElementById('progress');
    if (!el) { el = document.createElement('div'); el.id = 'progress'; el.className = 'progress'; el.innerHTML = '<i></i>'; document.body.appendChild(el); }
    if (!S.refreshing) { el.classList.remove('indet'); el.querySelector('i').style.width = '0'; return; }
    const p = S.progress;
    if (p && p.total) { el.classList.remove('indet'); el.querySelector('i').style.width = `${Math.min(98, Math.round((p.done / p.total) * 100))}%`; }
    else el.classList.add('indet');
  }

  const extraViews = {};
  let mountedView = null;
  function renderContent() {
    const c = document.getElementById('content');
    if (mountedView && mountedView !== S.view && extraViews[mountedView] && extraViews[mountedView].unmount) { try { extraViews[mountedView].unmount(); } catch (e) { console.error(e); } mountedView = null; }
    document.body.classList.toggle('feed-mode', S.view === 'feed' && !S.query.trim());
    let html = '';
    if (S.query.trim()) html = viewSearch();
    else if (extraViews[S.view]) {
      html = extraViews[S.view].render();
      c.classList.add('custom-view');
      c.innerHTML = html;
      c.scrollTop = 0; if (c.parentElement) c.parentElement.scrollTop = 0;
      mountedView = S.view;
      if (extraViews[S.view].mount) extraViews[S.view].mount(c);
      if (S.heroTimer) { clearInterval(S.heroTimer); S.heroTimer = null; }
      bgClear();
      return;
    }
    c.classList.remove('custom-view');
    switch (S.view) {
      case 'home': html = viewHome(); break;
      case 'calendar': html = viewCalendar(); break;
      case 'movies': html = viewType('movie'); break;
      case 'tv': html = viewType('tv'); break;
      case 'games': html = viewType('game'); break;
      case 'favorites': html = viewFavorites(); break;
      case 'settings': html = viewSettings(); break;
    }
    c.innerHTML = html;
    if (S.view !== 'settings') { c.scrollTop = 0; if (c.parentElement) c.parentElement.scrollTop = 0; }
    setupHero();
    bgFromView();
  }

  // ---------- Components ----------
  function placeholder(it, big) {
    const h = hashHue(it.id);
    return `<div class="ph" style="background: linear-gradient(135deg, hsl(${h} 50% 24%), hsl(${(h + 50) % 360} 60% 42%))"><span class="glyph" style="width:${big ? 120 : 56}px;height:${big ? 120 : 56}px">${TYPE_ICON[it.type]}</span></div>`;
  }
  function imgTag(it, kind, cls) {
    const list = kind === 'poster' ? (it.posters.length ? it.posters : it.backdrops) : it.backdrops;
    if (!list.length) return placeholder(it, kind === 'hero');
    return `<img src="${esc(list[0])}" data-srcs="${esc(list.join('|'))}" data-idx="0" data-ph="${esc(it.id)}" alt="" loading="lazy" class="${cls || ''}">`;
  }
  function typeChip(it, solid) {
    return `<span class="chip ${it.type} ${solid ? 'solid' : ''}">${TYPE_ICON[it.type]}${t('type_' + it.type)}</span>`;
  }
  function countdownHtml(it, big) {
    const cd = countdown(it, region());
    const label = countdownLabel(cd, lang(), t);
    if (cd.state === 'future' || cd.state === 'tomorrow') {
      return `<div class="cd ${cd.state}"><span class="n num">${cd.days}</span><span class="l">${daysLeftLabel(cd.days)}</span></div>`;
    }
    if (cd.state === 'today') return `<div class="cd today"><span class="n">${t('countdown_today')}</span></div>`;
    return `<div class="cd ${cd.state}">${esc(label)}</div>`;
  }
  function dateLine(it) {
    const d = effectiveDate(it, region());
    if (!d) return t('countdown_tba');
    if (it.date_precision === 'month') return monthName(parseDate(d), lang()) + ' ' + parseDate(d).getFullYear();
    if (it.date_precision === 'quarter') return tf('countdown_quarter', { q: Math.floor(parseDate(d).getMonth() / 3) + 1, year: parseDate(d).getFullYear() });
    return fmtDate(d, lang(), { weekday: 'short', day: 'numeric', month: 'short' });
  }
  function ratingStars(n) {
    if (!n) return '';
    return `<div class="rating-badge">${Array.from({ length: n }, () => I.star).join('')}</div>`;
  }
  function cardHtml(it) {
    const u = userOf(it.id);
    const seasonTag = it.type === 'tv' && it.extra && it.extra.season ? `<span class="chip">${it.extra.is_new_series ? t('new_series') : `${t('season')} ${it.extra.season}`}</span>` : '';
    const doneLabel = u.status === 'done' ? `<span class="status-tag">${it.type === 'game' ? t('status_done_play') : t('status_done_watch')}</span>` : '';
    const posterMode = (S.prefs.cardStyle || 'landscape') === 'poster' && (S.prefs.view || 'grid') !== 'list';
    return `<article class="card ${u.status === 'done' ? 'done' : ''} ${posterMode ? 'poster' : ''}" data-action="open" data-id="${esc(it.id)}" data-bg="${esc(it.backdrops[0] || '')}">
      <div class="glow"></div>
      <div class="media">${imgTag(it, posterMode ? 'poster' : 'backdrop')}
        <div class="badges">${typeChip(it, true)}${seasonTag}</div>
        ${doneLabel}
        <button class="fav-btn ${u.favorite ? 'active' : ''}" data-action="fav" data-id="${esc(it.id)}" title="${u.favorite ? t('unfavorite') : t('favorite')}">${u.favorite ? I.heartFill : I.heart}</button>
        ${countdownHtml(it)}
        ${ratingStars(u.rating)}
      </div>
      <div class="body">
        <h3>${esc(title(it))}</h3>
        ${altTitle(it) ? `<div class="title-en ltr">${esc(altTitle(it))}</div>` : ''}
        <div class="meta"><span class="date">${esc(dateLine(it))}</span>${it.genres.length ? `<span class="sep">·</span><span>${esc(it.genres.slice(0, 2).map(genreLabel).join(SEP()))}</span>` : ''}${it.date_precision !== 'day' ? `<span class="sep">·</span><span>${t('date_uncertain')}</span>` : ''}</div>
        <div class="platforms">${it.platforms.slice(0, 4).map((p) => `<span>${esc(platformLabel(p))}</span>`).join('')}</div>
      </div>
    </article>`;
  }
  let rowSeq = 0;
  function sectionHtml(titleText, items, { type, seeAll, row, count } = {}) {
    if (!items.length) return '';
    const rid = `row-${++rowSeq}`;
    const arrows = row ? `<span class="row-nav"><button class="btn icon sm ghost" data-action="row-scroll" data-row="${rid}" data-dir="-1">${lang() === 'ar' ? I.chevR : I.chevL}</button><button class="btn icon sm ghost" data-action="row-scroll" data-row="${rid}" data-dir="1">${lang() === 'ar' ? I.chevL : I.chevR}</button></span>` : '';
    return `<section class="section">
      <div class="section-head"><h2 class="section-title">${type ? `<span class="dot ${type}"></span>` : ''}${esc(titleText)}${count !== undefined ? `<span class="n num">${count}</span>` : ''}</h2><div class="section-tools">${seeAll ? `<button class="link" data-action="nav" data-view="${seeAll}">${t('see_all')} ${lang() === 'ar' ? I.chevL : I.chevR}</button>` : ''}${arrows}</div></div>
      <div id="${rid}" class="${row ? 'row' : 'grid'} ${(S.prefs.cardStyle || 'landscape') === 'poster' ? 'posters' : ''}">${items.map(cardHtml).join('')}</div>
    </section>`;
  }
  function emptyHtml(icon, h, p) {
    return `<div class="empty"><div class="ic">${icon}</div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`;
  }

  // ---------- Views ----------
  function viewHome() {
    const ym = ymOf(S.month);
    const feats = featuredItems(ym);
    const isCurrent = ym === ymOf(new Date());
    const all = monthItems(ym);
    const counts = { m: monthItems(ym, 'movie').length, t: monthItems(ym, 'tv').length, g: monthItems(ym, 'game').length };
    const onboard = !hasKeys() && !S.onboardDismissed && !S.prefs.onboarded ? `<div class="onboard"><div class="ic">${I.sparkle}</div><div><h3>${t('onboarding_title')}</h3><p>${t('onboarding_body')}</p></div><div class="spacer"></div><div class="actions"><button class="btn primary" data-action="nav" data-view="settings">${I.key}${t('onboarding_cta')}</button><button class="btn ghost" data-action="onboard-dismiss">${t('onboarding_later')}</button></div></div>` : '';
    const hero = feats.length ? heroHtml(feats[Math.min(S.heroIndex, feats.length - 1)], feats) : '';
    const week = isCurrent ? weekItems() : [];
    const recent = isCurrent ? recentItems() : [];
    const weekIds = new Set(week.map((x) => x.id));
    const topOf = (type) => sortItems(all.filter((x) => x.type === type && !weekIds.has(x.id) && countdown(x, region()).state !== 'released'), 'hype').slice(0, 12);
    const topOrAll = (type) => { const u = topOf(type); return u.length ? u : sortItems(all.filter((x) => x.type === type), 'hype').slice(0, 12); };
    return `${onboard}
      ${hero}
      ${sectionHtml(t('this_week'), week, { row: true, count: week.length })}
      ${sectionHtml(t('types_movie'), topOrAll('movie'), { type: 'movie', seeAll: 'movies', row: true, count: counts.m })}
      ${sectionHtml(t('types_tv'), topOrAll('tv'), { type: 'tv', seeAll: 'tv', row: true, count: counts.t })}
      ${sectionHtml(t('types_game'), topOrAll('game'), { type: 'game', seeAll: 'games', row: true, count: counts.g })}
      ${sectionHtml(t('released_recently'), recent, { row: true })}
      ${all.length ? '' : emptyHtml(I.calendar, t('no_results'), t('no_results_hint'))}`;
  }

  function heroHtml(it, feats) {
    const u = userOf(it.id);
    const cd = countdown(it, region());
    let count;
    if (cd.state === 'future' || cd.state === 'tomorrow') count = `<div class="count"><div class="n num">${cd.days}</div><div class="l">${daysLeftLabel(cd.days)}</div><div class="d">${esc(fmtDate(effectiveDate(it, region()), lang(), { day: 'numeric', month: 'short' }))}</div></div>`;
    else if (cd.state === 'today') count = `<div class="count today"><div class="n">${t('countdown_today')}</div><div class="l">${esc(fmtDate(effectiveDate(it, region()), lang(), { day: 'numeric', month: 'short' }))}</div></div>`;
    else count = `<div class="count released"><div class="n">${esc(countdownLabel(cd, lang(), t))}</div><div class="d">${esc(dateLine(it))}</div></div>`;
    const meta = [dateLine(it), it.platforms.slice(0, 3).map(platformLabel).join(' · '), it.genres.slice(0, 3).map(genreLabel).join(SEP())].filter(Boolean);
    return `<section class="hero" data-id="${esc(it.id)}" data-bg="${esc(it.backdrops[0] || '')}">
      <div class="media">${imgTag(it, 'hero')}</div>
      ${count}
      <div class="body">
        <div class="kicker">${typeChip(it, true)}<span class="chip" style="color:#fff;border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.12)">${t('hype_' + (it.hype || 3))}</span></div>
        ${titleBlock(it, 'hero')}
        <div class="meta">${meta.map((m) => `<span>${esc(m)}</span>`).join('<span class="sep">•</span>')}</div>
        <div class="sub">${esc(overview(it))}</div>
        <div class="actions">
          <button class="btn primary" data-action="open" data-id="${esc(it.id)}">${I.info}${t('overview')}</button>
          ${it.trailer ? `<button class="btn" data-action="open-trailer" data-id="${esc(it.id)}">${I.play}${t('watch_trailer')}</button>` : ''}
          <button class="btn icon fav ${u.favorite ? 'active' : ''}" data-action="fav" data-id="${esc(it.id)}" title="${t('favorite')}">${u.favorite ? I.heartFill : I.heart}</button>
        </div>
        ${feats.length > 1 ? `<div class="hero-thumbs">${feats.map((f, i) => `<button data-action="hero-thumb" data-i="${i}" class="${f.id === it.id ? 'active' : ''}" title="${esc(title(f))}" data-id="${esc(f.id)}">${f.backdrops[0] ? `<img src="${esc(f.backdrops[0])}" data-srcs="${esc(f.backdrops.join('|'))}" data-idx="0" data-ph="${esc(f.id)}" alt="">` : placeholder(f)}</button>`).join('')}</div>` : ''}
      </div>
    </section>`;
  }

  function setupHero() {
    if (S.heroTimer) { clearInterval(S.heroTimer); S.heroTimer = null; }
    const hero = document.querySelector('.hero');
    if (!hero || S.prefs.reduceMotion) return;
    const feats = featuredItems(ymOf(S.month));
    if (feats.length < 2) return;
    S.heroTimer = setInterval(() => {
      if (document.querySelector('.hero:hover') || S.modalId) return;
      S.heroIndex = (S.heroIndex + 1) % feats.length;
      swapHero(feats);
    }, 12000);
  }
  function swapHero(feats) {
    const old = document.querySelector('.hero');
    if (!old) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = heroHtml(feats[S.heroIndex], feats);
    const fresh = wrap.firstElementChild;
    fresh.style.animation = 'fadeIn .6s ease both';
    old.replaceWith(fresh);
    bgFromView();
  }

  function viewType(type) {
    const ym = ymOf(S.month);
    const base = monthItems(ym, type);
    const list = applyFilters(base);
    const platforms = [...new Set(base.flatMap((x) => x.platforms))].sort();
    const genres = [...new Set(base.flatMap((x) => x.genres))].sort();
    const view = S.prefs.view || 'grid';
    return `<div class="page-head"><div><h1 class="page-title">${t('types_' + type)}</h1><div class="page-sub">${esc(fmtMonthYear(S.month, lang()))} · <span class="num">${base.length}</span></div></div>
      <div class="seg"><button class="${S.filters.sort === 'date' ? 'active' : ''}" data-action="sort" data-v="date">${t('sort_date')}</button><button class="${S.filters.sort === 'hype' ? 'active' : ''}" data-action="sort" data-v="hype">${t('sort_hype')}</button><button class="${S.filters.sort === 'title' ? 'active' : ''}" data-action="sort" data-v="title">${t('sort_title')}</button></div></div>
      <div class="toolbar">
        <div class="chips scroll"><button class="chip ${!S.filters.platform ? 'active' : ''}" data-action="filter-platform" data-v="">${t('all')}</button>${platforms.map((p) => `<button class="chip ${S.filters.platform === p ? 'active' : ''}" data-action="filter-platform" data-v="${esc(p)}">${esc(platformLabel(p))}</button>`).join('')}</div>
        <div class="spacer"></div>
        <select class="input" style="width:170px" data-action="filter-genre"><option value="">${t('genres')}: ${t('all')}</option>${genres.map((g) => `<option value="${esc(g)}" ${S.filters.genre === g ? 'selected' : ''}>${esc(genreLabel(g))}</option>`).join('')}</select>
        <button class="chip ${S.prefs.hideReleased ? 'active' : ''}" data-action="toggle-hide-released">${I.filter}${t('hide_released')}</button>
        <div class="seg"><button class="${view === 'grid' && (S.prefs.cardStyle || 'landscape') !== 'poster' ? 'active' : ''}" data-action="layout" data-v="grid" title="${t('view_grid')}">${I.grid}</button><button class="${view === 'grid' && S.prefs.cardStyle === 'poster' ? 'active' : ''}" data-action="layout" data-v="poster" title="${t('view_poster')}">${I.poster}</button><button class="${view === 'list' ? 'active' : ''}" data-action="layout" data-v="list" title="${t('view_list')}">${I.list}</button></div>
      </div>
      ${list.length ? `<div class="${view === 'list' ? 'list' : 'grid'} ${view !== 'list' && S.prefs.cardStyle === 'poster' ? 'posters' : ''}">${list.map(cardHtml).join('')}</div>` : emptyHtml(TYPE_ICON[type], t('no_results'), t('no_results_hint'))}`;
  }

  function viewSearch() {
    const res = searchItems(S.query);
    const groups = { movie: res.filter((x) => x.type === 'movie'), tv: res.filter((x) => x.type === 'tv'), game: res.filter((x) => x.type === 'game') };
    return `<div class="page-head"><div><h1 class="page-title">${t('search_results')}</h1><div class="page-sub">"${esc(S.query)}" · <span class="num">${res.length}</span></div></div></div>
      ${res.length ? ['movie', 'tv', 'game'].map((ty) => sectionHtml(t('types_' + ty), groups[ty], { type: ty, count: groups[ty].length })).join('') : emptyHtml(I.search, t('no_results'), t('search_hint'))}`;
  }

  function viewCalendar() {
    const y = S.month.getFullYear(), m = S.month.getMonth();
    const first = new Date(y, m, 1);
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const startDow = firstDayOfWeek(lang());
    const lead = (first.getDay() - startDow + 7) % 7;
    const todayIso = isoDate(new Date());
    const byDay = {};
    for (const it of monthItems(ymOf(S.month))) {
      if (it.date_precision !== 'day') continue;
      const d = effectiveDate(it, region());
      (byDay[d] = byDay[d] || []).push(it);
    }
    for (const k of Object.keys(byDay)) byDay[k].sort((a, b) => (b.hype - a.hype) || ((b.popularity || 0) - (a.popularity || 0)));
    const names = t('weekday_short');
    const head = Array.from({ length: 7 }, (_, i) => `<div>${names[(startDow + i) % 7]}</div>`).join('');
    const cells = [];
    const total = Math.ceil((lead + daysInMonth) / 7) * 7;
    for (let i = 0; i < total; i++) {
      const dayNum = i - lead + 1;
      const date = new Date(y, m, dayNum);
      const iso = isoDate(date);
      const other = dayNum < 1 || dayNum > daysInMonth;
      const dow = date.getDay();
      const weekend = lang() === 'ar' ? (dow === 5 || dow === 6) : (dow === 0 || dow === 6);
      const list = byDay[iso] || [];
      const expanded = S.expandedCells.has(iso);
      const shown = expanded ? list : list.slice(0, 4);
      const hij = S.prefs.showHijri && !other ? `<div class="h">${esc(hijri(date, lang(), { day: 'numeric', month: 'short' }))}</div>` : '';
      const dots = list.slice(0, 6).map((it) => `<i class="dot ${it.type}"></i>`).join('');
      cells.push(`<div class="cal-cell ${other ? 'other' : ''} ${iso === todayIso ? 'today' : ''} ${weekend ? 'weekend' : ''} ${S.selectedDay === iso ? 'selected' : ''} ${list.length ? 'has' : ''}" data-action="cal-day" data-v="${iso}">
        <div class="d num">${date.getDate()}</div>${hij}
        <div class="cal-dots">${dots}${list.length > 6 ? `<span class="num">+${list.length - 6}</span>` : ''}</div>
        ${shown.map((it) => `<button class="cal-item ${it.type}" data-action="open" data-id="${esc(it.id)}" data-bg="${esc(it.backdrops[0] || '')}" title="${esc(title(it))}">${userOf(it.id).favorite ? `<span class="fav">${I.heartFill}</span>` : ''}<span class="t">${esc(title(it))}</span></button>`).join('')}
        ${list.length > 4 && !expanded ? `<button class="cal-more" data-action="cal-expand" data-v="${iso}">${tf('more', { n: list.length - 4 })}</button>` : ''}
      </div>`);
    }
    return `<div class="page-head"><div><h1 class="page-title">${t('nav_calendar')}</h1><div class="page-sub">${esc(fmtMonthYear(S.month, lang()))}${S.prefs.showHijri ? ' · ' + esc(hijriMonthRange(S.month, lang())) : ''}</div></div>
      <div class="cal-legend"><span><i class="dot movie" style="display:inline-block;width:8px;height:8px;border-radius:50%"></i>${t('types_movie')}</span><span><i class="dot tv" style="display:inline-block;width:8px;height:8px;border-radius:50%"></i>${t('types_tv')}</span><span><i class="dot game" style="display:inline-block;width:8px;height:8px;border-radius:50%"></i>${t('types_game')}</span></div></div>
      <div class="calendar"><div class="cal-head">${head}</div><div class="cal-body">${cells.join('')}</div></div>
      ${S.selectedDay && byDay[S.selectedDay] ? `<section class="section day-list"><div class="section-head"><h2 class="section-title">${esc(fmtDate(S.selectedDay, lang()))}<span class="n num">${byDay[S.selectedDay].length}</span></h2><button class="btn icon sm ghost" data-action="cal-day" data-v="">${I.close}</button></div><div class="grid ${(S.prefs.cardStyle || 'landscape') === 'poster' ? 'posters' : ''}">${byDay[S.selectedDay].map(cardHtml).join('')}</div></section>` : ''}`;
  }

  function viewFavorites() {
    const favIds = Object.entries(S.user).filter(([, u]) => u.favorite).map(([id]) => id);
    const favs = S.items.filter((it) => favIds.includes(it.id));
    const typeF = S.filters.favType || null;
    const filtered = typeF ? favs.filter((x) => x.type === typeF) : favs;
    const upcoming = sortItems(filtered.filter((it) => countdown(it, region()).state !== 'released' && userOf(it.id).status !== 'done'), 'date');
    const released = sortItems(filtered.filter((it) => countdown(it, region()).state === 'released' && userOf(it.id).status !== 'done'), 'date').reverse();
    const done = sortItems(filtered.filter((it) => userOf(it.id).status === 'done'), 'date').reverse();
    const rated = sortItems(S.items.filter((it) => userOf(it.id).rating && !favIds.includes(it.id) && (!typeF || it.type === typeF)), 'date').reverse();
    const head = `<div class="page-head"><div><h1 class="page-title">${t('nav_favorites')}</h1><div class="page-sub">${tf('favorites_count', { n: favs.length })}</div></div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div class="seg"><button class="${!typeF ? 'active' : ''}" data-action="fav-type" data-v="">${t('all')}</button><button class="${typeF === 'movie' ? 'active' : ''}" data-action="fav-type" data-v="movie">${t('types_movie')}</button><button class="${typeF === 'tv' ? 'active' : ''}" data-action="fav-type" data-v="tv">${t('types_tv')}</button><button class="${typeF === 'game' ? 'active' : ''}" data-action="fav-type" data-v="game">${t('types_game')}</button></div>
        ${upcoming.length ? `<button class="btn" data-action="ics-all">${I.calPlus}${t('export_all_ics')}</button>` : ''}
      </div></div>`;
    if (!favs.length && !rated.length) return head + emptyHtml(I.heart, t('no_favorites'), t('no_favorites_hint'));
    return head + sectionHtml(t('upcoming_favorites'), upcoming, { count: upcoming.length }) + sectionHtml(t('released_recently'), released, {}) + sectionHtml(t('done_items'), done, {}) + sectionHtml(t('rated_items'), rated, {});
  }

  function viewSettings() {
    const p = S.prefs;
    const ks = S.keyStatus;
    const keyStat = (k) => ks[k] === 'ok' ? `<span class="key-status ok">${t('key_ok')}</span>` : ks[k] === 'invalid' ? `<span class="key-status bad">${t('key_invalid')}</span>` : ks[k] && ks[k].startsWith('error') ? `<span class="key-status bad" title="${esc(ks[k])}">${t('key_error')}</span>` : ks[k] === 'testing' ? `<span class="key-status none">…</span>` : `<span class="key-status none">${p[k + 'Key'] ? '' : t('key_missing')}</span>`;
    const sw = (key) => `<button class="switch ${p[key] ? 'on' : ''}" data-action="pref-toggle" data-k="${key}" role="switch" aria-checked="${!!p[key]}"></button>`;
    const days = [0, 1, 3, 7, 14, 30];
    return `<div class="page-head"><div><h1 class="page-title">${t('settings_title')}</h1><div class="page-sub">${t('appName')} · ${t('version')} ${esc(S.version)}</div></div></div>
    <div class="settings">
      <div class="panel"><h3>${I.key}${t('settings_data')}</h3><p class="hint">${t('settings_data_hint')}</p>
        <div class="field col"><div class="lbl"><b>${t('tmdb_key')}</b><small>${t('tmdb_key_help')}</small></div>
          <div class="key-row"><input class="input" id="tmdbKey" type="text" value="${esc(p.tmdbKey || '')}" placeholder="API Key / Read Access Token" spellcheck="false">${keyStat('tmdb')}<button class="btn sm ghost" data-action="open-url" data-url="https://www.themoviedb.org/settings/api">${I.external}${t('get_key')}</button></div></div>
        <div class="field col"><div class="lbl"><b>${t('rawg_key')}</b><small>${t('rawg_key_help')}</small></div>
          <div class="key-row"><input class="input" id="rawgKey" type="text" value="${esc(p.rawgKey || '')}" placeholder="RAWG API Key" spellcheck="false">${keyStat('rawg')}<button class="btn sm ghost" data-action="open-url" data-url="https://rawg.io/apidocs">${I.external}${t('get_key')}</button></div></div>
        <div class="field" style="border-top:0;padding-top:4px"><div class="lbl"></div><div class="ctl"><button class="btn" data-action="test-keys">${t('test_keys')}</button><button class="btn primary" data-action="save-keys">${I.check}${t('save')}</button></div></div>
      </div>
      <div class="panel"><h3>${I.settings}${t('settings_general')}</h3>
        <div class="field"><div class="lbl"><b>${t('language')}</b></div><div class="ctl"><div class="seg"><button class="${lang() === 'ar' ? 'active' : ''}" data-action="set-lang" data-v="ar">العربية</button><button class="${lang() === 'en' ? 'active' : ''}" data-action="set-lang" data-v="en">English</button></div></div></div>
        <div class="field"><div class="lbl"><b>${t('theme')}</b></div><div class="ctl"><div class="seg">${['dark', 'light', 'system'].map((v) => `<button class="${(p.theme || 'dark') === v ? 'active' : ''}" data-action="pref-set" data-k="theme" data-v="${v}">${t('theme_' + v)}</button>`).join('')}</div></div></div>
        <div class="field"><div class="lbl"><b>${t('region')}</b></div><div class="ctl"><div class="seg"><button class="${region() === 'SA' ? 'active' : ''}" data-action="pref-set" data-k="region" data-v="SA">${t('region_sa')}</button><button class="${region() === 'US' ? 'active' : ''}" data-action="pref-set" data-k="region" data-v="US">${t('region_us')}</button></div></div></div>
        <div class="field"><div class="lbl"><b>${t('card_style')}</b><small>${t('card_style_hint')}</small></div><div class="ctl"><div class="seg"><button class="${(p.cardStyle || 'landscape') === 'landscape' ? 'active' : ''}" data-action="pref-set" data-k="cardStyle" data-v="landscape">${I.grid}${t('view_grid')}</button><button class="${p.cardStyle === 'poster' ? 'active' : ''}" data-action="pref-set" data-k="cardStyle" data-v="poster">${I.poster}${t('view_poster')}</button></div></div></div>
        ${isWeb() ? `<div class="field col"><div class="lbl"><b>${t('ui_scale')}</b><small>${t('ui_scale_hint')}</small></div>
          <div class="scale-row"><span class="scale-a">A</span><input type="range" class="scale-range" data-action="ui-scale" min="0.8" max="1.4" step="0.05" value="${Number(p.uiScale) || 1}"><span class="scale-A">A</span><b class="num scale-val">${Math.round((Number(p.uiScale) || 1) * 100)}%</b><button class="btn sm ghost" data-action="ui-scale-reset">${t('reset')}</button></div></div>` : ''}
        <div class="field"><div class="lbl"><b>${t('show_hijri')}</b></div><div class="ctl">${sw('showHijri')}</div></div>
        <div class="field"><div class="lbl"><b>${t('show_logos')}</b><small>${t('show_logos_hint')}</small></div><div class="ctl">${sw('showLogos')}</div></div>
        <div class="field"><div class="lbl"><b>${t('hide_indian')}</b><small>${t('hide_indian_hint')}</small></div><div class="ctl">${sw('hideIndian')}</div></div>
        <div class="field"><div class="lbl"><b>${t('auto_backdrop')}</b></div><div class="ctl">${sw('autoBackdrop')}</div></div>
        <div class="field"><div class="lbl"><b>${t('reduce_motion')}</b></div><div class="ctl">${sw('reduceMotion')}</div></div>
      </div>
      <div class="panel"><h3>${I.refresh}${t('settings_refresh')}</h3>
        <div class="field"><div class="lbl"><b>${t('refresh_every')}</b></div><div class="ctl"><select class="input" data-action="pref-select" data-k="refreshHours">${[1, 3, 6, 12, 24].map((h) => `<option value="${h}" ${Number(p.refreshHours || 6) === h ? 'selected' : ''}>${h} ${t('hours')}</option>`).join('')}</select></div></div>
        <div class="field"><div class="lbl"><b>${t('months_ahead')}</b></div><div class="ctl"><select class="input" data-action="pref-select" data-k="monthsAhead">${[2, 3, 5, 8, 11].map((h) => `<option value="${h}" ${Number(p.monthsAhead || 5) === h ? 'selected' : ''}>${h + 1} ${t('months')}</option>`).join('')}</select></div></div>
        <div class="field"><div class="lbl"><b>${t('refresh')}</b><small>${S.updatedAt ? t('last_updated') + ': ' + esc(new Date(S.updatedAt).toLocaleString(lang() === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB')) : t('never_updated')}</small></div><div class="ctl"><button class="btn ${S.refreshing ? 'spin' : ''}" data-action="refresh" ${S.refreshing ? 'disabled' : ''}>${I.refresh}${t('refresh')}</button></div></div>
        ${S.errors && S.errors.length ? `<div class="field col"><div class="lbl"><small style="color:#ff6961">${S.errors.slice(0, 4).map(esc).join('<br>')}</small></div></div>` : ''}
      </div>
      ${isWeb() ? `<div class="panel"><h3>${I.bell}${t('settings_notifications')}</h3><p class="hint" style="margin:0">${t('web_notify_hint')}</p></div>` : `<div class="panel"><h3>${I.bell}${t('settings_notifications')}</h3>
        <div class="field"><div class="lbl"><b>${t('notify_scope')}</b></div><div class="ctl"><div class="seg">${['favorites', 'all', 'off'].map((v) => `<button class="${(p.notifyScope || 'favorites') === v ? 'active' : ''}" data-action="pref-set" data-k="notifyScope" data-v="${v}">${t('notify_' + v)}</button>`).join('')}</div></div></div>
        <div class="field"><div class="lbl"><b>${t('notify_days')}</b></div><div class="ctl day-chips">${days.map((d) => `<button class="chip ${(p.notifyDays || []).includes(d) ? 'active' : ''}" data-action="notify-day" data-v="${d}">${t('days_before_' + d)}</button>`).join('')}</div></div>
        <div class="field"><div class="lbl"><b>${t('test_notification')}</b></div><div class="ctl"><button class="btn" data-action="test-notify">${I.bell}${t('test_notification')}</button></div></div>
      </div>`}
      <div class="panel"><h3>${I.download}${t('settings_backup')}</h3>
        <div class="field"><div class="lbl"><b>${t('export_data')}</b></div><div class="ctl"><button class="btn" data-action="export">${I.download}${t('export_data')}</button><button class="btn ghost" data-action="import">${I.upload}${t('import_data')}</button></div></div>
        <div class="field"><div class="lbl"><b>${t('clear_cache')}</b><small>${t('clear_cache_hint')}</small></div><div class="ctl"><button class="btn ghost danger" data-action="clear-cache">${I.trash}${t('clear_cache')}</button></div></div>
      </div>
      <div class="panel desktop-only"><h3>${I.keyboard}${t('shortcuts')}</h3>
        <div class="kbd-list">
          <div class="kbd-row"><span>${t('shortcut_search')}</span><span><kbd>Ctrl</kbd> <kbd>F</kbd> / <kbd>/</kbd></span></div>
          <div class="kbd-row"><span>${t('shortcut_months')}</span><span><kbd>←</kbd> <kbd>→</kbd></span></div>
          <div class="kbd-row"><span>${t('shortcut_refresh')}</span><span><kbd>Ctrl</kbd> <kbd>R</kbd></span></div>
          <div class="kbd-row"><span>${t('shortcut_lang')}</span><span><kbd>Ctrl</kbd> <kbd>L</kbd></span></div>
          <div class="kbd-row"><span>${t('shortcut_close')}</span><span><kbd>Esc</kbd></span></div>
          <div class="kbd-row"><span>${t('shortcut_rate')}</span><span><kbd>1</kbd> … <kbd>5</kbd></span></div>
        </div>
      </div>
      ${isWeb() ? `<div class="panel"><h3>${I.download}${t('install_title')}</h3><p class="hint" style="margin:0">${t('install_hint')}</p></div>` : ''}
      <div class="panel"><h3>${I.info}${t('about')}</h3><p class="hint" style="margin:0">${t('about_body')}</p>
        <div class="about-logos"><span>TMDB</span><span>RAWG</span><span>Electron</span><span>${t('version')} ${esc(S.version)}</span></div></div>
    </div>`;
  }

  // ---------- Detail modal ----------
  async function openDetail(id) {
    const it = S.items.find((x) => x.id === id);
    if (!it) return;
    if (extraViews[S.view] && extraViews[S.view].pause) extraViews[S.view].pause();
    S.modalId = id; S.modalDetail = null; S.player = false;
    renderModal();
    if (it.backdrops[0]) bgSet(it.backdrops[0]);
    try {
      const d = await window.mawid.detail(id);
      if (S.modalId === id) { S.modalDetail = d; if (!S.player) renderModal(); }
    } catch (_) { /* ignore */ }
  }
  function closeModal() {
    const finish = () => {
      S.modalId = null; S.modalDetail = null; S.player = false; S.lightbox = null; renderLightbox();
      document.getElementById('modal-root').innerHTML = '';
      if (extraViews[S.view] && extraViews[S.view].resume) extraViews[S.view].resume(); else bgFromView();
    };
    const m = document.querySelector('.modal-backdrop');
    if (isWeb() && m && !S.prefs.reduceMotion) { m.classList.add('closing'); setTimeout(finish, 300); } else finish();
  }
  function currentModalItem() {
    const base = S.items.find((x) => x.id === S.modalId);
    if (!base) return null;
    return S.modalDetail ? { ...base, ...S.modalDetail, extra: { ...(base.extra || {}), ...((S.modalDetail && S.modalDetail.extra) || {}) } } : base;
  }
  function renderModal() {
    const it = currentModalItem();
    if (!it) return;
    const u = userOf(it.id);
    const cd = countdown(it, region());
    const dEff = effectiveDate(it, region());
    const dSa = it.release_date_sa, dWorld = it.release_date;
    const ex = it.extra || {};
    const isGame = it.type === 'game';
    const facts = [];
    if (it.type === 'movie') {
      if (ex.director && !(it.people && it.people.crew && it.people.crew.length)) facts.push([t('director'), ex.director]);
      if (ex.studio) facts.push([t('studio'), ex.studio]);
      if (ex.runtime) facts.push([t('runtime'), `${ex.runtime} ${t('minutes')}`]);
      if (ex.cast && ex.cast.length && !(it.people && it.people.cast && it.people.cast.length)) facts.push([t('cast'), ex.cast.slice(0, 4).join(SEP())]);
      if (ex.rating_mpaa) facts.push(['MPAA', ex.rating_mpaa]);
    } else if (it.type === 'tv') {
      if (ex.season) facts.push([t('season'), ex.is_new_series ? t('new_series') : String(ex.season)]);
      if (ex.network) facts.push([t('network'), ex.network]);
      if (ex.episodes) facts.push([t('episodes'), String(ex.episodes)]);
      if (ex.creator && !(it.people && it.people.crew && it.people.crew.length)) facts.push([t('creator'), ex.creator]);
      if (ex.cast && ex.cast.length && !(it.people && it.people.cast && it.people.cast.length)) facts.push([t('cast'), ex.cast.slice(0, 4).join(SEP())]);
      if (ex.release_pattern) facts.push([lang() === 'ar' ? 'طريقة العرض' : 'Release', ex.release_pattern === 'weekly' ? (lang() === 'ar' ? 'أسبوعي' : 'Weekly') : (lang() === 'ar' ? 'كل الحلقات دفعة واحدة' : 'All at once')]);
    } else {
      if (ex.developer) facts.push([t('developer'), ex.developer]);
      if (ex.publisher) facts.push([t('publisher'), ex.publisher]);
      if (ex.is_exclusive) facts.push([t('exclusive'), ex.is_exclusive]);
      if (ex.metacritic) facts.push([t('metacritic'), String(ex.metacritic)]);
      if (ex.early_access) facts.push(['Early Access', '✓']);
    }
    const score = it.vote_average ? `<span class="meter"><span class="bar"><i style="width:${Math.round(it.vote_average * 10)}%"></i></span>${it.vote_average.toFixed(1)}</span>` : '';
    let count;
    if (cd.state === 'future' || cd.state === 'tomorrow') count = `<div class="big-count"><div class="n num">${cd.days}</div><div class="l">${daysLeftLabel(cd.days)}</div></div>`;
    else if (cd.state === 'today') count = `<div class="big-count today"><div class="n">${t('countdown_today')}</div></div>`;
    else count = `<div class="big-count released"><div class="n">${esc(countdownLabel(cd, lang(), t))}</div></div>`;
    const hasYt = !!it.youtube_id; const hasMp4 = !!it.trailerMp4;
    const playerBar = `<div class="player-bar"><span>${t('player_fallback')}</span><button class="btn sm" data-action="open-url" data-url="${esc(it.trailer || ytSearchUrl(it))}">${I.external}${t('open_youtube')}</button><button class="btn sm ghost" data-action="stop-player">${I.close}${t('close')}</button></div>`;
    const player = S.player === 'yt' && hasYt ? `<div class="player"><iframe src="https://www.youtube-nocookie.com/embed/${esc(it.youtube_id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>${playerBar}</div>`
      : S.player === 'mp4' && hasMp4 ? `<div class="player"><video src="${esc(it.trailerMp4)}" controls autoplay></video>${playerBar}</div>` : '';
    const playBtn = !player && (hasYt || hasMp4) ? `<div class="play-big"><button data-action="play" data-v="${hasMp4 && !hasYt ? 'mp4' : 'yt'}" title="${t('watch_trailer')}">${I.play}</button></div>` : '';
    const links = [];
    if (it.tmdb_id) links.push([t('open_tmdb'), `https://www.themoviedb.org/${it.type === 'movie' ? 'movie' : 'tv'}/${it.tmdb_id}`]);
    if (it.rawg_slug || it.rawg_id) links.push([t('open_rawg'), `https://rawg.io/games/${it.rawg_slug || it.rawg_id}`]);
    if (it.steam_appid) links.push([t('open_steam'), `https://store.steampowered.com/app/${it.steam_appid}`]);
    if (ex.website || ex.homepage) links.push([t('official_site'), ex.website || ex.homepage]);
    if (it.trailer) links.push([t('open_youtube'), it.trailer]);
    if (it.source) links.push([t('source'), it.source]);
    const statusWant = isGame ? t('status_want_play') : t('status_want_watch');
    const statusDone = isGame ? t('status_done_play') : t('status_done_watch');
    const shots = it.type === 'game' ? (it.screenshots || []).slice(0, 20) : (it.screenshots || []).slice(0, 3);
    document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true">
      ${isWeb() ? '<div class="sheet-handle"><i></i></div>' : ''}
      <button class="close-btn" data-action="close-modal" title="${t('close')} (Esc)">${I.close}</button>
      <div class="modal-hero">${imgTag(it, 'hero')}${playBtn}${player}</div>
      <div class="modal-body">
        <div class="modal-main">
          <div class="kicker">${typeChip(it, true)}${it.genres.map((g) => `<span class="chip">${esc(genreLabel(g))}</span>`).join('')}${it.date_precision !== 'day' ? `<span class="chip">${I.clock}${t('date_uncertain')}</span>` : ''}</div>
          ${titleBlock(it, 'modal')}
          ${altTitle(it) ? `<div class="title-en ltr" style="text-align:${lang() === 'ar' ? 'right' : 'left'}">${esc(altTitle(it))}</div>` : ''}
          ${it.tagline ? `<div class="tagline">${esc(it.tagline)}</div>` : ''}
          <p class="overview ${overviewIsFallback(it) ? 'dim ltr' : ''}" style="${overviewIsFallback(it) ? 'text-align:left' : ''}">${esc(overview(it)) || '—'}</p>
          <div class="ctas">
            ${hasYt || hasMp4 ? `<button class="btn primary" data-action="play" data-v="${hasMp4 && !hasYt ? 'mp4' : 'yt'}">${I.play}${t('watch_trailer')}</button>` : `<button class="btn" data-action="open-url" data-url="${esc(ytSearchUrl(it))}">${I.external}${t('search_trailer')}</button>`}
            ${hasYt && hasMp4 ? `<button class="btn ghost" data-action="play" data-v="mp4">${I.play}${lang() === 'ar' ? 'عرض RAWG' : 'RAWG video'}</button>` : ''}
            <button class="btn fav ${u.favorite ? 'active' : ''}" data-action="fav" data-id="${esc(it.id)}">${u.favorite ? I.heartFill : I.heart}${u.favorite ? t('unfavorite') : t('favorite')}</button>
            ${dEff && it.date_precision === 'day' ? `<button class="btn" data-action="ics" data-id="${esc(it.id)}">${I.calPlus}${t('add_to_calendar')}</button>` : ''}
          </div>
          ${facts.length ? `<h4>${lang() === 'ar' ? 'تفاصيل' : 'Details'}</h4><div class="fact-grid">${facts.map(([k, v]) => `<div class="fact"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`).join('')}</div>` : ''}
          ${peopleHtml(it)}
          ${!it.people && !S.modalDetail && (it.tmdb_id || it.rawg_id || it.rawg_slug) && hasKeys() ? `<div class="people-row loading"><div class="skel" style="width:76px;height:76px;border-radius:50%"></div><div class="skel" style="width:76px;height:76px;border-radius:50%"></div><div class="skel" style="width:76px;height:76px;border-radius:50%"></div></div>` : ''}
          ${shots.length && it.type === 'game' ? `<h4>${t('game_screens')} <span class="n num">${shots.length}</span></h4><div class="gallery" id="gallery">${shots.map((s, i) => `<button class="shot" data-action="lightbox" data-i="${i}"><img src="${esc(s)}" alt="" loading="lazy"></button>`).join('')}</div>` : shots.length ? `<h4>${lang() === 'ar' ? 'لقطات' : 'Screenshots'}</h4><div class="screens">${shots.map((s) => `<img src="${esc(s)}" alt="" loading="lazy">`).join('')}</div>` : ''}
          ${it.type === 'game' && !shots.length && !S.modalDetail && (it.rawg_id || it.rawg_slug || it.steam_appid) ? `<div class="gallery"><div class="skel" style="width:260px;height:146px"></div><div class="skel" style="width:260px;height:146px"></div><div class="skel" style="width:260px;height:146px"></div></div>` : ''}
          <h4>${t('notes')}</h4>
          <textarea class="input" id="note-input" placeholder="${t('notes_placeholder')}" data-id="${esc(it.id)}">${esc(u.note || '')}</textarea>
          ${it.detailError ? `<p class="hint" style="color:#ff6961;font-size:12px">${esc(it.detailError)}</p>` : ''}
        </div>
        <aside class="modal-side">
          ${it.posters.length ? `<div class="poster-card"><img src="${esc(it.posters[0])}" data-srcs="${esc(it.posters.join('|'))}" data-idx="0" alt=""></div>` : ''}
          <div class="side-card">${count}
            <div class="dates">
              ${dSa && region() === 'SA' ? `<div class="r"><span>${t('release_sa')}</span><b>${esc(fmtDate(dSa, lang()))}</b></div>` : ''}
              <div class="r"><span>${dSa && region() === 'SA' ? t('release_world') : t('release_date')}</span><b>${dWorld ? esc(it.date_precision === 'day' ? fmtDate(dWorld, lang()) : dateLine({ ...it, release_date_sa: null })) : t('countdown_tba')}</b></div>
              ${dSa && region() !== 'SA' ? `<div class="r"><span>${t('release_sa')}</span><b>${esc(fmtDate(dSa, lang()))}</b></div>` : ''}
              ${S.prefs.showHijri && dEff && it.date_precision === 'day' ? `<div class="hijri">${esc(hijri(parseDate(dEff), lang()))}</div>` : ''}
              ${ex.digital_date && ex.digital_date !== dWorld ? `<div class="r"><span>${t('streaming')}</span><b>${esc(fmtDate(ex.digital_date, lang(), { day: 'numeric', month: 'short', year: 'numeric' }))}</b></div>` : ''}
            </div>
          </div>
          <div class="side-card"><div class="k">${t('platforms')}</div><div class="chips">${it.platforms.map((p) => `<span class="chip">${esc(platformLabel(p))}</span>`).join('')}${(ex.providers || []).filter((p) => !it.platforms.includes(p)).map((p) => `<span class="chip">${esc(p)}</span>`).join('')}</div></div>
          <div class="side-card"><div class="k">${t('your_rating')}</div>
            <div class="stars" id="stars">${[1, 2, 3, 4, 5].map((n) => `<button data-action="rate" data-v="${n}" class="${u.rating >= n ? 'on' : ''}" title="${n}">${I.star}</button>`).join('')}</div>
            <div class="rating-line">${u.rating ? `${u.rating}/5 · <button class="link" data-action="rate" data-v="0">${t('clear_rating')}</button>` : ''}</div>
            <div class="status-seg" style="margin-top:10px"><button class="${u.status === 'want' ? 'active' : ''}" data-action="status" data-v="want">${statusWant}</button><button class="${u.status === 'done' ? 'active' : ''}" data-action="status" data-v="done">${statusDone}</button></div>
          </div>
          <div class="side-card"><div class="k">${t('hype')} · ${it.type === 'game' ? t('rawg_rating') : t('tmdb_rating')}</div>
            <div style="display:flex;justify-content:space-between;align-items:center"><span class="hype-dots">${[1, 2, 3, 4, 5].map((n) => `<i class="${it.hype >= n ? 'on' : ''}"></i>`).join('')} <span style="font-size:12px;color:var(--text-2);margin-inline-start:6px">${t('hype_' + (it.hype || 2))}</span></span>${score || '<span style="color:var(--text-3);font-size:12px">—</span>'}</div>
          </div>
          ${links.length ? `<div class="side-card"><div class="k">${t('links')}</div><div class="links-list">${links.map(([k, u2]) => `<button data-action="open-url" data-url="${esc(u2)}">${I.external}<span>${esc(k)}</span></button>`).join('')}</div></div>` : ''}
        </aside>
      </div>
    </div></div>`;
  }

  // ---------- Lightbox ----------
  function openLightbox(i) {
    const it = currentModalItem();
    if (!it || !it.screenshots || !it.screenshots.length) return;
    S.lightbox = { list: it.screenshots.slice(0, 20), i: Math.max(0, Math.min(i, it.screenshots.length - 1)) };
    renderLightbox();
  }
  function renderLightbox() {
    let el = document.getElementById('lightbox');
    if (!S.lightbox) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.id = 'lightbox'; el.className = 'lightbox'; document.body.appendChild(el); }
    const { list, i } = S.lightbox;
    el.innerHTML = `<div class="lb-backdrop" data-action="lightbox-close"></div>
      <button class="lb-close" data-action="lightbox-close" title="${t('close')}">${I.close}</button>
      <button class="lb-nav prev" data-action="lightbox-nav" data-dir="-1">${I.chevL}</button>
      <img class="lb-img" src="${esc(list[i])}" alt="">
      <button class="lb-nav next" data-action="lightbox-nav" data-dir="1">${I.chevR}</button>
      <div class="lb-count num">${i + 1} / ${list.length}</div>
      <div class="lb-thumbs">${list.map((u, k) => `<button class="${k === i ? 'active' : ''}" data-action="lightbox-go" data-i="${k}"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>`;
    const act = el.querySelector('.lb-thumbs .active');
    if (act) act.scrollIntoView({ inline: 'center', block: 'nearest' });
  }
  function lightboxNav(d) {
    if (!S.lightbox) return;
    const n = S.lightbox.list.length;
    S.lightbox.i = (S.lightbox.i + d + n) % n;
    renderLightbox();
  }

  // ---------- Background ----------
  let bgActive = 'a';
  let bgCurrent = '';
  function bgSet(url) {
    if (!url || url === bgCurrent) return;
    bgCurrent = url;
    const im = new Image();
    im.onload = () => {
      if (bgCurrent !== url) return;
      const next = bgActive === 'a' ? 'b' : 'a';
      const elNext = document.getElementById('bg-' + next), elCur = document.getElementById('bg-' + bgActive);
      elNext.style.backgroundImage = `url("${url}")`;
      elNext.classList.add('show');
      elCur.classList.remove('show');
      bgActive = next;
    };
    im.onerror = () => { if (bgCurrent === url) { bgCurrent = ''; const u = S.items.find((x) => x.backdrops.includes(url)); if (u) { const i = u.backdrops.indexOf(url); if (u.backdrops[i + 1]) bgSet(u.backdrops[i + 1]); } } };
    im.src = url;
  }
  function bgClear() {
    bgCurrent = '';
    document.getElementById('bg-a').classList.remove('show');
    document.getElementById('bg-b').classList.remove('show');
  }
  function bgFromView() {
    if (S.modalId) return;
    const hero = document.querySelector('.hero');
    if (hero && hero.dataset.bg) return bgSet(hero.dataset.bg);
    const first = document.querySelector('[data-bg]:not([data-bg=""])');
    if (first) return bgSet(first.dataset.bg);
    bgClear();
  }
  const hoverBg = debounce((url) => { if (S.prefs.autoBackdrop !== false && !S.modalId) bgSet(url); }, 320);
  const leaveBg = debounce(() => { if (!S.modalId) bgFromView(); }, 900);

  // ---------- Toasts ----------
  function toast(msg, err) {
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'toast' + (err ? ' err' : '');
    el.innerHTML = `${err ? I.info : I.check}<span>${esc(msg)}</span>`;
    root.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 2800);
  }

  // ---------- Actions ----------
  async function reloadState() {
    const st = await window.mawid.getState();
    S.items = st.catalog.items; S.updatedAt = st.catalog.updatedAt; S.errors = st.catalog.errors || [];
  }
  async function setPrefs(patch) {
    S.prefs = await window.mawid.setPrefs(patch);
    applyPrefsToDom();
  }
  async function toggleFav(id) {
    const u = userOf(id);
    const rec = await window.mawid.setUser(id, { favorite: !u.favorite });
    if (rec) S.user[id] = rec; else delete S.user[id];
    toast(u.favorite ? t('toast_fav_removed') : t('toast_fav_added'));
    // Update UI in place
    document.querySelectorAll(`[data-action="fav"][data-id="${CSS.escape(id)}"]`).forEach((b) => {
      const on = !u.favorite;
      b.classList.toggle('active', on);
      const isFs = b.classList.contains('fs-btn');
      const label = isFs ? `<span>${(on ? t('unfavorite') : t('favorite')).split(' ')[0]}</span>` : b.classList.contains('fav') && !b.classList.contains('icon') ? (on ? t('unfavorite') : t('favorite')) : '';
      b.innerHTML = (on ? I.heartFill : I.heart) + label;
      b.title = on ? t('unfavorite') : t('favorite');
    });
    renderSidebar();
    if (S.view === 'favorites' || S.view === 'calendar') renderContent();
  }
  async function setUserPatch(id, patch) {
    const rec = await window.mawid.setUser(id, patch);
    if (rec) S.user[id] = rec; else delete S.user[id];
  }
  async function doRefresh() {
    if (S.refreshing) return;
    if (!hasKeys()) { toast(t('toast_no_keys'), true); S.view = 'settings'; S.query = ''; renderAll(); return; }
    S.refreshing = true; S.progress = null; renderSidebar(); renderTopbar(); renderProgress();
    try {
      const r = await window.mawid.refresh({ force: true });
      if (r && r.skipped) toast(t('toast_up_to_date'));
      else if (r && r.ok) toast(tf('toast_refreshed', { m: r.counts.movies, t: r.counts.tv, g: r.counts.games }));
      else toast(`${t('toast_refresh_failed')}${r && r.errors && r.errors[0] ? ': ' + r.errors[0] : ''}`, true);
    } catch (err) { toast(t('toast_refresh_failed') + ': ' + err.message, true); }
    S.refreshing = false; S.progress = null;
    renderAll();
  }
  function goMonth(delta) {
    S.month = new Date(S.month.getFullYear(), S.month.getMonth() + (delta === 0 ? 0 : delta), 1);
    if (delta === 0) S.month = firstOfMonth(new Date());
    S.heroIndex = 0; S.expandedCells = new Set(); S.filters.platform = null; S.filters.genre = null;
    renderAll();
  }
  function navigate(view) {
    S.view = view; S.query = ''; S.filters.platform = null; S.filters.genre = null;
    renderAll();
  }
  async function saveKeys() {
    const tmdbKey = (document.getElementById('tmdbKey') || {}).value || '';
    const rawgKey = (document.getElementById('rawgKey') || {}).value || '';
    const had = hasKeys();
    await setPrefs({ tmdbKey: tmdbKey.trim(), rawgKey: rawgKey.trim(), onboarded: true });
    toast(t('saved'));
    renderSidebar();
    if (hasKeys() && (!had || true)) doRefresh();
  }
  async function testKeys() {
    const tmdbKey = (document.getElementById('tmdbKey') || {}).value || '';
    const rawgKey = (document.getElementById('rawgKey') || {}).value || '';
    S.keyStatus = { tmdb: tmdbKey ? 'testing' : null, rawg: rawgKey ? 'testing' : null };
    renderContent();
    const r = await window.mawid.testKeys({ tmdbKey: tmdbKey.trim(), rawgKey: rawgKey.trim() });
    S.keyStatus = { tmdb: r.tmdb, rawg: r.rawg };
    // keep typed values
    renderContent();
    const a = document.getElementById('tmdbKey'), b = document.getElementById('rawgKey');
    if (a) a.value = tmdbKey; if (b) b.value = rawgKey;
  }

  // ---------- Events ----------
  function bindEvents() {
    document.addEventListener('click', async (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const a = el.dataset.action;
      if (a === 'close-modal' && e.target !== el && el.classList.contains('modal-backdrop')) return; // click inside modal
      const id = el.dataset.id;
      switch (a) {
        case 'nav': navigate(el.dataset.view); break;
        case 'month-prev': goMonth(-1); break;
        case 'month-next': goMonth(1); break;
        case 'month-today': goMonth(0); break;
        case 'search-clear': S.query = ''; renderAll(); break;
        case 'refresh': doRefresh(); break;
        case 'lang': await setPrefs({ lang: lang() === 'ar' ? 'en' : 'ar' }); renderAll(); break;
        case 'set-lang': await setPrefs({ lang: el.dataset.v }); renderAll(); break;
        case 'theme': { const cur = document.documentElement.getAttribute('data-theme'); await setPrefs({ theme: cur === 'dark' ? 'light' : 'dark' }); renderAll(); break; }
        case 'open': e.stopPropagation(); openDetail(id); break;
        case 'open-trailer': { e.stopPropagation(); await openDetail(id); S.player = 'yt'; renderModal(); break; }
        case 'fav': e.stopPropagation(); toggleFav(id); break;
        case 'hero-thumb': { e.stopPropagation(); S.heroIndex = Number(el.dataset.i); swapHero(featuredItems(ymOf(S.month))); setupHero(); break; }
        case 'onboard-dismiss': S.onboardDismissed = true; await setPrefs({ onboarded: true }); renderContent(); break;
        case 'sort': S.filters.sort = el.dataset.v; renderContent(); break;
        case 'filter-platform': S.filters.platform = el.dataset.v || null; renderContent(); break;
        case 'toggle-hide-released': await setPrefs({ hideReleased: !S.prefs.hideReleased }); renderContent(); break;
        case 'layout': await setPrefs(el.dataset.v === 'list' ? { view: 'list' } : { view: 'grid', cardStyle: el.dataset.v === 'poster' ? 'poster' : 'landscape' }); renderContent(); break;
        case 'fav-type': S.filters.favType = el.dataset.v || null; renderContent(); break;
        case 'cal-expand': e.stopPropagation(); S.expandedCells.add(el.dataset.v); renderContent(); break;
        case 'cal-day': { const v = el.dataset.v; S.selectedDay = S.selectedDay === v || !v ? null : v; renderContent(); if (S.selectedDay) { const dl = document.querySelector('.day-list'); if (dl) dl.scrollIntoView({ behavior: 'smooth', block: 'start' }); } break; }
        case 'close-modal': closeModal(); break;
        case 'play': S.player = el.dataset.v; renderModal(); break;
        case 'stop-player': S.player = false; renderModal(); break;
        case 'lightbox': e.stopPropagation(); openLightbox(Number(el.dataset.i)); break;
        case 'lightbox-close': S.lightbox = null; renderLightbox(); break;
        case 'lightbox-nav': lightboxNav(Number(el.dataset.dir)); break;
        case 'lightbox-go': S.lightbox.i = Number(el.dataset.i); renderLightbox(); break;
        case 'row-scroll': { const r = document.getElementById(el.dataset.row); if (r) { const dir = Number(el.dataset.dir) * (lang() === 'ar' ? -1 : 1); r.scrollBy({ left: dir * Math.max(300, r.clientWidth * 0.8), behavior: 'smooth' }); } break; }
        case 'open-url': window.mawid.openExternal(el.dataset.url); break;
        case 'rate': { const n = Number(el.dataset.v); await setUserPatch(S.modalId, { rating: n || null }); renderModal(); break; }
        case 'status': { const cur = userOf(S.modalId).status; await setUserPatch(S.modalId, { status: cur === el.dataset.v ? null : el.dataset.v }); renderModal(); break; }
        case 'ics': { const r = await window.mawid.exportIcs([id]); if (r.ok) toast(t('toast_ics')); break; }
        case 'ics-all': { const ids = Object.entries(S.user).filter(([, u]) => u.favorite).map(([k]) => k); const r = await window.mawid.exportIcs(ids); if (r.ok) toast(t('toast_ics')); break; }
        case 'ui-scale-reset': await setPrefs({ uiScale: 1 }); renderContent(); break;
        case 'pref-toggle': await setPrefs({ [el.dataset.k]: !S.prefs[el.dataset.k] }); if (el.dataset.k === 'hideIndian') await reloadState(); renderAll(); break;
        case 'pref-set': await setPrefs({ [el.dataset.k]: el.dataset.v }); renderAll(); break;
        case 'notify-day': { const d = Number(el.dataset.v); const cur = new Set(S.prefs.notifyDays || []); cur.has(d) ? cur.delete(d) : cur.add(d); await setPrefs({ notifyDays: [...cur].sort((x, y) => x - y) }); renderContent(); break; }
        case 'test-notify': window.mawid.testNotification(); break;
        case 'save-keys': saveKeys(); break;
        case 'test-keys': testKeys(); break;
        case 'export': { const r = await window.mawid.exportData(); if (r.ok) toast(t('toast_exported')); break; }
        case 'import': { const r = await window.mawid.importData(); if (r.ok) { S.user = r.user; S.prefs = r.prefs; applyPrefsToDom(); toast(tf('toast_imported', { n: r.count })); renderAll(); } else if (r.error) toast(t('toast_refresh_failed'), true); break; }
        case 'clear-cache': { const cat = await window.mawid.clearCache(); S.items = cat.items; S.updatedAt = cat.updatedAt; toast(t('toast_cache_cleared')); renderAll(); break; }
        case 'win-min': window.mawid.window.minimize(); break;
        case 'win-max': window.mawid.window.maximize(); break;
        case 'win-close': window.mawid.window.close(); break;
      }
    });

    document.addEventListener('change', async (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      if (el.dataset.action === 'filter-genre') { S.filters.genre = el.value || null; renderContent(); }
      if (el.dataset.action === 'pref-select') { await setPrefs({ [el.dataset.k]: Number(el.value) }); }
      if (el.dataset.action === 'ui-scale') { await setPrefs({ uiScale: Number(el.value) }); }
    });

    document.addEventListener('input', (e) => {
      if (e.target.dataset && e.target.dataset.action === 'ui-scale') {
        document.documentElement.style.setProperty('--ui', e.target.value);
        const v = e.target.parentElement.querySelector('.scale-val'); if (v) v.textContent = Math.round(Number(e.target.value) * 100) + '%';
        return;
      }
      if (e.target.id === 'search-input') {
        S.query = e.target.value;
        debouncedSearch();
      }
      if (e.target.id === 'note-input') debouncedNote(e.target.dataset.id, e.target.value);
    });
    const debouncedSearch = debounce(() => { renderSidebar(); renderContent(); const inp = document.getElementById('search-input'); if (inp && !inp.matches(':focus')) { /* keep */ } const clr = document.querySelector('.search .clear'); if (!clr && S.query) renderTopbarKeepFocus(); if (clr && !S.query) renderTopbarKeepFocus(); }, 180);
    const debouncedNote = debounce((id, v) => setUserPatch(id, { note: v.trim() || null }), 500);

    // Card hover → dynamic background + glow
    document.addEventListener('mouseover', (e) => {
      const card = e.target.closest('[data-bg]');
      if (card && card.dataset.bg && !card.classList.contains('hero')) hoverBg(card.dataset.bg);
    });
    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('[data-bg]');
      if (card && !card.contains(e.relatedTarget)) leaveBg();
    });
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });

    // Image fallback chain
    document.addEventListener('error', (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (img.closest('.poster-card') && Number(img.dataset.idx || 0) + 1 >= (img.dataset.srcs || '').split('|').length) { img.closest('.poster-card').remove(); return; }
      if (img.dataset.initials !== undefined) {
        const d = document.createElement('div'); d.className = 'p-ph'; d.textContent = img.dataset.initials;
        const h = Number(img.dataset.hue || 0); d.style.background = `linear-gradient(135deg,hsl(${h} 45% 30%),hsl(${(h + 40) % 360} 55% 45%))`;
        img.replaceWith(d); return;
      }
      if (img.classList.contains('title-logo')) {
        const h = document.createElement('h2'); h.className = `${img.dataset.cls}-title`; h.textContent = img.dataset.title;
        const wrap = img.closest(`.${img.dataset.cls}-logo-wrap`) || img;
        const sub = wrap.nextElementSibling; if (sub && sub.classList.contains(`${img.dataset.cls}-title-sub`)) sub.remove();
        wrap.replaceWith(h);
        return;
      }
      if (!img.dataset.srcs) return;
      const list = img.dataset.srcs.split('|');
      const idx = Number(img.dataset.idx || 0) + 1;
      if (idx < list.length) { img.dataset.idx = String(idx); img.src = list[idx]; }
      else if (img.dataset.ph) {
        const it = S.items.find((x) => x.id === img.dataset.ph);
        if (it) { const w = document.createElement('div'); w.innerHTML = placeholder(it, img.closest('.modal-hero, .hero') != null); img.replaceWith(w.firstElementChild); }
      } else img.style.visibility = 'hidden';
    }, true);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      const inField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement && document.activeElement.tagName);
      if (S.lightbox) {
        if (e.key === 'Escape') { S.lightbox = null; renderLightbox(); }
        else if (e.key === 'ArrowLeft') lightboxNav(-1);
        else if (e.key === 'ArrowRight') lightboxNav(1);
        return;
      }
      if (e.key === 'Escape') { if (S.modalId) { closeModal(); return; } if (S.query) { S.query = ''; renderAll(); return; } if (inField) document.activeElement.blur(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') { e.preventDefault(); focusSearch(); return; }
      if (!inField && e.key === '/') { e.preventDefault(); focusSearch(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') { e.preventDefault(); doRefresh(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); setPrefs({ lang: lang() === 'ar' ? 'en' : 'ar' }).then(renderAll); return; }
      if (inField || S.modalId && ['1', '2', '3', '4', '5'].includes(e.key)) {
        if (!inField && S.modalId) { setUserPatch(S.modalId, { rating: Number(e.key) }).then(renderModal); }
        return;
      }
      if (S.modalId) return;
      if (e.key === 'ArrowLeft') goMonth(lang() === 'ar' ? 1 : -1);
      if (e.key === 'ArrowRight') goMonth(lang() === 'ar' ? -1 : 1);
    });
  }
  function focusSearch() { const i = document.getElementById('search-input'); if (i) { i.focus(); i.select(); } }
  function renderTopbarKeepFocus() {
    const inp = document.getElementById('search-input');
    const had = inp && document.activeElement === inp;
    const pos = inp ? inp.selectionStart : 0;
    renderTopbar();
    if (had) { const n = document.getElementById('search-input'); n.focus(); n.setSelectionRange(pos, pos); }
  }

  window.MawidApp = {
    S, t, tf, esc, I, title, altTitle, overview, logoFor, platformLabel, genreLabel, dateLine, region, lang, userOf, isWeb, hasKeys, SEP,
    countdown: (it) => countdown(it, region()), countdownLabel: (cd) => countdownLabel(cd, lang(), t), daysLeftLabel,
    openDetail, toggleFav, setUserPatch, navigate, toast, ytSearchUrl,
    registerView: (name, def) => { extraViews[name] = def; },
    rerender: () => renderContent(),
  };
  function boot() {
    if (window.mawid && window.mawid.isWeb) document.body.classList.add('web');
    const start = () => init().catch((err) => { console.error(err); document.getElementById('content').innerHTML = `<pre style="color:#ff6961;padding:20px;user-select:text">${esc(err.stack || err.message)}</pre>`; });
    // Wait for the remaining scripts (extra views) before the first render
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
  }
  if (window.mawid) boot(); else document.addEventListener('mawid-ready', boot, { once: true });
})();
