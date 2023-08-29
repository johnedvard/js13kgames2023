import { js13kViteConfig } from 'js13k-vite-plugins';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 9090,
    proxy: {
      '/api': {
        target: 'https://api-v2-mainnet.paras.id/token-series?collection_id=samurai-sam-by-johnedvardnear',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  ...js13kViteConfig({
    closureOptions: false,
  }),
});
