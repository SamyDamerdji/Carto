// This is a basic service worker file.
// It's required for the app to be installable (PWA).

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  // Basic fetch event handler
  event.respondWith(fetch(event.request));
});
