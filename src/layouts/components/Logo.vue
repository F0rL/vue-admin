<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
</script>

<template>
  <div
    class="h-14 px-2 flex items-center justify-center bg-white overflow-hidden transition-all duration-300"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div
        class="w-8 h-8 shrink-0 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md"
      >
        <span class="text-white font-bold text-sm">V</span>
      </div>
      <span
        v-show="!appStore.sidebarIconOnly"
        class="text-base font-semibold text-slate-700 whitespace-nowrap"
      >
        Vue Admin
      </span>
    </div>
  </div>
</template>
