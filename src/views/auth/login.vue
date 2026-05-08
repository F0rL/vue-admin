<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { Lock, Message, User } from '@element-plus/icons-vue'
import { feedback } from '@/utils/feedback'
import { useUserStore } from '@/store/modules/user'

interface LoginForm {
  username: string
  password: string
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appName = import.meta.env.VITE_APP_NAME || 'Admin App'

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
      }
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

function goToQrcode() {
  router.push('/auth/qrcode-login')
}
</script>

<template>
  <div
    class="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-7"
  >
    <div class="flex items-center gap-3.5">
      <div>
        <h2
          class="text-[24px] leading-tight font-bold text-slate-900 sm:text-[26px]"
        >
          {{ appName }}
        </h2>
        <p class="mt-1.5 text-sm text-slate-500">
          欢迎回来，请登录后继续访问后台系统
        </p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-2 rounded-[18px] bg-slate-50 p-1.5">
      <button
        class="h-11 rounded-[14px] bg-white text-sm font-semibold text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
        type="button"
      >
        账号登录
      </button>
      <button
        class="h-11 rounded-[14px] bg-transparent text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        type="button"
        @click="goToQrcode"
      >
        扫码登录
      </button>
    </div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      size="large"
      class="mt-5"
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
      <div class="mb-5 flex items-center justify-between gap-3">
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <button
          type="button"
          class="border-0 bg-transparent text-sm text-blue-600 transition hover:text-blue-700"
        >
          忘记密码？
        </button>
      </div>

      <el-button
        type="primary"
        class="h-12 w-full rounded-[14px] border-0 bg-[linear-gradient(135deg,#2563eb_0%,#0f766e_100%)] shadow-[0_16px_30px_rgba(37,99,235,0.22)]"
        :loading="submitting"
        @click="handleSubmit"
      >
        立即登录
      </el-button>
    </el-form>

    <el-divider>其他方式</el-divider>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-slate-300/90 bg-white text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
      >
        <el-icon><Message /></el-icon>
        短信登录
      </button>
      <button
        type="button"
        class="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-slate-300/90 bg-white text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
        @click="goToQrcode"
      >
        <el-icon></el-icon>
        企业微信扫码
      </button>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-alert) {
  border-radius: 16px;
}

:deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 14px;
  box-shadow: 0 0 0 1px rgba(226, 232, 240, 0.9) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow:
    0 0 0 1px #3b82f6 inset,
    0 0 0 4px rgba(59, 130, 246, 0.08);
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
