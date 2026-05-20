<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { CommonIcon } from '@/components/CommonIcon'
import type { MenuItem } from './types'

defineProps<{
  menuList: MenuItem[]
}>()

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isCollapse = computed(() => appStore.sidebarIconOnly)

function handleMenuClick(item: MenuItem) {
  router.push(item.path)
}

function handleToggleIconOnly() {
  appStore.toggleSidebarIconOnly()
}
</script>

<template>
  <div
    :class="[
      'flex-1 overflow-x-hidden transition-all duration-300',
      isCollapse ? 'w-16' : 'w-56',
    ]"
  >
    <el-menu
      :default-active="route.path"
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="false"
      class="sidebar-menu border-none!"
      background-color="transparent"
      text-color="#475569"
      active-text-color="#2563eb"
    >
      <template v-for="item in menuList" :key="item.path">
        <el-sub-menu v-if="item.children?.length" :index="item.path">
          <template #title>
            <CommonIcon v-if="item.icon" :icon="item.icon" :size="18" />
            <span class="font-medium">{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
            @click="handleMenuClick(child)"
          >
            <CommonIcon v-if="child.icon" :icon="child.icon" :size="16" />
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.path" @click="handleMenuClick(item)">
          <CommonIcon v-if="item.icon" :icon="item.icon" :size="18" />
          <span class="font-medium">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>

  <!-- 侧边栏折叠切换按钮 -->
  <div
    class="flex items-center justify-start px-5 py-2 cursor-pointer transition-colors"
  >
    <div
      @click="handleToggleIconOnly"
      class="flex items-center justify-center p-1 bg-gray-100 hover:bg-gray-200 rounded-md"
    >
      <CommonIcon
        :icon="isCollapse ? 'el-DArrowRight' : 'el-DArrowLeft'"
        :size="16"
      />
    </div>
  </div>
</template>

<style scoped>
.sidebar-menu {
  --el-menu-hover-bg-color: #eff6ff;
  --el-menu-active-color: #2563eb;
  width: 100%;
}

:deep(.el-menu--collapse) {
  width: 100% !important;
}

.el-menu-item.is-active {
  background-color: #eff6ff !important;
  border-right: 3px solid #2563eb;
}

.el-menu-item:hover {
  background-color: #f1f5f9 !important;
}
</style>
