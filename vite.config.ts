import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // console.log(env)
  return {
    base: env.VITE_BASE_URL,
    server: {
      host: '0.0.0.0',
      port: 5000,
    },
    define: {},
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [ElementPlusResolver()],
        dts: 'auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'css' })],
        dts: 'components.d.ts',
      }),
    ],
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
