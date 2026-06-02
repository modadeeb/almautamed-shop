import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'عيادتي — حجز العيادات الذكي',
        short_name: 'عيادتي',
        description: 'منصة حجز العيادات الذكية في اليمن',
        lang: 'ar',
        dir: 'rtl',
        theme_color: '#0056b3',
        background_color: '#f6faff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // تخزين الهيكل، وصفحة احتياطية عند انقطاع الاتصال (offline.html).
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ['**/*.{js,css,html,svg,woff,woff2}'],
        runtimeCaching: [
          {
            // بيانات الـ API — NetworkFirst مع مهلة قصيرة لتجربة أسرع على 3G.
            urlPattern: /\/api\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // فصل مكتبات الطرف الثالث لتحسين التخزين المؤقت وتقليل الحزمة الأولية.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tanstack')) return 'query'
            if (
              id.includes('react-router') ||
              id.includes('/react-dom/') ||
              id.includes('/react/')
            ) {
              return 'react-vendor'
            }
          }
        },
      },
    },
    // ميزانية التحذير: ننبّه إذا تجاوزت أي حزمة 200KB.
    chunkSizeWarningLimit: 200,
  },
})
