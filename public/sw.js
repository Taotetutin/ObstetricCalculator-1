const CACHE_NAME = 'obsterix-legend-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/generated-icon.png',
  '/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png',
  '/src/index.css',
  '/src/main.tsx'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
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

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline data synchronization
  return new Promise(resolve => {
    // Sync calculations when back online
    resolve();
  });
}

// Push notifications for medical reminders
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva información médica disponible',
    icon: '/generated-icon.png',
    badge: '/generated-icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir ObsteriX',
        icon: '/generated-icon.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/generated-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ObsteriX Legend', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});