// Service Worker for Sikhiya Offline Learning Platform
// Version 1.0 - Rural Education Platform

const CACHE_NAME = 'sikhiya-offline-v1';
const API_CACHE_NAME = 'sikhiya-api-cache-v1';

// Files to cache for offline access
const STATIC_CACHE_FILES = [
  '/',
  '/main.dart.js',
  '/manifest.json',
  '/favicon.png',
  '/icons/Icon-192.png',
  '/icons/Icon-512.png',
  '/assets/AssetManifest.json',
  '/assets/FontManifest.json',
  '/assets/fonts/punjabi_regular.ttf',
  '/assets/fonts/punjabi_bold.ttf',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
];

// API endpoints to cache for offline access
const API_ENDPOINTS = [
  '/api/content/grades',
  '/api/content/subjects',
  '/api/content/chapters',
  '/api/content/lessons',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Service Worker: Caching static files');
        return cache.addAll(STATIC_CACHE_FILES.filter(url => !url.startsWith('http')));
      }),
      // Cache API responses with dummy data for offline
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('💾 Service Worker: Pre-caching API responses');
        return Promise.all([
          // Cache grades data
          cache.put('/api/content/grades', new Response(JSON.stringify({
            success: true,
            grades: [
              { id: 1, name: 'Class 1', description: 'Grade 1 curriculum', grade: 1, subject_count: 3 },
              { id: 2, name: 'Class 2', description: 'Grade 2 curriculum', grade: 2, subject_count: 3 },
              { id: 3, name: 'Class 3', description: 'Grade 3 curriculum', grade: 3, subject_count: 3 },
              { id: 4, name: 'Class 4', description: 'Grade 4 curriculum', grade: 4, subject_count: 4 },
              { id: 5, name: 'Class 5', description: 'Grade 5 curriculum', grade: 5, subject_count: 4 },
              { id: 6, name: 'Class 6', description: 'Grade 6 curriculum', grade: 6, subject_count: 5 },
              { id: 7, name: 'Class 7', description: 'Grade 7 curriculum', grade: 7, subject_count: 5 },
              { id: 8, name: 'Class 8', description: 'Grade 8 curriculum', grade: 8, subject_count: 6 },
              { id: 9, name: 'Class 9', description: 'Grade 9 curriculum', grade: 9, subject_count: 6 },
              { id: 10, name: 'Class 10', description: 'Grade 10 curriculum', grade: 10, subject_count: 6 },
              { id: 11, name: 'Class 11', description: 'Grade 11 curriculum', grade: 11, subject_count: 6 },
              { id: 12, name: 'Class 12', description: 'Grade 12 curriculum', grade: 12, subject_count: 6 }
            ]
          }), {
            headers: { 'Content-Type': 'application/json' }
          })),
          
          // Cache subjects data for different grades
          ...Array.from({length: 12}, (_, i) => i + 1).map(grade => 
            cache.put(`/api/content/subjects?grade=${grade}`, new Response(JSON.stringify({
              success: true,
              subjects: getSubjectsForGrade(grade)
            }), {
              headers: { 'Content-Type': 'application/json' }
            }))
          )
        ]);
      })
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker: Activation complete');
    })
  );
});

// Fetch event - handle requests with offline-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static files with cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('📋 Service Worker: Serving from cache', url.pathname);
        return cachedResponse;
      }
      
      // If not in cache, try network
      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Return offline page if available
        if (request.mode === 'navigate') {
          return caches.match('/') || new Response('Offline - Please check your connection');
        }
        throw new Error('Network request failed and no cache available');
      });
    })
  );
});

