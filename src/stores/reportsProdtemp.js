import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'reports/prodtemp'

export const useReportProdtempStore = defineStore(resource, () => {
  const isLoading = ref(false)

  //取得指定日期區間內的訪視表檢核紀錄
  const getReportProdtemp = async (start, end) => {
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
    getReportProdtemp,
  }
})
