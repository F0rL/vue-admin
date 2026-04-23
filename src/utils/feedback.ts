import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from 'element-plus'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import type { InjectionKey, VNode } from 'vue'
import { inject, isVNode } from 'vue'
import type { LoadingOptions } from 'element-plus/es/components/loading/src/types'
import type {
  MessageHandler,
  MessageOptions,
  MessageType,
} from 'element-plus/es/components/message/src/message'
import type {
  ElMessageBoxOptions,
  MessageBoxData,
} from 'element-plus/es/components/message-box/src/message-box.type'
import type {
  NotificationHandle,
  NotificationOptions,
  NotificationType,
} from 'element-plus/es/components/notification/src/notification'

type Awaitable<T> = T | Promise<T>

/**
 * `ElMessage` 支持的消息内容类型。
 * 业务侧可直接传字符串，也可传 VNode/渲染函数。
 */
export type FeedbackMessageContent = NonNullable<MessageOptions['message']>

/**
 * `ElNotification` 支持的消息内容类型。
 */
export type FeedbackNotificationContent = NonNullable<
  NotificationOptions['message']
>

/**
 * Loading 文案支持字符串和 VNode。
 */
export type FeedbackLoadingText = string | VNode | VNode[]

/**
 * 通用 Message 配置。
 * 默认会自动补齐 `grouping: true` 和 `duration: 3000`。
 */
export interface FeedbackMessageOptions extends Omit<
  MessageOptions,
  'message'
> {
  message: FeedbackMessageContent
}

/**
 * 快捷消息方法的附加配置，业务侧无需重复传 `type` 和 `message`。
 */
export type FeedbackTypedMessageOptions = Omit<
  MessageOptions,
  'message' | 'type'
>

/**
 * 通知配置，`title` 与 `message` 为必填。
 */
export interface FeedbackNotificationOptions extends Omit<
  NotificationOptions,
  'title' | 'message'
> {
  title: string
  message: FeedbackNotificationContent
}

/**
 * 快捷通知方法的附加配置，业务侧无需重复传 `type`、`title`、`message`。
 */
export type FeedbackTypedNotificationOptions = Omit<
  NotificationOptions,
  'title' | 'message' | 'type'
>

/**
 * 二次封装后的确认弹窗配置。
 * 默认禁止点击遮罩关闭。
 */
export interface FeedbackConfirmOptions extends Omit<
  ElMessageBoxOptions,
  'message' | 'title'
> {
  title?: string
}

/**
 * 二次封装后的提醒弹窗配置。
 */
export interface FeedbackAlertOptions extends Omit<
  ElMessageBoxOptions,
  'message' | 'title' | 'showCancelButton'
> {
  title?: string
}

/**
 * 二次封装后的输入弹窗配置。
 */
export interface FeedbackPromptOptions extends Omit<
  ElMessageBoxOptions,
  'message' | 'title'
> {
  title?: string
}

/**
 * Loading 扩展配置。
 * `minDuration` 用于避免接口太快完成时产生闪烁。
 */
export interface FeedbackLoadingOptions extends LoadingOptions {
  minDuration?: number
}

/**
 * Loading 控制器。
 */
export interface FeedbackLoadingController {
  /**
   * 关闭 Loading。
   * 若未达到最短展示时间，会等待到达后再关闭。
   */
  close: () => Promise<void>

  /**
   * 动态更新 Loading 文案。
   */
  setText: (text: FeedbackLoadingText) => void
}

/**
 * 统一反馈服务。
 * 推荐在 `<script setup>` 中直接导入 `feedback` 或 `useFeedback()` 使用。
 */
