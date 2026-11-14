// Tennis Scorer service worker – cache-first app shell, works offline after first load.
// Bump VERSION when any shell file changes so clients pick up the update.
const VERSION = 'v7';
const CACHE = 'tennis-scorer-' + VERSION;
const SHELL = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('tennis-scorer-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Pages: network first (so updates show up right away), cached copy when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(new Request(req.url, { cache: 'no-store' })).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => { c.put('./', copy.clone()); c.put('./index.html', copy); }); }
        return res;
      }).catch(() => caches.match('./index.html').then(h => h || caches.match('./')))
    );
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
    })
  );
});
