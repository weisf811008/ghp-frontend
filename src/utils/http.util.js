import axios from 'axios'
import { ElNotification } from 'element-plus'
import router from '../routers'

export const request = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          ElNotification({
            type: 'error',
            message: err.response.data.message,
          })
          break
        case 401:
          ElNotification({
            type: 'error',
            message: '請重新登入',
          })
          if (router.currentRoute.value.name !== 'Login') {
            router.push({ name: 'Login' })
          }
          break
        case 403:
          ElNotification({
            type: 'error',
            message: '沒有存取權限',
          })
          break
        case 422:
          ElNotification({
            type: 'error',
            message: err.response.data.errors
              .map((error) => `${error.param}${error.msg}`)
              .join('、'),
          })
          break
        default:
          ElNotification({
            type: 'error',
            message: '系統發生錯誤，請聯絡系統管理員',
          })
      }
    } else if (!window.navigator.onLine) {
      ElNotification({
        type: 'error',
        message: '網路異常，請重新連線',
      })
    }
    return Promise.reject(err)
  }
)
