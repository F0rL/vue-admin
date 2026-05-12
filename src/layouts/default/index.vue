<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Logo from '../components/Logo.vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'

const appStore = useAppStore()
const userStore = useUserStore()

onMounted(() => {
  appStore.initTheme()
})

const sidebarWidthClass = computed(() => {
  if (!appStore.sidebarVisible) return 'w-0 overflow-hidden'
  return appStore.sidebarIconOnly ? 'w-16' : 'w-56'
})

const menuList = computed(() => {
  const menus = userStore.menuTree
  if (!menus?.length) return []
  return menus.map(menu => ({
    path: menu.path,
    name: menu.name,
    title: menu.title,
    icon: menu.icon,
    children: menu.children?.map(child => ({
      path: `${menu.path}/${child.path}`.replace(/\/+/g, '/'),
      name: child.name,
      title: child.title,
      icon: child.icon,
    })),
  }))
})
</script>

<template>
  <div class="h-screen w-screen flex bg-gray-100 dark:bg-(--app-bg-color)">
    <!-- 侧边栏 -->
    <aside
      :class="[
        'h-full flex flex-col bg-white dark:bg-(--app-sidebar-bg) border-r border-gray-200 dark:border-(--app-border-color) transition-all duration-300',
        sidebarWidthClass,
      ]"
    >
      <Logo />
      <Sidebar :menu-list="menuList" />
    </aside>

    <!-- 右侧内容区 -->
    <div class="flex-1 flex flex-col min-w-0">
      <Header />
      <main class="flex-1 overflow-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
