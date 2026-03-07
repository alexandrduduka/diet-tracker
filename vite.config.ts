import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Eat Right',
        short_name: 'Eat Right',
        description: 'AI-powered nutrition and calorie tracker. Describe meals in plain text — get instant calorie and macro breakdowns.',
        theme_color: '#7cb87a',
        background_color: '#18180f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/app',
        categories: ['health', 'fitness', 'food'],
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Log a Meal',
            short_name: 'Log Meal',
            description: 'Open the meal logging chat',
            url: '/app#/chat',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Dashboard',
            short_name: 'Today',
            description: "View today's nutrition summary",
            url: '/app',
            icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Only use app.html as the navigation fallback for /app paths.
        // This prevents the SW from intercepting / and serving the SPA shell.
        navigateFallback: '/app.html',
        navigateFallbackAllowlist: [/^\/app/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com/,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        app: 'app.html',
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          db: ['dexie'],
          gemini: ['@google/generative-ai'],
        },
      },
    },
  },
})
