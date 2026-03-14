import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@gluco/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@gluco/tipos': path.resolve(__dirname, '../../packages/tipos/src'),
      '@gluco/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
});
