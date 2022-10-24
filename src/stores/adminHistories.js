import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'admin/histories'

export const useAdminHistoriesStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //查詢操作記錄
  const getAdminHistories = async (start, end) => {
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
    getAdminHistories,
  }
})
