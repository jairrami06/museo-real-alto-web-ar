const CACHE_NAME = 'webar-base-v2';
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/i18n.json',
    '/i18n/es.json',
    '/i18n/en.json',
    '/i18n/fr.json',
    '/src/js/app.js',
    '/public/images/home.webp',
    '/public/images/icon.svg',
    '/public/images/icon-maskable.svg',
    '/public/assets/markers/pattern-marcador-1.patt',
    '/public/assets/markers/pattern-marcador-2.patt',
    '/public/assets/overlays/estacion-1.svg',
    '/public/assets/overlays/estacion-2.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
                }

                return networkResponse;
            }).catch(() => caches.match('/index.html'));
        })
    );
});
