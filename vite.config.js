import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ensureTrailingSlash = (value) => (value.endsWith('/') ? value : `${value}/`)

const attachLegacyHeaders = (proxyReq) => {
  if (!proxyReq.getHeader('accept')) {
    proxyReq.setHeader('accept', 'application/json, text/plain, */*')
  }
  if (!proxyReq.getHeader('x-requested-with')) {
    proxyReq.setHeader('x-requested-with', 'XMLHttpRequest')
  }
}

const resolveBasePath = () => {
  const raw = process.env.VITE_BASE_PATH?.trim()
  if (!raw) return '/'
  if (raw === '/' || raw === '.') return '/'
  return ensureTrailingSlash(raw.startsWith('/') ? raw : `/${raw}`)
}

const basePath = resolveBasePath()

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: []
  },
  ssr: {
    noExternal: ['react', 'react-dom']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    host: 'localhost',
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173,
      overlay: true,
      timeout: 5000
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
})
          proxy.on('proxyReq', (proxyReq, req, res) => {
            attachLegacyHeaders(proxyReq)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
})
        },
      },
      // Proxy Quran.com API calls
      '/api/quran': {
        target: 'https://api.quran.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/quran/, '/api/v4'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
})
          proxy.on('proxyReq', (proxyReq) => attachLegacyHeaders(proxyReq))
        },
      },
      // Proxy Directus CMS API calls
      '/api/directus': {
        target: 'https://directus.d4dx.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/directus/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
})
          proxy.on('proxyReq', (proxyReq) => attachLegacyHeaders(proxyReq))
        },
      },
      '/api/old-thaf-api': {
        target: 'https://old.thafheem.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/old-thaf-api/, '/thaf-api'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
})
          proxy.on('proxyReq', (proxyReq) => attachLegacyHeaders(proxyReq))
        },
      }
    }
  }
})