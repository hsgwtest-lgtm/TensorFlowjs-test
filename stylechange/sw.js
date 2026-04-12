const CACHE = "stylechange-v1";
const BASE  = "/TensorFlowjs-test/stylechange/";
const ASSETS = [BASE, BASE + "index.html", BASE + "manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // TF.js / Magenta CDN: always from network
  if (e.request.url.includes("cdn.") || e.request.url.includes("tensorflow") ||
      e.request.url.includes("magenta") || e.request.url.includes("storage.googleapis")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
  }
});
