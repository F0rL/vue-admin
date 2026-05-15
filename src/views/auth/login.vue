<script setup lang="ts">
import LoginLayout from './components/LoginLayout.vue'
import AccountLogin from './components/AccountLogin.vue'
import QrcodeLogin from './components/QrcodeLogin.vue'

const activeTab = ref<'account' | 'qrcode'>('account')
</script>

<template>
  <LoginLayout v-model:active-tab="activeTab" />
  <div class="panel-container">
    <div v-show="activeTab === 'account'" class="panel">
      <AccountLogin @switch-to-qrcode="activeTab = 'qrcode'" />
    </div>
    <div v-show="activeTab === 'qrcode'" class="panel">
      <QrcodeLogin @switch-to-account="activeTab = 'account'" />
    </div>
  </div>
</template>

<style scoped>
.panel-container {
  position: relative;
  min-height: 416px;
}

.panel {
  position: absolute;
  inset: 0;
}
</style>
