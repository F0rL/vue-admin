import { http } from '@/utils/http/useRequest'

/** 菜单类型 */
export type MenuType = 'directory' | 'menu' | 'button'

/** 菜单树节点 */
export interface MenuTreeItem {
  id: string
  parentId: string | null
  name: string
  icon: string | null
  path: string | null
  component: string | null
  type: MenuType
  permissionCode: string | null
  sortOrder: number
  isVisible: boolean
  status: boolean
  children: MenuTreeItem[]
}

/** 创建菜单参数 */
export interface CreateMenuParams {
  parentId?: string | null
  name: string
  icon?: string | null
  path?: string | null
  component?: string | null
  type: MenuType
  permissionCode?: string | null
  sortOrder?: number
  isVisible?: boolean
  status?: boolean
}

/** 更新菜单参数 */
export interface UpdateMenuParams {
  id: string
  parentId?: string | null
  name?: string
  icon?: string | null
  path?: string | null
  component?: string | null
  type?: MenuType
  permissionCode?: string | null
  sortOrder?: number
  isVisible?: boolean
  status?: boolean
}

/** 批量更新菜单项 */
export interface BatchUpdateMenuItem {
  id: string
  sortOrder?: number
  isVisible?: boolean
  status?: boolean
  parentId?: string | null
}

/** 批量更新菜单参数 */
export interface BatchUpdateMenuParams {
  updates: BatchUpdateMenuItem[]
}

export const menuApi = {
  /** 创建菜单 */
  create(data: CreateMenuParams) {
    return http.post<MenuTreeItem>('/menu/create', data)
  },

  /** 删除菜单 */
  delete(id: string) {
    return http.post<null>('/menu/delete', { id })
  },

  /** 更新菜单 */
  update(data: UpdateMenuParams) {
    return http.post<MenuTreeItem>('/menu/update', data)
  },

  /** 菜单详情 */
  detail(id: string) {
    return http.get<MenuTreeItem>('/menu/detail', { id })
  },

  /** 获取菜单树（所有菜单） */
  tree() {
    return http.get<MenuTreeItem[]>('/menu/tree')
  },

  /** 获取当前用户菜单（根据角色过滤） */
  getUserMenus() {
    return http.get<MenuTreeItem[]>('/menu/get-user-menus')
  },

  /** 批量更新菜单 */
  batchUpdate(data: BatchUpdateMenuParams) {
    return http.post<null>('/menu/batch-update', data)
  },
}
