const CACHE = "3dobj-v1";
const BASE  = "/TensorFlowjs-test/3DObject_detect/";
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
  const url = e.request.url;
  // CDN (MediaPipe WASM / TF.js) は常にネットワーク優先
  if (url.includes("cdn.") || url.includes("mediapipe") || url.includes("tensorflow")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
  }
});
