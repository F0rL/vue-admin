import type { AppRouteRecordRaw } from '@/router/types'

import { LAYOUT, EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '../constant'

const NOT_FOUND_META = {
  title: 'ErrorPage',
  hideBreadcrumb: true,
  hideMenu: true,
}

export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: NOT_FOUND_META,
  children: [
    {
      path: '', // 匹配父路径本身
      name: 'EXCEPTION',
      component: EXCEPTION_COMPONENT,
      meta: NOT_FOUND_META,
    },
  ],
}

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: '/dashboard',
  meta: {
    title: 'Root',
  },
}

export const Login: AppRouteRecordRaw = {
  path: '/auth',
  name: 'Auth',
  redirect: '/auth/login',
  component: () => import('@/views/auth/index.vue'),
  meta: {
    title: '登录',
  },
  children: [
    {
      path: 'login',
      name: 'AuthLogin',
      component: () => import('@/views/auth/login.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      path: 'qrcode-login',
      name: 'AuthQrcodeLogin',
      component: () => import('@/views/auth/qrcode-login.vue'),
      meta: {
        title: '登录',
      },
    },
  ],
}

// 获取所有路由模块
function getAsyncRoutes() {
  const modules = import.meta.glob('./modules/**/*.ts', {
    eager: true,
  })
  const r: AppRouteRecordRaw[] = []
  Object.keys(modules).forEach(key => {
    const mod = (modules as Recordable)[key].default || {}
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    r.push(...modList)
  })
  return r
}

export const asyncRoutes = getAsyncRoutes()

export const basicRoutes = [Login, PAGE_NOT_FOUND_ROUTE]
