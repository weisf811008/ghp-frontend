import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'categories'

export const useCategoryStore = defineStore(resource, () => {
  const categories = ref([])
  const isLoading = ref(false)

  const getCategories = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    categories.value = res.data.categories
    isLoading.value = false
  }

  const createCategory = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getCategories()
    
  }

  const updateCategory = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getCategories()
  }

  const deleteCategory = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getCategories()
  }

  return {
    categories,
    isLoading,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
