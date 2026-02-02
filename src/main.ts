import { createApp } from 'vue'
import './styles/main.css'
import App from './App.vue'
import { setupRouter } from '@/router'

async function bootstrap() {
  const app = createApp(App)

  // 配置路由
  setupRouter(app)

  app.mount('#app')
}

bootstrap()
