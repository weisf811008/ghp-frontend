import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'users'

export const useUserStore = defineStore(resource, () => {
  const users = ref([])
  const isLoading = ref(false)

  //取得帳號清單
  const getUsers = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    users.value = res.data
    isLoading.value = false
  }

  //取得一個帳號
  const getUserById = async (id) => {
    isLoading.value = true
    const res = await request.get(`${resource}/${id}`)
    isLoading.value = false
    return res.data
  }

  //新增一個帳號
  const createUser = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getUsers()
  }

  //修改一個帳號
  const updateUser = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getUsers()
  }

  //刪除一個帳號
  const deleteUser = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getUsers()
  }

  //重設一個帳號的密碼
  const resetPassword = async (id, password) => {
    isLoading.value = true
    await request.patch(`${resource}/${id}/password`, { password })
    isLoading.value = false
  }

  return {
    users,
    isLoading,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
  }
})
