import type { AppRouteRecordRaw } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const system: AppRouteRecordRaw = {
  path: '/sys',
  name: 'System',
  component: LAYOUT,
  redirect: '/sys/menu',
  meta: {
    title: '设置',
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
  ],
}

export default system
