import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias para importar archivos desde la carpeta src
    },
  },
  server: {
    host: '0.0.0.0', // Escucha en todas las interfaces de red
    port: 5173, // Puedes cambiar el puerto si es necesario
    allowedHosts: [
      'reclamos.yes.com.sv' // Permitir solicitudes desde este dominio
    ],
    // proxy: {
    //   '/capta': {
    //     target: 'https://newcapta.yes.com.sv', // URL del servidor al que deseas hacer proxy
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '') // Reescribe la ruta eliminando el prefijo /api
    //   }
    // }
  },
})