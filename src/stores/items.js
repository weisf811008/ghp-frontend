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

  // const getNeedCheckValue = async (id) => {
  //   isLoading.value = true
  //   const res = await request.get(`${resource}/${id}`)
  //   isLoading.value = false
  //   return res.data
  // }

  //取得細項清單
  const getItems = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    items.value = res.data
    items.value.sort((a, b) => {
      if (a.no > b.no) return 1
      if (a.no < b.no) return -1
      return 0
    })
    isLoading.value = false
  }

  //取得一筆細項id
  const getItemById = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data
  }

  //新增一筆細項
  const createItem = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getItems()
  }

  //修改一筆細項
  const updateItem = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getItems()
  }

  //刪除一筆細項
  const deleteItem = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getItems()
  }

  return {
    items,
    isLoading,
    getTransferList,
    // getNeedCheckValue,
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
  }
})
