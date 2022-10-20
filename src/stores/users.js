import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'users'

export const useUserStore = defineStore(resource, () => {
  const users = ref([])
  const isLoading = ref(false)

  //取得帳號清單
  const getUsers = async () => {
    try {
      isLoading.value = true
      const res = await request.get(resource)
      users.value = res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得一個帳號
  const getUserById = async (id) => {
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
  const createUser = async (data) => {
    try {
      isLoading.value = true
      await request.post(resource, data)
      await getUsers()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //修改一個帳號
  const updateUser = async (id, data) => {
    try {
      isLoading.value = true
      await request.put(`${resource}/${id}`, data)
      await getUsers()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //刪除一個帳號
  const deleteUser = async (id) => {
    try {
      isLoading.value = true
      await request.delete(`${resource}/${id}`)
      await getUsers()
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //重設一個帳號的密碼
  const resetPassword = async (id, password) => {
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
