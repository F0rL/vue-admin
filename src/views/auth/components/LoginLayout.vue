<script setup lang="ts">
defineProps<{
  activeTab: 'account' | 'qrcode'
}>()

const emit = defineEmits<{
  'update:activeTab': [tab: 'account' | 'qrcode']
}>()

const appName = import.meta.env.VITE_APP_NAME || 'Admin'
</script>

<template>
  <div class="w-full">
    <!-- Header -->
    <div class="text-center lg:text-left">
      <h1 class="text-2xl font-bold text-slate-900">{{ appName }}</h1>
      <p class="mt-2 text-sm text-slate-500">登录以继续访问后台系统</p>
    </div>

    <!-- Tab switcher -->
    <div class="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
      <button
        type="button"
        class="h-10 rounded-lg text-sm font-medium transition cursor-pointer"
        :class="
          activeTab === 'account'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        "
        @click="emit('update:activeTab', 'account')"
      >
        账号登录
      </button>
      <button
        type="button"
        class="h-10 rounded-lg text-sm font-medium transition cursor-pointer"
        :class="
          activeTab === 'qrcode'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        "
        @click="emit('update:activeTab', 'qrcode')"
      >
        扫码登录
      </button>
    </div>
  </div>
</template>
