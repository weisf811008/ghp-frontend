import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'forms'

export const useFormStore = defineStore(resource, () => {
  const forms = ref([])
  const isLoading = ref(false)

  const getForms = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    forms.value = res.data.forms
    isLoading.value = false
  }

  const getFormById = async id => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data.form
  }

  const createForm = async data => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getForms()
  }

  const updateForm = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getForms()
  }

  const deleteForm = async id => {
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
    deleteForm
  }
})
