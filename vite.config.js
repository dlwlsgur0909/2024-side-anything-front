import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default ({mode}) => {

  const env = loadEnv(mode, '', '');

  const backendConfig = {
    target:
      mode === 'development' ? env.VITE_LOCAL_SERVER: '',
    changeOrigin: true,
    secure: false,
  }

  return defineConfig({
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/auth': backendConfig,
        '/oauth2': backendConfig, 
      }
    }
  })
}
  
  
