import type { AppRouteRecordRaw } from '@/router/types'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuTree } from '@/store/modules/user'

// 根据菜单树筛选有权限的路由
export function filterRoutesByMenus(
  menus: MenuTree[],
  routes: AppRouteRecordRaw[]
): AppRouteRecordRaw[] {
  const allowedRoutes: AppRouteRecordRaw[] = []

  routes.forEach(route => {
    // 获取路由的一级路径
    const routeFirstLevel = '/' + (route.path?.split('/')[1] || '')

    // 检查该路由是否在菜单树中
    const menu = menus.find(m => m.path === routeFirstLevel)

    if (menu) {
      const filteredRoute: AppRouteRecordRaw = {
        ...route,
        children: [],
      }

      // 筛选子路由
      if (route.children && menu.children) {
        filteredRoute.children = route.children.filter(child => {
          const childPath = child.path?.split('/').pop() || ''
          return menu.children!.some(m => m.path === childPath)
        })
      }

      // 只添加有子路由的菜单
      if (filteredRoute.children && filteredRoute.children.length > 0) {
        allowedRoutes.push(filteredRoute)
      }
    }
  })
  return allowedRoutes
}

// 获取第一个有效路由路径
export function getFirstValidPath(routes: AppRouteRecordRaw[]): string | null {
  for (const route of routes) {
    // 如果有子路由，递归查找
    if (route.children && route.children.length > 0) {
      // 如果只有一个子路由，直接跳转到子路由
      if (route.children.length === 1) {
        const child = route.children[0]
        const childPath = child?.path?.split('/').pop() || ''
        return `${route.path}/${childPath}`.replace(/\/+/g, '/')
      }
      // 多个子路由，返回父路由（让 Layout 处理）
      return route.path
    }
  }
  return null
}
