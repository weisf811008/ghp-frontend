import { ref } from 'vue'
import { defineStore } from 'pinia'
import { isAfter, parseISO } from 'date-fns'
import { request } from '../utils/http.util'

const resource = 'inspections'

export const useInspectionStore = defineStore(resource, () => {
  const inspections = ref([])
  const createFormId = ref(null)
  const photos = ref('')
  const isLoading = ref(false)

  const getInspections = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    inspections.value = res.data.inspections
    inspections.value.sort((a, b) =>
      isAfter(parseISO(a.date), parseISO(b.date)) ? -1 : 1
    )
    isLoading.value = false
  }

  const createInspection = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getInspections()
  }

  const getInspection = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data.inspection
  }

  const updateInspection = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getInspections()
  }

  const uploadFile = async (data) => {
    isLoading.value = true
    await request.post(`${resource}/upload`, data)
    isLoading.value = false
  }

  const getPhotos = async () => {
    isLoading.value = true
    const res = await request.get(`${resource}/photo/${filename}`)
    photos.value = res.data.photos
    isLoading.value = false
  }

  const setCreateFormId = (formId) => {
    createFormId.value = formId
  }

  return {
    inspections,
    createFormId,
    setCreateFormId,
    getInspections,
    createInspection,
    getInspection,
    updateInspection,
    uploadFile,
    getPhotos,
  }
})
