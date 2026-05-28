import { http } from '@/utils/http/useRequest'

/** 角色列表项 */
export interface RoleListItem {
  id: string
  name: string
  code: string
  description: string | null
  isSystem: boolean
  status: boolean
  sortOrder: number
  userCount: number
  createdAt: string
}

/** 角色详情（含菜单/权限） */
export interface RoleDetail extends RoleListItem {
  menuIds: string[]
  permissionCodes: string[]
}

/** 创建角色参数 */
export interface CreateRoleParams {
  name: string
  code: string
  description?: string | null
  status: boolean
  sortOrder: number
  menuIds: string[]
  permissionCodes: string[]
}

/** 更新角色参数 */
export interface UpdateRoleParams {
  id: string
  name?: string
  code?: string
  description?: string | null
  status?: boolean
  sortOrder?: number
  menuIds?: string[]
  permissionCodes?: string[]
}

/** 批量更新项 */
export interface BatchUpdateRoleItem {
  id: string
  status?: boolean
  sortOrder?: number
}

/** 批量更新参数 */
export interface BatchUpdateRoleParams {
  updates: BatchUpdateRoleItem[]
}

export const roleApi = {
  /** 创建角色 */
  create(data: CreateRoleParams) {
    return http.post<RoleDetail>('/role/create', data)
  },

  /** 删除角色 */
  delete(id: string) {
    return http.post<null>('/role/delete', { id })
  },

  /** 更新角色 */
  update(data: UpdateRoleParams) {
    return http.post<RoleDetail>('/role/update', data)
  },

  /** 角色详情 */
  detail(id: string) {
    return http.get<RoleDetail>('/role/detail', { id })
  },

  /** 角色列表 */
  list() {
    return http.get<RoleListItem[]>('/role/list')
  },

  /** 批量更新 */
  batchUpdate(data: BatchUpdateRoleParams) {
    return http.post<null>('/role/batch-update', data)
  },
}
