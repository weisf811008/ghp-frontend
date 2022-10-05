import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'regulations'

export const useRegulationStore = defineStore(resource, () => {
  const regulations = ref([])
  const isLoading = ref(false)

  //取得條文清單
  const getRegulations = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    regulations.value = res.data
    regulations.value.sort((a, b) => {
      if (a.code > b.code) return 1
      if (a.code < b.code) return -1
      return 0
    })
    isLoading.value = false
  }

  //取得一筆條文
  const getRegulationById = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data
  }

  //新增一筆條文
  const createRegulation = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getRegulations()
  }

  //修改一筆條文
  const updateRegulation = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getRegulations()
  }

  //刪除一筆條文
  const deleteRegulation = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getRegulations()
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
