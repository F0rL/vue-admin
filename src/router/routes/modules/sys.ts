import type { AppRouteRecordRaw } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const setting: AppRouteRecordRaw = {
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
      name: 'SettingMenu',
      component: () => import('@/views/sys/menu/index.vue'),
      meta: {
        title: '菜单管理',
      },
    },
    {
      path: 'role',
      name: 'SettingRole',
      component: () => import('@/views/sys/role/index.vue'),
      meta: {
        title: '角色管理',
      },
    },
  ],
}

export default setting
