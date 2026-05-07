<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const isCollapse = computed(() => !appStore.sidebarOpened)
</script>

<template>
  <div class="h-14 flex items-center justify-center bg-white">
    <div class="flex items-center gap-3">
      <div
        class="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md"
      >
        <span class="text-white font-bold text-sm">V</span>
      </div>
      <transition name="fade">
        <span
          v-if="!isCollapse"
          class="text-base font-semibold text-slate-700 whitespace-nowrap"
        >
          Vue Admin
        </span>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