export interface FeedbackService {
  /**
   * 通用消息提示。
   * 既支持 `feedback.message('保存成功')`，
   * 也支持 `feedback.message({ message: '保存成功', duration: 5000 })`。
   */
  message: (
    input: FeedbackMessageContent | FeedbackMessageOptions
  ) => MessageHandler
  success: (
    message: FeedbackMessageContent,
    options?: FeedbackTypedMessageOptions
  ) => MessageHandler
  error: (
    message: FeedbackMessageContent,
    options?: FeedbackTypedMessageOptions
  ) => MessageHandler
  warning: (
    message: FeedbackMessageContent,
    options?: FeedbackTypedMessageOptions
  ) => MessageHandler
  info: (
    message: FeedbackMessageContent,
    options?: FeedbackTypedMessageOptions
  ) => MessageHandler
  notification: (options: FeedbackNotificationOptions) => NotificationHandle
  notifySuccess: (
    title: string,
    message: FeedbackNotificationContent,
    options?: FeedbackTypedNotificationOptions
  ) => NotificationHandle
  notifyError: (
    title: string,
    message: FeedbackNotificationContent,
    options?: FeedbackTypedNotificationOptions
  ) => NotificationHandle
  notifyWarning: (
    title: string,
    message: FeedbackNotificationContent,
    options?: FeedbackTypedNotificationOptions
  ) => NotificationHandle
  notifyInfo: (
    title: string,
    message: FeedbackNotificationContent,
    options?: FeedbackTypedNotificationOptions
  ) => NotificationHandle
  confirm: (
    message: NonNullable<ElMessageBoxOptions['message']>,
    options?: FeedbackConfirmOptions
  ) => Promise<boolean>
  alert: (
    message: NonNullable<ElMessageBoxOptions['message']>,
    options?: FeedbackAlertOptions
  ) => Promise<void>
  prompt: (
    message: NonNullable<ElMessageBoxOptions['message']>,
    options?: FeedbackPromptOptions
  ) => Promise<string | null>
  createLoading: (options?: FeedbackLoadingOptions) => FeedbackLoadingController

  /**
   * 包装异步任务并自动管理 Loading 生命周期。
   * 无论成功还是失败，都会在最短展示时间满足后自动关闭 Loading。
   */
  withLoading: <T>(
    fn: () => Awaitable<T>,
    options?: FeedbackLoadingOptions
  ) => Promise<Awaited<T>>
}

// 默认开启 grouping，避免同内容短时间重复弹出。
const DEFAULT_MESSAGE_OPTIONS = {
  duration: 3000,
  grouping: true,
} as const satisfies Pick<MessageOptions, 'duration' | 'grouping'>

const DEFAULT_NOTIFICATION_OPTIONS = {
  duration: 4500,
} as const satisfies Pick<NotificationOptions, 'duration'>

const DEFAULT_MESSAGE_BOX_OPTIONS = {
  closeOnClickModal: false,
} as const satisfies Pick<ElMessageBoxOptions, 'closeOnClickModal'>

const DEFAULT_LOADING_OPTIONS = {
  lock: true,
  text: '加载中...',
  minDuration: 300,
} as const satisfies Pick<
  FeedbackLoadingOptions,
  'lock' | 'text' | 'minDuration'
>

const DEFAULT_CONFIRM_OPTIONS = {
  ...DEFAULT_MESSAGE_BOX_OPTIONS,
  type: 'warning',
  title: '提示',
  confirmButtonText: '确定',
  cancelButtonText: '取消',
} as const satisfies FeedbackConfirmOptions

const DEFAULT_ALERT_OPTIONS = {
  ...DEFAULT_MESSAGE_BOX_OPTIONS,
  type: 'info',
  title: '提示',
  confirmButtonText: '我知道了',
  showCancelButton: false,
} as const satisfies FeedbackAlertOptions & { showCancelButton: false }

const DEFAULT_PROMPT_OPTIONS = {
  ...DEFAULT_MESSAGE_BOX_OPTIONS,
  title: '请输入',
  confirmButtonText: '确定',
  cancelButtonText: '取消',
} as const satisfies FeedbackPromptOptions

function sleep(duration: number): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, duration)
  })
}

function normalizeMinDuration(duration?: number): number {
  if (typeof duration !== 'number' || Number.isNaN(duration)) {
    return DEFAULT_LOADING_OPTIONS.minDuration
  }

  return Math.max(duration, 0)
}

function isMessageOptions(
  input: FeedbackMessageContent | FeedbackMessageOptions
): input is FeedbackMessageOptions {
  return typeof input === 'object' && input !== null && !isVNode(input)
}

function createTypedMessage(type: MessageType): FeedbackService['success'] {
  return (message, options) =>
    ElMessage({
      ...DEFAULT_MESSAGE_OPTIONS,
      ...options,
      type,
      message,
    })
}

