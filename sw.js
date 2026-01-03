const CACHE_NAME = 'pl-dates-v2'; // Incrementing this forces a browser update

// List of all files to cache for offline learning
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './holiday.js',
  './cultural.js',
  './year.js',
  './phonetics.js',
  './manifest.json',
  './icon.png'
];

/**
 * Install Event: Caches all static assets.
 * This is where the Polish grammar guide and etymologies are stored locally.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Caching assets for offline Polish learning');
      return cache.addAll(ASSETS);
    })
  );
});

/**
 * Activate Event: Removes old cache versions.
 * This ensures that the new seasonal themes (Winter, Spring, etc.) are applied.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('PWA: Clearing old cache version');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

/**
 * Fetch Event: Network-First Strategy.
 * This attempts to get the latest update from GitHub first, falling back to cache if offline.
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
