import { defineConfig } from 'vite';

// The site is served from a custom domain root (see public/CNAME),
// so assets are resolved from "/".
export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
});
