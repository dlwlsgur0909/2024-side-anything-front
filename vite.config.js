import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import rollupNodePolyfills from 'rollup-plugin-node-polyfills';

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
      // vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        global: 'globalThis' // global -> globalThis로 대체
      }
    },
    define: {
      global: 'globalThis'
    },
    build: {
      rollupOptions: {
        plugins: [
          // Node.js 내장 모듈에 대한 polyfill 제공
          rollupNodePolyfills()
        ]
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
  
  
