import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Only use base path in production, not in development
  base: process.env.NODE_ENV === 'production' ? '/new_thafheem_web/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173
    },
    // Only apply cache headers in production, not in development
    // Cache headers can interfere with HMR WebSocket connections
    headers: process.env.NODE_ENV === 'production' ? {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    } : {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
      // Cache headers removed in dev to prevent WebSocket/HMR issues
    },
    proxy: {
      // Proxy API calls to bypass CORS
      '/api/thafheem': {
        target: 'https://thafheem.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/thafheem/, '/thafheem-api'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy Quran.com API calls
      '/api/quran': {
        target: 'https://api.quran.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/quran/, '/api/v4'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
        },
      },
      // Proxy Directus CMS API calls
      '/api/directus': {
        target: 'https://directus.d4dx.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/directus/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
        },
      },
      // Proxy audio files to bypass CORS
      '/api/audio': {
        target: 'https://old.thafheem.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/audio/, '/audio'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('audio proxy error', err);
          });
        },
      }
    }
  }
})