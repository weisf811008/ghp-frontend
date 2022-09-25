import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'periods'

export const usePeriodStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //取得週期標籤清單
  const getPeriods = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    isLoading.value = false
    return res.data
  }

  return {
    isLoading,
    getPeriods,
  }
})
