import axios, { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosHeaderValue, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { router, resetRouter } from '@/router'
import { store } from '@/store'
import { useUserStore } from '@/store/modules/user'
import { feedback } from '@/utils/feedback'
import type {
  ApiResponse,
  HttpAxiosResponse,
  HttpMethodConfig,
  HttpRequestConfig,
  RetryOptions,
  UploadPayload,
  UploadRequestConfig,
} from './types'

const DEFAULT_SUCCESS_CODE = 200
const DEFAULT_RETRY_DELAY = 300
const LOGIN_PATH = '/auth/login'
const TOKEN_STORAGE_KEYS = ['token', 'Authorization', 'access_token']

function sleep(duration: number): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, duration)
  })
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function safeStringify(value: unknown): string {
  if (value === null || value === undefined) return ''

  if (typeof value === 'string') return value

  if (value instanceof FormData) {
    return JSON.stringify(
      Array.from(value.entries()).map(([key, item]) => [
        key,
        item instanceof File ? item.name : String(item),
      ])
    )
  }

  if (!isPlainObject(value) && !Array.isArray(value)) {
    return String(value)
  }

  const sorted = Object.keys(value)
    .sort()
    .reduce<Record<string, unknown>>((result, key) => {
      result[key] = (value as Record<string, unknown>)[key]
      return result
    }, {})

  return JSON.stringify(sorted)
}

function createRequestKey(config: HttpRequestConfig): string {
  if (config.requestKey) {
    return config.requestKey
  }

  const method = (config.method ?? 'get').toUpperCase()
  return [
    method,
    config.url ?? '',
    safeStringify(config.params),
    safeStringify(config.data),
  ].join('&')
}

function isAbortError(error: unknown): boolean {
  return (
    axios.isCancel(error) ||
    (error instanceof AxiosError && error.code === 'ERR_CANCELED')
  )
}

function shouldRetry(
  error: AxiosError<ApiResponse<unknown>>,
  retry: RetryOptions | false | undefined,
  attempt: number
): boolean {
  if (!retry || attempt >= retry.count || isAbortError(error)) {
    return false
  }

  if (!error.response) {
    return true
  }

  return error.response.status >= 500
}

function resolveRetryDelay(
  retry: RetryOptions,
  attempt: number,
  error: AxiosError<ApiResponse<unknown>>
): number {
  if (typeof retry.delay === 'function') {
    return Math.max(retry.delay(attempt, error), 0)
  }

  return Math.max(retry.delay ?? DEFAULT_RETRY_DELAY, 0)
}

class LoadingManager {
  private count = 0

  private controller: ReturnType<typeof feedback.createLoading> | null = null

  open(text?: string) {
    this.count += 1

    if (!this.controller) {
      this.controller = feedback.createLoading({
        text: text ?? '请求处理中...',
      })
      return
    }

    if (text) {
      this.controller.setText(text)
    }
  }

  async close() {
    if (this.count <= 0) return

    this.count -= 1

    if (this.count === 0 && this.controller) {
      const controller = this.controller
      this.controller = null
      await controller.close()
    }
  }
}

/**
 * 生产环境级别的 axios 请求类。
 */
export class HttpRequest {
  private readonly instance: AxiosInstance

  private readonly pendingMap = new Map<string, AbortController>()

  private readonly loadingManager = new LoadingManager()

