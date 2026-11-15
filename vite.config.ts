import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Stripe payments stay on the existing Express server (port 4242).
      // This rule must stay first: the first matching rule wins.
      "/api/create-payment-intent": "http://localhost:4242",

      // Everything else under /api, plus login cookies and uploaded images, goes to Laravel (port 8000).
      // 127.0.0.1 (not "localhost") avoids Node picking IPv6 while "php artisan serve" listens on IPv4.
      "/api": "http://127.0.0.1:8000",
      "/sanctum": "http://127.0.0.1:8000",
      "/storage": "http://127.0.0.1:8000",
    },
  },
});
