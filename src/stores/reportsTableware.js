import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'reports/tableware'

export const useReportTablewareStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //取得指定日期區間內的餐具檢核紀錄
  const getReportTableware = async (start, end) => {
    try {
      isLoading.value = true
      const res = await request.get(resource, {
        params: {
          start,
          end,
        },
      })
      return {
        rows: res.data.rows.sort((a, b) => {
          if (a.date > b.date) return -1
          if (a.date < b.date) return 1
        }),
        abnormalRows: res.data.abnormalRows.sort((a, b) => {
          if (a.date > b.date) return -1
          if (a.date < b.date) return 1
        }),
      }
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    getReportTableware,
  }
})
