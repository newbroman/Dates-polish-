const CACHE_NAME = 'pl-dates-v1';

// List of assets to be cached for offline use
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './holiday.js',
  './cultural.js', // This is the file you just updated
  './year.js',
  './phonetics.js',
  './manifest.json',
  './icon.png'
];

/**
 * Install Event: Caches all static assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Caching all assets for offline use');
      return cache.addAll(ASSETS);
    })
  );
});

/**
 * Activate Event: Cleans up old caches if the version changes
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('PWA: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

/**
 * Fetch Event: Serves assets from cache when offline
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached file, or fetch from network if not in cache
      return response || fetch(event.request);
    })
  );
});
