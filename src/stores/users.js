import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

const resource = 'users'

export const useUserStore = defineStore(resource, () => {
  const users = ref([])
  const isLoading = ref(false)

  const getUsers = async () => {
    isLoading.value = true
    const res = await request.get(resource)
    users.value = res.data
    isLoading.value = false
  }

  const createUser = async (data) => {
    isLoading.value = true
    await request.post(resource, data)
    isLoading.value = false
    await getUsers()
  }

  const updateUser = async (id, data) => {
    isLoading.value = true
    await request.put(`${resource}/${id}`, data)
    isLoading.value = false
    await getUsers()
  }

  const deleteUser = async (id) => {
    isLoading.value = true
    await request.delete(`${resource}/${id}`)
    isLoading.value = false
    await getUsers()
  }

  const resetPassword = async (id, password) => {
    isLoading.value = true
    await request.patch(`${resource}/${id}/password`, { password })
    isLoading.value = false
  }

  return {
    users,
    isLoading,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
  }
})
