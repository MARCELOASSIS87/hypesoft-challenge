// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ajuste aqui o alvo do backend durante o desenvolvimento
const API_TARGET = 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Ex.: /api/products  ->  http://localhost:5000/products
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
