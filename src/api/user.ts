import { http } from '@/utils/http/useRequest'

/** 用户列表项 */
export interface UserListItem {
  id: string
  username: string
  nickname: string
  email: string | null
  phone: string | null
  avatar: string | null
  role: { id: string; name: string } | null
  department: { id: string; name: string } | null
  isActive: boolean
  isLocked: boolean
  lastLoginAt: string | null
  createdAt: string
}

/** 用户详情 */
export interface UserDetail extends UserListItem {
  loginFailCount: number
  createdBy: string | null
  updatedAt: string
}

/** 用户列表查询参数 */
export interface UserListParams {
  page: number
  pageSize: number
  keyword?: string
  status?: boolean
  roleId?: string
  departmentId?: string
  sortField?: 'createdAt' | 'username' | 'lastLoginAt'
  sortOrder?: 'asc' | 'desc'
}

/** 用户列表响应 */
export interface UserListResult {
  list: UserListItem[]
  total: number
  page: number
  pageSize: number
}

/** 创建用户参数 */
export interface CreateUserParams {
  username: string
  password: string
  nickname: string
  email?: string | null
  phone?: string | null
  avatar?: string | null
  roleId?: string | null
  departmentId?: string | null
}

/** 更新用户参数 */
export interface UpdateUserParams {
  id: string
  nickname?: string
  email?: string | null
  phone?: string | null
  avatar?: string | null
  roleId?: string | null
  departmentId?: string | null
  isActive?: boolean
  isLocked?: boolean
  password?: string
}

/** 批量更新用户参数 */
export interface BatchUpdateUserItem {
  id: string
  roleId?: string | null
  departmentId?: string | null
  isActive?: boolean
  isLocked?: boolean
}

export interface BatchUpdateUserParams {
  updates: BatchUpdateUserItem[]
}

/** 角色列表项（用于下拉选择） */
export interface RoleItem {
  id: string
  name: string
  code: string
}

/** 部门树节点（用于下拉选择） */
export interface DepartmentItem {
  id: string
  parentId: string | null
  name: string
  children?: DepartmentItem[]
}

export const userApi = {
  /** 创建用户 */
  create(data: CreateUserParams) {
    return http.post<UserDetail>('/user/create', data)
  },

  /** 删除用户 */
  delete(id: string) {
    return http.post<null>('/user/delete', { id })
  },

  /** 更新用户 */
  update(data: UpdateUserParams) {
    return http.post<UserDetail>('/user/update', data)
  },

  /** 用户详情 */
  detail(id: string) {
    return http.get<UserDetail>('/user/detail', { id })
  },

  /** 用户列表（分页） */
  list(params: UserListParams) {
    return http.get<UserListResult>('/user/list', params)
  },

  /** 批量更新用户 */
  batchUpdate(data: BatchUpdateUserParams) {
    return http.post<null>('/user/batch-update', data)
  },

  /** 角色列表（所有角色，用于下拉选择） */
  getRoleList() {
    return http.get<RoleItem[]>('/role/list')
  },

  /** 部门树（用于下拉选择） */
  getDepartmentTree() {
    return http.get<DepartmentItem[]>('/department/tree')
  },
}
