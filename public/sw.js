// This is a basic service worker file for PWA capabilities
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handler
  event.respondWith(fetch(event.request));
});
