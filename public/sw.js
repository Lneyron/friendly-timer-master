
// This is the service worker with the combined offline experience (Offline copy of pages)

const CACHE = "friendly-timer-offline";

// Variables to customize the delay. Increase the delay if needed.
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        OFFLINE_URL,
        "/",
        "/index.html",
        "/manifest.json",
        "/icon-192x192.png",
        "/icon-512x512.png"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.mode === "navigate" || 
      (event.request.method === "GET" && 
       event.request.headers.get("accept").includes("text/html"))) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          return caches.open(CACHE).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});

// This handles push notifications if they become available in the future
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'Timer notification!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Friendly Timer', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
