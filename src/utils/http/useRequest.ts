import { onBeforeUnmount, ref } from 'vue'
import type { Ref } from 'vue'
import { HttpRequest } from './index'
import type {
  HttpMethodConfig,
  HttpRequestConfig,
  UseRequestState,
} from './types'

/**
 * 全局单例请求实例。
 */
export const http = new HttpRequest()

/**
 * 在组件作用域内使用请求实例，并在卸载时自动取消。
 */
export function useRequest() {
  const controllers = new Set<AbortController>()

  onBeforeUnmount(() => {
    controllers.forEach(controller => controller.abort())
    controllers.clear()
  })

  function withSignal<T>(
    executor: (config: HttpRequestConfig) => Promise<T>,
    config: HttpRequestConfig = {}
  ) {
    const controller = new AbortController()
    controllers.add(controller)

    return executor({
      ...config,
      signal: controller.signal,
    }).finally(() => {
      controllers.delete(controller)
    })
  }

  function get<T>(
    url: string,
    params?: HttpRequestConfig['params'],
    config?: HttpMethodConfig
  ) {
    return withSignal(
      nextConfig => http.get<T>(url, params, nextConfig),
      config
    )
  }

  function post<T, D = unknown>(
    url: string,
    data?: D,
    config?: HttpMethodConfig<D>
  ) {
    return withSignal(
      nextConfig => http.post<T, D>(url, data, nextConfig),
      config
    )
  }

  function put<T, D = unknown>(
    url: string,
    data?: D,
    config?: HttpMethodConfig<D>
  ) {
    return withSignal(
      nextConfig => http.put<T, D>(url, data, nextConfig),
      config
    )
  }

  function patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: HttpMethodConfig<D>
  ) {
    return withSignal(
      nextConfig => http.patch<T, D>(url, data, nextConfig),
      config
    )
  }

  function del<T, D = unknown>(
    url: string,
    data?: D,
    config?: HttpMethodConfig<D>
  ) {
    return withSignal(
      nextConfig => http.delete<T, D>(url, data, nextConfig),
      config
    )
  }

  function request<T>(config: HttpRequestConfig) {
    return withSignal(nextConfig =>
      http.request<T>({ ...config, ...nextConfig })
    )
  }

  return {
    http,
    get,
    post,
    put,
    patch,
    delete: del,
    request,
    cancelAll() {
      controllers.forEach(controller => controller.abort())
      controllers.clear()
    },
  }
}

/**
 * 极简 GET 状态钩子。
 */
export function useGet<T>(
  url: string,
  params?: HttpRequestConfig['params'],
  config?: HttpMethodConfig
): UseRequestState<T> & { execute: () => Promise<T> } {
  const { get, cancelAll } = useRequest()
  const loading = ref(false)
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)

  async function execute() {
    loading.value = true
    error.value = null

    try {
      const result = await get<T>(url, params, config)
      data.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('请求失败')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading: loading as Ref<boolean>,
    data: data as Ref<T | null>,
    error: error as Ref<Error | null>,
    execute,
    cancelAll,
  }
}
