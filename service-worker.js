// కాష్ పేరును v2 నుండి v3 కు మార్చబడింది.
// మీరు యాప్‌లో మార్పులు చేసిన ప్రతిసారీ ఈ నంబర్‌ను పెంచండి.
const CACHE_NAME = 'speakpro-glass-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html', // మీరు jjjhhg.html పేరును index.html గా మార్చారని నిర్ధారించుకోండి
  './manifest.json',
  './1000094592.jpg',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@phosphor-icons/web',
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Ramabhadra&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting(); // కొత్త సర్వీస్ వర్కర్‌ను వెంటనే యాక్టివేట్ చేస్తుంది
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // కాష్‌లో ఉంటే కాష్ నుండి, లేకపోతే నెట్‌వర్క్ నుండి ఫెచ్ చేస్తుంది
      return response || fetch(event.request);
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  // పాత కాష్‌లను (v2 వంటివి) తొలగిస్తుంది
  const cacheWhitelist = [CACHE_NAME]; // v3 ని మాత్రమే ఉంచుతుంది
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

