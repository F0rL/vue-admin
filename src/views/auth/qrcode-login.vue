<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function backToLogin() {
  router.push('/auth/login')
}
</script>

<template>
  <div
    class="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-7"
  >
    <div class="text-center">
      <button
        type="button"
        class="mb-5 inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        @click="backToLogin"
      >
        <el-icon><ArrowLeft /></el-icon>
        返回账号登录
      </button>
      <h2 class="mt-[18px] text-[24px] font-bold text-slate-900 sm:text-[26px]">
        扫码登录
      </h2>
      <p class="mt-2 text-sm text-slate-500">
        请使用企业微信或移动端管理应用扫码完成登录
      </p>
    </div>

    <div
      class="mx-auto my-6 flex items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.96))] p-5"
    >
      <div
        class="relative aspect-square w-full max-w-[220px] rounded-[24px] bg-[linear-gradient(90deg,#0f172a_10px,transparent_10px),linear-gradient(#0f172a_10px,transparent_10px),linear-gradient(135deg,#1e293b_0%,#0f766e_100%)] bg-[position:0_0,0_0,0_0] bg-[size:24px_24px,24px_24px,100%_100%] shadow-[inset_0_0_0_14px_#fff] before:absolute before:left-[18px] before:top-[18px] before:h-14 before:w-14 before:rounded-2xl before:border-[10px] before:border-white before:bg-white/35 before:content-[''] after:absolute after:bottom-[18px] after:right-[18px] after:h-14 after:w-14 after:rounded-2xl after:border-[10px] after:border-white after:bg-white/35 after:content-['']"
      ></div>
    </div>

    <el-alert
      type="success"
      :closable="false"
      show-icon
      title="二维码示意区域"
      description="后续接入真实二维码后，可在此增加状态轮询、扫码成功跳转等逻辑。"
    />
  </div>
</template>
