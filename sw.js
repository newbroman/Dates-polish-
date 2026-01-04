const CACHE_NAME = 'pl-dates-v7.1';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './holiday.js',
  './cultural.js',
  './year.js',
  './phonetics.js',
  './numbers.js', // Added for the new written numbers module
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching all Polish Date modules');
      return cache.addAll(ASSETS);
    })
  );
});

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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
