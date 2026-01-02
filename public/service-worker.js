/**
 * Service Worker for Thafheem Quran App
 * Implements stale-while-revalidate caching strategy for ALL API responses
 * Caches: surah data, translations (ayahwise & blockwise), interpretations, word-by-word, etc.
 */

const CACHE_NAME = 'thafheem-translations-v1';
const API_CACHE_NAME = 'thafheem-api-v1';
const STATIC_CACHE_NAME = 'thafheem-static-v1';

// API endpoints to cache
// NOTE: Now caching ALL /api/ requests automatically (see isAPIRequest function)
// This includes: surah data, translations, interpretations, blockwise, ayahwise, word-by-word, etc.
const API_ENDPOINTS = [
  '/api/ayatranslation/',
  '/api/ayaranges/',
  '/api/ayahaudio/',
  '/api/interpretation/',
  // All other /api/ endpoints are now automatically cached
];

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/fonts/',
  '/assets/',
];

// Cache duration (in milliseconds)
const CACHE_DURATIONS = {
  translations: 12 * 60 * 60 * 1000, // 12 hours
  ranges: 6 * 60 * 60 * 1000, // 6 hours
  audio: 7 * 24 * 60 * 60 * 1000, // 7 days
  static: 6 * 60 * 60 * 1000, // 6 hours
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  // Service Worker installing
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        // Caching static assets
        return cache.addAll(STATIC_ASSETS.filter(url => url !== '/'));
      })
      .then(() => {
        // Static assets cached successfully
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // Service Worker activating
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME) {
              // Deleting old cache
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Service Worker activated
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests and supported schemes
  if (request.method !== 'GET' || 
      (!request.url.startsWith('http://') && !request.url.startsWith('https://'))) {
    return;
  }

  // Handle API requests with stale-while-revalidate strategy
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // For other requests, use network-first strategy
  event.respondWith(handleNetworkFirst(request));
});

/**
 * Check if request is for API endpoint
 * Now caches ALL /api/ requests (surah data, translations, interpretations, blockwise, ayahwise, etc.)
 */
function isAPIRequest(url) {
  // Cache all API requests (minimal change - catches everything under /api/)
  return url.pathname.includes('/api/');
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.pathname.includes(asset));
}

/**
 * Handle API requests with stale-while-revalidate strategy
 */
async function handleAPIRequest(request) {
  const cacheName = getCacheName(request.url);
  const cache = await caches.open(cacheName);
  
  try {
    // Try to get from cache first
    const cachedResponse = await cache.match(request);
    
    // If we have a cached response, return it immediately
    if (cachedResponse && !isCacheExpired(cachedResponse)) {
      // Cache HIT
      
      // Update cache in background (stale-while-revalidate)
      fetchAndCache(request, cache).catch(error => {
        // Background cache update failed
      });
      
      return cachedResponse;
    }
    
    // No valid cache, fetch from network
    // Cache MISS, fetching
    return await fetchAndCache(request, cache);
    
  } catch (error) {
    console.error('API request failed:', error);
    
    // Fallback to cache even if expired
    const staleResponse = await cache.match(request);
    if (staleResponse) {
      // Returning stale response
      return staleResponse;
    }
    
    // No cache available, return error response
    return new Response(
      JSON.stringify({ 
        error: 'Network error', 
        message: 'Unable to fetch data. Please check your connection.' 
      }),
      { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Handle static asset requests with cache-first strategy
 */
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  try {
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isCacheExpired(cachedResponse)) {
      // Static cache HIT
      return cachedResponse;
    }
    
    // Cache miss or expired, fetch from network
    // Static cache MISS, fetching
    return await fetchAndCache(request, cache);
    
  } catch (error) {
    console.error('Static request failed:', error);
    return new Response('Resource not available', { status: 404 });
  }
}

/**
 * Handle other requests with network-first strategy
 */
async function handleNetworkFirst(request) {
  // Don't cache index.html
  if (request.url.includes('/index.html') || request.url.endsWith('/')) {
    return fetch(request);
  }
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Network failed, returning cached response
      return cachedResponse;
    }
    
    // No cache available
    return new Response('Resource not available', { status: 404 });
  }
}

