import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'categories'

export const useCategoryStore = defineStore(resource, () => {
  const categories = ref([])
  const isLoading = ref(false)

  //取得大項清單
  const getCategories = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      categories.value = res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // 取得一筆大項
  const getCategoryById = async (id) => {
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

  //新增一筆大項
  const createCategory = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getCategories()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //修改一筆大項
  const updateCategory = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getCategories()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //刪除一筆大項
  const deleteCategory = async (id) => {
    try {
      isLoading.value = true
      await request.delete(`${resource}/${id}`)
      await getCategories()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    isLoading,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
