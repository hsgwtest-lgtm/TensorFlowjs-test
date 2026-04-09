const CACHE = "hand-v1";
const ASSETS = ["/TensorFlowjs-test/handpose/", "/TensorFlowjs-test/handpose/index.html", "/TensorFlowjs-test/handpose/manifest.json"];
 
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
 
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
 
self.addEventListener("fetch", e => {
  if (e.request.url.includes("cdn.") || e.request.url.includes("tensorflow") || e.request.url.includes("mediapipe")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
  }
});