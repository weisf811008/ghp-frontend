import { ref } from 'vue'
import { defineStore } from 'pinia'
import { isAfter, parseISO } from 'date-fns'
import { request } from '../utils/http.util'

const resource = 'inspections'

export const useInspectionStore = defineStore(resource, () => {
  const inspections = ref([])
  const files = ref('')
  const isLoading = ref(false)

  //取得巡檢紀錄清單
  const getInspections = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    inspections.value = res.data
    isLoading.value = false
  }

  //新增一筆巡檢紀錄
  const createInspection = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getInspections()
  }

  //取得一筆巡檢紀錄
  const getInspection = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data
  }

  //修改一筆巡檢紀錄
  const updateInspection = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getInspections()
  }

  //上傳一個檔案
  const uploadFile = async (data) => {
    isLoading.value = true
    await request.post(`${resource}/files`, data)
    isLoading.value = false
  }

  //取得一個已上傳檔案
  const getFile = async (filename) => {
    isLoading.value = true
    const res = await request.get(`${resource}/files/${filename}`)
    files.value = res.data
    isLoading.value = false
  }

  return {
    isLoading,
    inspections,
    getInspections,
    createInspection,
    getInspection,
    updateInspection,
    uploadFile,
    getFile,
  }
})
