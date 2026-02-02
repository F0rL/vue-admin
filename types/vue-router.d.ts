import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    icon?: string
    hideBreadcrumb?: boolean
    hideMenu?: boolean
  }
}
