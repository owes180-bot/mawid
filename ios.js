/* Mawid — iOS/PWA extras: TikTok-style vertical feed + bottom-sheet gestures */
(function () {
  'use strict';
  const A = window.MawidApp;
  if (!A) return;
  const { S, t, esc, I } = A;
  const U = window.U;

  // ---------------- Feed ----------------
  const F = { filter: 'all', items: [], activeId: null, sound: false, observer: null, ytLoading: false, root: null, tapTimer: null, lastTap: 0, resizeT: null };

  function feedItems() {
    const today = U.isoDate(new Date());
    const list = S.items.filter((it) => {
      if (F.filter !== 'all' && it.type !== F.filter) return false;
      const d = U.effectiveDate(it, A.region());
      if (!d) return false;
      const cd = A.countdown(it);
      if (cd.state === 'released' && cd.days < -5) return false; // keep last few days
      return true;
    });
    // TikTok-style discovery: most anticipated first, then soonest; titles with a trailer float up
    list.sort((a, b) => {
      const ta = a.youtube_id || a.trailerMp4 ? 0 : 1, tb = b.youtube_id || b.trailerMp4 ? 0 : 1;
      if (ta !== tb) return ta - tb;
      if ((b.hype || 0) !== (a.hype || 0)) return (b.hype || 0) - (a.hype || 0);
      const da = U.effectiveDate(a, A.region()) || '9999', db = U.effectiveDate(b, A.region()) || '9999';
      return da < db ? -1 : da > db ? 1 : 0;
    });
    // Mix types when unfiltered so the feed does not show 20 movies in a row
    if (F.filter === 'all') {
      const buckets = { movie: [], tv: [], game: [] };
      for (const it of list) buckets[it.type].push(it);
      const mixed = [];
      const order = ['movie', 'game', 'tv'];
      let guard = 0;
      while (mixed.length < list.length && guard++ < 1000) for (const ty of order) { const x = buckets[ty].shift(); if (x) mixed.push(x); }
      return mixed.slice(0, 80);
    }
    return list.slice(0, 80);
  }

  function countdownPill(it) {
    const cd = A.countdown(it);
    const label = A.countdownLabel(cd);
    if (cd.state === 'future' || cd.state === 'tomorrow') return `<div class="feed-cd"><b class="num">${cd.days}</b><span>${esc(A.daysLeftLabel(cd.days))}</span></div>`;
    if (cd.state === 'today') return `<div class="feed-cd today"><b>${t('countdown_today')}</b></div>`;
    return `<div class="feed-cd small"><span>${esc(label)}</span></div>`;
  }

  function itemHtml(it) {
    const u = A.userOf(it.id);
    const logo = A.logoFor(it);
    const title = A.title(it);
    const titleHtml = logo
      ? `<img class="feed-logo" src="${esc(logo.url)}" alt="${esc(title)}" data-title="${esc(title)}">${A.lang() === 'ar' && !logo.isAr ? `<div class="feed-title sub">${esc(title)}</div>` : ''}`
      : `<h2 class="feed-title">${esc(title)}</h2>`;
    const meta = [A.dateLine(it), it.platforms.slice(0, 2).map(A.platformLabel).join(' · '), it.genres.slice(0, 2).map(A.genreLabel).join(A.SEP())].filter(Boolean);
    const hasVideo = !!(it.youtube_id || it.trailerMp4);
    const poster = it.backdrops[0] || '';
    return `<section class="feed-item" data-id="${esc(it.id)}" data-yt="${esc(it.youtube_id || '')}" data-mp4="${esc(it.trailerMp4 || '')}" data-poster="${esc(poster)}">
      <div class="feed-media" style="background:linear-gradient(160deg,hsl(${U.hashHue(it.id)} 45% 18%),hsl(${(U.hashHue(it.id) + 50) % 360} 55% 34%))">${poster ? `<img class="feed-poster ${hasVideo ? '' : 'kb'}" src="${esc(poster)}" data-srcs="${esc(it.backdrops.join('|'))}" data-idx="0" alt="">` : ''}</div>
      <div class="feed-veil"></div>
      <div class="feed-touch" data-action="feed-tap" data-id="${esc(it.id)}"></div>
      <div class="feed-heart-burst">${I.heartFill}</div>
      <div class="feed-top"><span class="chip ${it.type} solid">${I[it.type === 'movie' ? 'film' : it.type === 'tv' ? 'tv' : 'game']}${t('type_' + it.type)}</span>${countdownPill(it)}</div>
      ${hasVideo ? `<button class="feed-playhint" data-action="feed-play" data-id="${esc(it.id)}">${I.play}<span>${t('feed_tap_play')}</span></button>` : ''}
      <div class="feed-side">
        <button class="fs-btn fav ${u.favorite ? 'active' : ''}" data-action="fav" data-id="${esc(it.id)}">${u.favorite ? I.heartFill : I.heart}<span>${u.favorite ? t('unfavorite').split(' ')[0] : t('favorite').split(' ')[0]}</span></button>
        <button class="fs-btn ${u.rating ? 'rated' : ''}" data-action="open" data-id="${esc(it.id)}">${I.star}<span>${u.rating ? `${u.rating}/5` : t('feed_rate')}</span></button>
        <button class="fs-btn" data-action="open" data-id="${esc(it.id)}">${I.info}<span>${t('feed_details')}</span></button>
        ${hasVideo ? `<button class="fs-btn sound" data-action="feed-sound">${F.sound ? soundOnIcon : soundOffIcon}<span>${F.sound ? t('feed_sound_on') : t('feed_sound_off')}</span></button>` : ''}
        <button class="fs-btn" data-action="open-url" data-url="${esc(it.trailer || A.ytSearchUrl(it))}">${I.external}<span>${t('feed_youtube')}</span></button>
      </div>
      <div class="feed-body">
        ${titleHtml}
        <div class="feed-meta">${meta.map(esc).join(' <i>•</i> ')}</div>
        <p class="feed-overview" data-action="feed-expand">${esc(A.overview(it)) || (hasVideo ? '' : t('feed_no_trailer'))}</p>
      </div>
    </section>`;
  }

  const soundOnIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  const soundOffIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M17 9l4 6M21 9l-4 6"/></svg>';

  function render() {
    F.keepId = F.activeId;
    F.items = feedItems();
    const chips = [['all', t('all')], ['movie', t('types_movie')], ['tv', t('types_tv')], ['game', t('types_game')]];
    return `<div class="feed-filters">${chips.map(([k, l]) => `<button class="chip ${F.filter === k ? 'active' : ''}" data-action="feed-filter" data-v="${k}">${l}</button>`).join('')}</div>
      <div class="feed" id="feed">${F.items.length ? F.items.map(itemHtml).join('') : `<div class="feed-item empty"><div class="empty"><div class="ic">${I.sparkle}</div><h3>${t('feed_empty')}</h3></div></div>`}</div>`;
  }

  // ---- media lifecycle ----
  function loadYT() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (F.ytPromise) return F.ytPromise;
    F.ytPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(); };
      const sc = document.createElement('script');
      sc.src = 'https://www.youtube.com/iframe_api';
      sc.onerror = () => resolve();
      document.head.appendChild(sc);
      setTimeout(resolve, 6000);
    });
    return F.ytPromise;
  }

  function sizeFrame(el, frame) {
    if (!frame) return;
    const h = el.clientHeight, w = el.clientWidth;
    const fw = Math.max(w, Math.ceil(h * 16 / 9)), fh = Math.max(h, Math.ceil(w * 9 / 16));
    frame.style.width = fw + 'px'; frame.style.height = fh + 'px';
  }

  async function mountMedia(el) {
    if (!el || el.dataset.mounted) return;
    el.dataset.mounted = '1';
    const media = el.querySelector('.feed-media');
    const mp4 = el.dataset.mp4, yt = el.dataset.yt;
    if (mp4) {
      const v = document.createElement('video');
      v.src = mp4; v.muted = !F.sound; if (!F.sound) v.setAttribute('muted', ''); v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); v.preload = 'auto';
      v.addEventListener('playing', () => el.classList.add('playing'));
      v.addEventListener('error', () => { el.classList.remove('playing'); });
      media.appendChild(v);
      el._video = v;
      if (F.activeId === el.dataset.id) playEl(el);
    } else if (yt) {
      await loadYT();
      if (!window.YT || !window.YT.Player || !el.isConnected || el._player) return;
      const holder = document.createElement('div');
      media.appendChild(holder);
      el._player = new YT.Player(holder, {
        videoId: yt,
        playerVars: { autoplay: F.activeId === el.dataset.id ? 1 : 0, mute: 1, playsinline: 1, controls: 0, rel: 0, modestbranding: 1, loop: 1, playlist: yt, iv_load_policy: 3, disablekb: 1, fs: 0, origin: location.origin },
        events: {
          onReady: (e) => {
            el._ready = true;
            const frame = e.target.getIframe(); sizeFrame(el, frame);
            if (F.sound) e.target.unMute(); else e.target.mute();
            if (F.activeId === el.dataset.id) { e.target.playVideo(); scheduleHint(el); }
          },
          onStateChange: (e) => {
            if (e.data === 1) { el.classList.add('playing'); el.classList.remove('needs-tap'); }
            if (e.data === 0 && el._player) { try { el._player.seekTo(0); el._player.playVideo(); } catch (_) {} }
          },
          onError: () => { el.classList.remove('playing'); el.classList.add('video-error'); },
        },
      });
    }
  }

  function scheduleHint(el) {
    clearTimeout(el._hintT);
    el._hintT = setTimeout(() => { if (F.activeId === el.dataset.id && !el.classList.contains('playing')) el.classList.add('needs-tap'); }, 2800);
  }

  function unmountMedia(el) {
    if (!el || !el.dataset.mounted) return;
    delete el.dataset.mounted;
    el.classList.remove('playing', 'needs-tap');
    if (el._video) { try { el._video.pause(); el._video.removeAttribute('src'); el._video.load(); } catch (_) {} el._video.remove(); el._video = null; }
    if (el._player) { try { el._player.destroy(); } catch (_) {} el._player = null; el._ready = false; }
    const media = el.querySelector('.feed-media');
    if (media) media.querySelectorAll('iframe, div:not(.feed-ph)').forEach((n) => n.remove());
  }

  function playEl(el) {
    if (!el) return;
    if (el._video) { el._video.muted = !F.sound; const p = el._video.play(); if (p && p.catch) p.catch(() => el.classList.add('needs-tap')); }
    else if (el._player && el._ready) { try { if (F.sound) el._player.unMute(); else el._player.mute(); el._player.playVideo(); } catch (_) {} scheduleHint(el); }
    else if (el.dataset.yt || el.dataset.mp4) mountMedia(el);
  }
  function pauseEl(el) {
    if (!el) return;
    if (el._video) { try { el._video.pause(); } catch (_) {} }
    if (el._player && el._ready) { try { el._player.pauseVideo(); } catch (_) {} }
  }

  function activate(el) {
    if (!el) return;
    const id = el.dataset.id;
    if (F.activeId === id) return;
    F.activeId = id;
    const all = [...document.querySelectorAll('.feed-item')];
    const idx = all.indexOf(el);
    all.forEach((x, i) => {
      if (Math.abs(i - idx) > 1) unmountMedia(x);
      else if (i !== idx) { mountMedia(x); pauseEl(x); }
    });
    mountMedia(el);
    playEl(el);
  }

  function mount(container) {
    F.root = container.querySelector('#feed');
    if (!F.root) return;
    F.observer = new IntersectionObserver((entries) => {
      let best = null;
      for (const en of entries) if (en.isIntersecting && en.intersectionRatio >= 0.6) best = en.target;
      if (best) activate(best);
    }, { root: F.root, threshold: [0.6] });
    F.root.querySelectorAll('.feed-item').forEach((el) => F.observer.observe(el));
    F.activeId = null;
    const keep = F.keepId ? F.root.querySelector(`.feed-item[data-id="${CSS.escape(F.keepId)}"]`) : null;
    F.keepId = null;
    const first = keep || F.root.querySelector('.feed-item');
    if (keep) keep.scrollIntoView({ block: 'start' });
    if (first) activate(first);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
  }
  function unmount() {
    if (F.observer) { F.observer.disconnect(); F.observer = null; }
    document.querySelectorAll('.feed-item').forEach(unmountMedia);
    F.activeId = null;
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
  }
  function pause() { const el = activeEl(); if (el) pauseEl(el); }
  function resume() { const el = activeEl(); if (el) playEl(el); }
  function activeEl() { return F.activeId ? document.querySelector(`.feed-item[data-id="${CSS.escape(F.activeId)}"]`) : null; }
  function onVis() { if (document.hidden) pause(); else if (!S.modalId) resume(); }
  function onResize() { clearTimeout(F.resizeT); F.resizeT = setTimeout(() => { document.querySelectorAll('.feed-item').forEach((el) => { if (el._player && el._ready) sizeFrame(el, el._player.getIframe()); }); }, 150); }

  function setSound(on) {
    F.sound = on;
    document.querySelectorAll('.feed-item').forEach((el) => {
      if (el._video) { el._video.muted = !on; if (on) el._video.removeAttribute('muted'); else el._video.setAttribute('muted', ''); }
      if (el._player && el._ready) { try { on ? el._player.unMute() : el._player.mute(); } catch (_) {} }
      const b = el.querySelector('.fs-btn.sound');
      if (b) b.innerHTML = `${on ? soundOnIcon : soundOffIcon}<span>${on ? t('feed_sound_on') : t('feed_sound_off')}</span>`;
    });
    const el = activeEl();
    if (el) { const flash = document.createElement('div'); flash.className = 'feed-flash'; flash.innerHTML = on ? soundOnIcon : soundOffIcon; el.appendChild(flash); setTimeout(() => flash.remove(), 700); }
  }

  function heartBurst(el) {
    const b = el.querySelector('.feed-heart-burst');
    if (!b) return;
    b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
  }

  A.registerView('feed', { render, mount, unmount, pause, resume });

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    switch (el.dataset.action) {
      case 'feed-filter': F.filter = el.dataset.v; A.rerender(); break;
      case 'feed-sound': e.stopPropagation(); setSound(!F.sound); break;
      case 'feed-play': { e.stopPropagation(); const item = el.closest('.feed-item'); item.classList.remove('needs-tap'); playEl(item); break; }
      case 'feed-expand': { e.stopPropagation(); el.classList.toggle('open'); break; }
      case 'feed-tap': {
        e.stopPropagation();
        const item = el.closest('.feed-item');
        const now = Date.now();
        if (now - F.lastTap < 320) { // double tap → favorite
          clearTimeout(F.tapTimer); F.lastTap = 0;
          heartBurst(item);
          if (!A.userOf(item.dataset.id).favorite) A.toggleFav(item.dataset.id);
        } else {
          F.lastTap = now;
          F.tapTimer = setTimeout(() => { if (item.classList.contains('needs-tap')) { item.classList.remove('needs-tap'); playEl(item); } else if (item.dataset.yt || item.dataset.mp4) setSound(!F.sound); }, 330);
        }
        break;
      }
    }
  });
  // logo fallback → title text
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.classList.contains('feed-logo')) return;
    const h = document.createElement('h2'); h.className = 'feed-title'; h.textContent = img.dataset.title;
    const sub = img.nextElementSibling; if (sub && sub.classList.contains('sub')) sub.remove();
    img.replaceWith(h);
  }, true);

  // ---------------- Bottom sheet gestures ----------------
  let drag = null;
  document.addEventListener('touchstart', (e) => {
    const modal = e.target.closest('.modal');
    if (!modal || S.lightbox) return;
    const onHandle = !!e.target.closest('.sheet-handle, .modal-hero');
    if (modal.scrollTop > 0 && !onHandle) return;
    drag = { y: e.touches[0].clientY, modal, moved: 0, active: onHandle || modal.scrollTop <= 0 };
    modal.style.transition = 'none';
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (!drag) return;
    const dy = e.touches[0].clientY - drag.y;
    if (dy <= 0 || drag.modal.scrollTop > 0) { drag.moved = 0; drag.modal.style.transform = ''; return; }
    drag.moved = dy;
    drag.modal.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (!drag) return;
    const m = drag.modal, dy = drag.moved;
    drag = null;
    m.style.transition = '';
    if (dy > 110) { m.style.transform = 'translateY(100%)'; setTimeout(() => { const btn = document.querySelector('.modal .close-btn'); if (btn) btn.click(); }, 120); }
    else m.style.transform = '';
  });
})();
