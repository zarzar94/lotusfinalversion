import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages subpath deployments, set BASE_PATH (e.g. '/repo-name/')
// Otherwise default './' works well for static hosting under any path.
export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [react()],
  build: {
    // Improve build performance
    target: 'es2020',
    // Chunk size warnings at 500KB
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - loaded once and cached
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-pdf': ['jspdf'],
          // Separate heavy dependencies
          'vendor-html2canvas': ['html2canvas'],
          'vendor-purify': ['dompurify'],
        },
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
