import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'forms'

export const useFormStore = defineStore(resource, () => {
  const forms = ref([])
  const isLoading = ref(false)

  //取得表單清單
  const getForms = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    forms.value = res.data
    isLoading.value = false
  }

  //取得表單
  const getFormById = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data
  }

  //新增一筆表單
  const createForm = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getForms()
  }

  //修改一筆表單
  const updateForm = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getForms()
  }

  //刪除一筆表單
  const deleteForm = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getForms()
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
