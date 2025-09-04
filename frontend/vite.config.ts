// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ajuste aqui o alvo do backend durante o desenvolvimento
const API_TARGET = 'http://localhost:5239';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Ex.: /api/products  ->  http://localhost:5239/products
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
