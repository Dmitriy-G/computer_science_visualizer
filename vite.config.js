import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.PAGES_BASE_PATH || '/',
  plugins: [
    react(),
    {
      name: 'umami-analytics',
      apply: 'build',
      transformIndexHtml() {
        const scriptUrl = process.env.UMAMI_SCRIPT_URL?.trim()
        const websiteId = process.env.UMAMI_WEBSITE_ID?.trim()
        const domains = process.env.UMAMI_DOMAINS?.trim()

        if (!scriptUrl || !websiteId || !domains) {
          return []
        }

        return [{
          tag: 'script',
          attrs: {
            defer: true,
            src: scriptUrl,
            'data-website-id': websiteId,
            'data-domains': domains,
          },
          injectTo: 'head',
        }]
      },
    },
  ],
})
