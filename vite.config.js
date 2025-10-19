import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/new_thafheem_web/',  // ← ADD THIS LINE
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
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