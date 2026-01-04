const CACHE_NAME = 'pl-dates-v5';

// List of all assets to be cached for offline use
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './holiday.js',
  './cultural.js',
  './year.js',
  './phonetics.js', // Added the new phonetics module
  './manifest.json',
  './icon.png'
];

// Install Event: Cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event: Clear old caches (v1 through v4)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch Event: Try network first, fall back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
