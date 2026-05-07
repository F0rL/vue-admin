import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    const sidebarOpened = ref(true)

    function toggleSidebar() {
      sidebarOpened.value = !sidebarOpened.value
    }

    function setSidebarOpened(opened: boolean) {
      sidebarOpened.value = opened
    }

    return {
      sidebarOpened,
      toggleSidebar,
      setSidebarOpened,
    }
  },
  {
    persist: true,
  },
)