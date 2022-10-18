import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'reports/visiting'

export const useReportVisitingStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //取得指定日期區間內的訪視表檢核紀錄
  const getReportVisiting = async (start, end) => {
    try {
      isLoading.value = true
      const res = await request.get(resource, {
        params: {
          start,
          end,
        },
      })
      return res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    getReportVisiting,
  }
})
