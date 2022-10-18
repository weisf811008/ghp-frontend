import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'visitingForms'

export const useVisitingFormStore = defineStore(resource, () => {
  const visitingForms = ref([])
  const isLoading = ref(false)

  //取得訪視表清單
  const getVisitingForms = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      visitingForms.value = res.data
      visitingForms.value.sort((a, b) => {
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

  //新增一筆訪視表
  const createVisitingForm = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getVisitingForms()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得一筆訪視表
  const getVisitingFormById = async (id) => {
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

  //修改一筆訪視表
  const updateVisingForm = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getVisitingForms()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //刪除一筆訪視表
  const deleteVisitingForms = async (id) => {
    try {
      isLoading.value = true
      await request.delete(`${resource}/${id}`)
      await getVisitingForms()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
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
