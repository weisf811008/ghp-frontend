import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'admin/schools'

export const useAdminSchoolStore = defineStore(resource, () => {
  const schools = ref([])
  const isLoading = ref(false)

  //取得學校資料清單
  const getSchools = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      schools.value = res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得一筆學校資料
  const getSchoolById = async (id) => {
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

  //新增一筆學校資料
  const createSchool = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getSchools()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //修改一筆學校資料
  const updateSchool = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getSchools()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //刪除一筆學校資料
  const deleteSchool = async (id) => {
    try {
      isLoading.value = true
      await request.delete(`${resource}/${id}`)
      await getSchools()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
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