function createTypedNotification(
  type: NotificationType
): FeedbackService['notifySuccess'] {
  return (title, message, options) =>
    ElNotification({
      ...DEFAULT_NOTIFICATION_OPTIONS,
      ...options,
      type,
      title,
      message,
    })
}

function resolvePromptValue(result: MessageBoxData): string | null {
  const { value } = result as { value?: unknown }
  return typeof value === 'string' ? value : null
}

async function openMessageBoxWithBooleanResult(
  message: NonNullable<ElMessageBoxOptions['message']>,
  options?: FeedbackConfirmOptions
): Promise<boolean> {
  try {
    await ElMessageBox.confirm(
      message,
      options?.title ?? DEFAULT_CONFIRM_OPTIONS.title,
      {
        ...DEFAULT_CONFIRM_OPTIONS,
        ...options,
      }
    )

    return true
  } catch {
    return false
  }
}

async function openAlertMessageBox(
  message: NonNullable<ElMessageBoxOptions['message']>,
  options?: FeedbackAlertOptions
): Promise<void> {
  try {
    await ElMessageBox.alert(
      message,
      options?.title ?? DEFAULT_ALERT_OPTIONS.title,
      {
        ...DEFAULT_ALERT_OPTIONS,
        ...options,
        showCancelButton: false,
      }
    )
  } catch {
    return
  }
}

async function openPromptMessageBox(
  message: NonNullable<ElMessageBoxOptions['message']>,
  options?: FeedbackPromptOptions
): Promise<string | null> {
  try {
    const result = await ElMessageBox.prompt(
      message,
      options?.title ?? DEFAULT_PROMPT_OPTIONS.title,
      {
        ...DEFAULT_PROMPT_OPTIONS,
        ...options,
      }
    )

    return resolvePromptValue(result)
  } catch {
    return null
  }
}

function createLoadingController(
  options: FeedbackLoadingOptions = {}
): FeedbackLoadingController {
  const {
    minDuration: rawMinDuration = DEFAULT_LOADING_OPTIONS.minDuration,
    ...loadingOptions
  } = options
  const minDuration = normalizeMinDuration(rawMinDuration)
  const startedAt = Date.now()
  const instance = ElLoading.service({
    ...DEFAULT_LOADING_OPTIONS,
    ...loadingOptions,
  })

  let closePromise: Promise<void> | null = null

  return {
    close() {
      if (closePromise) {
        return closePromise
      }

      closePromise = (async () => {
        const elapsed = Date.now() - startedAt
        const remaining = Math.max(minDuration - elapsed, 0)

        if (remaining > 0) {
          await sleep(remaining)
        }

        instance.close()
      })()

      return closePromise
    },

    setText(text) {
      instance.setText(text)
    },
  }
}

export const FEEDBACK_INJECTION_KEY: InjectionKey<FeedbackService> =
  Symbol('feedback')

export const feedback: FeedbackService = {
  message(input) {
    if (isMessageOptions(input)) {
      return ElMessage({
        ...DEFAULT_MESSAGE_OPTIONS,
        ...input,
      })
    }

    return ElMessage({
      ...DEFAULT_MESSAGE_OPTIONS,
      message: input,
    })
  },

  success: createTypedMessage('success'),
  error: createTypedMessage('error'),
  warning: createTypedMessage('warning'),
  info: createTypedMessage('info'),

  notification(options) {
    return ElNotification({
      ...DEFAULT_NOTIFICATION_OPTIONS,
      ...options,
    })
  },

  notifySuccess: createTypedNotification('success'),
  notifyError: createTypedNotification('error'),
  notifyWarning: createTypedNotification('warning'),
  notifyInfo: createTypedNotification('info'),

  confirm(message, options) {
    return openMessageBoxWithBooleanResult(message, options)
  },

  alert(message, options) {
    return openAlertMessageBox(message, options)
  },

  prompt(message, options) {
    return openPromptMessageBox(message, options)
  },

  createLoading(options = {}) {
    return createLoadingController(options)
  },

  async withLoading<T>(
    fn: () => Awaitable<T>,
    options?: FeedbackLoadingOptions
  ): Promise<Awaited<T>> {
    const loading = createLoadingController(options)

    try {
      const result = await fn()
      return result as Awaited<T>
    } finally {
      await loading.close()
    }
  },
}

export function useFeedback(): FeedbackService {
  return inject(FEEDBACK_INJECTION_KEY, feedback)
}
