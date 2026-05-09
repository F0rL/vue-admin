import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    const sidebarVisible = ref(true)
    const sidebarIconOnly = ref(false)

    function toggleSidebar() {
      sidebarVisible.value = !sidebarVisible.value
    }

    function setSidebarVisible(visible: boolean) {
      sidebarVisible.value = visible
    }

    function toggleSidebarIconOnly() {
      sidebarIconOnly.value = !sidebarIconOnly.value
    }

    function setSidebarIconOnly(iconOnly: boolean) {
      sidebarIconOnly.value = iconOnly
    }

    return {
      sidebarVisible,
      sidebarIconOnly,
      toggleSidebar,
      setSidebarVisible,
      toggleSidebarIconOnly,
      setSidebarIconOnly,
    }
  },
  {
    persist: true,
  },
)