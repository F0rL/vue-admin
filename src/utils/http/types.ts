import type {
  AxiosError,
  AxiosHeaderValue,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios'
import type { Ref } from 'vue'

/**
 * 后端标准响应结构。
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: ApiError
}

/**
 * 后端业务错误对象。
 */
export interface ApiError {
  code: string
  message: string
}

/**
 * 自动重试配置。
 */
export interface RetryOptions {
  /**
   * 最大重试次数，不包含首次请求。
   */
  count: number

  /**
   * 是否允许对非幂等请求进行重试。
   * 默认仅重试 GET / HEAD / OPTIONS / PUT / DELETE。
   */
  allowNonIdempotent?: boolean

  /**
   * 每次重试前的等待时间，单位毫秒。
   * 支持固定值或基于当前次数动态计算。
   */
  delay?:
    | number
    | ((attempt: number, error: AxiosError<ApiResponse<unknown>>) => number)
}

/**
 * 请求扩展配置。
 */
export interface HttpRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  /**
   * 是否自动携带 Token。
   */
  withToken?: boolean

  /**
   * 是否显示全局 Loading。
   */
  showLoading?: boolean

  /**
   * Loading 文案。
   */
  loadingText?: string

  /**
   * 业务报错时是否自动弹出提示。
   */
  showErrorMessage?: boolean

  /**
   * HTTP 状态错误时是否自动弹出提示。
   * 未单独配置时回退到 `showErrorMessage`。
   */
  showHttpErrorMessage?: boolean

  /**
   * 是否取消上一次相同请求，默认开启。
   */
  cancelDuplicate?: boolean

  /**
   * 自定义请求去重 Key。
   */
  requestKey?: string

  /**
   * 请求去重作用域。
   * 相同 scope 内的重复请求才会互相取消。
   */
  dedupeScope?: string

  /**
   * 自动重试配置，默认关闭。
   */
  retry?: false | RetryOptions

  /**
   * 返回完整业务响应体，而不是直接返回 data。
   */
  returnFullResponse?: boolean
}

/**
 * HttpRequest 实例级配置。
 */
export interface HttpRequestOptions extends AxiosRequestConfig {
  /**
   * 单例实例的默认请求配置。
   */
  defaultRequestConfig?: Omit<HttpRequestConfig, 'url' | 'method'>

  /**
   * 自定义 Token 获取策略。
   */
  tokenProvider?: () => string

  /**
   * 自定义清理认证态逻辑。
   */
  clearAuthState?: () => void

  /**
   * 自定义未授权处理逻辑。
   */
  onUnauthorized?: (
    error: AxiosError<ApiResponse<unknown>>
  ) => void | Promise<void>
}

/**
 * 上传文件时允许附带的额外字段。
 */
export type UploadPayload = Record<
  string,
  string | Blob | number | boolean | null | undefined
>

/**
 * 便捷请求方法的可选配置。
 */
export type HttpMethodConfig<D = unknown> = Omit<
  HttpRequestConfig<D>,
  'url' | 'method' | 'params' | 'data'
>

/**
 * 上传接口配置。
 */
export type UploadRequestConfig = HttpMethodConfig<FormData> & {
  headers?: RawAxiosRequestHeaders
}

/**
 * 内部扩展响应类型，透传原始请求配置，便于拦截器读取自定义字段。
 */
export type HttpAxiosResponse<T = unknown, D = unknown> = Omit<
  AxiosResponse<ApiResponse<T>, D>,
  'config'
> & {
  config: HttpRequestConfig<D>
}

/**
 * 统一业务异常模型。
 */
export class HttpBusinessError<T = unknown, D = unknown> extends Error {
  response: HttpAxiosResponse<T, D>

  config: HttpRequestConfig<D>

  constructor(response: HttpAxiosResponse<T, D>) {
    super(response.data.message || '请求失败')
    this.name = 'HttpBusinessError'
    this.response = response
    this.config = response.config
  }
}

/**
 * 组件内请求控制器。
 */
export interface UseRequestController {
  /**
   * 取消当前作用域内所有请求。
   */
  cancelAll: () => void
}

/**
 * 组合式请求状态。
 */
export interface UseRequestState<T> extends UseRequestController {
  loading: Readonly<Ref<boolean>>
  data: Readonly<Ref<T | null>>
  error: Readonly<Ref<Error | null>>
}

/**
 * 请求错误类型。
 */
export type HttpError<T = unknown> = AxiosError<ApiResponse<T>>

/**
 * 可参与 Header 合并的输入类型。
 */
export type HttpHeadersInput =
  | RawAxiosRequestHeaders
  | Record<string, AxiosHeaderValue | undefined>
