const CACHE = "vision-v1";
const ASSETS = ["/TensorFlowjs-test/detect/", "/TensorFlowjs-test/detect/index.html", "/TensorFlowjs-test/detect/manifest.json"];

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
  // CDNリソースはネットワーク優先（TF.jsモデル等）
  if (e.request.url.includes("cdn.") || e.request.url.includes("tensorflow")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
  }
});
