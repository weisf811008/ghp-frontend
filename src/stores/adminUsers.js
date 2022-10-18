import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'admin/users'

export const useAdminUserStore = defineStore(resource, () => {
  const adminUsers = ref([])
  const isLoading = ref(false)

  //取得帳號清單
  const getAdminUsers = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      adminUsers.value = res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得一個帳號
  const getAdminUserById = async (id) => {
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

  //新增一個帳號
  const createAdminUser = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getAdminUsers()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //修改一個帳號
  const updateAdminUser = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getAdminUsers()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //刪除一個帳號
  const deleteAdminUser = async (id) => {
    try {
      isLoading.value = true
      await request.delete(`${resource}/${id}`)
      await getAdminUsers()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //重設一個帳號的密碼
  const resetAdminPassword = async (id, password) => {
    try {
      isLoading.value = true
      await request.patch(`${resource}/${id}/password`, { password })
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    adminUsers,
    isLoading,
    getAdminUsers,
    getAdminUserById,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    resetAdminPassword,
  }
})
