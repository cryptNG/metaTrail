import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'metatrail/config/environment';
import Buffer from 'buffer';

export default class App extends Application {
  
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

// let metaTrail = "metaTrail"
// let assets = [
//     "/",
//     "/index.html",
//     "/styles/app.css",
//     "/assets/*",
//     "/images/*"
//   ]

//   self.addEventListener("install", installEvent => {
//     installEvent.waitUntil(
//       caches.open(this.metaTrail).then(cache => {
//         cache.addAll(this.assets)
//       })
//     )
//   })

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', { scope: 'http://localhost:4200/' })
  //navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
          const data = {
              type: 'CACHE_URLS',
              payload: [
                  location.href,
                  ...performance.getEntriesByType('resource').map((r) => r.name).filter((d) => d.includes("localhost") && !d.includes("service-worker.js") && !d.includes("livereload.js"))
              ]
          };
          registration.installing.postMessage(data);
      })
      .catch((err) => console.log('SW registration FAIL:', err));
}

window.global = window;
window.Buffer = Buffer.Buffer;

loadInitializers(App, config.modulePrefix);
