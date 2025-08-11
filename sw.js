// Service Worker for Boxerhof Website
// Implements caching strategies for improved performance and offline functionality

const CACHE_NAME = 'boxerhof-v2.0.0';
const RUNTIME_CACHE = 'boxerhof-runtime';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/admin.html',
    '/style.css',
    '/admin-style.css',
    '/enhancements.css',
    '/script.js',
    '/admin.js',
    '/performance-enhancements.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome-extension and other protocols
    if (!url.protocol.startsWith('http')) return;

    event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache First for static assets
        if (isStaticAsset(request)) {
            return await cacheFirst(request);
        }
        
        // Strategy 2: Network First for HTML pages
        if (isHTMLPage(request)) {
            return await networkFirst(request);
        }
        
        // Strategy 3: Stale While Revalidate for images and fonts
        if (isImageOrFont(request)) {
            return await staleWhileRevalidate(request);
        }
        
        // Strategy 4: Network First for API calls
        if (isAPICall(request)) {
            return await networkFirst(request);
        }
        
        // Default: Network First
        return await networkFirst(request);
        
    } catch (error) {
        console.error('Fetch error:', error);
        return await handleOffline(request);
    }
}

// Cache First Strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        console.log('📦 Serving from cache:', request.url);
        return cachedResponse;
    }
    
    console.log('🌐 Fetching and caching:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network First Strategy
async function networkFirst(request) {
    try {
        console.log('🌐 Fetching from network:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('📦 Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const networkPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    });
    
    if (cachedResponse) {
        console.log('📦 Serving from cache, updating in background:', request.url);
        return cachedResponse;
    }
    
    console.log('🌐 No cache, waiting for network:', request.url);
    return await networkPromise;
}

// Handle offline scenarios
async function handleOffline(request) {
    const url = new URL(request.url);
    
    // Try to return cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Return offline fallback for HTML pages
    if (request.destination === 'document') {
        return new Response(`
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Boxer Nothilfe e.V.</title>
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    .offline-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    h1 {
                        font-size: 2rem;
                        margin-bottom: 1rem;
                    }
                    p {
                        font-size: 1.1rem;
                        max-width: 500px;
                        line-height: 1.6;
                        margin-bottom: 2rem;
                    }
                    .retry-btn {
                        background: rgba(255, 255, 255, 0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 50px;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .retry-btn:hover {
                        background: white;
                        color: #667eea;
                    }
                </style>
            </head>
            <body>
                <div class="offline-icon">🐕💔</div>
                <h1>Keine Internetverbindung</h1>
                <p>
                    Es scheint, als hätten Sie keine Internetverbindung. 
                    Bitte überprüfen Sie Ihre Netzwerkeinstellungen und versuchen Sie es erneut.
                </p>
                <button class="retry-btn" onclick="window.location.reload()">
                    🔄 Erneut versuchen
                </button>
            </body>
            </html>
        `, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    // Return 404 for other resources
    return new Response('Offline - Resource not available', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
    });
}

// Helper functions to categorize requests
function isStaticAsset(request) {
    const url = new URL(request.url);
    return STATIC_ASSETS.some(asset => url.pathname === asset) ||
           url.pathname.match(/\.(css|js)$/);
}

function isHTMLPage(request) {
    return request.destination === 'document' ||
           request.headers.get('Accept')?.includes('text/html');
}

function isImageOrFont(request) {
    return request.destination === 'image' ||
           request.destination === 'font' ||
           request.url.includes('fonts.googleapis.com') ||
           request.url.includes('fonts.gstatic.com');
}

function isAPICall(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') ||
           url.pathname.includes('.json');
}

// Background sync for form submissions (when available)
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        const pendingSubmissions = await getStoredSubmissions();
        
        for (const submission of pendingSubmissions) {
            await submitForm(submission);
            await removeStoredSubmission(submission.id);
        }
        
        console.log('✅ Background sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Push notifications (when available)
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        data: data.data,
        actions: [
            {
                action: 'view',
                title: 'Ansehen',
                icon: '/icon-view.png'
            },
            {
                action: 'close',
                title: 'Schließen',
                icon: '/icon-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// Utility functions for IndexedDB operations
async function getStoredSubmissions() {
    // Implementation for retrieving stored form submissions
    return [];
}

async function removeStoredSubmission(id) {
    // Implementation for removing stored form submission
    return true;
}

async function submitForm(submission) {
    // Implementation for submitting form data
    return true;
}

// Cache cleanup on storage quota warning
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        cleanupCache();
    }
});

async function cleanupCache() {
    const cache = await caches.open(RUNTIME_CACHE);
    const requests = await cache.keys();
    
    // Remove oldest entries if cache is getting too large
    if (requests.length > 50) {
        const toDelete = requests.slice(0, requests.length - 30);
        await Promise.all(toDelete.map(request => cache.delete(request)));
        console.log(`🧹 Cleaned up ${toDelete.length} cache entries`);
    }
}

console.log('🎯 Service Worker loaded successfully');