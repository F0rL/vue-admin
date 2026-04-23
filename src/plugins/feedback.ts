import type { App, Plugin } from 'vue'
import { FEEDBACK_INJECTION_KEY, feedback } from '@/utils/feedback'

export interface FeedbackPluginOptions {
  /**
   * 是否额外挂载到 `app.config.globalProperties.$feedback`。
   * 默认关闭，优先使用 `provide/inject`，减少全局实例代理上的属性扩展。
   */
  exposeToGlobalProperties?: boolean
}

/**
 * 创建反馈插件。
 * 默认仅通过 `provide/inject` 暴露，按需再开启 `this.$feedback`。
 */
export function createFeedbackPlugin(
  options: FeedbackPluginOptions = {}
): Plugin {
  const { exposeToGlobalProperties = false } = options

  return {
    install(app: App) {
      if (exposeToGlobalProperties) {
        app.config.globalProperties.$feedback = feedback
      }

      app.provide(FEEDBACK_INJECTION_KEY, feedback)
    },
  }
}

/**
 * 统一入口，便于在 `main.ts` 中按项目规范注册。
 * 默认不挂到全局组件实例，避免不必要的全局代理属性。
 */
export function setupFeedback(
  app: App,
  options: FeedbackPluginOptions = {}
) {
  app.use(createFeedbackPlugin(options))
}

export { feedback }
