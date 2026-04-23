import { createApp } from 'vue'
import './styles/main.css'
import App from './App.vue'
import { setupFeedback } from '@/plugins/feedback'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'

async function bootstrap() {
  const app = createApp(App)

  // 配置 store
  setupStore(app)

  // 配置路由
  setupRouter(app)

  // 配置全局消息反馈
  setupFeedback(app)

  app.mount('#app')
}

bootstrap()
