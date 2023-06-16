const cacheName = "v1"
const urlsToCache = ["offline.html"]
const self = this

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(urlsToCache))
    )
})

self.addEventListener("activate", event => {
    const cacheWhitelist = []
    cacheWhitelist.push(cacheName)

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName)
                }
            })
        ))
    )
})

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(() => fetch(event.request).catch(() => caches.match("offline.html")))
    )
})