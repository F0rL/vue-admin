import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from './components/types'

export function generateMenu(routes: RouteRecordRaw[]): MenuItem[] {
  const menuList: MenuItem[] = []

  routes.forEach(route => {
    if (route.meta?.hideMenu) return

    const menuItem: MenuItem = {
      path: route.path,
      name: route.name as string,
      title: (route.meta?.title as string) || '',
      icon: route.meta?.icon as string | undefined,
    }

    if (route.children?.length) {
      menuItem.children = generateMenu(route.children)
    }

    menuList.push(menuItem)
  })

  return menuList
}
