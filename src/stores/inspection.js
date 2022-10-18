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
    try {
      isLoading.value = true
      const res = await request.get(resource)
      inspections.value = res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //新增一筆巡檢紀錄
  const createInspection = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getInspections()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得一筆巡檢紀錄
  const getInspection = async (id) => {
    try {
      isLoading.value = true
      const res = await request.get(`${resource}/${id}`)
      return res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //修改一筆巡檢紀錄
  const updateInspection = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getInspections()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //上傳一個檔案
  const uploadFile = async (data) => {
    try {
      isLoading.value = true
      await request.post(`${resource}/files`, data)
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得一個已上傳檔案
  const getFile = async (filename) => {
    try {
      isLoading.value = true
      const res = await request.get(`${resource}/files/${filename}`)
      files.value = res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
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
