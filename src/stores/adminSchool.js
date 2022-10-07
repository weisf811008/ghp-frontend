import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'admin/schools'

export const useAdminSchoolStore = defineStore(resource, () => {
  const schools = ref([])
  const isLoading = ref(false)

  //取得學校資料清單
  const getSchools = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    schools.value = res.data
    isLoading.value = false
  }

  //取得一筆學校資料
  const getSchoolById = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data
  }

  //新增一筆學校資料
  const createSchool = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getSchools()
  }

  //修改一筆學校資料
  const updateSchool = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getSchools()
  }

  //刪除一筆學校資料
  const deleteSchool = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getSchools()
  }

  return {
    schools,
    isLoading,
    getSchools,
    getSchoolById,
    createSchool,
    updateSchool,
    deleteSchool,
  }
})
