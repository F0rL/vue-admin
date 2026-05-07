<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { logoutAndReset } from '@/router'
import {
  Expand,
  Fold,
  User,
  Setting,
  SwitchButton,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const isCollapse = computed(() => !appStore.sidebarOpened)

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
  logoutAndReset()
  await nextTick()
  router.replace('/auth/login')
}
</script>

<template>
  <div
    class="h-14 px-4 flex items-center justify-between bg-white border-b border-slate-200/80"
  >
    <div class="flex items-center gap-3">
      <el-button
        text
        @click="handleToggleSidebar"
        class="text-slate-500! hover:text-blue-600!"
      >
        <el-icon :size="20">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
      </el-button>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in breadcrumbs"
          :key="item.path"
          :to="{ path: item.path }"
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
              <el-icon><User /></el-icon>
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
