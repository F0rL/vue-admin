import 'vue'
import type { FeedbackService } from '@/utils/feedback'

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * 全局反馈服务：
     * `this.$feedback.success('保存成功')`
     * `await this.$feedback.confirm('确定删除？')`
     *
     * 仅在 `setupFeedback(app, { exposeToGlobalProperties: true })`
     * 时才会实际挂载到组件实例。
     */
    $feedback: FeedbackService
  }
}

export {}
