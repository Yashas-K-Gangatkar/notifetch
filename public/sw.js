const CACHE_NAME = 'notifetch-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.svg',
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

  // Skip API calls entirely — never cache authenticated responses
  // This prevents session data leakage between users on the same device
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(cacheFirst(request));
});

/**
 * Network-first: try network, fall back to cache.
 * Good for API calls where fresh data is preferred.
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline', message: 'No cached data available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
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

// ─── Background Sync ────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-orders') {
    console.log('[SW] Syncing offline orders');
    event.waitUntil(syncOfflineOrders());
  }
});

async function syncOfflineOrders() {
  try {
    // Retrieve pending orders from IndexedDB
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
          // Remove successfully synced order from IndexedDB
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

/**
 * Minimal IndexedDB helper using raw IDB API
 */
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
//
// Handles push events from Firebase Cloud Messaging (FCM).
// FCM sends two types of payloads:
//   1. "notification" payload — auto-displayed by the browser (we can't customize)
//   2. "data" payload — we handle manually and show custom notification
//
// When the server sends both notification + data, the browser auto-displays the
// notification part. When only data is sent, we have full control.
// Our server-side (firebase-admin) sends both, so the browser handles display,
// but we also handle data-only messages for flexibility.

self.addEventListener('push', (event) => {
  // Default notification data
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

      // FCM can send data in different formats:
      // 1. Direct data payload: { title, body, ... }
      // 2. FCM wrapper: { data: { ... }, notification: { title, body } }
      // 3. FCM background: { data: { ... } }

      if (payload.data && typeof payload.data === 'object') {
        // FCM data payload — merge into our data object
        data = {
          ...data,
          ...payload.data,
          // Data payload values are always strings in FCM, keep as-is
        };

        // If there's also a notification payload, prefer its title/body
        if (payload.notification) {
          if (payload.notification.title) data.title = payload.notification.title;
          if (payload.notification.body) data.body = payload.notification.body;
        }
      } else {
        // Direct payload (non-FCM wrapped)
        data = { ...data, ...payload };
      }
    } catch (e) {
      // If JSON parsing fails, treat as plain text
      data.body = event.data.text();
    }
  }

  // Build notification options
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
    actions: [],
    tag: data.orderId || undefined, // Group notifications by order ID
    renotify: true, // Re-notify even if tag matches
  };

  // Add context-specific actions based on notification type
  if (data.type === 'order' || data.orderId) {
    options.actions = [
      { action: 'view', title: 'View Order' },
      { action: 'dismiss', title: 'Dismiss' },
    ];
  } else if (data.type === 'test') {
    options.actions = [
      { action: 'view', title: 'Open NotiFetch' },
      { action: 'dismiss', title: 'Dismiss' },
    ];
  } else {
    options.actions = [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ];
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ─── Notification Click ─────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Dismiss action — do nothing
  if (event.action === 'dismiss') return;

  // Determine the URL to open based on notification data
  const notificationData = event.notification.data || {};
  let urlToOpen = notificationData.url || '/';

  // Build contextual deep links based on notification type
  if (notificationData.type === 'order' && notificationData.orderId) {
    urlToOpen = `/?orderId=${encodeURIComponent(notificationData.orderId)}`;
  } else if (notificationData.type === 'test') {
    urlToOpen = '/';
  }

  // Ensure URL is relative to the origin
  if (urlToOpen.startsWith('http')) {
    try {
      const parsedUrl = new URL(urlToOpen);
      // Only allow same-origin URLs
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
      // Focus an existing window if one is open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(urlToOpen);
    })
  );
});

// ─── Push Subscription Change ───────────────────────────────────────────────
// When the push subscription changes (e.g., browser updates the endpoint),
// we should notify the server so it can update the FCM token.
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
