import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));

// For GitHub Pages subpath deployments, set BASE_PATH (e.g. '/repo-name/')
// Otherwise default './' works well for static hosting under any path.
export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [
    react(),
  ],
  build: {
    // Improve build performance
    target: 'es2020',
    // Chunk size warnings at 500KB
    chunkSizeWarningLimit: 500,
    // Minification
    minify: 'esbuild',
    // CSS code splitting
    cssCodeSplit: true,
    // Source maps for production debugging
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        404: resolve(rootDir, '404.html'),
      },
      output: {
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // Three.js (heavy, load separately)
          if (id.includes('node_modules/three') || id.includes('@react-three')) {
            return 'vendor-three';
          }
          // PDF generation
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) {
            return 'vendor-pdf';
          }
          // Animation libraries
          if (id.includes('node_modules/gsap')) {
            return 'vendor-animation';
          }
          // Utility libraries
          if (id.includes('node_modules/dompurify')) {
            return 'vendor-utils';
          }
        },
      },
      // Tree-shaking optimization
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Force pre-bundling
    force: false,
  },
  // Server optimizations for development
  server: {
    // Enable compression
    middlewareMode: false,
    // HMR settings
    hmr: {
      overlay: true,
    },
  },
  // Preview server settings
  preview: {
    port: 4173,
    strictPort: true,
  },
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
      '@components': resolve(rootDir, 'src/components'),
      '@hooks': resolve(rootDir, 'src/hooks'),
      '@utils': resolve(rootDir, 'src/utils'),
      '@context': resolve(rootDir, 'src/context'),
      '@services': resolve(rootDir, 'src/services'),
      '@types': resolve(rootDir, 'src/types'),
    },
  },
  // Performance hints
  esbuild: {
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Legal comments
    legalComments: 'none',
  },
});
