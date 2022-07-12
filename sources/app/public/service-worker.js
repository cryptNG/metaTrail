const CACHE_NAME = 'metaTrail';

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('message', (event) => {
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then( (cache) => {
                    return cache.addAll(event.data.payload);
                })
        );
    }
});


// let assets = [
//   "/",
//   "/assets/vendor.css",
//   "/assets/metatrail.css",
//   "/assets/ember-modal-dialog/ember-modal-structure.css",
//   "/images/polyback.min.svg",
//   "/assets/ember-modal-dialog/ember-modal-appearance.css"
// ]

// self.addEventListener("install", installEvent => {
//   installEvent.waitUntil(
//     caches.open(KEY).then(cache => {
//       cache.addAll(assets)
//     })
//   )
// })

//local walletconnect here
self.addEventListener('fetch', function fetcher (event) {
  var request = event.request;
  // check if request 
  if (request.url.indexOf('localhost') > -1) {
    // contentful asset detected
    event.respondWith(
      caches.match(event.request).then(function(response) {
        console.log('FETCH: ' + response);
        // return from cache, otherwise fetch from network
      //  return response || fetch(request);
      return fetch(request);
      })
    );
  }
  // otherwise: ignore event
});