// Handle API requests with offline-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    
    if (navigator.onLine) {
      // If online, try network first, fallback to cache
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          // Update cache with fresh data
          const responseToCache = networkResponse.clone();
          const cache = await caches.open(API_CACHE_NAME);
          await cache.put(request, responseToCache);
          console.log('🌐 Service Worker: Updated cache from network', url.pathname);
          return networkResponse;
        }
      } catch (error) {
        console.log('⚠️ Service Worker: Network failed, falling back to cache', error);
      }
    }
    
    // Return cached response or generate offline response
    if (cachedResponse) {
      console.log('📋 Service Worker: Serving API from cache', url.pathname);
      return cachedResponse;
    }
    
    // Generate offline response for uncached API requests
    return generateOfflineApiResponse(url);
    
  } catch (error) {
    console.error('❌ Service Worker: API request failed', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Offline - Content not available',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Generate offline API responses
function generateOfflineApiResponse(url) {
  const pathname = url.pathname;
  
  if (pathname === '/api/content/grades') {
    return new Response(JSON.stringify({
      success: true,
      grades: [
        { id: 1, name: 'Class 1', description: 'Grade 1 curriculum', grade: 1, subject_count: 3 },
        { id: 2, name: 'Class 2', description: 'Grade 2 curriculum', grade: 2, subject_count: 3 },
        { id: 3, name: 'Class 3', description: 'Grade 3 curriculum', grade: 3, subject_count: 3 },
        { id: 4, name: 'Class 4', description: 'Grade 4 curriculum', grade: 4, subject_count: 4 },
        { id: 5, name: 'Class 5', description: 'Grade 5 curriculum', grade: 5, subject_count: 4 },
        { id: 6, name: 'Class 6', description: 'Grade 6 curriculum', grade: 6, subject_count: 5 },
        { id: 7, name: 'Class 7', description: 'Grade 7 curriculum', grade: 7, subject_count: 5 },
        { id: 8, name: 'Class 8', description: 'Grade 8 curriculum', grade: 8, subject_count: 6 },
        { id: 9, name: 'Class 9', description: 'Grade 9 curriculum', grade: 9, subject_count: 6 },
        { id: 10, name: 'Class 10', description: 'Grade 10 curriculum', grade: 10, subject_count: 6 },
        { id: 11, name: 'Class 11', description: 'Grade 11 curriculum', grade: 11, subject_count: 6 },
        { id: 12, name: 'Class 12', description: 'Grade 12 curriculum', grade: 12, subject_count: 6 }
      ],
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (pathname === '/api/content/subjects') {
    const grade = parseInt(url.searchParams.get('grade')) || 1;
    return new Response(JSON.stringify({
      success: true,
      subjects: getSubjectsForGrade(grade),
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Default offline response
  return new Response(JSON.stringify({
    success: false,
    error: 'Offline - Content not available',
    offline: true
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Helper function to get subjects for a grade
function getSubjectsForGrade(grade) {
  const allSubjects = {
    basic: [
      { id: 1, name: 'Mathematics', description: 'Basic math concepts', grade, icon: 'calculate', chapters: 8 },
      { id: 2, name: 'English', description: 'Language skills', grade, icon: 'book', chapters: 6 },
      { id: 3, name: 'Environmental Studies', description: 'World around us', grade, icon: 'nature', chapters: 5 }
    ],
    withHindi: [
      { id: 1, name: 'Mathematics', description: 'Math and problem solving', grade, icon: 'calculate', chapters: 10 },
      { id: 2, name: 'English', description: 'Language and communication', grade, icon: 'book', chapters: 8 },
      { id: 3, name: 'Environmental Studies', description: 'Science and nature', grade, icon: 'nature', chapters: 7 },
      { id: 4, name: 'Hindi', description: 'हिंदी भाषा', grade, icon: 'language', chapters: 6 }
    ],
    middle: [
      { id: 1, name: 'Mathematics', description: 'Advanced mathematics', grade, icon: 'calculate', chapters: 12 },
      { id: 2, name: 'Science', description: 'Physics, Chemistry, Biology', grade, icon: 'science', chapters: 10 },
      { id: 3, name: 'Social Science', description: 'History, Geography, Civics', grade, icon: 'public', chapters: 8 },
      { id: 4, name: 'English', description: 'Literature and grammar', grade, icon: 'book', chapters: 8 },
      { id: 5, name: 'Hindi', description: 'हिंदी साहित्य', grade, icon: 'language', chapters: 7 }
    ],
    secondary: [
      { id: 1, name: 'Mathematics', description: 'Algebra, Geometry, Statistics', grade, icon: 'calculate', chapters: 15 },
      { id: 2, name: 'Science', description: 'Physics, Chemistry, Biology', grade, icon: 'science', chapters: 12 },
      { id: 3, name: 'Social Science', description: 'History, Geography, Economics', grade, icon: 'public', chapters: 10 },
      { id: 4, name: 'English', description: 'Literature and communication', grade, icon: 'book', chapters: 8 },
      { id: 5, name: 'Hindi', description: 'हिंदी साहित्य व्याकरण', grade, icon: 'language', chapters: 8 },
      { id: 6, name: 'Computer Science', description: 'Programming and digital literacy', grade, icon: 'computer', chapters: 6 }
    ],
    senior: [
      { id: 1, name: 'Mathematics', description: 'Calculus, Statistics, Algebra', grade, icon: 'calculate', chapters: 18 },
      { id: 2, name: 'Physics', description: 'Mechanics, Waves, Electricity', grade, icon: 'science', chapters: 15 },
      { id: 3, name: 'Chemistry', description: 'Organic, Inorganic, Physical', grade, icon: 'science', chapters: 12 },
      { id: 4, name: 'Biology', description: 'Cell biology, Genetics, Ecology', grade, icon: 'biotech', chapters: 14 },
      { id: 5, name: 'English', description: 'Advanced literature', grade, icon: 'book', chapters: 10 },
      { id: 6, name: 'Computer Science', description: 'Data structures, Algorithms', grade, icon: 'computer', chapters: 12 }
    ]
  };
  
  if (grade <= 3) return allSubjects.basic;
  if (grade <= 5) return allSubjects.withHindi;
  if (grade <= 8) return allSubjects.middle;
  if (grade <= 10) return allSubjects.secondary;
  return allSubjects.senior;
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Service Worker: Background sync triggered');
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get offline progress data from IndexedDB or localStorage
    const offlineData = await getOfflineProgressData();
    
    if (offlineData && offlineData.length > 0) {
      // Send offline progress to server
      for (const progressItem of offlineData) {
        try {
          await fetch('/api/sync/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(progressItem)
          });
        } catch (error) {
          console.log('⚠️ Failed to sync progress item:', error);
        }
      }
      
      // Clear synced data
      await clearSyncedProgressData();
      console.log('✅ Offline data synced successfully');
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Helper functions for offline data management
async function getOfflineProgressData() {
  // Implementation would use IndexedDB or localStorage
  return [];
}

async function clearSyncedProgressData() {
  // Implementation would clear synced data from local storage
  return true;
}

console.log('🎓 Sikhiya Service Worker loaded - Ready for offline learning!');