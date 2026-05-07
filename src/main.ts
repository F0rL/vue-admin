import { createApp } from 'vue'
import './styles/main.css'
import App from './App.vue'
import { setupFeedback } from '@/plugins/feedback'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { CommonIcon } from '@/components/CommonIcon'

async function bootstrap() {
  const app = createApp(App)

  // 全局注册 CommonIcon 组件
  app.component('CommonIcon', CommonIcon)

  // 配置 store
  setupStore(app)

  // 配置路由
  setupRouter(app)

  // 配置全局消息反馈
  setupFeedback(app)

  app.mount('#app')
}

bootstrap()
