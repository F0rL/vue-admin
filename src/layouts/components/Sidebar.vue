<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import type { MenuItem } from './types'

defineProps<{
  menuList: MenuItem[]
}>()

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isCollapse = computed(() => !appStore.sidebarOpened)

function handleMenuClick(item: MenuItem) {
  console.log(item)
  router.push(item.path)
}

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <el-scrollbar class="flex-1">
    <el-menu
      :default-active="route.path"
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="false"
      class="border-none!"
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
  </el-scrollbar>
</template>

<style scoped>
.el-menu {
  --el-menu-hover-bg-color: #eff6ff;
  --el-menu-active-color: #2563eb;
}

.el-menu-item.is-active {
  background-color: #eff6ff !important;
  border-right: 3px solid #2563eb;
}

.el-menu-item:hover {
  background-color: #f1f5f9 !important;
}
</style>
