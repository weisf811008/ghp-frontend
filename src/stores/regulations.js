import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'regulations'

export const useRegulationStore = defineStore(resource, () => {
  const regulations = ref([])
  const isLoading = ref(false)

  //取得條文清單
  const getRegulations = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      regulations.value = res.data
      regulations.value.sort((a, b) => {
        if (a.code > b.code) return 1
        if (a.code < b.code) return -1
        return 0
      })
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得一筆條文
  const getRegulationById = async (id) => {
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

  //新增一筆條文
  const createRegulation = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getRegulations()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //修改一筆條文
  const updateRegulation = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getRegulations()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //刪除一筆條文
  const deleteRegulation = async (id) => {
    try {
      isLoading.value = true
      await request.delete(`${resource}/${id}`)
      await getRegulations()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    regulations,
    isLoading,
    getRegulations,
    getRegulationById,
    createRegulation,
    updateRegulation,
    deleteRegulation,
  }
})
