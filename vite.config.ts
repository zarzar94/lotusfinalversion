import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));

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
    // Minify and drop console/debugger in production
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        404: resolve(rootDir, '404.html'),
      },
      output: {
        manualChunks: {
          // Vendor chunks - loaded once and cached
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-pdf': ['jspdf'],
        },
      },
    },
  },
  // Drop console and debugger in production builds
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
