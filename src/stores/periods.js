import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'periods'

export const usePeriodStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //取得週期標籤清單
  const getPeriods = async () => {
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
    getPeriods,
  }
})
