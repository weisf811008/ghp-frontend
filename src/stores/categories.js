import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'categories'

export const useCategoryStore = defineStore(resource, () => {
  const categories = ref([])
  const isLoading = ref(false)

  //取得大項清單
  const getCategories = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    categories.value = res.data
    isLoading.value = false
  }

  //新增一筆大項
  const createCategory = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getCategories()
  }

  //修改一筆大項
  const updateCategory = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getCategories()
  }

  //刪除一筆大項
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
