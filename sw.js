const CACHE_NAME = "memory-quest-v2";
const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./game.js",
    "./manifest.json",
    "./assets/app-icon.svg",
    "./assets/memories/ride.jpg",
    "./assets/memories/trip.jpg",
    "./assets/memories/daruth.jpg",
    "./assets/memories/hug.jpg",
    "./assets/memories/kiss.jpg",
    "./assets/music/our_song.mp3"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => Promise.allSettled(ASSETS.map((asset) => cache.add(asset))))
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request).then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
                return response;
            });
        })
    );
});