  constructor(config?: HttpRequestConfig) {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 15000,
      ...config,
    })

    this.setupInterceptors()
  }

  /**
   * 通用请求方法。
   */
  async request<T>(
    config: HttpRequestConfig & { returnFullResponse: true }
  ): Promise<ApiResponse<T>>
  async request<T>(config: HttpRequestConfig): Promise<T>
  async request<T>(config: HttpRequestConfig): Promise<T | ApiResponse<T>> {
    const response = await this.dispatchRequest<T>(config, 0)

    if (config.returnFullResponse) {
      return response.data
    }

    return response.data.data
  }

  /**
   * GET 请求。
   */
  get<T>(
    url: string,
    params?: HttpRequestConfig['params'],
    config: HttpMethodConfig = {}
  ): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'get',
      params,
    })
  }

  /**
   * POST 请求。
   */
  post<T, D = unknown>(
    url: string,
    data?: D,
    config: HttpMethodConfig<D> = {}
  ): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'post',
      data,
    })
  }

  /**
   * PUT 请求。
   */
  put<T, D = unknown>(
    url: string,
    data?: D,
    config: HttpMethodConfig<D> = {}
  ): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'put',
      data,
    })
  }

  /**
   * DELETE 请求。
   */
  delete<T, D = unknown>(
    url: string,
    data?: D,
    config: HttpMethodConfig<D> = {}
  ): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'delete',
      data,
    })
  }

  /**
   * PATCH 请求。
   */
  patch<T, D = unknown>(
    url: string,
    data?: D,
    config: HttpMethodConfig<D> = {}
  ): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'patch',
      data,
    })
  }

  /**
   * 文件上传。
   */
  upload<T>(
    url: string,
    file: File | Blob | FormData,
    data?: UploadPayload,
    config: UploadRequestConfig = {}
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData()

    if (!(file instanceof FormData)) {
      formData.append('file', file)
    }

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value instanceof Blob ? value : String(value))
        }
      })
    }

    return this.post<T, FormData>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config.headers ?? {}),
      },
    })
  }

  /**
   * 取消指定请求。
   */
  cancelRequest(requestKey: string) {
    const controller = this.pendingMap.get(requestKey)
    if (!controller) return

    controller.abort()
    this.pendingMap.delete(requestKey)
  }

  /**
   * 取消全部请求。
   */
  cancelAllRequests() {
    this.pendingMap.forEach(controller => {
      controller.abort()
    })
    this.pendingMap.clear()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      config => this.handleRequest(config as HttpRequestConfig),
      async error => {
        await this.closeLoading(error.config as HttpRequestConfig | undefined)
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      response => {
        const typedResponse = response as HttpAxiosResponse<unknown>
        this.removePendingRequest(typedResponse.config)

        return this.closeLoading(typedResponse.config).then(() => {
          this.handleBusinessError(typedResponse)
          return response
        })
      },
      async error => {
        const config = error.config as HttpRequestConfig | undefined
        if (config) {
          this.removePendingRequest(config)
        }

        await this.closeLoading(config)

        return Promise.reject(error)
      }
    )
  }

  private async dispatchRequest<T>(
    config: HttpRequestConfig,
    attempt: number
  ): Promise<HttpAxiosResponse<T>> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config)
      return response as HttpAxiosResponse<T>
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      const retry = config.retry

      if (!retry || !shouldRetry(axiosError, retry, attempt)) {
        if (!isAbortError(axiosError)) {
          this.handleHttpError(axiosError)
        }
        throw error
      }

      await sleep(resolveRetryDelay(retry, attempt + 1, axiosError))
      return this.dispatchRequest<T>(config, attempt + 1)
    }
  }

  private handleRequest(config: HttpRequestConfig): InternalAxiosRequestConfig {
    const nextConfig = {
      withToken: true,
      showErrorMessage: true,
      cancelDuplicate: true,
      ...config,
    } as HttpRequestConfig

    const controller = new AbortController()
    const requestKey = createRequestKey(nextConfig)

    if (nextConfig.cancelDuplicate !== false) {
      this.cancelRequest(requestKey)
      this.pendingMap.set(requestKey, controller)
    }

    if (nextConfig.signal) {
      if (nextConfig.signal.aborted) {
        controller.abort()
      } else {
        nextConfig.signal.addEventListener?.('abort', () => controller.abort(), {
          once: true,
        })
      }
    }

    nextConfig.signal = controller.signal
    nextConfig.requestKey = requestKey
    nextConfig.headers = this.mergeHeaders(nextConfig)

    if (nextConfig.showLoading) {
      this.loadingManager.open(nextConfig.loadingText)
    }

    return nextConfig as InternalAxiosRequestConfig
  }

  private mergeHeaders(config: HttpRequestConfig): AxiosHeaders {
    const headers = new AxiosHeaders()

    if (config.headers instanceof AxiosHeaders) {
      config.headers.forEach((value: AxiosHeaderValue, key: string) => {
        headers.set(key, value)
      })
    } else if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          headers.set(key, value as AxiosHeaderValue)
        }
      })
    }

    const token = this.getToken()

    if (config.withToken !== false && token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }

  private getToken(): string {
    const userStore = useUserStore(store)

    if (userStore.token) {
      return userStore.token
    }

    for (const key of TOKEN_STORAGE_KEYS) {
      const token = window.localStorage.getItem(key)
      if (token) {
        return token.replace(/^Bearer\s+/i, '')
      }
    }

    return ''
  }

  private handleBusinessError<T>(response: HttpAxiosResponse<T>) {
    const { data, config } = response
    const successCode = config.successCode ?? DEFAULT_SUCCESS_CODE

    if (data.code === successCode) {
      return
    }

    if (config.showErrorMessage !== false && data.message) {
      feedback.error(data.message)
    }

    throw new Error(data.message || '请求失败')
  }

  private handleHttpError(error: AxiosError<ApiResponse<unknown>>) {
    const status = error.response?.status
    const message =
      error.response?.data?.message || error.message || '网络异常，请稍后重试'

    if (status === 401) {
      this.clearAuthState()
      feedback.error('登录状态已失效，请重新登录')
      if (router.currentRoute.value.fullPath !== LOGIN_PATH) {
        void router.push({
          path: LOGIN_PATH,
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        })
      }
      return
    }

    if (status === 403) {
      feedback.warning(message || '暂无权限访问该资源')
      return
    }

    if (status === 500 || status === 502) {
      feedback.error(message || '服务异常，请稍后重试')
      return
    }

    if (!status) {
      feedback.error('网络连接异常，请检查网络后重试')
      return
    }

    feedback.error(message)
  }

  private clearAuthState() {
    const userStore = useUserStore(store)

    try {
      userStore.$reset()
    } catch {
      userStore.token = ''
      userStore.userInfo = undefined
    }

    userStore.token = ''
    userStore.userInfo = undefined
    TOKEN_STORAGE_KEYS.forEach(key => {
      window.localStorage.removeItem(key)
    })

    resetRouter()
  }

  private removePendingRequest(config?: HttpRequestConfig) {
    if (!config?.requestKey) return
    this.pendingMap.delete(config.requestKey)
  }

  private async closeLoading(config?: HttpRequestConfig) {
    if (!config?.showLoading) return
    await this.loadingManager.close()
  }
}
