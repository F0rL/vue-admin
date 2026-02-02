import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { createRouter, createWebHistory } from 'vue-router'
import { basicRoutes } from './routes/basic'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 初始路由
  routes: basicRoutes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

const WHITE_NAME_LIST = ['login']

// reset router
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
export function setupRouter(app: App<Element>) {
  app.use(router)
}
