<script setup lang="ts">
import { computed } from 'vue'
import * as elementPlusIcons from '@element-plus/icons-vue'

interface Props {
  icon: string
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
})

const iconComponent = computed(() => {
  const name = props.icon
  if (!name) return undefined
  const key = name.charAt(0).toUpperCase() + name.slice(1)
  return (elementPlusIcons as any)[key] || (elementPlusIcons as any)[name]
})
</script>

<template>
  <el-icon v-if="iconComponent" :size="size">
    <component :is="iconComponent" />
  </el-icon>
</template>