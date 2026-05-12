import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    const sidebarVisible = ref(true)
    const sidebarIconOnly = ref(false)
    const isDark = ref(false)

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

    function toggleDark() {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark', isDark.value)
    }

    function initTheme() {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      }
    }

    return {
      sidebarVisible,
      sidebarIconOnly,
      isDark,
      toggleSidebar,
      setSidebarVisible,
      toggleSidebarIconOnly,
      setSidebarIconOnly,
      toggleDark,
      initTheme,
    }
  },
  {
    persist: true,
  },
)