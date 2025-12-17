// Service Worker pour PWA
const CACHE_NAME = 'avanpass-v2.1.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/programmes.css',
  '/js/app.js',
  '/js/api.js',
  '/js/auth.js',
  '/js/utils.js',
  '/js/client.js',
  '/js/client-programmes.js',
  '/js/commercant.js',
  '/js/admin.js',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes - Network First pour les fichiers JS/CSS
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Pour les fichiers JS et CSS : Network First (toujours récupérer la dernière version)
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre en cache la nouvelle version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // En cas d'erreur réseau, utiliser le cache
          return caches.match(event.request);
        })
    );
  } else {
    // Pour les autres fichiers : Cache First
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
