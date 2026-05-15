<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowLeft, Lock, Message, User } from '@element-plus/icons-vue'
import { feedback } from '@/utils/feedback'
import { useUserStore } from '@/store/modules/user'

interface LoginForm {
  username: string
  password: string
}

const emit = defineEmits<{
  switchToQrcode: []
}>()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = useTemplateRef<FormInstance>('formRef')
const submitting = ref(false)
const rememberMe = ref(true)

const form = reactive<LoginForm>({
  username: 'admin',
  password: '123456',
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, message: '账号长度不能少于 3 位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
})

async function handleSubmit() {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    submitting.value = true

    await feedback.withLoading(
      () => userStore.login(form.username, form.password),
      {
        text: '正在登录，请稍候...',
        minDuration: 500,
      },
    )

    feedback.notifySuccess('登录成功', `欢迎回来，${form.username}`, {
      duration: 2500,
    })

    const redirectPath =
      typeof route.query.redirect === 'string' && route.query.redirect
        ? route.query.redirect
        : userStore.getFirstRoutePath() || '/dashboard/index'
    await router.push(redirectPath)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '登录失败，请稍后重试'
    feedback.error(message)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mt-6">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      size="large"
    >
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入账号"
          class="login-input"
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="请输入密码"
          class="login-input"
          @keyup.enter="handleSubmit"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <div class="-mt-2 mb-6 flex items-center justify-between">
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <button
          type="button"
          class="cursor-pointer border-0 bg-transparent text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          忘记密码？
        </button>
      </div>

      <el-button
        type="primary"
        size="large"
        class="login-btn"
        :loading="submitting"
        @click="handleSubmit"
      >
        登&nbsp;&nbsp;录
      </el-button>
    </el-form>

    <!-- Other login methods -->
    <div class="mt-8">
      <div class="flex items-center gap-3">
        <span class="h-px flex-1 bg-slate-200" />
        <span class="shrink-0 text-xs text-slate-400">其他方式</span>
        <span class="h-px flex-1 bg-slate-200" />
      </div>

      <div class="mt-5 grid grid-cols-2 gap-3">
        <button type="button" class="secondary-btn">
          <el-icon><Message /></el-icon>
          短信登录
        </button>
        <button
          type="button"
          class="secondary-btn"
          @click="emit('switchToQrcode')"
        >
          <el-icon />
          企业微信扫码
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-input__wrapper) {
  min-height: 48px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  padding-left: 12px;
  transition: box-shadow 0.2s;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow:
    0 0 0 1px #3b82f6 inset,
    0 0 0 4px rgba(59, 130, 246, 0.1);
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #64748b;
}

.login-btn {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
  transition:
    box-shadow 0.2s,
    transform 0.15s;
}

.login-btn:hover {
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

.secondary-btn {
  display: inline-flex;
  height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    color 0.2s;
}

.secondary-btn:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}
</style>
