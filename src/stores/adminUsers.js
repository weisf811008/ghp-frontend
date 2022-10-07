import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'admin/users'

export const useAdminUserStore = defineStore(resource, () => {
  const adminUsers = ref([])
  const isLoading = ref(false)

  //取得帳號清單
  const getAdminUsers = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    adminUsers.value = res.data
    isLoading.value = false
  }

  //取得一個帳號
  const getAdminUserById = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data
  }

  //新增一個帳號
  const createAdminUser = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getAdminUsers()
  }

  //修改一個帳號
  const updateAdminUser = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getAdminUsers()
  }

  //刪除一個帳號
  const deleteAdminUser = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getAdminUsers()
  }

  //重設一個帳號的密碼
  const resetAdminPassword = async (id, password) => {
    isLoading.value = true
    await request.patch(`${resource}/${id}/password`, { password })
    isLoading.value = false
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
