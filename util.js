// Utilities: dates, countdowns, Hijri, formatting.
(function () {
  const DAY = 86400000;

  function parseDate(str) {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    if (!y || !m) return null;
    return new Date(y, m - 1, d || 1);
  }

  function isoDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function startOfToday() {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  // Effective release date given region preference
  function effectiveDate(item, region) {
    if (region === 'SA' && item.release_date_sa) return item.release_date_sa;
    return item.release_date;
  }

  // Countdown state for an item
  function countdown(item, region) {
    const dateStr = effectiveDate(item, region);
    const date = parseDate(dateStr);
    if (!date) return { state: 'tba', days: null };
    const today = startOfToday();
    const days = Math.round((date - today) / DAY);
    if (item.date_precision === 'month' || item.date_precision === 'quarter') {
      return { state: days < 0 ? 'released' : 'approx', days, date, precision: item.date_precision };
    }
    if (days < 0) return { state: 'released', days, date };
    if (days === 0) return { state: 'today', days: 0, date };
    const now = new Date();
    const hours = Math.max(1, Math.round((date - now) / 3600000));
    return { state: days === 1 ? 'tomorrow' : 'future', days, hours, date };
  }

  function numFmt(lang) {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-US-u-ca-gregory');
  }

  function fmtNum(n, lang) {
    return numFmt(lang).format(n);
  }

  function pluralAr(n, forms) {
    // forms: { zero, one, two, few, many, other }
    const rule = new Intl.PluralRules('ar').select(n);
    return (forms[rule] || forms.other).replace('{n}', n);
  }

  function countdownLabel(cd, lang, t) {
    if (cd.state === 'tba') return t('countdown_tba');
    if (cd.state === 'approx') {
      if (cd.precision === 'quarter') {
        const q = Math.floor(cd.date.getMonth() / 3) + 1;
        return t('countdown_quarter').replace('{q}', q).replace('{year}', cd.date.getFullYear());
      }
      return t('countdown_month').replace('{month}', monthName(cd.date, lang));
    }
    if (cd.state === 'released') {
      const ago = -cd.days;
      if (ago === 0) return t('countdown_today');
      if (lang === 'ar') {
        if (ago > 60) return t('countdown_available');
        return pluralAr(ago, { one: 'صدر أمس', two: 'صدر منذ يومين', few: 'صدر منذ {n} أيام', many: 'صدر منذ {n} يومًا', other: 'صدر منذ {n} يوم' });
      }
      if (ago > 60) return t('countdown_available');
      return ago === 1 ? 'Released yesterday' : `Released ${ago} days ago`;
    }
    if (cd.state === 'today') return t('countdown_today');
    if (cd.state === 'tomorrow') return t('countdown_tomorrow');
    if (lang === 'ar') {
      return pluralAr(cd.days, { two: 'بعد يومين', few: 'بعد {n} أيام', many: 'بعد {n} يومًا', other: 'بعد {n} يوم' });
    }
    return `In ${cd.days} days`;
  }

  function monthName(date, lang, style = 'long') {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-US-u-ca-gregory', { month: style }).format(date);
  }

  function fmtDate(dateStr, lang, opts) {
    const d = parseDate(dateStr);
    if (!d) return '';
    const o = opts || { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB-u-ca-gregory', o).format(d);
  }

  function fmtMonthYear(date, lang) {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-US-u-ca-gregory', { month: 'long', year: 'numeric' }).format(date);
  }

  function hijri(date, lang, opts) {
    try {
      const loc = lang === 'ar' ? 'ar-SA-u-ca-islamic-umalqura-nu-latn' : 'en-US-u-ca-islamic-umalqura';
      return new Intl.DateTimeFormat(loc, opts || { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    } catch (_) {
      return '';
    }
  }

  function hijriMonthRange(date, lang) {
    // Hijri months spanning a Gregorian month
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const a = hijri(first, lang, { month: 'long', year: 'numeric' });
    const b = hijri(last, lang, { month: 'long', year: 'numeric' });
    return a === b ? a : `${a} – ${b}`;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  function hashHue(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h % 360;
  }

  function sameMonth(dateStr, ym) {
    return (dateStr || '').slice(0, 7) === ym;
  }

  function ymOf(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  function firstDayOfWeek(lang) {
    try {
      const loc = new Intl.Locale(lang === 'ar' ? 'ar-SA' : 'en-US');
      const info = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo;
      if (info && info.firstDay) return info.firstDay % 7; // 7 → 0 (Sunday)
    } catch (_) {}
    return lang === 'ar' ? 0 : 1;
  }

  window.U = { DAY, parseDate, isoDate, startOfToday, effectiveDate, countdown, countdownLabel, fmtNum, fmtDate, fmtMonthYear, monthName, hijri, hijriMonthRange, escapeHtml, debounce, hashHue, sameMonth, ymOf, firstDayOfWeek, pluralAr };
})();
