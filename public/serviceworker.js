const cacheName = "v1"
const urlsToCache = ["offline.html"]
const self = this

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(urlsToCache))
    )
})

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== cacheName).map(key => caches.delete(key))
        ))
    )
})

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(() => fetch(event.request).catch(() => caches.match("offline.html")))
    )
})