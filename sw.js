/* Mawid service worker — app shell offline + opportunistic image cache */
const VERSION = '1.3.1-mtvt2kws';
const SHELL = `mawid-shell-${VERSION}`;
const IMAGES = 'mawid-images-v1';
const SHELL_FILES = [
  './', './index.html', './styles.css', './mobile.css', './i18n.js', './util.js', './app.js', './ios.js', './bridge.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
  './fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2', './fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2',
  './fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2', './fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2',
  './fonts/ibm-plex-sans-arabic-latin-400-normal.woff2', './fonts/ibm-plex-sans-arabic-latin-500-normal.woff2',
  './fonts/ibm-plex-sans-arabic-latin-600-normal.woff2', './fonts/ibm-plex-sans-arabic-latin-700-normal.woff2',
  './fonts/inter-latin-wght-normal.woff2', './fonts/inter-latin-ext-wght-normal.woff2',
];
const IMAGE_HOSTS = ['image.tmdb.org', 'media.rawg.io', 'cdn.cloudflare.steamstatic.com', 'i.ytimg.com', 'shared.cloudflare.steamstatic.com'];
const MAX_IMAGES = 600;

self.addEventListener('install', (event) => {
  // Precache what exists; a missing optional file (a font, an icon) must not break offline support
  event.waitUntil(caches.open(SHELL).then((c) => Promise.allSettled(SHELL_FILES.map((f) => c.add(f).catch(() => null)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('mawid-shell-') && k !== SHELL).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function trimImages() {
  try {
    const cache = await caches.open(IMAGES);
    const keys = await cache.keys();
    if (keys.length > MAX_IMAGES) {
      for (const req of keys.slice(0, keys.length - MAX_IMAGES)) await cache.delete(req);
    }
  } catch (_) { /* ignore */ }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // App shell: cache first, then network (and refresh the cache)
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(SHELL);
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
      return cached || (await network) || new Response('offline', { status: 503 });
    })());
    return;
  }

  // Artwork: stale-while-revalidate with a bounded cache
  if (IMAGE_HOSTS.includes(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(IMAGES);
      const cached = await cache.match(req);
      const network = fetch(req, { mode: 'no-cors' }).then((res) => { if (res) { cache.put(req, res.clone()); trimImages(); } return res; }).catch(() => null);
      return cached || (await network) || Response.error();
    })());
  }
});
