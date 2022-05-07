const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./manifest.json",
    "./icons/icons-72x72.png",
    "./icons/icons-96x96.png",
    "./icons/icons-128x128.png",
    "./icons/icons-144x144.png",
    "./icons/icons-152x152.png",
    "./icons/icons-192x192.png",
    "./icons/icons-384x384.png",
    "./icons/icons-512z512.png",
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files are pre-cached succesfully');
            return cache.addAll(Files_To_CACHE);
        })
        );
        self.skipWaiting();
});

self.addEventListener('activate', evt => {
    evt.WaitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map( key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME){
                        console.log('Removing old cache data', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    )
    self.clients.claim();
});

self.addEventListener('fetch', evt => {
    if(evt.request.url.includes('/api')){
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200 ){
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            })
        );
        return;
    }

    evt.respondWith(
        caches.open(CACHE_NAME).then( cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request)
            });
        })
    )
})