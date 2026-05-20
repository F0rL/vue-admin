import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { createRouter, createWebHistory } from 'vue-router'
import { basicRoutes } from './routes/basic'
import { useUserStore } from '@/store/modules/user'
import { WHITE_NAME_LIST } from './routes/basic'

function getRemovableRouteNames(): string[] {
  return router
    .getRoutes()
    .map(route => route.name)
    .filter(
      name => name && !WHITE_NAME_LIST.includes(name as string)
    ) as string[]
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 重置路由到基础路由
export function resetRouter() {
  getRemovableRouteNames().forEach(name => {
    router.hasRoute(name) && router.removeRoute(name)
  })

  const userStore = useUserStore()
  userStore.isRouteAdded = false
}

// 添加动态路由
export function addAsyncRoutes(): boolean {
  const userStore = useUserStore()

  // 如果已经添加过路由，不再重复添加
  if (userStore.isRouteAdded) return true

  const filteredRoutes = userStore.getFilteredRoutes()

  // 没有可添加的路由
  if (!filteredRoutes.length) {
    return false
  }

  filteredRoutes.forEach(route => {
    const routeName = route.name
    if (!routeName) return

    if (!router.hasRoute(routeName)) {
      router.addRoute(route as unknown as RouteRecordRaw)
    }
  })

  userStore.isRouteAdded = true
  return true
}

// 获取跳转路径
function getRedirectPath(): string {
  const userStore = useUserStore()
  const firstPath = userStore.getFirstRoutePath()

  // 如果有有效路径，跳转到该路径
  if (firstPath) return firstPath

  // 没有路由配置，跳转到默认页面
  return '/'
}

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = !!userStore.token

  // ==================== 已登录 ====================
  if (isLoggedIn) {
    // 访问登录页，跳转到首页
    if (to.path === '/auth/login' || to.path === '/auth') {
      const redirectPath = getRedirectPath()
      next(redirectPath)
      return
    }

    // 刷新页面后，token 存在但 menuTree 为空，需要重新获取菜单并添加路由
    if (!userStore.menuTree.length) {
      await userStore.fetchMenuTree()
    }

    // 首次访问，需要添加动态路由
    if (!userStore.isRouteAdded) {
      const added = addAsyncRoutes()
      if (added) {
        if (to.path !== '/' && to.path !== '') {
          // 用 to.fullPath 重新导航，触发路由重新匹配
          // 否则虽然路由池已更新，但当前 to 仍指向旧的匹配结果（如 404 路由）
          next({ path: to.fullPath, replace: true })
          return
        }
        // 访问的是根路径，跳转到第一个有效路由
        const redirectPath = getRedirectPath()
        next({ path: redirectPath, replace: true })
        return
      } else {
        // 没有可用的路由
        next('/auth/login')
        return
      }
    }
    next()
    return
  }
  // ==================== 未登录 ====================
  // 访问登录页，放行
  if (WHITE_NAME_LIST.includes(to.name as string)) {
    next()
    return
  }
  // 其他页面，跳转到登录页
  next(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
})

// 退出登录后清理路由
export async function logoutAndReset() {
  const userStore = useUserStore()

  userStore.logout()
  resetRouter()

  if (router.currentRoute.value.path !== '/auth/login') {
    await router.replace('/auth/login')
  }
}

export function setupRouter(app: App<Element>) {
  app.use(router)
}
