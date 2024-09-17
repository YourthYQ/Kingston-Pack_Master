import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    hmr: {
      overlay: false, // Optional: to disable error overlay
    },
  },
  optimizeDeps: {
    include: ['xlsx', 'papaparse'],
  },
});