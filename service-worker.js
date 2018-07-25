importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.staleWhileRevalidate(),
);

workbox.routing.registerRoute(
  'https://unpkg.com/vue',
  workbox.strategies.staleWhileRevalidate(),
);

self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.json()}"`);

  const data = event.data.json();

  const { text, day } = data;
  const image = `/img/${day.isShopping ? 'cart' : 'family'}-192-transparent.png`;
  
  event.waitUntil(
    self.registration.showNotification('Niedziele handlowe', {
      body: text,
      vibrate: [100, 50, 100],
      badge: image,
      icon: image,
      requireInteraction: true,
      data,
    })
  );
});

async function openApp(data) {
  const openWindows = await clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  const client = await (openWindows.length ?
    openWindows[0].focus() :
    clients.openWindow('/'));

  client.postMessage({ type: 'notification-received', data });
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(openApp(event.notification.data));
});
