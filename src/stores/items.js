import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'items'

export const useItemStore = defineStore(resource, () => {
  const items = ref([])
  const isLoading = ref(false)

  //取得大項及細項區清單
  const getTransferList = () => {
    return items.value.map((item) => ({
      key: item.id,
      label: `[${item.category}]-[${item.no}]-${item.item}`,
    }))
  }

  //取得細項清單
  const getItems = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      items.value = res.data
      items.value.sort((a, b) => {
        if (a.no > b.no) return 1
        if (a.no < b.no) return -1
        return 0
      })
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得一筆細項id
  const getItemById = async (id) => {
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

  //新增一筆細項
  const createItem = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getItems()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //修改一筆細項
  const updateItem = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getItems()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //刪除一筆細項
  const deleteItem = async (id) => {
    try {
      isLoading.value = true
      await request.delete(`${resource}/${id}`)
      await getItems()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    items,
    isLoading,
    getTransferList,
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
  }
})
