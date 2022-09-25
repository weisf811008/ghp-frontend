import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'reports/tableware'

export const useReportTablewareStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //取得指定日期區間內的餐具檢核紀錄
  const getReportTableware = async (start, end) => {
    isLoading.value = true
    const res = await request.get(resource, {
      params: {
        start,
        end,
      },
    })
    isLoading.value = false
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
  }

  return {
    isLoading,
    getReportTableware,
  }
})
