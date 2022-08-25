import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'areas'

export const useAreaStore = defineStore(resource, () => {
  const isLoading = ref(false)

  const getAreas = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    isLoading.value = false
    return res.data.areas
  }

  return {
    isLoading,
    getAreas
  }
})
