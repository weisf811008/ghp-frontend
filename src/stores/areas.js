import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'areas'

export const useAreaStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //取得區域標籤清單
  const getAreas = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      return res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    getAreas,
  }
})
