import axios from 'axios'

export const request = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.response.use(
  res => res,
  err => {
    // if (axios.isAxiosError(err) && err.response.status === 401) {
    //   return
    // }
    console.error(err.response.data)
    return Promise.reject(err)
  }
)
