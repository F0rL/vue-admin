import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios'

/**
 * 后端标准响应结构。
 */
export interface ApiResponse<T> {
  code: number
  data: T
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
   * 每次重试前的等待时间，单位毫秒。
   * 支持固定值或基于当前次数动态计算。
   */
  delay?: number | ((attempt: number, error: AxiosError<ApiResponse<unknown>>) => number)
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
   * 业务成功状态码，默认 200。
   */
  successCode?: number

  /**
   * 业务报错时是否自动弹出提示。
   */
  showErrorMessage?: boolean

  /**
   * 是否取消上一次相同请求，默认开启。
   */
  cancelDuplicate?: boolean

  /**
   * 自定义请求去重 Key。
   */
  requestKey?: string

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
 * 上传文件时允许附带的额外字段。
 */
export type UploadPayload = Record<string, string | Blob | number | boolean | null | undefined>

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
  loading: Readonly<{ value: boolean }>
  data: Readonly<{ value: T | null }>
  error: Readonly<{ value: Error | null }>
}

/**
 * 请求错误类型。
 */
export type HttpError<T = unknown> = AxiosError<ApiResponse<T>>
