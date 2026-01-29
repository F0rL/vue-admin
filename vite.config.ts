import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // console.log(env)
  return {
    base: env.VITE_BASE_URL,
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    define: {},
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        // 使用 path.resolve 创建绝对路径别名
        '@': resolve(__dirname, 'src'),
        '~': resolve(__dirname, 'public'),
      },
    },
    build: {
      outDir: 'dist',
    },
  }
})
