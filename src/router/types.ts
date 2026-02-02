import type { RouteRecordRaw, RouteMeta } from 'vue-router'

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string
  meta: RouteMeta
}
