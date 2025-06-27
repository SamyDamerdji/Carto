self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
});

self.addEventListener('fetch', (event) => {
  // A basic fetch handler to make the app installable.
  // This does not provide offline functionality.
});
