const CACHE_NAME = "habit-tracker-1.0";
const OFFLINE_FALLBACK_URL = "/";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",

  "/dashboard",
  "/dashboard/index.html",

  "/login",
  "/login/index.html",

  "/signup",
  "/signup/index.html",

  "/manifest.json",
  "/favicon.ico",
  "/manifest.json",
  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-32x32.png",
  "/icons/favicon-16x16.png",
];

// Install: minimal shell only
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // 🔹 1. Handle navigation (HTML pages)
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // ✅ Handle navigation (pages)
  if (event.request.mode === "navigate") {
    const cleanUrl = url.origin + url.pathname; // strip query

    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            // store WITHOUT query params
            cache.put(cleanUrl, copy);
          });

          return response;
        })
        .catch(() => {
          return caches
            .match(cleanUrl)
            .then((res) => res || caches.match("/index.html"));
        }),
    );

    return;
  }

  // 🔹 2. Static assets (_next, images, etc.)
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
            return response;
          })
        );
      }),
    );
    return;
  }

  // 🔹 3. Default: try cache first
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached || fetch(event.request)),
  );
});
