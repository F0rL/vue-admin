import { onBeforeUnmount, ref, shallowRef } from 'vue'
import type { Ref } from 'vue'
import type { GenericAbortSignal } from 'axios'
import { router, resetRouter } from '@/router'
import { store } from '@/store'
import { useUserStore } from '@/store/modules/user'
import { HttpRequest } from './index'
import type {
  HttpMethodConfig,
  HttpRequestConfig,
  UseRequestState,
} from './types'

/**
 * 全局单例请求实例。
 */
export const http = new HttpRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
  defaultRequestConfig: {
    withToken: true,
    showErrorMessage: true,
    cancelDuplicate: true,
    retry: false,
  },
  tokenProvider: () => {
    const userStore = useUserStore(store)
    return userStore.token
  },
  clearAuthState: () => {
    const userStore = useUserStore(store)
    userStore.$reset()
    resetRouter()
  },
  onUnauthorized: async () => {
    const currentPath = router.currentRoute.value.fullPath

    if (currentPath !== '/auth/login') {
      await router.push({
        path: '/auth/login',
        query: {
          redirect: currentPath,
        },
      })
    }
  },
})
let requestScopeSeed = 0

function mergeSignals(
  signals: Array<AbortSignal | GenericAbortSignal | undefined>
): AbortSignal | undefined {
  const availableSignals = signals.filter(
    (signal): signal is AbortSignal | GenericAbortSignal => signal !== undefined
  )

  if (availableSignals.length === 0) {
    return undefined
  }

  if (availableSignals.length === 1) {
    const [signal] = availableSignals
    return signal instanceof AbortSignal ? signal : undefined
  }

  const controller = new AbortController()

  const abort = () => {
    controller.abort()
  }

  for (const signal of availableSignals) {
    if (signal.aborted) {
      abort()
      break
    }

    signal.addEventListener?.('abort', abort, { once: true })
  }

  return controller.signal
}

/**
 * 在组件作用域内使用请求实例，并在卸载时自动取消。
 */
export function useRequest() {
  const controllers = new Set<AbortController>()
  const dedupeScope = `scope_${Date.now()}_${++requestScopeSeed}`

  function cancelAllControllers() {
    controllers.forEach(controller => controller.abort())
    controllers.clear()
  }

  onBeforeUnmount(() => {
    cancelAllControllers()
  })

  function withSignal<T>(
    executor: (config: HttpRequestConfig) => Promise<T>,
    config: HttpRequestConfig = {}
  ) {
    const controller = new AbortController()
    controllers.add(controller)

    return executor({
      ...config,
      dedupeScope: config.dedupeScope ?? dedupeScope,
      signal: mergeSignals([config.signal, controller.signal]),
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
      cancelAllControllers()
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
  const data = shallowRef<T | null>(null)
  const error = shallowRef<Error | null>(null)
  let currentRequestId = 0

  async function execute() {
    const requestId = ++currentRequestId
    loading.value = true
    error.value = null

    try {
      const result = await get<T>(url, params, config)
      if (requestId === currentRequestId) {
        data.value = result
      }
      return result
    } catch (err) {
      const nextError = err instanceof Error ? err : new Error('请求失败')
      if (requestId === currentRequestId) {
        error.value = nextError
      }
      throw nextError
    } finally {
      if (requestId === currentRequestId) {
        loading.value = false
      }
    }
  }

  return {
    loading,
    data,
    error,
    execute,
    cancelAll,
  }
}

/**
 * 为异步操作附加 loading 状态。
 *
 * 适合表单提交、按钮点击等需要控制 loading 状态的场景，
 * 避免在每个组件中手动维护 `ref(false)` + try/finally。
 *
 * @example
 * ```ts
 * const { loading, execute } = useLoading(userStore.login)
 *
 * // 模板中使用
 * <el-button :loading="loading" @click="execute('admin', '123')">登录</el-button>
 * ```
 */
export function useLoading<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
): {
  loading: Ref<boolean>
  execute: (...args: TArgs) => Promise<TReturn | undefined>
} {
  const loading = ref(false)

  async function execute(
    ...args: TArgs
  ): Promise<TReturn | undefined> {
    if (loading.value) return

    loading.value = true
    try {
      return await fn(...args)
    } finally {
      loading.value = false
    }
  }

  return { loading, execute }
}
