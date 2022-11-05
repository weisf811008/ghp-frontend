import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'forms'

export const useFormStore = defineStore(resource, () => {
  const forms = ref([])
  const isLoading = ref(false)

  //取得表單清單
  const getForms = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      forms.value = res.data
      forms.value.sort((a, b) => {
        if (a.title > b.title) return 1
        if (a.title < b.title) return -1
        return 0
      })
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得表單
  const getFormById = async (id) => {
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

  //新增一筆表單
  const createForm = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getForms()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //修改一筆表單
  const updateForm = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getForms()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //刪除一筆表單
  const deleteForm = async (id) => {
    try {
      isLoading.value = true
      await request.delete(`${resource}/${id}`)
      await getForms()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    forms,
    isLoading,
    getForms,
    getFormById,
    createForm,
    updateForm,
    deleteForm,
  }
})