/**
 * Fetch from network and cache the response
 */
async function fetchAndCache(request, cache) {
  const response = await fetch(request);
  
  // Don't cache partial responses (206), audio files, or index.html
  const isAudioFile = request.url.includes('/audio/') || 
                      request.url.includes('.mp3') || 
                      request.url.includes('.ogg') || 
                      request.url.includes('.wav');
  const isIndexHtml = request.url.includes('/index.html') || request.url.endsWith('/');
  const isPartialResponse = response.status === 206;
  
  if (response.ok && !isPartialResponse && !isAudioFile && !isIndexHtml) {
    // Clone the response before caching
    const responseToCache = response.clone();
    
    // Add cache metadata
    const headers = new Headers(responseToCache.headers);
    headers.set('sw-cached-at', Date.now().toString());
    headers.set('sw-cache-expiry', getCacheExpiry(request.url).toString());
    
    const cachedResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers: headers
    });
    
    // Only cache supported schemes (http/https)
    try {
      if (request.url.startsWith('http://') || request.url.startsWith('https://')) {
        cache.put(request, cachedResponse);
        // Cached response
      } else {
        // Skipping cache for unsupported scheme
      }
    } catch (error) {
      // Cache error (unsupported scheme)
    }
  }
  
  return response;
}

/**
 * Get appropriate cache name for request
 */
function getCacheName(url) {
  if (url.includes('ayatranslation')) return CACHE_NAME;
  if (url.includes('ayaranges')) return API_CACHE_NAME;
  if (url.includes('audio')) return API_CACHE_NAME;
  return API_CACHE_NAME;
}

/**
 * Get cache expiry time for request
 * Extended to handle all API endpoints (surah data, translations, interpretations, blockwise, ayahwise)
 */
function getCacheExpiry(url) {
  // Surah data and page ranges - cache for 6 hours
  if (url.includes('suranames') || url.includes('pageranges') || url.includes('arabic/surah')) {
    return Date.now() + CACHE_DURATIONS.ranges;
  }
  // Translations (ayahwise and blockwise) - cache for 12 hours
  if (url.includes('translation') || url.includes('ayatransl') || url.includes('ayatranslation')) {
    return Date.now() + CACHE_DURATIONS.translations;
  }
  // Interpretations - cache for 12 hours
  if (url.includes('interpretation') || url.includes('interpret')) {
    return Date.now() + CACHE_DURATIONS.translations;
  }
  // Aya ranges for blockwise - cache for 6 hours
  if (url.includes('ayaranges')) {
    return Date.now() + CACHE_DURATIONS.ranges;
  }
  // Audio - cache for 7 days
  if (url.includes('audio')) {
    return Date.now() + CACHE_DURATIONS.audio;
  }
  // Word-by-word and other API data - cache for 6 hours
  return Date.now() + CACHE_DURATIONS.ranges;
}

/**
 * Check if cached response has expired
 */
function isCacheExpired(response) {
  const cachedAt = response.headers.get('sw-cached-at');
  const cacheExpiry = response.headers.get('sw-cache-expiry');
  
  if (!cachedAt || !cacheExpiry) return false;
  
  return Date.now() > parseInt(cacheExpiry);
}

/**
 * Handle background sync for offline functionality
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    // Background sync triggered
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Perform background sync operations
 */
async function doBackgroundSync() {
  try {
    // Clean up expired cache entries
    await cleanupExpiredCache();
    // Background sync completed
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

/**
 * Clean up expired cache entries
 */
async function cleanupExpiredCache() {
  const cacheNames = [CACHE_NAME, API_CACHE_NAME, STATIC_CACHE_NAME];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response && isCacheExpired(response)) {
        await cache.delete(request);
        // Cleaned expired cache entry
      }
    }
  }
}

/**
 * Handle push notifications (if needed in future)
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    // Push notification received
    
    const options = {
      body: data.body,
      icon: '/assets/logo.png',
      badge: '/assets/logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Thafheem Service Worker loaded successfully
