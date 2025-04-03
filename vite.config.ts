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
    allowedHosts: ['liquidtoken.vercel.app']
  },
});


