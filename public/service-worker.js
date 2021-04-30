const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/style.css',
    '/dist/app.bundle.js',
    '/dist/indexDb.bundle.js',
    // "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    // "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

const ASSETS_CACHE_NAME = 'assets-cache-v1';

const RUNTIME_CACHE_NAME = 'runtime-cache-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(ASSETS_CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)).then(self.skipWaiting())
    )
})
self.addEventListener('activate', (event) => {
    const myCaches = [ASSETS_CACHE_NAME, RUNTIME_CACHE_NAME];
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !myCaches.keys(cacheName))
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete)
                    })
                )
            })
            .then(() => self.clients.claim())
    )
})
self.addEventListener('fetch', (event) => {
    if(event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if(response){
                    return response;
                }
                return caches.open(RUNTIME_CACHE_NAME)
                .then((cache) => {
                    return fetch(event.request).then((response) => {
                        return cache.put(event.request, response.clone()).then(() => {
                            return response
                        })
                    })
                })
            })
        )
    }
})