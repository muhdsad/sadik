const CACHE_NAME = 'sadik-hub-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './scripts.js',
  './logo.png',
  './txt.jpg',
  './adiyath.jpg',
  './icon-192.png',
  './icon-512.png',
  './manifest.webmanifest',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only intercept same-origin requests or local assets; let external app/iframes load normally
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((networkResponse) => {
          return networkResponse;
        });
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
    );
  }
});
