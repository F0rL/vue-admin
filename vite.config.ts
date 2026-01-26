import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // console.log(env)
  return {
    base: env.VITE_BASE_URL,
    server: {
      host: '0.0.0.0',
      port: 5173
    },
    define: {},
    plugins: [vue()]
  }
})
