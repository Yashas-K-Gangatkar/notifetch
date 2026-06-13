const CACHE_NAME = 'notifetch-v3';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.svg',
  '/qr-code.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.png',
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// ─── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Skip API calls entirely — NEVER cache authenticated/private responses
  // This prevents session data leakage between users on the same device
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkOnly(request));
    return;
  }

  // For navigation requests (HTML), use network-first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Cache-first strategy for static assets (images, CSS, JS, fonts)
  event.respondWith(cacheFirst(request));
});

/**
 * Network-only: always fetch from network, never cache.
 * Used for API calls to prevent data leakage between users.
 */
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Offline', message: 'No network connection available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Network-first: try network, fall back to cache.
 * Good for HTML pages where fresh content is preferred.
 */
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for navigation, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline fallback page
    return new Response(offlinePage(), {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

/**
 * Cache-first: try cache, fall back to network.
 * Good for static assets that rarely change.
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache and network both failed:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Offline fallback HTML page
 */
function offlinePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NotiFetch - Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #fafafa;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }
    .container { max-width: 400px; }
    .icon { font-size: 64px; margin-bottom: 20px; }
    h1 { font-size: 24px; margin-bottom: 12px; color: #f59e0b; }
    p { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 20px; }
    button {
      background: linear-gradient(to right, #f59e0b, #ea580c);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>You're Offline</h1>
    <p>NotiFetch needs an internet connection to load the latest notifications. Check your connection and try again.</p>
    <button onclick="window.location.reload()">Try Again</button>
  </div>
</body>
</html>`;
}

// ─── Message handler (for skip waiting) ─────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ─── Background Sync ────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-orders') {
    console.log('[SW] Syncing offline orders');
    event.waitUntil(syncOfflineOrders());
  }
});

async function syncOfflineOrders() {
  try {
    const db = await openDB();
    const tx = db.transaction('offline-orders', 'readonly');
    const store = tx.objectStore('offline-orders');
    const orders = await idbRequestToPromise(store.getAll());

    for (const order of orders) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });

        if (response.ok) {
          const deleteTx = db.transaction('offline-orders', 'readwrite');
          const deleteStore = deleteTx.objectStore('offline-orders');
          deleteStore.delete(order.id);
          await idbRequestToPromise(deleteTx.done);
          console.log('[SW] Synced order:', order.id);
        }
      } catch (err) {
        console.error('[SW] Failed to sync order:', order.id, err);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('notifetch-offline', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-orders')) {
        db.createObjectStore('offline-orders', { keyPath: 'id' });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

function idbRequestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ─── Push Notifications ─────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = {
    title: 'NotiFetch',
    body: 'You have a new update!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    url: '/',
    type: 'general',
    orderId: null,
    platform: null,
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      if (payload.data && typeof payload.data === 'object') {
        data = { ...data, ...payload.data };
        if (payload.notification) {
          if (payload.notification.title) data.title = payload.notification.title;
          if (payload.notification.body) data.body = payload.notification.body;
        }
      } else {
        data = { ...data, ...payload };
      }
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      type: data.type || 'general',
      orderId: data.orderId || null,
      platform: data.platform || null,
      timestamp: data.timestamp || Date.now().toString(),
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    tag: data.orderId || undefined,
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ─── Notification Click ─────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const notificationData = event.notification.data || {};
  let urlToOpen = notificationData.url || '/';

  if (urlToOpen.startsWith('http')) {
    try {
      const parsedUrl = new URL(urlToOpen);
      if (parsedUrl.origin !== self.location.origin) {
        urlToOpen = '/';
      } else {
        urlToOpen = parsedUrl.pathname + parsedUrl.search;
      }
    } catch {
      urlToOpen = '/';
    }
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      return self.clients.openWindow(urlToOpen);
    })
  );
});

// ─── Push Subscription Change ───────────────────────────────────────────────
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] Push subscription changed');
  event.waitUntil(
    fetch('/api/notifications/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fcmToken: event.newSubscription ? JSON.stringify(event.newSubscription) : null,
        subscriptionChanged: true,
      }),
    }).catch((err) => {
      console.error('[SW] Failed to update push subscription on server:', err);
    })
  );
});
