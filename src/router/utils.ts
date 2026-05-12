import type { AppRouteRecordRaw } from '@/router/types'
import type { MenuTree } from '@/store/modules/user'

export interface BreadcrumbItem {
  title: string
  path: string
}

function normalizePath(path: string): string {
  return path.replace(/\/+/g, '/')
}

function resolveRoutePath(parentPath: string, childPath = ''): string {
  if (!childPath) {
    return normalizePath(parentPath)
  }

  if (childPath.startsWith('/')) {
    return normalizePath(childPath)
  }

  return normalizePath(`${parentPath}/${childPath}`)
}

function collectMenuPaths(
  menus: MenuTree[],
  parentPath = ''
): Set<string> {
  const paths = new Set<string>()

  menus.forEach(menu => {
    const currentPath = resolveRoutePath(parentPath, menu.path)
    paths.add(currentPath)

    if (menu.children?.length) {
      collectMenuPaths(menu.children, currentPath).forEach(path => {
        paths.add(path)
      })
    }
  })

  return paths
}

// 根据菜单树筛选有权限的路由
export function filterRoutesByMenus(
  menus: MenuTree[],
  routes: AppRouteRecordRaw[]
): AppRouteRecordRaw[] {
  const allowedRoutes: AppRouteRecordRaw[] = []
  const menuPaths = collectMenuPaths(menus)

  routes.forEach(route => {
    const routePath = normalizePath(route.path)
    const filteredChildren = route.children?.filter(child =>
      menuPaths.has(resolveRoutePath(routePath, child.path))
    )

    if (menuPaths.has(routePath) || filteredChildren?.length) {
      allowedRoutes.push({
        ...route,
        children: filteredChildren,
      })
    }
  })

  return allowedRoutes
}

// 根据当前路径从菜单树中查找面包屑路径
export function getBreadcrumbByPath(
  menus: MenuTree[],
  currentPath: string
): BreadcrumbItem[] {
  const normalizedPath = normalizePath(currentPath)

  for (const menu of menus) {
    const menuPath = normalizePath(menu.path)

    if (normalizedPath === menuPath) {
      return [{ title: menu.title, path: menuPath }]
    }

    if (menu.children?.length) {
      for (const child of menu.children) {
        const childPath = resolveRoutePath(menuPath, child.path)

        if (normalizedPath === childPath) {
          return [
            { title: menu.title, path: menuPath },
            { title: child.title, path: childPath },
          ]
        }

        // 子菜单的子级（三级菜单）
        if (child.children?.length) {
          const grandBreadcrumb = getBreadcrumbByPath(child.children, childPath)
          if (grandBreadcrumb.length) {
            return [
              { title: menu.title, path: menuPath },
              { title: child.title, path: childPath },
              ...grandBreadcrumb,
            ]
          }
        }
      }
    }
  }

  return []
}

// 获取第一个有效路由路径
export function getFirstValidPath(routes: AppRouteRecordRaw[]): string | null {
  for (const route of routes) {
    if (route.redirect && typeof route.redirect === 'string') {
      return normalizePath(route.redirect)
    }

    if (route.children?.length) {
      const child = route.children[0]
      if (!child) {
        continue
      }

      const childPath = getFirstValidPath([child as AppRouteRecordRaw])

      if (childPath) {
        return childPath.startsWith('/')
          ? normalizePath(childPath)
          : resolveRoutePath(route.path, childPath)
      }
    }

    if (route.path) {
      return normalizePath(route.path)
    }
  }

  return null
}
