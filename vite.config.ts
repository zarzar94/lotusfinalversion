import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages subpath deployments, set BASE_PATH (e.g. '/repo-name/')
// Otherwise default './' works well for static hosting under any path.
export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [react()],
});
