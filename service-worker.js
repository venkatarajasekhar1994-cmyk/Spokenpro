// Cache Name Updated to SpokenPro
const CACHE_NAME = 'spokenpro-v1';

// Main App Files to Cache Immediately (App Shell)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  
  // Data Files (వీటిని కూడా యాడ్ చేశాను)
  './notes.js',
  './diagram_data.js',
  './static_data.js',

  // External Libraries
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@phosphor-icons/web',
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Ramabhadra&display=swap'
];

// 1. Install Event (మొదటిసారి యాప్ లోడ్ అయినప్పుడు ఈ ఫైల్స్ సేవ్ అవుతాయి)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache: ' + CACHE_NAME);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fetch Event (ఏదైనా ఫైల్ కావాల్సి వచ్చినప్పుడు ఇక్కడ చెక్ చేస్తుంది)
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // A. IMAGE CACHING STRATEGY (ఇమేజెస్ కోసం ప్రత్యేక రూల్)
  // ఎప్పుడైనా 'images' ఫోల్డర్ నుండి ఏదైనా అడిగితే, దాన్ని డౌన్లోడ్ చేసి సేవ్ చేసుకుంటుంది.
  if (requestUrl.pathname.includes('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          // Cache లో ఉంటే అక్కడి నుండి ఇస్తుంది, లేకపోతే నెట్ నుండి తెచ్చి Cache లో పెడుతుంది
          return response || fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return; // ఇమేజ్ అయితే ఇక్కడితో అయిపోతుంది
  }

  // B. GENERAL STRATEGY (మిగిలిన ఫైల్స్ కోసం)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 3. Activate Event (పాత Cache ని డిలీట్ చేసి కొత్తది ఆక్టివేట్ చేస్తుంది)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


