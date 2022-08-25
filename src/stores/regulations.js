import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'regulations'

export const useRegulationStore = defineStore(resource, () => {
  const regulations = ref([])
  const isLoading = ref(false)

  const getRegulations = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    regulations.value = res.data.regulations
    regulations.value.sort((a, b) => {
      if (a.code > b.code) return 1
      if (a.code < b.code) return -1
      return 0
    })
    isLoading.value = false
  }

  const createRegulation = async data => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getRegulations()
  }

  const updateRegulation = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getRegulations()
  }

  const deleteRegulation = async id => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getRegulations()
  }

  return {
    regulations,
    isLoading,
    getRegulations,
    createRegulation,
    updateRegulation,
    deleteRegulation
  }
})
