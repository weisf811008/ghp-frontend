import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'charts'

export const useChartStore = defineStore(resource, () => {
  const isLoading = ref(false)

  const getAbnormalCategories = async (start, end) => {
    isLoading.value = true
    const res = await request.get(`${resource}/abnormalCategories`, {
      params: {
        start,
        end,
      },
    })
    isLoading.value = false
    return res.data
  }

  const getAbnormalItems = async (start, end) => {
    isLoading.value = true
    const res = await request.get(`${resource}/abnormalItems`, {
      params: {
        start,
        end,
      },
    })
    isLoading.value = false
    return res.data
  }

  const getAbnormalGhp = async (start, end) => {
    isLoading.value = true
    const res = await request.get(`${resource}/abnormalGhp`, {
      params: {
        start,
        end,
      },
    })
    isLoading.value = false
    return res.data
  }

  const getAbnormalVisiting = async (start, end) => {
    isLoading.value = true
    const res = await request.get(`${resource}/abnormalVisiting`, {
      params: {
        start,
        end,
      },
    })
    isLoading.value = false
    return res.data
  }

  return {
    isLoading,
    getAbnormalCategories,
    getAbnormalItems,
    getAbnormalGhp,
    getAbnormalVisiting,
  }
})
