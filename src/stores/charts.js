import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'charts'

export const useChartStore = defineStore(resource, () => {
  const isLoading = ref(false)

  const getAbnormalCategories = async (start, end) => {
    try {
      isLoading.value = true
      const res = await request.get(`${resource}/abnormalCategories`, {
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

  const getAbnormalItems = async (start, end) => {
    try {
      isLoading.value = true
      const res = await request.get(`${resource}/abnormalItems`, {
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

  const getAbnormalGhp = async (start, end) => {
    try {
      isLoading.value = true
      const res = await request.get(`${resource}/abnormalGhp`, {
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

  const getAbnormalVisiting = async (start, end) => {
    try {
      isLoading.value = true
      const res = await request.get(`${resource}/abnormalVisiting`, {
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
    getAbnormalCategories,
    getAbnormalItems,
    getAbnormalGhp,
    getAbnormalVisiting,
  }
})
