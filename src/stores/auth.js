import { ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '../utils/http.util'

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const user = ref({})
  const returnRul = ref(null)

  //帳號登入
  const loginUser = async (credential) => {
    try {
      isLoading.value = true
      const res = await request.post('auth/login', credential)
      user.value = res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //帳號登出
  const logoutUser = async () => {
    try {
      isLoading.value = true
      await request.get('auth/logout')
      user.value = null
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  //取得當前登入使用者資訊
  const getUserInfo = async () => {
    try {
      isLoading.value = true
      const res = await request.get('auth/me')
      user.value = res.data
    } catch (e) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const setReturnUrl = (url) => {
    returnRul.value = url
  }

  return {
    isLoading,
    user,
    loginUser,
    logoutUser,
    getUserInfo,
    setReturnUrl,
  }
})
