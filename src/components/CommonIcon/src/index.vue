<script setup lang="ts">
import * as elementPlusIcons from '@element-plus/icons-vue'
import type { IconName } from '../types'
import { ICON_NAME_LIST } from '../types'

interface Props {
  icon: IconName
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
})

const iconComponent = computed(() => {
  const name = props.icon
  if (!name) return undefined
  return (elementPlusIcons as Record<string, Component>)[name.slice(3)]
})
</script>

<template>
  <el-icon v-if="iconComponent" :size="size">
    <component :is="iconComponent" />
  </el-icon>
</template>
