// sw.js – caches the core assets for offline use
const CACHE = 'iptv-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  // include only if you have uploaded the icon
  './icon-192.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  // Only handle GET requests for same-origin resources
  if (e.request.method !== 'GET' || !e.request.url.startsWith(location.origin)) return;

  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request).then(resp => {
        // Cache the response for future offline use
        return caches.open(CACHE).then(cache => {
          cache.put(e.request, resp.clone());
          return resp;
        });
      }))
  );
};
