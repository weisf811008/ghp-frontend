import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'charts'

export const useChartStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //取得指定日期區間內合格大項發生次數
  const getNormalCategories = async (start, end) => {
    try {
      isLoading.value = true
      const res = await request.get(`${resource}/normalCategories`, {
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

  //取得指定日期區間內缺失大項發生次數
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

  //取得指定日期區間內十大缺失細項發生次數
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

  //取得指定日期區間內十大缺失條文發生次數
  // const getAbnormalGhp = async (start, end) => {
  //   try {
  //     isLoading.value = true
  //     const res = await request.get(`${resource}/abnormalGhp`, {
  //       params: {
  //         start,
  //         end,
  //       },
  //     })
  //     return res.data
  //   } catch (e) {
  //     throw e
  //   } finally {
  //     isLoading.value = false
  //   }
  // }

  //取得指定日期區間內十大缺失訪視表發生次數
  // const getAbnormalVisiting = async (start, end) => {
  //   try {
  //     isLoading.value = true
  //     const res = await request.get(`${resource}/abnormalVisiting`, {
  //       params: {
  //         start,
  //         end,
  //       },
  //     })
  //     return res.data
  //   } catch (e) {
  //     throw e
  //   } finally {
  //     isLoading.value = false
  //   }
  // }

  return {
    isLoading,
    getNormalCategories,
    getAbnormalCategories,
    getAbnormalItems,
    // getAbnormalGhp,
    // getAbnormalVisiting,
  }
})
