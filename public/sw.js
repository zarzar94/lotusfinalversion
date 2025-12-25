/**
 * Service Worker - Offline caching and performance optimization
 */

const CACHE_NAME = 'lotus-ait-v1';
const STATIC_CACHE = 'lotus-static-v1';
const API_CACHE = 'lotus-api-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/fonts/Cairo-Regular.ttf',
  '/fonts/Cairo-Bold.ttf',
];

// API routes to cache
const CACHEABLE_API_ROUTES = [
  '/api/gamification/leaderboard',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET responses for cacheable routes
          if (response.ok && CACHEABLE_API_ROUTES.some(route => url.pathname.includes(route))) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached and update in background
        event.waitUntil(
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, response);
              });
            }
          }).catch(() => {})
        );
        return cachedResponse;
      }

      // Not in cache, fetch and cache
      return fetch(request).then((response) => {
        if (response.ok && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.woff2'))) {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Background sync for offline mutations
const OFFLINE_SYNC_TAG = 'sync-data';
const OFFLINE_QUEUE_DB = 'lotus_offline_queue_db';
const OFFLINE_QUEUE_STORE = 'offline_queue';

self.addEventListener('sync', (event) => {
  if (event.tag === OFFLINE_SYNC_TAG) {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  if (clients.length) {
    await Promise.all(
      clients.map((client) => {
        return new Promise((resolve) => {
          const channel = new MessageChannel();
          const timeout = setTimeout(resolve, 4000);
          channel.port1.onmessage = () => {
            clearTimeout(timeout);
            resolve();
          };
          client.postMessage({ type: 'SYNC_OFFLINE_QUEUE' }, [channel.port2]);
        });
      })
    );
    return;
  }

  await processOfflineQueueInWorker();
}

const openQueueDb = () => {
  return new Promise((resolve, reject) => {
    if (!self.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = self.indexedDB.open(OFFLINE_QUEUE_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OFFLINE_QUEUE_STORE)) {
        db.createObjectStore(OFFLINE_QUEUE_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open offline queue DB'));
  });
};

const getQueuedRequests = async () => {
  const db = await openQueueDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readonly');
    const store = tx.objectStore(OFFLINE_QUEUE_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error || new Error('Failed to read offline queue'));
  });
};

const overwriteQueuedRequests = async (items) => {
  const db = await openQueueDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(OFFLINE_QUEUE_STORE);
    store.clear();
    items.forEach((item) => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Failed to update offline queue'));
    tx.onabort = () => reject(tx.error || new Error('Failed to update offline queue'));
  });
};

const processOfflineQueueInWorker = async () => {
  const queue = await getQueuedRequests();
  if (!queue.length) return;

  const failed = [];
  for (const request of queue) {
    try {
      const baseUrl = request.baseUrl || '';
      const headers = { 'Content-Type': 'application/json' };
      if (!request.skipAuth && request.token) {
        headers['Authorization'] = `Bearer ${request.token}`;
      }
      const response = await fetch(`${baseUrl}${request.endpoint}`, {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch {
      failed.push(request);
    }
  }

  await overwriteQueuedRequests(failed);
};

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo192.png',
      badge: '/badge.png',
    });
  }
});
