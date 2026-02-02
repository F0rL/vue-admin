<script setup lang="ts">
import { ref } from 'vue'

const value = ref('layout')
</script>

<template>
  <div>
    {{ value }}
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
