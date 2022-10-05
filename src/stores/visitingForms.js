import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'visitingForms'

export const useVisitingFormStore = defineStore(resource, () => {
  const visitingForms = ref([])
  const isLoading = ref(false)

  //取得訪視表清單
  const getVisitingForms = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    visitingForms.value = res.data
    visitingForms.value.sort((a, b) => {
      if (a.code > b.code) return 1
      if (a.code < b.code) return -1
      return 0
    })
    isLoading.value = false
  }

  //新增一筆訪視表
  const createVisitingForm = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getVisitingForms()
  }

  //取得一筆訪視表
  const getVisitingFormById = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data
  }

  //修改一筆訪視表
  const updateVisingForm = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getVisitingForms()
  }

  //刪除一筆訪視表
  const deleteVisitingForms = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getVisitingForms()
  }

  return {
    visitingForms,
    isLoading,
    getVisitingForms,
    createVisitingForm,
    getVisitingFormById,
    updateVisingForm,
    deleteVisitingForms,
  }
})
