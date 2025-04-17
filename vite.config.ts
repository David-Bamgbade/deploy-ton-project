// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import {nodePolyfills} from "vite-plugin-node-polyfills";
//
// export default defineConfig({
//   plugins: [react(), nodePolyfills()],
//   base: '/',
//   resolve: {
//     dedupe: ['react', 'react-dom'], // Ensures a single instance of React
//   },
//   build: {
//     outDir: 'dist',
//   },
//   server: {
//     allowedHosts: ['deploy-ton-project.vercel.app']
//   },
// });
//

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      exclude: ['vm'], // Exclude vm module to avoid eval warning
    }),
  ],
  base: '/',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // Group TON dependencies into a separate chunk
          ton: [
            '@ton/core',
            '@ton/crypto',
            '@ton/ton',
            '@tonconnect/ui-react',
            '@orbs-network/ton-access',
          ],
          // Group React dependencies
          react: ['react', 'react-dom', 'react-router-dom'],
          // Group TanStack Query
          tanstack: ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase to 1 MB to reduce warnings (optional)
  },

});