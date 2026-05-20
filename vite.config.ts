import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← Agrega esta línea
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@img': resolve(__dirname, 'public/images'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@common': resolve(__dirname, 'src/components/common'),
      '@layout': resolve(__dirname, 'src/components/layout'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@services': resolve(__dirname, 'src/services'),
      '@context': resolve(__dirname, 'src/context'),
      '@hooks': resolve(__dirname, 'src/hooks'),
    },
  },
})