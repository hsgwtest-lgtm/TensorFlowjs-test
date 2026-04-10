const CACHE = "face-v1";
const BASE  = "/TensorFlowjs-test/facemesh/";
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
  // CDN リソース (TF.js / MediaPipe WASM) は常にネットワーク優先
  const url = e.request.url;
  if (url.includes("cdn.") || url.includes("tensorflow") || url.includes("mediapipe")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
  }
});
