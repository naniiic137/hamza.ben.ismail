import { defineConfig } from 'vite';

// Relative base so the build works both on the custom domain root
// and under a sub-path like username.github.io/repo/.
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
});
