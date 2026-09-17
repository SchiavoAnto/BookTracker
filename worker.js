// The version of the cache.
const VERSION = "v1.1";

// The name of the cache
const CACHE_NAME = `book-tracker-${VERSION}`;

// The static resources that the app needs to function.
const APP_STATIC_RESOURCES = [
    "./",
    "./add.html",
    "./book.html",
    "./cart.html",
    "./index.html",

    "./js/add.js",
    "./js/book.js",
    "./js/cart.js",
    "./js/database.js",
    "./js/index.js",
    "./js/rating-bar.js",
    "./js/theme.js",

    "./css/add.css",
    "./css/book.css",
    "./css/cart.css",
    "./css/common.css",
    "./css/index.css",

    "./icons/basket.svg",
    "./icons/check.svg",
    "./icons/chevron-left.svg",
    "./icons/chevron-right.svg",
    "./icons/filter.svg",
    "./icons/info.svg",
    "./icons/plus.svg",
    "./icons/search.svg",
    "./icons/star-filled.svg",

    "./icons/logo-96.png",
    "./icons/logo-120.png",
    "./icons/logo-128.png",
    "./icons/logo-152.png",
    "./icons/logo-192.png",
    "./icons/logo-256.png",
    "./icons/logo-512.png"
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES);
        })(),
    );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                    return undefined;
                }),
            );
            await clients.claim();
        })(),
    );
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener("fetch", (event) => {
    // Go to the cache first, and then the network.
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            let url = event.request.url;
            if (url.includes("?"))
                url = url.slice(0, event.request.url.indexOf("?"));
            const cachedResponse = await cache.match(url);
            if (cachedResponse) {
                // Return the cached response if it's available.
                return cachedResponse;
            }
            // If resource isn't in the cache, return a 404.
            return new Response(null, { status: 404 });
        })(),
    );
});
