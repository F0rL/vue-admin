import axios, { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { router, resetRouter } from '@/router'
import { store } from '@/store'
import { useUserStore } from '@/store/modules/user'
import { feedback } from '@/utils/feedback'
import {
  HttpBusinessError,
  type ApiResponse,
  type HttpAxiosResponse,
  type HttpHeadersInput,
  type HttpMethodConfig,
  type HttpRequestConfig,
  type HttpRequestOptions,
  type RetryOptions,
  type UploadPayload,
  type UploadRequestConfig,
} from './types'

const DEFAULT_RETRY_DELAY = 300
const LOGIN_PATH = '/auth/login'
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'])

function sleep(duration: number): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, duration)
  })
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function normalizeRequestValue(value: unknown): unknown {
  if (value === undefined) {
    return '__undefined__'
  }

  if (value === null) {
    return null
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value instanceof File) {
    return {
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified,
    }
  }

  if (value instanceof Blob) {
    return {
      size: value.size,
      type: value.type,
    }
  }

  if (value instanceof FormData) {
    return Array.from(value.entries()).map(([key, item]) => [
      key,
      normalizeRequestValue(item),
    ])
  }

  if (Array.isArray(value)) {
    return value.map(item => normalizeRequestValue(item))
  }

  if (isPlainObject(value)) {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = normalizeRequestValue(value[key])
        return result
      }, {})
  }

  return String(value)
}

function safeStringify(value: unknown): string {
  return JSON.stringify(normalizeRequestValue(value))
}

function getRequestMethod(config: HttpRequestConfig): string {
  return (config.method ?? 'get').toUpperCase()
}

function canRetryRequest(
  config: HttpRequestConfig,
  retry: RetryOptions
): boolean {
  if (retry.allowNonIdempotent) {
    return true
  }

  return IDEMPOTENT_METHODS.has(getRequestMethod(config))
}

function createRequestKey(config: HttpRequestConfig): string {
  if (config.requestKey) {
    return config.requestKey
  }

  const method = getRequestMethod(config)
  return [
    config.dedupeScope ?? 'global',
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
  config: HttpRequestConfig,
  retry: RetryOptions | false | undefined,
  attempt: number
): boolean {
  if (!retry || attempt >= retry.count || isAbortError(error)) {
    return false
  }

  if (!canRetryRequest(config, retry)) {
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

  private readonly options: HttpRequestOptions

  constructor(config: HttpRequestOptions = {}) {
    const {
      defaultRequestConfig,
      tokenProvider,
      clearAuthState,
      onUnauthorized,
      ...axiosConfig
    } = config

    this.options = {
      defaultRequestConfig,
      tokenProvider,
      clearAuthState,
      onUnauthorized,
    }
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 15000,
      ...axiosConfig,
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

        // HTTP 层错误（4xx/5xx）在此统一处理，不抛到业务层
        this.handleHttpError(error)
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

      if (isAbortError(axiosError)) {
        throw error
      }

      if (retry && shouldRetry(axiosError, config, retry, attempt)) {
        await sleep(resolveRetryDelay(retry, attempt + 1, axiosError))
        return this.dispatchRequest<T>(config, attempt + 1)
      }

      throw error
    }
  }

  private handleRequest(config: HttpRequestConfig): InternalAxiosRequestConfig {
    const nextConfig = {
      ...(this.options.defaultRequestConfig ?? {}),
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
        nextConfig.signal.addEventListener?.(
          'abort',
          () => controller.abort(),
          {
            once: true,
          }
        )
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
    const rawHeaders = config.headers as
      | HttpHeadersInput
      | AxiosHeaders
      | undefined
    if (rawHeaders) {
      for (const [key, value] of Object.entries(rawHeaders)) {
        if (value !== undefined) {
          headers.set(key, value)
        }
      }
    }

    const token = this.getToken()

    if (config.withToken !== false && token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }

  private getToken(): string {
    if (this.options.tokenProvider) {
      return this.options.tokenProvider()
    }

    const userStore = useUserStore(store)
    return userStore.token
  }

  private handleBusinessError<T>(response: HttpAxiosResponse<T>) {
    const { data, config } = response

    if (data.success) {
      return
    }

    const message =
      data.error?.message || data.message || '请求失败，请稍后重试'

    if (this.shouldShowBusinessErrorMessage(config) && message) {
      feedback.error(message)
    }

    throw new HttpBusinessError(response)
  }

  private async handleHttpError(error: AxiosError<ApiResponse<unknown>>) {
    const config = error.config as HttpRequestConfig | undefined
    const status = error.response?.status
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      '网络异常，请稍后重试'
    const shouldShowMessage = this.shouldShowHttpErrorMessage(config)

    if (status === 401) {
      this.clearAuthState()
      if (shouldShowMessage) {
        feedback.error('登录状态已失效，请重新登录')
      }
      if (this.options.onUnauthorized) {
        await this.options.onUnauthorized(error)
        return
      }
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
      if (shouldShowMessage) {
        feedback.warning(message || '暂无权限访问该资源')
      }
      return
    }

    if (status === 500 || status === 502) {
      if (shouldShowMessage) {
        feedback.error(message || '服务异常，请稍后重试')
      }
      return
    }

    if (!status) {
      if (shouldShowMessage) {
        feedback.error('网络连接异常，请检查网络后重试')
      }
      return
    }

    if (shouldShowMessage) {
      feedback.error(message)
    }
  }

  private clearAuthState() {
    if (this.options.clearAuthState) {
      this.options.clearAuthState()
      return
    }

    const userStore = useUserStore(store)
    userStore.$reset()

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

  private shouldShowBusinessErrorMessage(config?: HttpRequestConfig) {
    return config?.showErrorMessage !== false
  }

  private shouldShowHttpErrorMessage(config?: HttpRequestConfig) {
    if (config?.showHttpErrorMessage !== undefined) {
      return config.showHttpErrorMessage
    }

    return config?.showErrorMessage !== false
  }
}
