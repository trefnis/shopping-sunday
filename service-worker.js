importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

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
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
  event.waitUntil(
    self.registration.showNotification('Hello world1', {
      body: 'push push noti noti',
    })
  );
});
