<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { logoutAndReset } from '@/router'
import { CommonIcon } from '@/components/CommonIcon'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const isSidebarHidden = computed(() => !appStore.sidebarVisible)

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched.map(item => ({
    title: item.meta.title as string,
    path: item.path,
  }))
})

function handleToggleSidebar() {
  appStore.toggleSidebar()
}

async function handleLogout() {
  await logoutAndReset()
}
</script>

<template>
  <div
    class="h-14 px-4 flex items-center justify-between bg-white border-b border-slate-200/80"
  >
    <div class="flex items-center gap-3">
      <div
        @click="handleToggleSidebar"
        class="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
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
      <el-dropdown trigger="click">
        <div
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <el-avatar :size="32" class="bg-blue-500! text-white!">
            {{ userStore.userInfo?.name?.charAt(0)?.toUpperCase() || 'U' }}
          </el-avatar>
          <span class="text-sm font-medium text-slate-700">
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
