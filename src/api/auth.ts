import { http } from '@/utils/http/useRequest'

/**
 * 登录请求参数。
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * 登录返回结果。
 */
export interface LoginResult {
  sessionId: string
}

/**
 * 用户信息。
 */
export interface UserProfile {
  id: string
  name: string
  avatar: string
  roles: string[]
}

/**
 * 用户模块 API 示例。
 */
export const authApi = {
  login(data: LoginParams) {
    return http.post<LoginResult, LoginParams>('/auth/login', data)
  },
  getCurrentUserInfo() {
    return http.get<UserProfile>('/auth/me')
  },
  uploadAvatar(file: File) {
    return http.upload<{ url: string }>('/auth/avatar', file, undefined, {
      showLoading: true,
      loadingText: '正在上传头像...',
      retry: {
        count: 1,
        delay: 500,
      },
    })
  },
}
