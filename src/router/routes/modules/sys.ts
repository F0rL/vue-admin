import type { AppRouteRecordRaw } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const system: AppRouteRecordRaw = {
  path: '/sys',
  name: 'System',
  component: LAYOUT,
  redirect: '/sys/menu',
  meta: {
    title: '系统管理',
  },
  children: [
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('@/views/sys/menu/index.vue'),
      meta: {
        title: '菜单管理',
      },
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/sys/role/index.vue'),
      meta: {
        title: '角色管理',
      },
    },
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/sys/user/index.vue'),
      meta: {
        title: '用户管理',
      },
    },
    {
      path: 'department',
      name: 'SystemDepartment',
      component: () => import('@/views/sys/department/index.vue'),
      meta: {
        title: '部门管理',
      },
    },
    {
      path: 'log',
      name: 'SystemLog',
      component: () => import('@/views/sys/log/index.vue'),
      meta: {
        title: '日志管理',
      },
    },
  ],
}

export default system
