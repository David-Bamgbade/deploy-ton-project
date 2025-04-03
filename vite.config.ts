import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {nodePolyfills} from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/',
  resolve: {
    dedupe: ['react', 'react-dom'], // Ensures a single instance of React
  },
  build: {
    outDir: 'dist',
  },
  server: {
    allowedHosts: ['final-tact-frontend-c2pcm3q9k-david-bamgbades-projects.vercel.app']
  },
});


