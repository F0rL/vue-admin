import { ref } from 'vue'
import { defineStore } from 'pinia'

interface userInfo {
  id: string
  name: string
  avatar: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<userInfo>()
    const token = ref<string>('')

    // 在 Setup Stores 中，您需要创建自己的 $reset() 方法重置
    function $reset() {}
    return {
      userInfo,
      token,
      $reset,
    }
  },
  {
    persist: [],
  }
)
