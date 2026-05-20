import { ref } from 'vue'
import { defineStore } from 'pinia'
import { asyncRoutes } from '@/router/routes/basic'
import type { AppRouteRecordRaw } from '@/router/types'
import type { IconName } from '@/components/CommonIcon/types'
import { filterRoutesByMenus, getFirstValidPath } from '@/router/utils'
import { authApi } from '@/api/auth'

// 菜单树结构
export interface MenuTree {
  path: string
  name: string
  title: string
  icon?: IconName
  children?: MenuTree[]
}

// 用户信息
export interface UserInfo {
  id: string
  name: string
  avatar: string
  menus?: MenuTree[]
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo | undefined>()
    const token = ref<string>('')
    const permissions = ref<string[]>([])
    const menuTree = ref<MenuTree[]>([])
    const isRouteAdded = ref(false)

    // 设置 Token
    function setToken(t: string) {
      token.value = t
    }

    // 设置用户信息
    function setUserInfo(info: UserInfo) {
      userInfo.value = info
    }

    // 设置菜单树
    function setMenuTree(menus: MenuTree[]) {
      menuTree.value = menus
    }

    // 设置权限
    function setPermissions(perms: string[]) {
      permissions.value = perms
    }

    // 登录
    async function login(username: string, password: string) {
      const res = await authApi.login({ username, password })
      token.value = res.sessionId
      const userRes = await authApi.getCurrentUserInfo()
      setToken(token.value)
      setUserInfo(userRes)
      await fetchMenuTree()
      return { userInfo: userRes, token: token.value }
    }

    // 模拟后端返回的菜单树数据
    async function fetchMenuTree(): Promise<MenuTree[]> {
      // 模拟 API 调用
      await new Promise(resolve => {
        window.setTimeout(resolve, 500)
      })
      const mockMenuTree: MenuTree[] = [
        {
          path: '/dashboard/index',
          name: 'DashboardIndex',
          title: '仪表盘',
          icon: 'el-TrendCharts',
        },
        {
          path: '/sys',
          name: 'System',
          title: '系统管理',
          icon: 'el-Setting',
          children: [
            {
              path: 'user',
              name: 'SystemUser',
              title: '用户管理',
              icon: 'el-User',
            },
            {
              path: 'role',
              name: 'SystemRole',
              title: '角色管理',
              icon: 'el-User',
            },
            {
              path: 'department',
              name: 'SystemDepartment',
              title: '部门管理',
              icon: 'el-User',
            },
            {
              path: 'menu',
              name: 'SystemMenu',
              title: '菜单管理',
              icon: 'el-Menu',
            },
            {
              path: 'log',
              name: 'SystemLog',
              title: '日志管理',
              icon: 'el-User',
            },
          ],
        },
      ]
      setMenuTree(mockMenuTree)
      return mockMenuTree
    }

    // 获取过滤后的路由
    function getFilteredRoutes(): AppRouteRecordRaw[] {
      // 如果没有菜单树，返回所有动态路由
      if (!menuTree.value.length) {
        return asyncRoutes
      }
      return filterRoutesByMenus(menuTree.value, asyncRoutes)
    }

    // 获取第一个有效路由路径
    function getFirstRoutePath(): string | null {
      const routes = getFilteredRoutes()
      return getFirstValidPath(routes)
    }

    // 重置状态
    function $reset() {
      token.value = ''
      userInfo.value = undefined
      permissions.value = []
      menuTree.value = []
      isRouteAdded.value = false
    }

    // 退出登录
    function logout() {
      $reset()
    }

    return {
      userInfo,
      token,
      permissions,
      menuTree,
      isRouteAdded,
      login,
      logout,
      fetchMenuTree,
      setToken,
      setUserInfo,
      setMenuTree,
      setPermissions,
      getFilteredRoutes,
      getFirstRoutePath,
      $reset,
    }
  },
  {
    persist: {
      pick: ['token', 'userInfo', 'permissions'],
    },
  }
)
