/*
 * Dice Entropy Check — offline service worker.
 *
 * Its only job is to keep a copy of this app's own files so it works with
 * no connection. It never contacts any other site: it caches the files
 * listed below (all from this same folder) and serves them back.
 *
 * Bump VERSION whenever any file changes, so installed copies update.
 */
const VERSION = "v1.0.0";
const CACHE = "dice-entropy-check-" + VERSION;
const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

// Install: download this version's files into a fresh cache.
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

// Activate: delete caches from older versions.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("dice-entropy-check-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch: answer from the cache first. Only same-site GET requests are handled;
// anything else is left alone (and the page itself makes no other requests).
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("./index.html").then(page => page || fetch(req));
      return fetch(req);
    })
  );
});
