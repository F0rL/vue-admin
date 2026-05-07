import type { AppRouteRecordRaw } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/index',
  meta: {
    title: '仪表盘',
  },
  children: [
    {
      path: 'index',
      name: 'DashboardIndex',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '统计页',
      },
    },
  ],
}

export default dashboard