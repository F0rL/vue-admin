<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { logoutAndReset } from '@/router'
import { getBreadcrumbByPath } from '@/router/utils'
import type { BreadcrumbItem } from '@/router/utils'
import { CommonIcon } from '@/components/CommonIcon'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const isSidebarHidden = computed(() => !appStore.sidebarVisible)

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const menus = userStore.menuTree
  if (!menus?.length) {
    const matched = route.matched.filter(item => item.meta?.title)
    return matched.map(item => ({
      title: item.meta.title as string,
      path: item.path,
    }))
  }
  return getBreadcrumbByPath(menus, route.path)
})

function handleToggleSidebar() {
  appStore.toggleSidebar()
}

function handleToggleTheme(e: MouseEvent) {
  const x = e.clientX
  const y = e.clientY
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  if (!document.startViewTransition) {
    appStore.toggleDark()
    return
  }

  const transition = document.startViewTransition(() => {
    appStore.toggleDark()
  })

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0% at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
}

async function handleLogout() {
  await logoutAndReset()
}
</script>

<template>
  <div
    class="h-14 px-4 flex items-center justify-between transition-colors"
    :class="appStore.isDark ? 'bg-(--app-header-bg) border-b border-(--app-border-color)' : 'bg-white border-b border-slate-200/80'"
  >
    <div class="flex items-center gap-3">
      <div
        @click="handleToggleSidebar"
        class="flex items-center justify-center p-2 rounded-md cursor-pointer transition-colors"
        :class="appStore.isDark ? 'hover:bg-(--app-menu-hover-item-bg) text-(--app-text-color)' : 'bg-gray-100 hover:bg-gray-200'"
      >
        <CommonIcon :icon="isSidebarHidden ? 'el-Expand' : 'el-Fold'" :size="16" />
      </div>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in breadcrumbs"
          :key="item.path"
          :to="item.path === route.path ? { path: item.path } : undefined"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex items-center gap-1">
      <el-tooltip
        :content="appStore.isDark ? '切换亮色模式' : '切换暗色模式'"
        placement="bottom"
      >
        <div
          @click="handleToggleTheme"
          class="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors"
          :class="appStore.isDark ? 'text-(--app-text-color) hover:bg-(--app-header-hover-bg)' : 'text-slate-500 hover:bg-gray-100'"
        >
          <CommonIcon :icon="appStore.isDark ? 'el-Sunny' : 'el-Moon'" :size="18" />
        </div>
      </el-tooltip>

      <el-dropdown trigger="click">
        <div
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
          :class="appStore.isDark ? 'hover:bg-(--app-header-hover-bg)' : 'hover:bg-slate-50'"
        >
          <el-avatar :size="32" class="bg-blue-500! text-white!">
            {{ userStore.userInfo?.name?.charAt(0)?.toUpperCase() || 'U' }}
          </el-avatar>
          <span
            class="text-sm font-medium"
            :class="appStore.isDark ? 'text-(--app-text-color)' : 'text-slate-700'"
          >
            {{ userStore.userInfo?.name || 'Admin' }}
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <CommonIcon icon="el-User" :size="16" />
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <CommonIcon icon="el-Setting" :size="16" />
              <span>系统设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <CommonIcon icon="el-SwitchButton" :size="16" />
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
